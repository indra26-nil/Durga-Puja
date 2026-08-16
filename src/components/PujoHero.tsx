import React from 'react';
import { motion } from 'motion/react';
import { Radio, Music2, ChevronDown, Sparkles, Calendar, Heart } from 'lucide-react';
import { ThemeId } from '../types';

interface PujoHeroProps {
  theme: ThemeId;
  isDhakPlaying: boolean;
  onOpenPlaylist: () => void;
  onToggleDhak: () => void;
  onOpenDhakStudio: () => void;
}

export const PujoHero: React.FC<PujoHeroProps> = ({
  theme,
  isDhakPlaying,
  onOpenPlaylist,
  onToggleDhak,
  onOpenDhakStudio
}) => {
  const isLight = theme === 'dawn_light';

  return (
    <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 flex flex-col md:flex-row items-center md:items-center justify-between min-h-[48vh] sm:min-h-[54vh] select-none pointer-events-auto">
      {/* Left / Side Content: "পুজো আসছে" typography & action controls */}
      <div className="relative flex flex-col items-center md:items-start text-center md:text-left max-w-2xl">
        {/* Glow aura backdrop positioned behind the side text */}
        <div
          className={`absolute -left-10 top-1/2 -translate-y-1/2 w-80 sm:w-96 h-80 sm:h-96 rounded-full blur-3xl pointer-events-none transition-opacity duration-1000 ${isLight ? 'bg-amber-300/35' : 'bg-amber-500/20'
            }`}
        />

        {/* Small Festive Tag */}
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-3 sm:mb-4 border backdrop-blur-md ${isLight
              ? 'bg-amber-100/90 text-amber-900 border-amber-300/60 shadow-sm'
              : 'bg-amber-950/40 text-amber-300 border-amber-500/30 shadow-black/40'
            }`}
        >
          <Sparkles className="w-3 h-3 text-amber-400 animate-spin-slow" />
          <span>শারদোৎসব ২০২৬ • MAA DURGA'S HOMECOMING</span>
        </motion.div>

        {/* Main Iconic Bengali Typography: "পুজো আসছে" (Side Aligned) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex flex-col items-center md:items-start tracking-tight"
        >
          <h1
            id="main-pujo-title"
            className="font-bengali font-extrabold text-6xl sm:text-7xl md:text-8xl lg:text-[9.5rem] leading-[0.92] sm:leading-[0.88] drop-shadow-2xl"
          >
            {/* Top Word: পুজো */}
            <span
              className={`block transition-all duration-300 ${isLight
                  ? 'text-amber-600 drop-shadow-[0_4px_18px_rgba(217,119,6,0.35)]'
                  : 'text-[#facc15] drop-shadow-[0_0_40px_rgba(250,204,21,0.65)]'
                }`}
            >
              পুজো
            </span>

            {/* Bottom Word: আসছে */}
            <span
              className={`block transition-all duration-300 ${isLight
                  ? 'text-amber-900 drop-shadow-[0_4px_16px_rgba(120,53,15,0.25)]'
                  : 'text-[#fef08a] drop-shadow-[0_0_35px_rgba(254,240,138,0.55)]'
                }`}
            >
              আসছে
            </span>
          </h1>

          {/* English Subtitle: The Spirit of Durga Puja */}
          {/* <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.95 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className={`mt-3 sm:mt-4 text-xs sm:text-sm md:text-base font-medium tracking-wide ${
              isLight ? 'text-amber-950/80 font-medium' : 'text-amber-100/90'
            }`}
          >
            Welcome Maa Durga <span className="text-amber-400 font-bold">•</span> Sharodiyo Melodies & Live Dhak
          </motion.p> */}
        </motion.div>

        {/* Pill Action Controls beneath title on the side */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center md:justify-start gap-2.5 sm:gap-3.5"
        >
          {/* 1. PUJA RADIO ▾ Pill Button */}
          <button
            id="hero-puja-radio-btn"
            onClick={onOpenPlaylist}
            className={`group flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-300 shadow-lg ${isLight
                ? 'bg-white/90 hover:bg-white text-zinc-800 border border-zinc-200 shadow-amber-900/10 hover:scale-105 active:scale-95'
                : 'bg-zinc-900/85 hover:bg-zinc-800/95 text-zinc-200 border border-white/15 backdrop-blur-xl shadow-black/50 hover:border-amber-400/40 hover:scale-105 active:scale-95'
              }`}
          >
            <Radio className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
            <span>PUJA RADIO</span>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 group-hover:translate-y-0.5 transition-transform" />
          </button>

          {/* 2. ♫ DHAK Button */}
          <button
            id="hero-dhak-toggle-btn"
            onClick={onToggleDhak}
            onContextMenu={(e) => {
              e.preventDefault();
              onOpenDhakStudio();
            }}
            title="Click to play/pause Dhak beats. Right click for Dhak Studio."
            className={`flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-300 shadow-lg ${isDhakPlaying
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold shadow-amber-500/40 border border-amber-300 animate-pulse-slow scale-105'
                : isLight
                  ? 'bg-white/90 hover:bg-white text-zinc-800 border border-zinc-200 shadow-amber-900/10 hover:scale-105 active:scale-95'
                  : 'bg-zinc-900/85 hover:bg-zinc-800/95 text-zinc-200 border border-white/15 backdrop-blur-xl shadow-black/50 hover:border-amber-400/40 hover:scale-105 active:scale-95'
              }`}
          >
            <Music2 className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isDhakPlaying ? 'text-black animate-bounce' : 'text-amber-400'}`} />
            <span>{isDhakPlaying ? 'DHAK PLAYING' : '♫ DHAK'}</span>
            {isDhakPlaying && (
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-black" />
              </span>
            )}
          </button>

          {/* 3. DHAK STUDIO Trigger */}
          <button
            id="hero-dhak-studio-btn"
            onClick={onOpenDhakStudio}
            title="Open interactive Dhak Studio & live percussion simulator"
            className={`p-2.5 sm:p-3 rounded-full text-xs transition-all duration-200 border flex items-center justify-center ${isLight
                ? 'bg-white/80 border-zinc-200 text-zinc-700 hover:bg-white hover:border-amber-400'
                : 'bg-zinc-900/80 border-white/15 text-zinc-300 hover:bg-zinc-800 hover:text-amber-400 hover:border-amber-400/40'
              }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
          </button>
        </motion.div>
      </div>

      {/* Right / Center-Stage Open Space: Allows the Maa Durga Pratima Murti in the background to shine clearly */}
      <div className="hidden md:flex flex-col items-end justify-center pointer-events-none pr-4">
        {/* Subtle decorative glass card on the side indicating current festival phase */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className={`px-4 py-3 rounded-2xl border backdrop-blur-md max-w-xs text-right shadow-xl pointer-events-auto ${isLight
              ? 'bg-white/70 border-amber-900/10 text-zinc-800'
              : 'bg-black/40 border-white/10 text-amber-100/90'
            }`}
        >
          <div className="flex items-center justify-end gap-1.5 text-xs font-semibold text-amber-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>শারদীয় দুর্গোৎসব ২০২৬</span>
          </div>
          <p className="text-[11px] opacity-75 font-bengali mt-1 leading-relaxed">
            মহালয়া থেকে দশমী — ভোরের শিউলি, ঢাকের কাঠি আর কাশফুলের আগমনী সুর।
          </p>
        </motion.div>
      </div>
    </div>
  );
};

