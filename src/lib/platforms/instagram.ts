import { PlatformHandlerInterface } from "@/lib/types/platform"

class InstagramHandlerClass implements PlatformHandlerInterface {
  name = "Instagram"

  validateUrl(url: string): boolean {
    return /instagram\.com\/(p|reel)\/[\w-]+/.test(url)
  }

  getEmbedUrl(url: string): string | null {
    const match = url.match(/\/(p|reel)\/([A-Za-z0-9_-]+)/)
    if (match && match[2]) {
      const postId = match[2]
      return `https://www.instagram.com/${match[1]}/${postId}/embed`
    }
    return null
  }

  async extractMetadata(url: string) {
    // In the future, we could add Instagram API integration here
    // to fetch more metadata about the post
    return {}
  }
}

export const InstagramHandler = new InstagramHandlerClass()
