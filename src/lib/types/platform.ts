export interface PlatformHandlerMetadata {
  title?: string
  description?: string
  thumbnailUrl?: string
  [key: string]: any
}

export interface PlatformHandlerInterface {
  name: string
  validateUrl: (url: string) => boolean
  getEmbedUrl: (url: string) => string | null
  extractMetadata?: (url: string) => Promise<PlatformHandlerMetadata>
}

export interface ProcessedPlatformUrl {
  embedUrl: string | null
  isValid: boolean
  metadata?: PlatformHandlerMetadata
}
