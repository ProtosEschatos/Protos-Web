/** Lightweight admin backdrop — CSS only, no WebGL or animations. */
export default function AdminBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-[#100818]" aria-hidden>
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 20% 30%, rgba(139,92,246,0.22) 0%, transparent 55%), radial-gradient(ellipse at 80% 70%, rgba(255,102,0,0.14) 0%, transparent 50%)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#100818] via-transparent to-[#100818]/50" />
    </div>
  )
}
