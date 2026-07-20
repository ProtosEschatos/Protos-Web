'use client'

import { useState } from 'react'
import AssetLibrary from '@/components/features/admin/AssetLibrary'
import AssetUploader from '@/components/features/admin/AssetUploader'
import ClientErrorBoundary from '@/components/ui/ClientErrorBoundary'

/**
 * Client-side pairing of uploader + library that shares the refresh trigger.
 * Rendered by the server page so `AdminPageShell` (server-only) stays server-side.
 *
 * Each half is wrapped in its own boundary so an uploader crash cannot take
 * the library down with it (and vice versa) — historical repro was a shared
 * scene-store dependency yanking both panels into a blank page.
 */
export default function AssetsWorkspace() {
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <ClientErrorBoundary label="Assets workspace">
      <div className="grid gap-4 lg:grid-cols-[380px_1fr]">
        <div>
          <ClientErrorBoundary label="Uploader">
            <AssetUploader onUploaded={() => setRefreshKey((n) => n + 1)} />
          </ClientErrorBoundary>
        </div>
        <div>
          <ClientErrorBoundary label="Biblioteka assets">
            <AssetLibrary refreshKey={refreshKey} />
          </ClientErrorBoundary>
        </div>
      </div>
    </ClientErrorBoundary>
  )
}
