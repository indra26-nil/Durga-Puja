import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2, VolumeX, ListMusic, Music } from 'lucide-react';
import { Track, ThemeId } from '../types';
import { audioEngine } from '../utils/audioEngine';

interface MusicPlayerProps {
  currentTrack: Track;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNextTrack: () => void;
  onPrevTrack: () => void;
  onOpenPlaylist: () => void;
  theme: ThemeId;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  currentTrack,
  isPlaying,
  onTogglePlay,
  onNextTrack,
  onPrevTrack,
  onOpenPlaylist,
  theme
}) => {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [trackDuration, setTrackDuration] = useState<number>(currentTrack.durationSeconds || 147);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [isRepeat, setIsRepeat] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState<boolean>(false);

  // Reset progress when track changes
  useEffect(() => {
    setCurrentTime(0);
    setTrackDuration(currentTrack.durationSeconds || 147);
  }, [currentTrack.id, currentTrack.durationSeconds]);

  // Sync audio playback, time updates, & real audio duration
  useEffect(() => {
    if (isPlaying) {
      audioEngine.startMelodyTrack(currentTrack.id, currentTrack.audioSrc, (sec, dur) => {
        setCurrentTime(sec);
        if (dur && dur > 0) {
          setTrackDuration(dur);
        }

        const maxDur = dur || trackDuration || currentTrack.durationSeconds;
        if (sec >= maxDur && maxDur > 0) {
          if (isRepeat) {
            audioEngine.seek(0);
            setCurrentTime(0);
          } else {
            onNextTrack();
          }
        }
      });
    } else {
      audioEngine.stopMelodyTrack();
    }

    return () => {
      audioEngine.stopMelodyTrack();
    };
  }, [isPlaying, currentTrack.id, currentTrack.audioSrc, isRepeat, trackDuration]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setCurrentTime(val);
    audioEngine.seek(val);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
    audioEngine.setMusicVolume(val);
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      audioEngine.setMusicVolume(volume || 0.8);
    } else {
      setIsMuted(true);
      audioEngine.setMusicVolume(0);
    }
  };

  const formatTime = (totalSeconds: number) => {
    if (isNaN(totalSeconds) || totalSeconds < 0) return '0:00';
    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.floor(totalSeconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const isLight = theme === 'dawn_light';
  const displayDurationSeconds = trackDuration || currentTrack.durationSeconds || 147;

  return (
    <div className="fixed bottom-4 sm:bottom-6 inset-x-0 z-30 flex justify-center px-3 sm:px-6 pointer-events-none">
      <div
        id="floating-music-player"
        className={`pointer-events-auto w-full max-w-xl sm:max-w-2xl md:max-w-3xl rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-2xl transition-all duration-300 border backdrop-blur-2xl ${
          isLight
            ? 'bg-white/90 border-black/10 text-zinc-900 shadow-amber-950/15'
            : 'bg-[#12141c]/90 border-white/10 text-zinc-100 shadow-black/80'
        }`}
      >
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          {/* Left: Album Artwork + Track Information */}
          <div className="flex items-center gap-3 min-w-0 max-w-[40%] sm:max-w-[45%]">
            {/* Album Art with spinning disc animation when playing */}
            <div
              onClick={onOpenPlaylist}
              className="relative w-11 h-11 sm:w-14 sm:h-14 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer group shadow-md"
            >
              <img
                src={currentTrack.coverUrl}
                alt={currentTrack.title}
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
                  isPlaying ? 'brightness-105' : 'brightness-90'
                }`}
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors flex items-center justify-center">
                <Music className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>

            {/* Title & Artist & Time */}
            <div className="min-w-0 flex-1">
              <h4
                onClick={onOpenPlaylist}
                className="text-xs sm:text-sm font-semibold truncate cursor-pointer hover:text-amber-400 transition-colors"
                title={currentTrack.title}
              >
                {currentTrack.title}
              </h4>
              <p className="text-[11px] sm:text-xs opacity-70 truncate font-medium">
                {currentTrack.artist}
              </p>
              <div className="text-[10px] sm:text-[11px] opacity-60 font-mono mt-0.5">
                {formatTime(currentTime)} / {formatTime(displayDurationSeconds)}
              </div>
            </div>
          </div>

          {/* Center/Right: Progress Scrubber + Controls */}
          <div className="flex-1 flex flex-col items-center justify-center max-w-[55%] sm:max-w-[50%]">
            {/* Timeline Progress Slider */}
            <div className="w-full mb-1 sm:mb-2 flex items-center gap-2">
              <input
                type="range"
                min="0"
                max={displayDurationSeconds}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 sm:h-1.5 rounded-lg appearance-none cursor-pointer accent-amber-400 bg-zinc-700/40 hover:bg-zinc-600/60 transition-colors"
              />
            </div>

            {/* Playback Controls (Shuffle, Prev, Play/Pause, Next, Repeat) */}
            <div className="flex items-center justify-center gap-1 sm:gap-3 w-full">
              {/* Shuffle */}
              <button
                id="player-shuffle-btn"
                onClick={() => setIsShuffle(!isShuffle)}
                title="Shuffle"
                aria-label="Shuffle playlist"
                className={`p-1.5 rounded-full transition-colors ${
                  isShuffle
                    ? 'text-amber-400 font-bold'
                    : isLight
                    ? 'text-zinc-500 hover:text-zinc-900'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Shuffle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              {/* Prev */}
              <button
                id="player-prev-btn"
                onClick={onPrevTrack}
                title="Previous Track"
                aria-label="Previous track"
                className={`p-1.5 rounded-full transition-colors active:scale-90 ${
                  isLight ? 'text-zinc-700 hover:text-black' : 'text-zinc-300 hover:text-white'
                }`}
              >
                <SkipBack className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
              </button>

              {/* Play / Pause Circular Button (Matches screenshot!) */}
              <button
                id="player-play-pause-btn"
                onClick={onTogglePlay}
                title={isPlaying ? 'Pause' : 'Play'}
                aria-label={isPlaying ? 'Pause music' : 'Play music'}
                className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-200 shadow-md active:scale-95 ${
                  isLight
                    ? 'bg-zinc-900 text-white hover:bg-black shadow-zinc-900/30'
                    : 'bg-white text-zinc-950 hover:bg-amber-100 hover:scale-105 shadow-white/20'
                }`}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                ) : (
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current translate-x-0.5" />
                )}
              </button>

              {/* Next */}
              <button
                id="player-next-btn"
                onClick={onNextTrack}
                title="Next Track"
                aria-label="Next track"
                className={`p-1.5 rounded-full transition-colors active:scale-90 ${
                  isLight ? 'text-zinc-700 hover:text-black' : 'text-zinc-300 hover:text-white'
                }`}
              >
                <SkipForward className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
              </button>

              {/* Repeat */}
              <button
                id="player-repeat-btn"
                onClick={() => setIsRepeat(!isRepeat)}
                title={isRepeat ? 'Repeat Enabled' : 'Repeat Off'}
                aria-label="Repeat track"
                className={`p-1.5 rounded-full transition-colors ${
                  isRepeat
                    ? 'text-amber-400 font-bold'
                    : isLight
                    ? 'text-zinc-500 hover:text-zinc-900'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Repeat className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              {/* Volume Slider Toggle (Desktop / Hover) */}
              <div className="relative hidden md:flex items-center ml-1">
                <button
                  onClick={toggleMute}
                  onMouseEnter={() => setShowVolumeSlider(true)}
                  className={`p-1.5 rounded-full transition-colors ${
                    isLight ? 'text-zinc-500 hover:text-zinc-900' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                </button>

                {showVolumeSlider && (
                  <div
                    onMouseLeave={() => setShowVolumeSlider(false)}
                    className={`absolute bottom-8 right-0 p-2 rounded-xl border shadow-xl backdrop-blur-xl flex items-center ${
                      isLight ? 'bg-white border-zinc-200' : 'bg-zinc-900 border-zinc-700'
                    }`}
                  >
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-20 h-1.5 rounded-lg appearance-none cursor-pointer accent-amber-400 bg-zinc-700"
                    />
                  </div>
                )}
              </div>

              {/* Playlist drawer toggle button */}
              <button
                onClick={onOpenPlaylist}
                title="View All Tracks"
                aria-label="View all tracks"
                className={`p-1.5 rounded-full transition-colors ${
                  isLight ? 'text-zinc-500 hover:text-zinc-900' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <ListMusic className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
