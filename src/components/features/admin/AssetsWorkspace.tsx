'use client'

import { useState } from 'react'
import AssetLibrary from '@/components/features/admin/AssetLibrary'
import AssetUploader from '@/components/features/admin/AssetUploader'

/**
 * Client-side pairing of uploader + library that shares the refresh trigger.
 * Rendered by the server page so `AdminPageShell` (server-only) stays server-side.
 */
export default function AssetsWorkspace() {
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <div className="grid gap-4 lg:grid-cols-[380px_1fr]">
      <div>
        <AssetUploader onUploaded={() => setRefreshKey((n) => n + 1)} />
      </div>
      <div>
        <AssetLibrary refreshKey={refreshKey} />
      </div>
    </div>
  )
}
