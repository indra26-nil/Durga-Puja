import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Palette, Bell, Info, Sun, Moon, Sparkles, Music, Flame } from 'lucide-react';
import { PujoStats, ThemeId } from '../types';
import { audioEngine } from '../utils/audioEngine';

interface HeaderProps {
  stats?: PujoStats;
  currentTheme: ThemeId;
  onSelectTheme: (theme: ThemeId) => void;
  onOpenPlaylist: () => void;
  onOpenAbout: () => void;
  onOpenSchedule: () => void;
  onOpenDhak: () => void;
  onOpenThemePicker: () => void;
}

// Curated festive moods, mantras & Bengali Sharodiyo sentiments
const FESTIVE_SENTIMENTS = [
  {
    icon: '🪔',
    bengali: 'শুভ শারদীয়া',
    english: 'Subho Sharodiyo',
    tag: 'শারদোৎসবের প্রীতি ও শুভেচ্ছা',
    mantra: 'সর্বমঙ্গলমঙ্গল্যে শিবে সর্বার্থসাধিকে'
  },
  {
    icon: '🌺',
    bengali: 'দেবীপক্ষ শুরু',
    english: 'Devipaksha Dawn',
    tag: 'মায়ের আগমন বার্তা',
    mantra: 'যা দেবী সর্বভূতেষু শক্তিরূপেণ সংস্থিতা'
  },
  {
    icon: '🌾',
    bengali: 'কাশফুলের দোলা',
    english: 'Autumn Kash Breeze',
    tag: 'শরতের নীল আকাশ ও সাদা মেঘ',
    mantra: 'নমস্তস্যৈ নমস্তস্যৈ নমস্তস্যৈ নমো নমঃ'
  },
  {
    icon: '🥁',
    bengali: 'ঢাকের বোল',
    english: 'Dhak Rhythm',
    tag: 'পূজার আনন্দধ্বনি চারিদিকে',
    mantra: 'বাজে রে বাজে রে ঢাক বাজে!'
  },
  {
    icon: '🪷',
    bengali: '১০৮ পদ্ম অঞ্জলি',
    english: '108 Sacred Lotuses',
    tag: 'সন্ধিপূজার মঙ্গল আরতি',
    mantra: 'জয়ন্তী মঙ্গলা কালী ভদ্রকালী কপালিনী'
  },
  {
    icon: '🍂',
    bengali: 'শিউলি সুবাস',
    english: 'Shiuli Fragrance',
    tag: 'শিশিরভেজা ভোরের আগমনী',
    mantra: 'রূপং দেহি জয়ং দেহি যশো দেহি দ্বিষো জহি'
  },
  {
    icon: '✨',
    bengali: 'জয় মা দুর্গা',
    english: 'Joy Maa Durga',
    tag: 'দুর্গতিনাশিনী দশভুজা মহামায়া',
    mantra: 'ওঁ ঐং হ্রীং ক্লীং চামুণ্ডায়ৈ বিচ্চে'
  }
];

export const Header: React.FC<HeaderProps> = ({
  stats,
  currentTheme,
  onSelectTheme,
  onOpenPlaylist,
  onOpenAbout,
  onOpenSchedule,
  onOpenDhak,
  onOpenThemePicker
}) => {
  const [timeString, setTimeString] = useState<string>('');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [shankhoPlaying, setShankhoPlaying] = useState<boolean>(false);
  const [sentimentIndex, setSentimentIndex] = useState<number>(0);
  const [showBlessingPopup, setShowBlessingPopup] = useState<boolean>(false);

  // Live local time formatting (e.g. 11:04 pm)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12;
      setTimeString(`${hours}:${minutes} ${ampm}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-cycle through festive sentiments every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setSentimentIndex((prev) => (prev + 1) % FESTIVE_SENTIMENTS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    audioEngine.setMasterVolume(nextMute ? 0 : 0.85);
  };

  const handlePlayShankho = () => {
    setShankhoPlaying(true);
    audioEngine.playShankho();
    setTimeout(() => setShankhoPlaying(false), 2800);
  };

  const handleNextSentiment = () => {
    audioEngine.playTempleBell();
    setSentimentIndex((prev) => (prev + 1) % FESTIVE_SENTIMENTS.length);
    setShowBlessingPopup(true);
    setTimeout(() => setShowBlessingPopup(false), 3200);
  };

  const currentSentiment = FESTIVE_SENTIMENTS[sentimentIndex];
  const isLight = currentTheme === 'dawn_light';

  // Bengali numerals helper for countdown
  const getBengaliDigits = (num: number) => {
    const bengaliNums = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(num).split('').map(d => bengaliNums[parseInt(d, 10)] || d).join('');
  };

  const daysLeft = stats?.daysUntilPujo ?? 61;

  return (
    <header className="relative z-20 w-full px-4 sm:px-8 py-4 sm:py-6 flex items-center justify-between">
      {/* Top Left: Clock */}
      <div className="flex items-center gap-3">
        <div
          id="live-clock"
          className={`text-sm sm:text-base font-medium tracking-wide transition-colors ${
            isLight ? 'text-zinc-800' : 'text-zinc-300'
          }`}
        >
          {timeString || '11:04 pm'}
        </div>
      </div>

      {/* Top Center: Interactive Festive Status & Pujo Countdown Pill */}
      <div className="relative flex items-center justify-center">
        <button
          id="pujo-status-pill"
          onClick={handleNextSentiment}
          title="Click to cycle festive blessings & hear temple bell"
          aria-label="Festive mood and Durga Puja countdown"
          className={`group flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium tracking-wide shadow-sm border transition-all duration-300 cursor-pointer select-none active:scale-95 ${
            isLight
              ? 'bg-white/90 hover:bg-white border-black/10 text-zinc-800 backdrop-blur-md shadow-amber-900/10 hover:border-amber-400/50'
              : 'bg-zinc-900/85 hover:bg-zinc-900 border-white/10 text-zinc-200 backdrop-blur-md shadow-black/40 hover:border-amber-400/40'
          }`}
        >
          {/* Sacred Diya / Flame Glow Indicator */}
          <span className="relative flex items-center justify-center">
            <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-amber-400 opacity-60"></span>
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
          </span>

          {/* Dynamic Sacred Sentiment (Bengali + English tag) */}
          <div className="overflow-hidden h-5 flex items-center min-w-[90px] sm:min-w-[130px] justify-start">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSentiment.bengali}
                initial={{ opacity: 0, y: 7 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -7 }}
                transition={{ duration: 0.25 }}
                className="flex items-center gap-1.5"
              >
                <span className="text-amber-400 font-medium font-bengali">
                  {currentSentiment.bengali}
                </span>
                <span className="hidden md:inline text-[11px] opacity-60 font-sans tracking-normal">
                  ({currentSentiment.english})
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Divider */}
          <span className={`opacity-30 ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>|</span>

          {/* Days until Durga Pujo with Bengali digits */}
          <div className="flex items-center gap-1">
            <span className="font-semibold text-amber-400/95 font-sans">
              {daysLeft} days
            </span>
            <span className="text-[11px] opacity-75 font-bengali hidden sm:inline text-amber-300/80">
              ({getBengaliDigits(daysLeft)} দিন)
            </span>
            <span className={`hidden xs:inline ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>
              to Durga Pujo
            </span>
          </div>

          <Sparkles className="w-3 h-3 text-amber-400/60 group-hover:text-amber-300 group-hover:rotate-45 transition-all" />
        </button>

        {/* Floating Blessing / Mantra Toast when pill is clicked */}
        <AnimatePresence>
          {showBlessingPopup && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`absolute top-11 sm:top-12 z-30 px-4 py-2.5 rounded-2xl border shadow-xl backdrop-blur-xl text-center whitespace-nowrap pointer-events-none ${
                isLight
                  ? 'bg-amber-50/95 border-amber-200 text-zinc-900 shadow-amber-950/15'
                  : 'bg-zinc-900/95 border-amber-500/30 text-amber-100 shadow-black/80'
              }`}
            >
              <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-amber-400">
                <span>{currentSentiment.icon}</span>
                <span>{currentSentiment.tag}</span>
              </div>
              <div className="text-[11px] text-zinc-400 font-bengali mt-0.5">
                {currentSentiment.mantra}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Top Right: Action Controls (Matches screenshots!) */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {/* Sacred Shankho Sound Trigger */}
        <button
          id="shankho-action-btn"
          onClick={handlePlayShankho}
          title="Play Sacred Shankho (Conch Shell) Sound"
          aria-label="Sound sacred conch shell"
          className={`relative p-2 sm:p-2.5 rounded-full transition-all duration-200 flex items-center justify-center ${
            shankhoPlaying
              ? 'bg-amber-500 text-black scale-110 shadow-lg shadow-amber-500/50'
              : isLight
              ? 'bg-white/80 text-zinc-700 hover:bg-amber-100/80 hover:text-amber-700 border border-black/5'
              : 'bg-zinc-900/80 text-zinc-300 hover:bg-zinc-800 hover:text-amber-300 border border-white/10'
          }`}
        >
          <Sparkles className={`w-4 h-4 ${shankhoPlaying ? 'animate-spin' : ''}`} />
          {shankhoPlaying && (
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-amber-400 whitespace-nowrap">
              শঙ্খধ্বনি
            </span>
          )}
        </button>

        {/* Master Mute / Sound Toggle */}
        <button
          id="audio-mute-toggle"
          onClick={toggleMute}
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          aria-label="Toggle mute"
          className={`p-2 sm:p-2.5 rounded-full transition-all duration-200 ${
            isLight
              ? 'bg-white/80 text-zinc-700 hover:bg-zinc-100 border border-black/5'
              : 'bg-zinc-900/80 text-zinc-300 hover:bg-zinc-800 border border-white/10'
          }`}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Playlists Button */}
        <button
          id="playlists-top-btn"
          onClick={onOpenPlaylist}
          title="Open Curated Playlists"
          aria-label="Open playlists"
          className={`p-2 sm:p-2.5 rounded-full transition-all duration-200 ${
            isLight
              ? 'bg-white/80 text-zinc-700 hover:bg-zinc-100 border border-black/5'
              : 'bg-zinc-900/80 text-zinc-300 hover:bg-zinc-800 border border-white/10'
          }`}
        >
          <Music className="w-4 h-4" />
        </button>

        {/* Pujo Calendar Schedule Notifications */}
        <button
          id="schedule-top-btn"
          onClick={onOpenSchedule}
          title="Puja Schedule & Ritual Timings"
          aria-label="Puja schedule"
          className={`p-2 sm:p-2.5 rounded-full transition-all duration-200 relative ${
            isLight
              ? 'bg-white/80 text-zinc-700 hover:bg-zinc-100 border border-black/5'
              : 'bg-zinc-900/80 text-zinc-300 hover:bg-zinc-800 border border-white/10'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-zinc-900" />
        </button>

        {/* Theme Palette Switcher */}
        <button
          id="theme-picker-btn"
          onClick={onOpenThemePicker}
          title="Change Theme & Background"
          aria-label="Change theme"
          className={`p-2 sm:p-2.5 rounded-full transition-all duration-200 ${
            isLight
              ? 'bg-white/80 text-zinc-700 hover:bg-zinc-100 border border-black/5'
              : 'bg-zinc-900/80 text-zinc-300 hover:bg-zinc-800 border border-white/10'
          }`}
        >
          <Palette className="w-4 h-4" />
        </button>

        {/* Quick Dark/Light Toggle */}
        <button
          id="quick-dark-toggle"
          onClick={() => onSelectTheme(isLight ? 'illustrated' : 'dawn_light')}
          title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          aria-label="Toggle dark and light mode"
          className={`p-2 sm:p-2.5 rounded-full transition-all duration-200 ${
            isLight
              ? 'bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300/40'
              : 'bg-zinc-900/80 text-amber-400 hover:bg-zinc-800 border border-white/10'
          }`}
        >
          {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>

        {/* Team / Info Button ("Made with Bhalobasha by") */}
        <button
          id="about-team-btn"
          onClick={onOpenAbout}
          title="Made with Bhalobasha by Ritam & Arup"
          aria-label="About creators"
          className={`p-2 sm:p-2.5 rounded-full transition-all duration-200 ${
            isLight
              ? 'bg-white/80 text-zinc-700 hover:bg-zinc-100 border border-black/5'
              : 'bg-zinc-900/80 text-zinc-300 hover:bg-zinc-800 border border-white/10'
          }`}
        >
          <Info className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
