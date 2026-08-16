import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Sparkles, Clock, Flame, Heart } from 'lucide-react';
import { PUJA_DAYS } from '../data/pujoData';
import { ThemeId, PujaDayInfo } from '../types';

interface PujaScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeId;
}

export const PujaScheduleModal: React.FC<PujaScheduleModalProps> = ({
  isOpen,
  onClose,
  theme
}) => {
  const [selectedDay, setSelectedDay] = useState<PujaDayInfo>(PUJA_DAYS[3]); // Default to Maha Ashtami

  if (!isOpen) return null;

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
          className={`relative z-10 w-full max-w-2xl max-h-[88vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden backdrop-blur-2xl ${
            isLight
              ? 'bg-white/95 border-zinc-200 text-zinc-900 shadow-amber-950/20'
              : 'bg-[#181922]/95 border-white/10 text-zinc-100 shadow-black/90'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold tracking-tight">
                  Durga Puja Calendar & Rituals
                </h3>
                <p className="text-xs text-zinc-400">
                  Devipaksha Chronology & Sacred Traditions
                </p>
              </div>
            </div>
            <button
              id="schedule-close-btn"
              onClick={onClose}
              className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close schedule"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Day selection horizontal pill list */}
          <div className="px-6 pt-4 pb-2">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {PUJA_DAYS.map((day) => {
                const isSelected = selectedDay.day === day.day;
                return (
                  <button
                    key={day.day}
                    onClick={() => setSelectedDay(day)}
                    className={`flex-shrink-0 px-4 py-2 rounded-2xl text-xs font-semibold tracking-wide transition-all ${
                      isSelected
                        ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/30'
                        : 'bg-black/20 border border-white/5 text-zinc-300 hover:bg-white/5'
                    }`}
                  >
                    <span className="font-bengali text-sm mr-1.5">{day.bengaliDay}</span>
                    <span>{day.day}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Details for Selected Day */}
          <div className="flex-1 overflow-y-auto p-6 pt-2 space-y-4">
            {/* Spotlight Card */}
            <div
              className={`p-5 rounded-3xl border transition-all ${
                isLight
                  ? 'bg-amber-50/70 border-amber-300/60'
                  : 'bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 border-amber-500/30'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xl sm:text-2xl font-bold font-bengali text-amber-400">
                    {selectedDay.bengaliDay} • {selectedDay.day}
                  </h4>
                  <p className="text-xs sm:text-sm font-medium text-zinc-300 mt-1">
                    {selectedDay.date}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Sacred Tithi
                </span>
              </div>

              <p className="text-xs sm:text-sm text-zinc-300 mt-4 leading-relaxed">
                {selectedDay.significance}
              </p>
            </div>

            {/* Rituals & Highlights */}
            <div>
              <h5 className="text-xs font-semibold uppercase tracking-wider text-amber-400/90 mb-3 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                Key Ceremonies & Rituals
              </h5>
              <div className="space-y-2">
                {selectedDay.rituals.map((ritual, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-black/25 border border-white/5"
                  >
                    <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {idx + 1}
                    </div>
                    <span className="text-xs sm:text-sm text-zinc-200 font-medium">
                      {ritual}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ashtami Pushpanjali Special Mantra */}
            <div className="p-4 rounded-2xl bg-black/30 border border-white/5 text-center">
              <p className="text-xs font-bengali text-amber-300 leading-relaxed">
                "সর্বমঙ্গল মঙ্গল্যে শিবে সর্বার্থ সাধিকে, শরণ্যে ত্র্যম্বকে গৌরী নারায়ণী নমোহস্তুতে।"
              </p>
              <p className="text-[11px] text-zinc-400 mt-1">
                Sarva Mangala Mangalye Shive Sarvartha Sadhike • May all auspiciousness prevail.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
