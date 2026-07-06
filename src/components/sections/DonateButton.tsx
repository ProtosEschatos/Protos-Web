'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Heart } from 'lucide-react'

export default function DonateButton() {
  const t = useTranslations('aboutPage')
  const locale = useLocale()
  const [loading, setLoading] = useState(false)

  const handleDonate = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locale }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
        return
      }
      alert(t('supportDonateNote'))
    } catch {
      alert(t('supportDonateNote'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleDonate}
      disabled={loading}
      className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-[var(--primary)] to-[#ff8800] shadow-lg shadow-[var(--primary)]/20 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70"
    >
      <Heart className="w-4 h-4 fill-current" />
      {loading ? '…' : t('supportDonateBtn')}
    </button>
  )
}
