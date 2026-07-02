import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const tableMap = {
  services: { table: 'services', orderCol: 'sort_order', filter: { active: true } },
  portfolio: { table: 'portfolio_items', orderCol: 'sort_order', filter: { active: true } },
  blog: { table: 'blog_posts', orderCol: 'created_at', filter: { is_published: true } },
  testimonials: { table: 'testimonials', orderCol: 'sort_order', filter: { active: true } },
  pricing: { table: 'pricing_plans', orderCol: 'sort_order', filter: { active: true } },
  process: { table: 'process_steps', orderCol: 'step_number', filter: { active: true } },
  products: { table: 'products', orderCol: 'sort_order', filter: { active: true } },
} as const

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const type = url.searchParams.get('type')
    const lang = url.searchParams.get('lang') || 'hr'

    if (!type || !(type in tableMap)) {
      return new Response(
        JSON.stringify({ error: `Nepoznat tip. Dostupni: ${Object.keys(tableMap).join(', ')}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const mapping = tableMap[type as keyof typeof tableMap]
    let query = supabase
      .from(mapping.table)
      .select('*')
      .eq('language', lang)
      .order(mapping.orderCol)

    if (mapping.filter) {
      for (const [key, value] of Object.entries(mapping.filter)) {
        query = query.eq(key, value)
      }
    }

    const { data, error } = await query
    if (error) throw error

    return new Response(
      JSON.stringify({ success: true, type, lang, count: data?.length || 0, data: data || [] }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300',
        },
      },
    )
  } catch (error) {
    console.error('[content] ERROR:', error)
    return new Response(JSON.stringify({ error: 'Greška pri dohvaćanju sadržaja' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
