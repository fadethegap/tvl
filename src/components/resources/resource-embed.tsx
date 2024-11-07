import { platformRegistry } from "@/lib/platforms/registry"
import { ProcessedPlatformUrl } from "@/lib/types/platform"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Platform } from "@prisma/client"
import { useState, useEffect } from "react"

interface ResourceEmbedProps {
  url: string
  platform: Platform
  className?: string
}

export function ResourceEmbed({
  url,
  platform,
  className = "",
}: ResourceEmbedProps) {
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

    processUrl()
  }, [url, platform.name])

  if (loading) {
    return <Skeleton className={`w-full aspect-video ${className}`} />
  }

  if (error || !embedData?.embedUrl) {
    return (
      <Alert variant="destructive" className={className}>
        <AlertDescription>{error || "Failed to load content"}</AlertDescription>
      </Alert>
    )
  }

  return (
    <iframe
      src={embedData.embedUrl}
      className={`w-full ${
        platform.name.toLowerCase() === "instagram"
          ? "aspect-[9/16]"
          : "aspect-video"
      } ${className}`}
      allowFullScreen
      loading="lazy"
    />
  )
}
