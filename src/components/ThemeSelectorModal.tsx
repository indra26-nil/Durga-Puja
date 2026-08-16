import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Palette, Check, Sparkles, Sun, Moon } from 'lucide-react';
import { ThemeId, ThemeConfig } from '../types';

interface ThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeId;
  onSelectTheme: (theme: ThemeId) => void;
}

export const THEMES: ThemeConfig[] = [
  {
    id: 'illustrated',
    name: 'Maa Durga Pratima (Daaker Saaj)',
    subtitle: 'Classic Bengali Durga Murti, Trishul, glowing diyas & hanging fairy lights',
    isDark: true,
    bgClass: 'from-[#080911] via-[#101424] to-[#1c161a]'
  },
  {
    id: 'golden_pandal',
    name: 'Illuminated Golden Durga Mandap',
    subtitle: 'Royal temple pandal, golden Durga idol & shimmering chandeliers',
    isDark: true,
    bgClass: 'from-amber-950 via-[#130d0a] to-[#070505]'
  },
  {
    id: 'twilight',
    name: 'Midnight Twilight Pratima',
    subtitle: 'Deep midnight aura with Maa Durga silhouette & festive embers',
    isDark: true,
    bgClass: 'from-[#050608] via-[#0d121f] to-[#1e131d]'
  },
  {
    id: 'dawn_light',
    name: 'Sharodiyo Morning & Kash Flowers',
    subtitle: 'Autumn sunrise sky, Durga idol aura & blooming white Kash meadow',
    isDark: false,
    bgClass: 'from-sky-200 via-amber-50 to-emerald-50'
  }
];

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/65 backdrop-blur-md"
        />

        {/* Modal Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative z-10 w-full max-w-lg rounded-3xl border border-white/10 bg-[#181922]/95 text-zinc-100 shadow-2xl p-6 sm:p-8 backdrop-blur-2xl"
        >
          {/* Close button */}
          <button
            id="theme-close-btn"
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close theme selector"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold tracking-tight">
                Atmosphere & Themes
              </h3>
              <p className="text-xs text-zinc-400">
                Choose your festive visual scenery and mode
              </p>
            </div>
          </div>

          {/* Theme List */}
          <div className="space-y-3">
            {THEMES.map((theme) => {
              const isSelected = currentTheme === theme.id;
              return (
                <div
                  key={theme.id}
                  onClick={() => {
                    onSelectTheme(theme.id);
                    onClose();
                  }}
                  className={`group flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'bg-zinc-800 border-amber-400 shadow-lg shadow-amber-500/10'
                      : 'bg-black/30 border-white/5 hover:bg-zinc-800/60 hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    {/* Visual preview swatch */}
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${theme.bgClass} border border-white/15 flex items-center justify-center flex-shrink-0 shadow-inner`}
                    >
                      {theme.isDark ? (
                        <Moon className="w-4 h-4 text-amber-300" />
                      ) : (
                        <Sun className="w-4 h-4 text-amber-600" />
                      )}
                    </div>

                    <div>
                      <h4
                        className={`text-sm font-semibold ${
                          isSelected ? 'text-amber-400' : 'text-zinc-200 group-hover:text-white'
                        }`}
                      >
                        {theme.name}
                      </h4>
                      <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1">
                        {theme.subtitle}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-amber-500 text-black flex items-center justify-center flex-shrink-0 ml-2">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
