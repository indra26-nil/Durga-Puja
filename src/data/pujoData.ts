import { Track, TeamMember, DhakPattern, PujaDayInfo } from '../types';
import duggaElo from '../assets/audio/dugga_elo.mp3';
import duggaeloCover from '../assets/images/duggaelo.jpg';
import duggaMa from '../assets/audio/duggama.mp3';
import duggaMaCover from '../assets/images/dugga_ma.jpg';

export const TRACKS: Track[] = [
  // DURGA PUJA TRACKS
  {
    id: 'dp-1',
    number: '01',
    title: 'Dugga Elo',
    artist: 'Monali Thakur',
    duration: '2:27',
    durationSeconds: 147,
    category: 'durga_puja',
    coverUrl: duggaeloCover,
    audioSrc: duggaElo,
    notes: 'Uplifting celebratory rhythm welcoming Maa Durga home.'
  },
  {
    id: 'dp-2',
    number: '02',
    title: 'Dugga Ma',
    artist: 'Arijit Singh',
    duration: '4:31',
    durationSeconds: 271,
    category: 'durga_puja',
    coverUrl: duggaMaCover,
    audioSrc: duggaMa,
    notes: 'Soulful festive anthem echoing across the streets of Bengal.'
  },
  {
    id: 'dp-3',
    number: '03',
    title: 'Ebar Jeno Onno Rokom Pujo',
    artist: 'Nakash Aziz Official',
    duration: '3:33',
    durationSeconds: 213,
    category: 'durga_puja',
    coverUrl: 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=300&auto=format&fit=crop&q=80',
    audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    notes: 'Modern energetic beats celebrating the nostalgia of pandal hopping.'
  },
  {
    id: 'dp-4',
    number: '04',
    title: 'Dhak Baja Kashor Baja',
    artist: 'Shreya Ghoshal Official',
    duration: '4:26',
    durationSeconds: 266,
    category: 'durga_puja',
    coverUrl: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=300&auto=format&fit=crop&q=80',
    audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    notes: 'Electrifying fusion of traditional Dhak and melodic devotion.'
  },
  {
    id: 'dp-5',
    number: '05',
    title: 'Bolo Dugga Elo',
    artist: 'Kaushik-Guddu',
    duration: '3:20',
    durationSeconds: 200,
    category: 'durga_puja',
    coverUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300&auto=format&fit=crop&q=80',
    audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    notes: 'Joyful chorus resonating in every Para and street corner.'
  },
  {
    id: 'dp-6',
    number: '06',
    title: 'Aamaar Dugga',
    artist: 'Monali Thakur',
    duration: '3:20',
    durationSeconds: 200,
    category: 'durga_puja',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80',
    audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    notes: 'Tender emotion of daughters returning to their ancestral home.'
  },
  {
    id: 'dp-7',
    number: '07',
    title: 'Dhaker Taley (Original Motion Picture Soundtrack)',
    artist: 'Release',
    duration: '4:43',
    durationSeconds: 283,
    category: 'durga_puja',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80',
    audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    notes: 'The pulse of Dhunuchi dance and reverberating dhak beats.'
  },
  {
    id: 'dp-8',
    number: '08',
    title: 'Dugga Elo',
    artist: 'Akriti Kakar',
    duration: '3:58',
    durationSeconds: 238,
    category: 'durga_puja',
    coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&auto=format&fit=crop&q=80',
    audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    notes: 'Sparkling melodies of autumn morning celebration.'
  },
  {
    id: 'dp-9',
    number: '09',
    title: 'Shundori Komola',
    artist: 'Release',
    duration: '3:14',
    durationSeconds: 194,
    category: 'durga_puja',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=80',
    audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    notes: 'Timeless folk rhythm with captivating festive percussion.'
  },
  {
    id: 'dp-10',
    number: '10',
    title: 'Elo Je Maa',
    artist: 'Release',
    duration: '5:08',
    durationSeconds: 308,
    category: 'durga_puja',
    coverUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=300&auto=format&fit=crop&q=80',
    audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
    notes: 'Epic orchestral celebration welcoming the Divine Mother.'
  },

  // MAHALAYA TRACKS
  {
    id: 'mh-1',
    number: '01',
    title: 'Mahisasuramardini Full Audio',
    artist: 'Birendra Krishna Bhadra',
    duration: '1:28:40',
    durationSeconds: 5320,
    category: 'mahalaya',
    coverUrl: 'https://images.unsplash.com/photo-1569420067332-9f37c358aaef?w=300&auto=format&fit=crop&q=80',
    audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
    notes: 'The immortal 4:00 AM radio dawn chant inaugurating Devipaksha.'
  },
  {
    id: 'mh-2',
    number: '02',
    title: 'Jago Durga (Invocation)',
    artist: 'Birendra Krishna Bhadra & Pankaj Mullick',
    duration: '4:50',
    durationSeconds: 290,
    category: 'mahalaya',
    coverUrl: 'https://images.unsplash.com/photo-1601056752763-7eb6a29be608?w=300&auto=format&fit=crop&q=80',
    audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
    notes: 'Chandi Path invoking the goddess to vanquish darkness.'
  },
  {
    id: 'mh-3',
    number: '03',
    title: 'Ya Chandi Madhukaithabharadhani',
    artist: 'Dwijen Mukherjee',
    duration: '3:45',
    durationSeconds: 225,
    category: 'mahalaya',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80',
    audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3',
    notes: 'Classic shloka evoking the celestial combat and glory.'
  },
  {
    id: 'mh-4',
    number: '04',
    title: 'Rupang Dehi Jayang Dehi',
    artist: 'Manabendra Mukherjee',
    duration: '4:12',
    durationSeconds: 252,
    category: 'mahalaya',
    coverUrl: 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=300&auto=format&fit=crop&q=80',
    audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3',
    notes: 'Hymn of prayer seeking grace, victory, and inner light.'
  },
  {
    id: 'mh-5',
    number: '05',
    title: 'Bajlo Tomar Alor Benu',
    artist: 'Supriti Ghosh',
    duration: '3:30',
    durationSeconds: 210,
    category: 'mahalaya',
    coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&auto=format&fit=crop&q=80',
    audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3',
    notes: 'The flute of dawn heralds the golden autumn sunshine.'
  },
  {
    id: 'mh-6',
    number: '06',
    title: 'Tabo Shubo Shankho Dhabani',
    artist: 'Dwijen Mukherjee',
    duration: '3:55',
    durationSeconds: 235,
    category: 'mahalaya',
    coverUrl: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=300&auto=format&fit=crop&q=80',
    audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3',
    notes: 'Sacred conch shell vibrations awakening the universe.'
  },

  // MAHALAYA SONGS
  {
    id: 'ms-1',
    number: '01',
    title: 'Bajlo Tomar Alor Benu',
    artist: 'Supriti Ghosh',
    duration: '3:30',
    durationSeconds: 210,
    category: 'mahalaya_songs',
    coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&auto=format&fit=crop&q=80',
    audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3',
    notes: 'Radiant morning song that brings tears of joy to every Bengali.'
  },
  {
    id: 'ms-2',
    number: '02',
    title: 'Jaago Tumi Jaago',
    artist: 'Arati Mukherjee',
    duration: '4:02',
    durationSeconds: 242,
    category: 'mahalaya_songs',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80',
    audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    notes: 'Awakening song of the mother of all creation.'
  },
  {
    id: 'ms-3',
    number: '03',
    title: 'Matribhumi Matrimurti',
    artist: 'Shyamal Mitra',
    duration: '3:48',
    durationSeconds: 228,
    category: 'mahalaya_songs',
    coverUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300&auto=format&fit=crop&q=80',
    audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    notes: 'Deep devotional reverence blending motherland and mother divine.'
  },
  {
    id: 'ms-4',
    number: '04',
    title: 'Subhra Shankha Robe',
    artist: 'Sandhya Mukherjee',
    duration: '3:35',
    durationSeconds: 215,
    category: 'mahalaya_songs',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=80',
    audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    notes: 'Pure white conch sounds drifting across autumn clouds.'
  },
  {
    id: 'ms-5',
    number: '05',
    title: 'He Chinmayi',
    artist: 'Tarun Banerjee',
    duration: '3:12',
    durationSeconds: 192,
    category: 'mahalaya_songs',
    coverUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=300&auto=format&fit=crop&q=80',
    audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    notes: 'Consciousness eternal and embodiment of wisdom.'
  }
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Ritam Biswas',
    role: 'Creator & Developer',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com'
  },
  {
    name: 'Arup Matabber',
    role: 'Creator & Designer',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com'
  }
];

export const DHAK_PATTERNS: DhakPattern[] = [
  {
    id: 'agomoni',
    name: 'Agomoni Dhak Beat',
    bengaliName: 'আগমনী ঢাক',
    bpm: 110,
    description: 'The welcoming morning rhythm of Bodhon and Shasthi.',
    bol: 'Dhum-kur-kur Dhum-kur-kur Dhum-dha Dha-kiti'
  },
  {
    id: 'dhunuchi',
    name: 'Dhunuchi Naach Groove',
    bengaliName: 'ধুনুচি নাচ তাল',
    bpm: 132,
    description: 'High energy rhythmic frenzy for Aarti and smoke dance.',
    bol: 'Dha Tin-tin Dha Tin-tin Dhum-kur-kur Jhaang-kashor'
  },
  {
    id: 'sandhi',
    name: 'Sandhi Puja Mahashtami',
    bengaliName: 'সন্ধিপুজো ঢাক',
    bpm: 120,
    description: 'Sacred intense percussion during 108 lotus and lamp offerings.',
    bol: 'Dha Ghene Dha Ghene Kiti-taka Dhum Dha'
  },
  {
    id: 'bisorjon',
    name: 'Bisorjon Bhashan Beats',
    bengaliName: 'বিসর্জন ভাসান',
    bpm: 128,
    description: 'Asche bochor abar hobe! Joyous farewell carnival beat.',
    bol: 'Bolo bolo Durga Mai Ki Joy! Dha Dha Kiti Dha'
  }
];

export const PUJA_DAYS: PujaDayInfo[] = [
  {
    day: 'Mahalaya',
    bengaliDay: 'মহালয়া',
    date: 'Tarpan & Dawn Awakening',
    significance: 'Inauguration of Devipaksha, invocation of Goddess Durga with Birendra Krishna Bhadra Chandi Path at 4:00 AM.',
    rituals: ['Ganga Tarpan for ancestors', 'Mahisasuramardini radio listen', 'Chokkhu Daan (drawing eyes on idol)']
  },
  {
    day: 'Maha Shasthi',
    bengaliDay: 'মহা ষষ্ঠী',
    date: 'Bodhon & Amontron',
    significance: 'Goddess Durga arrives on Earth with her four children Lakshmi, Saraswati, Kartik, and Ganesh.',
    rituals: ['Kalparambha', 'Bodhon under Bel tree', 'Adhibas & Amontron']
  },
  {
    day: 'Maha Saptami',
    bengaliDay: 'মহা সপ্তমী',
    date: 'Nabapatrika Snan (Kola Bou)',
    significance: 'Consecration of nine plants representing nine forms of Goddess Durga bathed in sacred river waters.',
    rituals: ['Early morning Kola Bou Snan', 'Prana Pratishtha', 'Pushpanjali with lotus blooms']
  },
  {
    day: 'Maha Ashtami',
    bengaliDay: 'মহা অষ্টমী',
    date: 'Sandhi Puja & Kumari Puja',
    significance: 'The grandest day of Pujo. Sandhi Puja takes place at the juncture of Ashtami and Nabami with 108 lotuses.',
    rituals: ['Grand Ashtami Pushpanjali in traditional attire', 'Kumari Puja', '108 Diya illumination during Sandhi Puja']
  },
  {
    day: 'Maha Nabami',
    bengaliDay: 'মহা নবমী',
    date: 'Maha Aarti & Dhunuchi Naach',
    significance: 'Celebration of victory over Mahishasura. Evening streets burst with mesmerizing fragrant Dhunuchi dances.',
    rituals: ['Nabami Homa & Yagna', 'Bhog Prasad distribution (Khichuri & Labra)', 'Dhunuchi Naach competitions']
  },
  {
    day: 'Bijoya Dashami',
    bengaliDay: 'বিজয়া দশমী',
    date: 'Sindoor Khela & Bisorjon',
    significance: 'Maa Durga begins her journey back to Kailash. Women smear red vermilion and distribute sweets with "Subho Bijoya".',
    rituals: ['Devi Baran & Darpan Bisorjon', 'Sindoor Khela', 'Ganga Bisorjon & sweet exchange (Rosogolla, Sondesh)']
  }
];
