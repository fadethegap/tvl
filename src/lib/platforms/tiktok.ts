import { PlatformHandlerInterface } from "@/lib/types/platform"

class TikTokHandlerClass implements PlatformHandlerInterface {
  name = "TikTok"

  validateUrl(url: string): boolean {
    // Matches:
    // - tiktok.com/@username/video/VIDEO_ID
    // - vm.tiktok.com/VIDEO_ID
    return /^(https?:\/\/)?(www\.)?(tiktok\.com\/@[\w.-]+\/video\/\d+|vm\.tiktok\.com\/\w+)/.test(
      url
    )
  }

  getEmbedUrl(url: string): string | null {
    // Extract video ID from URL
    const match = url.match(/video\/(\d+)/)
    if (match && match[1]) {
      const videoId = match[1]
      return `https://www.tiktok.com/embed/${videoId}`
    }
    return null
  }

  async extractMetadata(url: string) {
    // TikTok's API could be used here in a production environment
    return {}
  }
}

export const TikTokHandler = new TikTokHandlerClass()
