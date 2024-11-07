import { PlatformHandlerInterface } from "@/lib/types/platform"
import { InstagramHandler } from "./instagram"
import { YouTubeHandler } from "./youtube"
import { TikTokHandler } from "./tiktok"

class PlatformRegistry {
  private handlers: Map<string, PlatformHandlerInterface> = new Map()

  constructor() {
    this.registerHandler("instagram", InstagramHandler)
    this.registerHandler("youtube", YouTubeHandler)
    this.registerHandler("tiktok", TikTokHandler)
  }

  registerHandler(platform: string, handler: PlatformHandlerInterface) {
    this.handlers.set(platform.toLowerCase(), handler)
  }

  getHandler(platform: string): PlatformHandlerInterface | undefined {
    return this.handlers.get(platform.toLowerCase())
  }

  validateUrl(platform: string, url: string): boolean {
    const handler = this.getHandler(platform)
    return handler ? handler.validateUrl(url) : false
  }

  async processUrl(platform: string, url: string) {
    const handler = this.getHandler(platform)
    if (!handler) {
      throw new Error(`No handler found for platform: ${platform}`)
    }

    const isValid = handler.validateUrl(url)
    if (!isValid) {
      throw new Error(`Invalid URL for platform: ${platform}`)
    }

    const embedUrl = handler.getEmbedUrl(url)
    const metadata = await handler.extractMetadata?.(url)

    return {
      embedUrl,
      isValid,
      metadata,
    }
  }
}

export const platformRegistry = new PlatformRegistry()
