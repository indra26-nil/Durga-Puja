import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Pause, Volume2, Sparkles, Music2, Disc } from 'lucide-react';
import { DHAK_PATTERNS } from '../data/pujoData';
import { audioEngine } from '../utils/audioEngine';
import { ThemeId } from '../types';

interface DhakStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDhakPlaying: boolean;
  onToggleDhak: () => void;
  theme: ThemeId;
}

export const DhakStudioModal: React.FC<DhakStudioModalProps> = ({
  isOpen,
  onClose,
  isDhakPlaying,
  onToggleDhak,
  theme
}) => {
  const [activePattern, setActivePattern] = useState<string>('agomoni');
  const [activeHit, setActiveHit] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<number>(-1);

  useEffect(() => {
    audioEngine.setOnDhakStep((step, hitName) => {
      setActiveStep(step);
      setActiveHit(hitName);
      setTimeout(() => setActiveHit(null), 120);
    });

    return () => {
      audioEngine.setOnDhakStep(() => {});
    };
  }, []);

  if (!isOpen) return null;

  const handleSelectPattern = (patternId: string) => {
    setActivePattern(patternId);
    if (isDhakPlaying) {
      audioEngine.startDhakLoop(patternId);
    }
  };

  const handleManualHit = (type: 'bass' | 'slap' | 'rim' | 'kanshor' | 'shankho') => {
    audioEngine.resume();
    setActiveHit(type);
    if (type === 'bass') audioEngine.playDhakBass();
    else if (type === 'slap') audioEngine.playDhakSlap();
    else if (type === 'rim') audioEngine.playDhakRim();
    else if (type === 'kanshor') audioEngine.playKanshor();
    else if (type === 'shankho') audioEngine.playShankho();

    setTimeout(() => setActiveHit(null), 150);
  };

  const isLight = theme === 'dawn_light';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-md"
        />

        {/* Modal Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className={`relative z-10 w-full max-w-2xl rounded-3xl border shadow-2xl p-6 sm:p-8 backdrop-blur-2xl overflow-hidden ${
            isLight
              ? 'bg-white/95 border-zinc-200 text-zinc-900 shadow-amber-950/20'
              : 'bg-[#181922]/95 border-white/10 text-zinc-100 shadow-black/90'
          }`}
        >
          {/* Close button */}
          <button
            id="dhak-studio-close-btn"
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close Dhak Studio"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Music2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight">
                Dhak & Kashor Rhythm Studio
              </h3>
              <p className="text-xs text-zinc-400">
                Traditional Bengali Percussion & Live Dhak Simulator
              </p>
            </div>
          </div>

          {/* Preset Grooves Selector */}
          <div className="mb-6">
            <label className="text-xs font-semibold uppercase tracking-wider text-amber-400/90 block mb-2.5">
              Select Festive Rhythm Pattern
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {DHAK_PATTERNS.map((pattern) => {
                const isSelected = activePattern === pattern.id;
                return (
                  <button
                    key={pattern.id}
                    onClick={() => handleSelectPattern(pattern.id)}
                    className={`p-3 rounded-2xl border text-left transition-all duration-200 ${
                      isSelected
                        ? isLight
                          ? 'bg-amber-100/90 border-amber-400 text-amber-950 shadow-sm'
                          : 'bg-zinc-800 border-amber-500/50 text-amber-300 shadow-lg'
                        : 'bg-black/20 border-white/5 hover:bg-white/5 text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm">{pattern.name}</span>
                      <span className="text-xs font-mono opacity-60">{pattern.bpm} BPM</span>
                    </div>
                    <p className="text-[11px] font-bengali text-amber-400/90 mt-0.5">
                      {pattern.bengaliName}
                    </p>
                    <p className="text-[11px] text-zinc-400 mt-1 line-clamp-1">
                      {pattern.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Master Dhak Rhythm Controller */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-black/30 border border-white/5 mb-6">
            <div className="flex items-center gap-3">
              <button
                id="studio-dhak-toggle"
                onClick={onToggleDhak}
                className={`px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm tracking-wider uppercase flex items-center gap-2 transition-all shadow-md active:scale-95 ${
                  isDhakPlaying
                    ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/40'
                    : 'bg-white text-black hover:bg-zinc-200'
                }`}
              >
                {isDhakPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isDhakPlaying ? 'STOP DHAK' : 'START GROOVE'}</span>
              </button>
              {isDhakPlaying && (
                <span className="text-xs text-amber-400 font-mono animate-pulse">
                  Looping {activePattern.toUpperCase()}
                </span>
              )}
            </div>

            {/* Visual Beat Indicator Dots */}
            <div className="flex items-center gap-1.5">
              {[0, 1, 2, 3, 4, 5, 6, 7].map((step) => (
                <span
                  key={step}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-100 ${
                    activeStep === step
                      ? 'bg-amber-400 scale-150 shadow-[0_0_8px_rgba(251,191,36,1)]'
                      : 'bg-zinc-700/60'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Interactive Manual Drum Strike Pads */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-amber-400/90 block mb-2.5">
              Live Percussion Pads (Touch or Click to Play)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {/* Bass Pad */}
              <button
                onClick={() => handleManualHit('bass')}
                className={`p-4 rounded-2xl border flex flex-col items-center justify-center transition-all active:scale-95 ${
                  activeHit === 'bass'
                    ? 'bg-amber-500 text-black border-amber-300 shadow-lg shadow-amber-500/40 scale-105'
                    : 'bg-black/30 border-white/10 hover:bg-zinc-800 text-zinc-200'
                }`}
              >
                <span className="text-xl">🥁</span>
                <span className="font-bold text-xs mt-1.5">DHUM</span>
                <span className="text-[10px] text-zinc-400">Deep Bass</span>
              </button>

              {/* Slap Pad */}
              <button
                onClick={() => handleManualHit('slap')}
                className={`p-4 rounded-2xl border flex flex-col items-center justify-center transition-all active:scale-95 ${
                  activeHit === 'slap'
                    ? 'bg-amber-500 text-black border-amber-300 shadow-lg shadow-amber-500/40 scale-105'
                    : 'bg-black/30 border-white/10 hover:bg-zinc-800 text-zinc-200'
                }`}
              >
                <span className="text-xl">⚡</span>
                <span className="font-bold text-xs mt-1.5">KUR</span>
                <span className="text-[10px] text-zinc-400">Treble Slap</span>
              </button>

              {/* Rim Pad */}
              <button
                onClick={() => handleManualHit('rim')}
                className={`p-4 rounded-2xl border flex flex-col items-center justify-center transition-all active:scale-95 ${
                  activeHit === 'rim'
                    ? 'bg-amber-500 text-black border-amber-300 shadow-lg shadow-amber-500/40 scale-105'
                    : 'bg-black/30 border-white/10 hover:bg-zinc-800 text-zinc-200'
                }`}
              >
                <span className="text-xl">🥢</span>
                <span className="font-bold text-xs mt-1.5">TAKA</span>
                <span className="text-[10px] text-zinc-400">Rim Click</span>
              </button>

              {/* Kanshor Brass Pad */}
              <button
                onClick={() => handleManualHit('kanshor')}
                className={`p-4 rounded-2xl border flex flex-col items-center justify-center transition-all active:scale-95 ${
                  activeHit === 'kanshor'
                    ? 'bg-amber-500 text-black border-amber-300 shadow-lg shadow-amber-500/40 scale-105'
                    : 'bg-black/30 border-white/10 hover:bg-zinc-800 text-zinc-200'
                }`}
              >
                <span className="text-xl">🔔</span>
                <span className="font-bold text-xs mt-1.5">KANSHOR</span>
                <span className="text-[10px] text-zinc-400">Brass Chime</span>
              </button>

              {/* Shankho Conch Pad */}
              <button
                onClick={() => handleManualHit('shankho')}
                className={`col-span-2 sm:col-span-1 p-4 rounded-2xl border flex flex-col items-center justify-center transition-all active:scale-95 ${
                  activeHit === 'shankho'
                    ? 'bg-amber-500 text-black border-amber-300 shadow-lg shadow-amber-500/40 scale-105'
                    : 'bg-black/30 border-white/10 hover:bg-zinc-800 text-zinc-200'
                }`}
              >
                <span className="text-xl">🐚</span>
                <span className="font-bold text-xs mt-1.5">SHANKHO</span>
                <span className="text-[10px] text-zinc-400">Conch Call</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
