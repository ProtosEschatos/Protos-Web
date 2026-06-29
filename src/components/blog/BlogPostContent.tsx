import Markdown from 'react-markdown'

type Props = {
  content: string
}

export default function BlogPostContent({ content }: Props) {
  return (
    <div className="blog-content text-[var(--light-muted)] leading-relaxed space-y-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[var(--light)] [&_h2]:mt-8 [&_h2]:mb-4 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-[var(--light)] [&_h3]:mt-6 [&_h3]:mb-3 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_a]:text-[var(--primary)] [&_a]:underline [&_strong]:text-[var(--light)] [&_strong]:font-semibold">
      <Markdown>{content}</Markdown>
    </div>
  )
}
