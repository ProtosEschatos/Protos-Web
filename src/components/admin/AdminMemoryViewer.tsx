import Markdown from 'react-markdown'

type Props = {
  content: string
}

export default function AdminMemoryViewer({ content }: Props) {
  return (
    <div className="admin-memory-content text-[var(--light-muted)] leading-relaxed space-y-4 rounded-2xl border border-white/10 bg-[var(--dark-card)]/55 p-6 md:p-8 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-[var(--light)] [&_h1]:mb-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[var(--light)] [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-[var(--light)] [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1 [&_a]:text-[var(--primary)] [&_a]:underline [&_strong]:text-[var(--light)] [&_code]:text-[var(--primary)] [&_code]:bg-white/5 [&_code]:px-1 [&_code]:rounded [&_pre]:bg-black/30 [&_pre]:p-4 [&_pre]:rounded-xl [&_pre]:overflow-x-auto [&_table]:w-full [&_th]:text-left [&_th]:text-[var(--light)] [&_td]:border-t [&_td]:border-white/5 [&_td]:py-2 [&_hr]:border-white/10">
      <Markdown>{content}</Markdown>
    </div>
  )
}
