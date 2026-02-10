import { NextRequest, NextResponse } from "next/server";
import { extractYouTubeVideoId } from "@/lib/youtube-utils";

/**
 * GET /api/validate-youtube?url=...
 * Validates if a YouTube video exists and is embeddable
 * Uses YouTube oEmbed API (no API key required)
 */
export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  
  if (!url) {
    return NextResponse.json({ error: "URL required" }, { status: 400 });
  }

  const videoId = extractYouTubeVideoId(url);
  
  if (!videoId) {
    return NextResponse.json({
      valid: false,
      embeddable: false,
      error: "Invalid YouTube URL",
    });
  }

  try {
    // YouTube oEmbed API - free, no API key required
    const oEmbedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    
    const response = await fetch(oEmbedUrl, {
      method: "GET",
      headers: { "Accept": "application/json" },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        return NextResponse.json({
          valid: true,
          embeddable: false,
          videoId,
          error: "embedding_disabled",
        });
      }
      if (response.status === 404) {
        return NextResponse.json({
          valid: false,
          embeddable: false,
          videoId,
          error: "not_found",
        });
      }
      return NextResponse.json({
        valid: false,
        embeddable: false,
        videoId,
        error: "api_error",
      });
    }

    const data = await response.json();
    
    return NextResponse.json({
      valid: true,
      embeddable: true,
      videoId,
      title: data.title,
      author: data.author_name,
      thumbnailUrl: data.thumbnail_url,
    });
  } catch {
    return NextResponse.json({
      valid: false,
      embeddable: false,
      videoId,
      error: "network_error",
    });
  }
}
