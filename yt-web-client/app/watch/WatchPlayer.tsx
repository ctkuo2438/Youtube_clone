'use client';

import { useSearchParams } from "next/navigation";

export default function WatchPlayer() {
  const videoPrefix = 'https://storage.googleapis.com/ctk-yt-processed-videos/';
  const videoSrc = useSearchParams().get('v');

  if (!videoSrc) return <p>No video selected.</p>;

  return (
    <video
      controls
      src={videoPrefix + videoSrc}
      style={{ width: "100%", maxWidth: "720px", marginTop: "20px" }}
    />
  );
}
