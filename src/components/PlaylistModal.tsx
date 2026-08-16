import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Pause, Search, Music, Sparkles } from 'lucide-react';
import { Track, PlaylistTab, ThemeId } from '../types';

interface PlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  tracks: Track[];
  currentTrack: Track;
  isPlaying: boolean;
  onSelectTrack: (track: Track) => void;
  activeTab: PlaylistTab;
  onChangeTab: (tab: PlaylistTab) => void;
  theme: ThemeId;
}

export const PlaylistModal: React.FC<PlaylistModalProps> = ({
  isOpen,
  onClose,
  tracks,
  currentTrack,
  isPlaying,
  onSelectTrack,
  activeTab,
  onChangeTab,
  theme
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const tabs: PlaylistTab[] = ['DURGA PUJA', 'MAHALAYA', 'MAHALAYA SONGS'];

  const categorySubtitles: Record<PlaylistTab, string> = {
    'DURGA PUJA': 'The main curated Durga Puja playlist.',
    'MAHALAYA': 'The sacred dawn chants of Mahisasuramardini & Birendra Krishna Bhadra.',
    'MAHALAYA SONGS': 'Immortal dawn melodies welcoming Devi Paksha.'
  };

  const filteredTracks = tracks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.artist.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const isLight = theme === 'dawn_light';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/65 backdrop-blur-md"
        />

        {/* Modal Container (Matches Image 1 & Image 8!) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className={`relative z-10 w-full max-w-lg md:max-w-xl max-h-[85vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden backdrop-blur-2xl ${
            isLight
              ? 'bg-white/95 border-zinc-200 text-zinc-900 shadow-amber-950/20'
              : 'bg-[#181920]/95 border-white/10 text-zinc-100 shadow-black/90'
          }`}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/5">
            <h2 className="text-xs sm:text-sm font-semibold tracking-widest uppercase opacity-75">
              PLAYLISTS
            </h2>
            <button
              id="playlist-close-btn"
              onClick={onClose}
              className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close playlists"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Category Tabs */}
          <div className="px-6 pt-3">
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/20 border border-white/5 overflow-x-auto">
              {tabs.map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => onChangeTab(tab)}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold tracking-wider transition-all duration-200 whitespace-nowrap ${
                      isActive
                        ? isLight
                          ? 'bg-amber-500 text-white shadow-md'
                          : 'bg-zinc-800 text-amber-300 shadow-sm border border-white/10'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            {/* Playlist Subtitle & Search */}
            <div className="mt-4 mb-2 flex items-center justify-between gap-3">
              <p className="text-xs sm:text-sm text-zinc-400 font-normal">
                {categorySubtitles[activeTab]}
              </p>
            </div>

            {/* Quick search input */}
            <div className="relative my-2">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Search song or artist..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/25 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-amber-400/50"
              />
            </div>
          </div>

          {/* Track List (Scrollable) */}
          <div className="flex-1 overflow-y-auto px-6 py-2 space-y-1 divide-y divide-white/[0.03]">
            {filteredTracks.length === 0 ? (
              <div className="text-center py-12 text-zinc-500 text-xs">
                No songs found matching "{searchQuery}"
              </div>
            ) : (
              filteredTracks.map((track) => {
                const isSelected = currentTrack.id === track.id;
                return (
                  <div
                    key={track.id}
                    onClick={() => onSelectTrack(track)}
                    className={`group flex items-center justify-between p-2.5 sm:p-3 rounded-2xl cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? isLight
                          ? 'bg-amber-50 text-amber-900 border border-amber-200/60 shadow-sm'
                          : 'bg-zinc-800/80 text-white border border-amber-500/30 shadow-lg'
                        : 'hover:bg-white/5 text-zinc-300'
                    }`}
                  >
                    {/* Left: Number + Thumbnail + Info */}
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      {/* Number / Equalizer */}
                      <span className="w-5 text-xs font-mono text-zinc-500 text-center flex-shrink-0">
                        {isSelected && isPlaying ? (
                          <div className="flex items-center justify-center gap-0.5 h-3">
                            <span className="w-0.5 h-3 bg-amber-400 animate-pulse" />
                            <span className="w-0.5 h-2 bg-amber-400 animate-pulse delay-75" />
                            <span className="w-0.5 h-3.5 bg-amber-400 animate-pulse delay-150" />
                          </div>
                        ) : (
                          track.number
                        )}
                      </span>

                      {/* Cover Art */}
                      <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden flex-shrink-0 shadow">
                        <img
                          src={track.coverUrl}
                          alt={track.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <div
                          className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${
                            isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                          }`}
                        >
                          {isSelected && isPlaying ? (
                            <Pause className="w-4 h-4 text-amber-400 fill-current" />
                          ) : (
                            <Play className="w-4 h-4 text-white fill-current ml-0.5" />
                          )}
                        </div>
                      </div>

                      {/* Title & Artist */}
                      <div className="min-w-0">
                        <h4
                          className={`text-xs sm:text-sm font-semibold truncate ${
                            isSelected ? 'text-amber-400' : 'group-hover:text-white'
                          }`}
                        >
                          {track.title}
                        </h4>
                        <p className="text-[11px] sm:text-xs text-zinc-400 truncate">
                          {track.artist}
                        </p>
                      </div>
                    </div>

                    {/* Right: Duration */}
                    <div className="text-xs font-mono text-zinc-400 ml-3 flex-shrink-0">
                      {track.duration}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Modal Footer Note */}
          <div className="p-4 px-6 bg-black/20 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-400">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Continuous high-fidelity playback
            </span>
            <span>{filteredTracks.length} tracks available</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
