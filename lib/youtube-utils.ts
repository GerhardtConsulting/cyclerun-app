/**
 * YouTube Video Utilities
 * 
 * Legal Framework:
 * - YouTube iframe embeds are explicitly permitted by YouTube's Terms of Service
 * - The video is streamed from YouTube's servers, not downloaded
 * - Users are responsible for the content they choose to watch
 * - CycleRun is a video player interface, not a content host
 * 
 * Reference: https://developers.google.com/youtube/terms/api-services-terms-of-service
 */

export interface YouTubeVideoInfo {
  valid: boolean;
  embeddable: boolean;
  title?: string;
  author?: string;
  thumbnailUrl?: string;
  error?: string;
}

/**
 * Extract YouTube video ID from various URL formats
 */
export function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  
  const patterns = [
    // Standard: youtube.com/watch?v=VIDEO_ID
    /(?:youtube\.com\/watch\?v=|youtube\.com\/watch\?.+&v=)([a-zA-Z0-9_-]{11})/,
    // Short: youtu.be/VIDEO_ID
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    // Embed: youtube.com/embed/VIDEO_ID
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    // Shorts: youtube.com/shorts/VIDEO_ID
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    // Live: youtube.com/live/VIDEO_ID
    /youtube\.com\/live\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
}

/**
 * Check if a URL is a YouTube URL
 */
export function isYouTubeUrl(url: string): boolean {
  return extractYouTubeVideoId(url) !== null;
}

/**
 * Validate YouTube video using oEmbed API (no API key required)
 * Returns info about whether the video exists and is embeddable
 */
export async function validateYouTubeVideo(url: string): Promise<YouTubeVideoInfo> {
  const videoId = extractYouTubeVideoId(url);
  
  if (!videoId) {
    return {
      valid: false,
      embeddable: false,
      error: "Invalid YouTube URL",
    };
  }

  try {
    // YouTube oEmbed API - free, no API key required
    const oEmbedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    
    const response = await fetch(oEmbedUrl, {
      method: "GET",
      headers: { "Accept": "application/json" },
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        return {
          valid: true,
          embeddable: false,
          error: "Video embedding is disabled by the uploader",
        };
      }
      if (response.status === 404) {
        return {
          valid: false,
          embeddable: false,
          error: "Video not found or is private",
        };
      }
      return {
        valid: false,
        embeddable: false,
        error: `YouTube API error: ${response.status}`,
      };
    }

    const data = await response.json();
    
    return {
      valid: true,
      embeddable: true,
      title: data.title,
      author: data.author_name,
      thumbnailUrl: data.thumbnail_url,
    };
  } catch (error) {
    return {
      valid: false,
      embeddable: false,
      error: "Could not verify video. Please check the URL.",
    };
  }
}

/**
 * Generate YouTube embed URL with recommended parameters
 * - autoplay=1: Start playing immediately
 * - mute=1: Required for autoplay in most browsers
 * - controls=1: Show player controls
 * - modestbranding=1: Minimal YouTube branding
 * - rel=0: Don't show related videos from other channels
 * - playsinline=1: Play inline on mobile
 * - enablejsapi=1: Enable JavaScript API for playback rate control
 */
export function getYouTubeEmbedUrl(videoId: string, options?: {
  autoplay?: boolean;
  mute?: boolean;
  startTime?: number;
  controls?: boolean;
}): string {
  const params = new URLSearchParams({
    autoplay: options?.autoplay ? "1" : "0",
    mute: options?.mute ? "1" : "0",
    controls: options?.controls !== false ? "1" : "0",
    modestbranding: "1",
    rel: "0",
    playsinline: "1",
    enablejsapi: "1",
  });

  if (options?.startTime && options.startTime > 0) {
    params.set("start", Math.floor(options.startTime).toString());
  }

  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

/**
 * Generate YouTube thumbnail URL
 */
export function getYouTubeThumbnail(videoId: string, quality: "default" | "medium" | "high" | "maxres" = "high"): string {
  const qualityMap = {
    default: "default",
    medium: "mqdefault",
    high: "hqdefault",
    maxres: "maxresdefault",
  };
  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
}

/**
 * Legal disclaimer text for YouTube video usage
 */
export const YOUTUBE_LEGAL_DISCLAIMER = {
  en: {
    title: "YouTube Video",
    text: "This video is streamed directly from YouTube. CycleRun does not host or store any video content. You are responsible for ensuring you have the right to view this content. Playback is subject to YouTube's Terms of Service.",
    shortText: "Streamed from YouTube. Subject to YouTube ToS.",
  },
  de: {
    title: "YouTube-Video",
    text: "Dieses Video wird direkt von YouTube gestreamt. CycleRun hostet oder speichert keine Videoinhalte. Du bist verantwortlich dafür, dass du das Recht hast, diesen Inhalt anzusehen. Die Wiedergabe unterliegt den YouTube-Nutzungsbedingungen.",
    shortText: "Von YouTube gestreamt. YouTube-AGB gelten.",
  },
};
