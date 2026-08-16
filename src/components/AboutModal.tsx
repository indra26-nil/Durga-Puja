import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, Check, Linkedin, Instagram, Heart, Sparkles } from 'lucide-react';
import { TEAM_MEMBERS } from '../data/pujoData';
import { ThemeId } from '../types';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeId;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, theme }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const email = 'devipakshaa@gmail.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
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
          className="absolute inset-0 bg-black/65 backdrop-blur-md"
        />

        {/* Modal Box (Matching Image 2 & Image 6!) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className={`relative z-10 w-full max-w-lg rounded-3xl border shadow-2xl p-6 sm:p-8 backdrop-blur-2xl ${
            isLight
              ? 'bg-white/95 border-zinc-200 text-zinc-900 shadow-amber-950/20'
              : 'bg-[#191a22]/95 border-white/10 text-zinc-100 shadow-black/90'
          }`}
        >
          {/* Close Button */}
          <button
            id="about-close-btn"
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="text-center mb-7">
            <h3 className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-amber-200/80 flex items-center justify-center gap-1.5">
              <span>MADE WITH BHALOBASHA BY</span>
            </h3>
          </div>

          {/* Team Cards Grid (Two equal columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TEAM_MEMBERS.map((member, i) => (
              <div
                key={i}
                className={`flex flex-col items-center justify-center p-6 rounded-2xl border transition-all duration-300 ${
                  isLight
                    ? 'bg-amber-50/50 border-amber-900/10 hover:border-amber-400/40 shadow-sm'
                    : 'bg-[#22242e]/80 border-white/5 hover:border-amber-400/30 hover:bg-[#252834]'
                }`}
              >
                {/* Circular Avatar with warm rim */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden p-1 border-2 border-amber-400/40 shadow-lg mb-4">
                  <img
                    src={member.avatarUrl}
                    alt={member.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>

                {/* Name */}
                <h4 className="text-base sm:text-lg font-semibold tracking-tight text-center">
                  {member.name}
                </h4>

                {/* Social Links (LinkedIn, Instagram buttons matching screenshot) */}
                <div className="flex items-center gap-2 mt-3">
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    title={`${member.name} LinkedIn`}
                    className="w-8 h-8 rounded-lg bg-black/30 hover:bg-amber-500 hover:text-black border border-white/10 flex items-center justify-center transition-all duration-200"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a
                    href={member.instagram}
                    target="_blank"
                    rel="noreferrer"
                    title={`${member.name} Instagram`}
                    className="w-8 h-8 rounded-lg bg-black/30 hover:bg-amber-500 hover:text-black border border-white/10 flex items-center justify-center transition-all duration-200"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Inquiry Section */}
          <div className="mt-8 text-center">
            <p className="text-xs sm:text-sm text-zinc-400 mb-3">Want to get in touch?</p>

            {/* Email copy pill button */}
            <div className="inline-flex items-center gap-2 p-1 pl-4 pr-1.5 rounded-full bg-black/40 border border-white/10 text-xs sm:text-sm text-zinc-300">
              <span className="font-mono">{email}</span>
              <button
                id="copy-email-btn"
                onClick={handleCopyEmail}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-zinc-800 hover:bg-amber-500 hover:text-black font-semibold text-xs transition-all duration-200 active:scale-95"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>COPIED!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>COPY</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Footer festive tagline */}
          <div className="mt-6 text-center text-[11px] text-zinc-500">
            Shubho Sharodiya • Celebrate the eternal victory of good over evil
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
