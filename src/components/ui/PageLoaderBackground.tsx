'use client'

import Image from 'next/image'

const BOOT_BG = '/loader/boot-bg.jpg'

export default function PageLoaderBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <Image
        src={BOOT_BG}
        alt=""
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
    </div>
  )
}
