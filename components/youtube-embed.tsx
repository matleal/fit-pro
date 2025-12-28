"use client";

import { useState } from "react";
import { Play } from "lucide-react";

interface YouTubeEmbedProps {
  url: string;
  title?: string;
  className?: string;
}

function extractVideoId(url: string): string | null {
  if (!url) return null;

  // Handle various YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/, // Direct video ID
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
}

function getThumbnailUrl(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

export function YouTubeEmbed({ url, title = "Video", className = "" }: YouTubeEmbedProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoId = extractVideoId(url);

  if (!videoId) {
    return (
      <div className={`aspect-video bg-zinc-800 rounded-lg flex items-center justify-center ${className}`}>
        <p className="text-zinc-500 text-sm">URL de vídeo inválida</p>
      </div>
    );
  }

  if (isPlaying) {
    return (
      <div className={`aspect-video rounded-lg overflow-hidden ${className}`}>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsPlaying(true)}
      className={`aspect-video rounded-lg overflow-hidden relative group cursor-pointer ${className}`}
    >
      <img
        src={getThumbnailUrl(videoId)}
        alt={title}
        className="w-full h-full object-cover"
        onError={(e) => {
          // Fallback to hqdefault if maxresdefault doesn't exist
          const target = e.target as HTMLImageElement;
          target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        }}
      />
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center">
        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
          <Play className="w-7 h-7 text-white ml-1" fill="white" />
        </div>
      </div>
    </button>
  );
}

// Compact version for lists
export function YouTubeThumbnail({ url, className = "" }: { url: string; className?: string }) {
  const videoId = extractVideoId(url);

  if (!videoId) {
    return (
      <div className={`aspect-video bg-zinc-800 rounded flex items-center justify-center ${className}`}>
        <Play className="w-4 h-4 text-zinc-600" />
      </div>
    );
  }

  return (
    <div className={`aspect-video rounded overflow-hidden relative ${className}`}>
      <img
        src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
        alt="Video thumbnail"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
        <div className="w-8 h-8 bg-red-600/90 rounded-full flex items-center justify-center">
          <Play className="w-4 h-4 text-white ml-0.5" fill="white" />
        </div>
      </div>
    </div>
  );
}
