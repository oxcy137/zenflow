import type { Meditation } from '@/types';
import { VIDEO_LANG_OVERRIDES } from '@/data/videoLangMap';

export function getMeditationVideo(m: Meditation, lang: string) {
  const override = VIDEO_LANG_OVERRIDES[m.id]?.[lang];
  if (override) {
    return {
      youtubeId: override.youtubeId,
      videoStart: override.start ?? 0,
    };
  }

  if (lang !== 'es' && m.youtubeIdEn) {
    return {
      youtubeId: m.youtubeIdEn,
      videoStart: m.videoStartEn ?? m.videoStart ?? 0,
    };
  }
  return {
    youtubeId: m.youtubeId,
    videoStart: m.videoStart ?? 0,
  };
}
