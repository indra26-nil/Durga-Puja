export interface Track {
  id: string;
  number: string;
  title: string;
  artist: string;
  duration: string;
  durationSeconds: number;
  category: 'durga_puja' | 'mahalaya' | 'mahalaya_songs';
  coverUrl: string;
  audioSrc?: string;
  raga?: string;
  notes?: string;
}

export type PlaylistTab = 'DURGA PUJA' | 'MAHALAYA' | 'MAHALAYA SONGS';

export interface TeamMember {
  name: string;
  role: string;
  avatarUrl: string;
  linkedin: string;
  instagram: string;
}

export interface PujoStats {
  onlineUsers: number;
  daysUntilPujo: number;
  targetPujoDate: string;
  currentPhase: string;
  shasthiDate: string;
  mahalayaDate: string;
  festiveWishBengali: string;
  festiveWishEnglish: string;
}

export type ThemeId = 'illustrated' | 'golden_pandal' | 'twilight' | 'dawn_light';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  subtitle: string;
  isDark: boolean;
  bgClass: string;
}

export interface DhakPattern {
  id: string;
  name: string;
  bengaliName: string;
  bpm: number;
  description: string;
  bol: string;
}

export interface PujaDayInfo {
  day: string;
  bengaliDay: string;
  date: string;
  significance: string;
  rituals: string[];
}
