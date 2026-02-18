export type LoopMode = 'crossfade' | 'optimal' | 'boomerang';
export type AspectRatio = 'original' | '16:9' | '1:1' | '9:16';

export interface TrimState {
  start: number;
  end: number;
  duration: number;
}

export interface LoopSettings {
  fadeDuration: number;
  isAutoFade: boolean;
  loopMode: LoopMode;
  loopCount: number;
  aspectRatio: AspectRatio;
}

// Declare globals for the CDN scripts
declare global {
  interface Window {
    FFmpeg: any;
    FFmpegUtil: any;
  }
}