import 'server-only'
import type { ArticleInput, PublishResult, PublisherContext } from './types'

const GQL_ENDPOINT = 'https://gql.hashnode.com'

const PUBLISH_MUTATION = /* GraphQL */ `
  mutation PublishPost($input: PublishPostInput!) {
    publishPost(input: $input) {
      post { id slug url }
    }
  }
`

const DRAFT_MUTATION = /* GraphQL */ `
  mutation CreateDraft($input: CreateDraftInput!) {
    createDraft(input: $input) {
      draft { id }
    }
  }
`

/**
 * Hashnode publisher (GraphQL).
 *
 * Vault: provider `hashnode` → Personal Access Token (Account → Developer).
 * options.publicationId = required for `publishPost` (public post) or for
 *   `createDraft`. Find it under Publication Dashboard → Domain & Meta.
 */
export async function publishToHashnode(
  input: ArticleInput,
  ctx: PublisherContext,
): Promise<PublishResult> {
  const token = ctx.secrets.pat?.trim()
  const publicationId = ctx.options?.publicationId?.trim()

  if (!token) throw new Error('Hashnode: fali PAT u vault-u')
  if (!publicationId) throw new Error('Hashnode: fali options.publicationId')

  const shouldPublish = input.published !== false
  const query = shouldPublish ? PUBLISH_MUTATION : DRAFT_MUTATION

  const contentMarkdown = input.markdown
  const variables = {
    input: {
      title: input.title,
      contentMarkdown,
      publicationId,
      tags: (input.tags ?? []).slice(0, 5).map((name) => ({ name, slug: slugify(name) })),
      coverImageOptions: input.coverImageUrl
        ? { coverImageURL: input.coverImageUrl }
        : undefined,
      originalArticleURL: input.canonicalUrl,
      metaTags: input.excerpt
        ? { description: input.excerpt.slice(0, 250) }
        : undefined,
    },
  }

  const res = await fetch(GQL_ENDPOINT, {
    method: 'POST',
    headers: {
      authorization: token,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  })
  if (!res.ok) {
    throw new Error(`Hashnode HTTP ${res.status}: ${await res.text()}`)
  }
  const payload = (await res.json()) as {
    data?: {
      publishPost?: { post: { id: string; slug: string; url: string } }
      createDraft?: { draft: { id: string } }
    }
    errors?: Array<{ message: string }>
  }
  if (payload.errors?.length) {
    throw new Error(`Hashnode GraphQL: ${payload.errors.map((e) => e.message).join('; ')}`)
  }
  if (shouldPublish && payload.data?.publishPost?.post) {
    const post = payload.data.publishPost.post
    return {
      remoteId: post.id,
      remoteUrl: post.url,
      response: payload as unknown as Record<string, unknown>,
    }
  }
  if (!shouldPublish && payload.data?.createDraft?.draft) {
    const draft = payload.data.createDraft.draft
    return {
      remoteId: draft.id,
      remoteUrl: `https://hashnode.com/draft/${draft.id}`,
      response: payload as unknown as Record<string, unknown>,
    }
  }
  throw new Error('Hashnode: unexpected empty response')
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)
}
