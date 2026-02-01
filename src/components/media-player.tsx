"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Song } from "@/types/song";
import { getYouTubeVideoId } from "@/lib/youtube";

function loadYouTubeAPI(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();
  return new Promise((resolve) => {
    window.onYouTubeIframeAPIReady = () => resolve();
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const first = document.getElementsByTagName("script")[0];
    first?.parentNode?.insertBefore(tag, first);
  });
}

export function useMediaPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ytPlayerRef = useRef<YTPlayer | null>(null);
  const ytContainerRef = useRef<HTMLDivElement | null>(null);
  const [ytReady, setYtReady] = useState(false);

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.addEventListener("ended", () => {});
    loadYouTubeAPI().then(() => setYtReady(true));
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
      ytPlayerRef.current?.destroy();
      ytPlayerRef.current = null;
    };
  }, []);

  const play = useCallback(async (song: Song) => {
    const ytId = getYouTubeVideoId(song.url);
    if (ytId) {
      if (!window.YT?.Player) await loadYouTubeAPI();
      ytPlayerRef.current?.destroy();
      ytPlayerRef.current = null;
      const container = ytContainerRef.current;
      if (!container) return;
      container.innerHTML = "";
      const div = document.createElement("div");
      div.id = "yt-player-instance";
      container.appendChild(div);
      await new Promise<void>((resolve) => {
        const player = new window.YT!.Player("yt-player-instance", {
          videoId: ytId,
          width: "100%",
          height: "100%",
          playerVars: { autoplay: 1, rel: 0 },
          events: { onReady: () => resolve() },
        });
        ytPlayerRef.current = player;
      });
    } else {
      const audio = audioRef.current;
      if (!audio) return;
      audio.src = song.url;
      audio.play();
    }
  }, []);

  const pause = useCallback(() => {
    const yt = ytPlayerRef.current;
    if (yt?.getPlayerState?.() === 1) yt.pauseVideo();
    else audioRef.current?.pause();
  }, []);

  const resume = useCallback(() => {
    const yt = ytPlayerRef.current;
    if (yt?.getPlayerState?.() === 2) yt.playVideo();
    else audioRef.current?.play();
  }, []);

  const stop = useCallback(() => {
    ytPlayerRef.current?.stopVideo();
    ytPlayerRef.current?.destroy();
    ytPlayerRef.current = null;
    if (ytContainerRef.current) ytContainerRef.current.innerHTML = "";
    audioRef.current?.pause();
    if (audioRef.current) audioRef.current.src = "";
  }, []);

  const setYtContainer = useCallback((el: HTMLDivElement | null) => {
    ytContainerRef.current = el;
  }, []);

  return {
    play,
    pause,
    resume,
    stop,
    ytReady,
    setYtContainer,
    isYouTube: (url: string) => getYouTubeVideoId(url) !== null,
  };
}
