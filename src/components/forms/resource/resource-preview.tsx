"use client"

import { useState, useEffect } from "react"
import { platformRegistry } from "@/lib/platforms/registry"
import { ProcessedPlatformUrl } from "@/lib/types/platform"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Platform } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ResourcePreviewProps {
  url: string
  platform: Platform
  className?: string
}

export function ResourcePreview({
  url,
  platform,
  className = "",
}: ResourcePreviewProps) {
  const [embedData, setEmbedData] = useState<ProcessedPlatformUrl | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function processUrl() {
      try {
        setLoading(true)
        setError(null)
        const data = await platformRegistry.processUrl(platform.name, url)
        setEmbedData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to process URL")
        setEmbedData(null)
      } finally {
        setLoading(false)
      }
    }

    if (url && platform) {
      processUrl()
    }
  }, [url, platform])

  if (!url || !platform) {
    return null
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Preview</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="w-full aspect-video" />
        ) : error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : embedData?.embedUrl ? (
          <div className="overflow-hidden rounded-lg border">
            <iframe
              src={embedData.embedUrl}
              className={`w-full ${
                platform.name.toLowerCase() === "instagram"
                  ? "aspect-[9/16]"
                  : "aspect-video"
              }`}
              allowFullScreen
              loading="lazy"
            />
            {embedData.metadata && (
              <div className="p-4 space-y-2">
                {embedData.metadata.title && (
                  <h3 className="font-medium">{embedData.metadata.title}</h3>
                )}
                {embedData.metadata.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {embedData.metadata.description}
                  </p>
                )}
              </div>
            )}
          </div>
        ) : (
          <Alert>
            <AlertDescription>No preview available</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
