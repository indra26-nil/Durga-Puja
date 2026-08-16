import { Track, PujoStats, PlaylistTab } from '../types';
import { TRACKS, PUJA_DAYS } from '../data/pujoData';

// Fetch live Pujo stats (online listeners, countdown, current mood)
export async function fetchPujoStats(): Promise<PujoStats> {
  // Simulate network delay for authentic React Query fetching
  await new Promise(resolve => setTimeout(resolve, 300));

  // Current year / date calculation
  const now = new Date();
  // Target Durga Puja Maha Shasthi (October)
  const targetYear = now.getFullYear();
  let pujoDate = new Date(targetYear, 9, 16); // Approx mid-October
  if (now > pujoDate) {
    pujoDate = new Date(targetYear + 1, 9, 6);
  }

  const diffTime = pujoDate.getTime() - now.getTime();
  const daysUntilPujo = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  // Realistic random variation around 265 online listeners as in screenshot
  const baseCount = 265;
  const jitter = Math.floor(Math.sin(Date.now() / 15000) * 18) + Math.floor(Math.random() * 8 - 4);
  const onlineUsers = Math.max(120, baseCount + jitter);

  return {
    onlineUsers,
    daysUntilPujo: daysUntilPujo || 61,
    targetPujoDate: pujoDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    currentPhase: 'Sharodiyo Autumn Celebrations',
    shasthiDate: 'Maha Shasthi: Bodhon & Amontron',
    mahalayaDate: 'Tarpan & Birendra Krishna Bhadra Chandi Path',
    festiveWishBengali: 'পুজোর আনন্দে ভরে উঠুক প্রতিটি মন ও প্রাণ!',
    festiveWishEnglish: 'May the divine presence of Maa Durga bring happiness, peace, and eternal joy.'
  };
}

// Fetch tracks by category with search/filter support
export async function fetchTracksByCategory(category: PlaylistTab): Promise<Track[]> {
  await new Promise(resolve => setTimeout(resolve, 200));

  const catMap: Record<PlaylistTab, 'durga_puja' | 'mahalaya' | 'mahalaya_songs'> = {
    'DURGA PUJA': 'durga_puja',
    'MAHALAYA': 'mahalaya',
    'MAHALAYA SONGS': 'mahalaya_songs'
  };

  const mappedCat = catMap[category];
  return TRACKS.filter(t => t.category === mappedCat);
}

// Fetch live festive announcement / trivia
export async function fetchDailyPujaTrivia(): Promise<{ title: string; text: string; bengaliText: string }> {
  await new Promise(resolve => setTimeout(resolve, 250));
  const trivias = [
    {
      title: 'The Sound of Kash Ful & Shiuli',
      bengaliText: 'শিউলি ফুলের গন্ধ আর কাশের বনে দোলা, জানান দিচ্ছে মা আসছেন।',
      text: 'White Kash flowers (Saccharum spontaneum) blooming under azure autumn skies symbolize the arrival of Maa Durga.'
    },
    {
      title: '4:00 AM Mahalaya Radio Tradition',
      bengaliText: 'মহালয়ার ভোরে বীরেন্দ্রকৃষ্ণ ভদ্রের চণ্ডীপাঠ ছাড়া বাঙালির পুজো শুরু হয় না।',
      text: 'Since 1931, the voice of Birendra Krishna Bhadra on All India Radio marks the dawn of Devipaksha.'
    },
    {
      title: '108 Lotus & Sandhi Puja',
      bengaliText: 'অষ্টমী ও নবমীর সন্ধিক্ষণে ১০৮ পদ্ম ও প্রদীপে হয় মহাশক্তিশালী সন্ধিপুজো।',
      text: 'Sandhi Puja takes place for 48 minutes at the sacred cusp between Maha Ashtami and Maha Nabami.'
    },
    {
      title: 'The Resonance of Dhak',
      bengaliText: 'ঢাকের কাঠি পড়লো বলে, কাশফুলে মন দুললো যে!',
      text: 'Dhak beats communicate the entire emotional journey of Durga Puja, from joyful welcoming to tearful farewell.'
    }
  ];
  const idx = Math.floor((Date.now() / 60000) % trivias.length);
  return trivias[idx];
}
