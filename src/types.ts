export interface MeditationStep {
  text: string;
  textEn?: string;
  duration: number;
  type: 'inhale' | 'hold' | 'exhale' | 'rest' | 'instruction' | 'silence' | 'mantra' | 'video';
}

export interface Meditation {
  id: string;
  title: string;
  titleEn?: string;
  subtitle: string;
  subtitleEn?: string;
  description: string;
  descriptionEn?: string;
  icon: string;
  iconType: string;
  color: string;
  gradient: string;
  duration: number;
  steps: MeditationStep[];
  youtubeId?: string;
  youtubeIdEn?: string;
  isVideo?: boolean;
  videoDuration?: number;
  videoStart?: number;
  videoStartEn?: number;
  premium?: boolean;
  pointsRequired?: number;
}

export interface MusicTrack {
  id: string;
  title: string;
  category: string;
  duration: number;
  source: 'simulated';
}

export interface Session {
  id: string;
  meditationId: string;
  meditationTitle: string;
  date: string;
  duration: number;
  completed: boolean;
}

export interface User {
  id: string;
  email: string;
  username: string;
}

export interface Comment {
  id: string;
  content: string;
  userId: string;
  username: string;
  createdAt: string;
  likes: number;
  liked: boolean;
}

export interface Stats {
  totalSessions: number;
  totalMinutes: number;
  byMeditation: { meditation_id: string; meditation_title: string; count: number }[];
}

export type Page = 'home' | 'practicas' | 'music' | 'stats' | 'misticismo';
