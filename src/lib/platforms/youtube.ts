import { PlatformHandlerInterface } from "@/lib/types/platform"

class YouTubeHandlerClass implements PlatformHandlerInterface {
  name = "YouTube"

  validateUrl(url: string): boolean {
    // Matches:
    // - youtube.com/watch?v=VIDEO_ID
    // - youtu.be/VIDEO_ID
    // - youtube.com/shorts/VIDEO_ID
    return /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/.test(
      url
    )
  }

  getEmbedUrl(url: string): string | null {
    // Extract video ID from URL
    const match = url.match(
      /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    )
    if (match && match[1]) {
      const videoId = match[1]
      return `https://www.youtube.com/embed/${videoId}`
    }
    return null
  }

  async extractMetadata(url: string) {
    // In a production environment, you could use the YouTube API here
    // to fetch video title, description, etc.
    return {}
  }
}

export const YouTubeHandler = new YouTubeHandlerClass()
