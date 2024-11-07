export async function fetchOEmbed(url: string, provider: string) {
  try {
    const response = await fetch(
      `https://api.${provider}.com/oembed?url=${encodeURIComponent(
        url
      )}&format=json`
    )
    if (!response.ok) throw new Error("Failed to fetch oEmbed data")
    return await response.json()
  } catch (error) {
    console.error("Error fetching oEmbed data:", error)
    return null
  }
}

export function sanitizeUrl(url: string) {
  // Remove tracking parameters
  try {
    const urlObj = new URL(url)
    urlObj.searchParams.delete("utm_source")
    urlObj.searchParams.delete("utm_medium")
    urlObj.searchParams.delete("utm_campaign")
    return urlObj.toString()
  } catch {
    return url
  }
}
