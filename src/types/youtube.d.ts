declare global {
  interface YTPlayerState {
    ENDED: number;
    PLAYING: number;
    PAUSED: number;
    BUFFERING: number;
    CUED: number;
  }

  interface YTPlayerEvent {
    target: YTPlayer;
    data: number;
  }

  interface YTPlayer {
    playVideo(): void;
    pauseVideo(): void;
    stopVideo(): void;
    destroy(): void;
    getPlayerState(): number;
  }

  interface YTPlayerOptions {
    videoId?: string;
    width?: string | number;
    height?: string | number;
    playerVars?: Record<string, number | string>;
    events?: {
      onReady?: (event: YTPlayerEvent) => void;
      onStateChange?: (event: YTPlayerEvent) => void;
    };
  }

  interface YT {
    Player: new (elementId: string, options: YTPlayerOptions) => YTPlayer;
    PlayerState: YTPlayerState;
  }

  interface Window {
    YT?: YT;
    onYouTubeIframeAPIReady?: () => void;
  }
}

export {};
