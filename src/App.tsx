import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { BackgroundView } from './components/BackgroundView';
import { Header } from './components/Header';
import { PujoHero } from './components/PujoHero';
import { MusicPlayer } from './components/MusicPlayer';
import { PlaylistModal } from './components/PlaylistModal';
import { AboutModal } from './components/AboutModal';
import { DhakStudioModal } from './components/DhakStudioModal';
import { PujaScheduleModal } from './components/PujaScheduleModal';
import { ThemeSelectorModal } from './components/ThemeSelectorModal';
import { TRACKS } from './data/pujoData';
import { Track, PlaylistTab, ThemeId } from './types';
import { fetchPujoStats, fetchTracksByCategory, fetchDailyPujaTrivia } from './services/api';
import { audioEngine } from './utils/audioEngine';

// Create TanStack React Query client with automatic background refresh
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30, // 30 seconds
      refetchInterval: 1000 * 20, // 20 seconds polling for live listener counts
      refetchOnWindowFocus: false,
    },
  },
});

function PujoApp() {
  // Theme state (default to illustrated pandal matching Image 3)
  const [theme, setTheme] = useState<ThemeId>('illustrated');
  const [isAutoMotion] = useState<boolean>(true);

  // Auto-rotate background theme scenes in smooth motion every 10 seconds (excluding dawn light)
  useEffect(() => {
    if (!isAutoMotion) return;
    const themes: ThemeId[] = ['illustrated', 'golden_pandal', 'twilight'];
    const timer = setInterval(() => {
      setTheme((prev) => {
        const darkThemes: ThemeId[] = ['illustrated', 'golden_pandal', 'twilight'];
        const nextIndex = (darkThemes.indexOf(prev) + 1) % darkThemes.length;
        return darkThemes[nextIndex];
      });
    }, 10000);

    return () => clearInterval(timer);
  }, [isAutoMotion]);

  // Active track state (default to Dugga Elo)
  const defaultTrack = TRACKS.find((t) => t.id === 'dp-1') || TRACKS[0];
  const [currentTrack, setCurrentTrack] = useState<Track>(defaultTrack);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isDhakPlaying, setIsDhakPlaying] = useState<boolean>(false);

  // Active playlist tab
  const [activeTab, setActiveTab] = useState<PlaylistTab>('DURGA PUJA');

  // Modal open states
  const [isPlaylistOpen, setIsPlaylistOpen] = useState<boolean>(false);
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState<boolean>(false);
  const [isDhakStudioOpen, setIsDhakStudioOpen] = useState<boolean>(false);
  const [isThemePickerOpen, setIsThemePickerOpen] = useState<boolean>(false);

  // Dynamic data fetching with React Query
  const { data: stats } = useQuery({
    queryKey: ['pujoStats'],
    queryFn: fetchPujoStats,
  });

  const { data: categoryTracks = TRACKS } = useQuery({
    queryKey: ['tracks', activeTab],
    queryFn: () => fetchTracksByCategory(activeTab),
  });

  const { data: trivia } = useQuery({
    queryKey: ['dailyTrivia'],
    queryFn: fetchDailyPujaTrivia,
  });

  // Track playback handlers
  const handleTogglePlay = () => {
    audioEngine.resume();
    if (isDhakPlaying) {
      audioEngine.stopDhakLoop();
      setIsDhakPlaying(false);
    }
    setIsPlaying((prev) => !prev);
  };

  const handleNextTrack = () => {
    if (isDhakPlaying) {
      audioEngine.stopDhakLoop();
      setIsDhakPlaying(false);
    }
    const list = categoryTracks.length > 0 ? categoryTracks : TRACKS;
    const currentIndex = list.findIndex((t) => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % list.length;
    setCurrentTrack(list[nextIndex]);
    setIsPlaying(true);
  };

  const handlePrevTrack = () => {
    if (isDhakPlaying) {
      audioEngine.stopDhakLoop();
      setIsDhakPlaying(false);
    }
    const list = categoryTracks.length > 0 ? categoryTracks : TRACKS;
    const currentIndex = list.findIndex((t) => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + list.length) % list.length;
    setCurrentTrack(list[prevIndex]);
    setIsPlaying(true);
  };

  const handleSelectTrack = (track: Track) => {
    if (isDhakPlaying) {
      audioEngine.stopDhakLoop();
      setIsDhakPlaying(false);
    }
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const handleToggleDhak = () => {
    audioEngine.resume();
    if (isPlaying) {
      setIsPlaying(false);
      audioEngine.stopMelodyTrack();
    }
    const playing = audioEngine.toggleDhakLoop('agomoni');
    setIsDhakPlaying(playing);
  };

  // Keyboard shortcut controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid firing shortcuts when typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.code === 'ArrowRight' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleNextTrack();
      } else if (e.code === 'ArrowLeft' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handlePrevTrack();
      } else if (e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        handleToggleDhak();
      } else if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        setIsPlaylistOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsPlaylistOpen(false);
        setIsAboutOpen(false);
        setIsScheduleOpen(false);
        setIsDhakStudioOpen(false);
        setIsThemePickerOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [categoryTracks, currentTrack]);

  return (
    <div
      className={`relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden transition-colors duration-700 ${
        theme === 'dawn_light' ? 'bg-sky-50 text-zinc-900' : 'bg-[#090b10] text-zinc-100'
      }`}
    >
      {/* Dynamic Animated Atmospheric Background */}
      <BackgroundView theme={theme} isDhakPlaying={isDhakPlaying} />

      {/* Top Header Navigation */}
      <Header
        stats={stats}
        currentTheme={theme}
        onSelectTheme={setTheme}
        onOpenPlaylist={() => setIsPlaylistOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenSchedule={() => setIsScheduleOpen(true)}
        onOpenDhak={handleToggleDhak}
        onOpenThemePicker={() => setIsThemePickerOpen(true)}
      />

      {/* Main Festive Hero ("পুজো আসছে") with quick action pills */}
      <main className="flex-1 flex items-center justify-center py-6 sm:py-10">
        <PujoHero
          theme={theme}
          isDhakPlaying={isDhakPlaying}
          onOpenPlaylist={() => setIsPlaylistOpen(true)}
          onToggleDhak={handleToggleDhak}
          onOpenDhakStudio={() => setIsDhakStudioOpen(true)}
        />
      </main>

      {/* Bottom Floating Music Player Dock */}
      <footer className="pb-28 sm:pb-32">
        <MusicPlayer
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          onTogglePlay={handleTogglePlay}
          onNextTrack={handleNextTrack}
          onPrevTrack={handlePrevTrack}
          onOpenPlaylist={() => setIsPlaylistOpen(true)}
          theme={theme}
        />
      </footer>

      {/* Modals & Dialogs */}
      {/* 1. Playlists Modal */}
      <PlaylistModal
        isOpen={isPlaylistOpen}
        onClose={() => setIsPlaylistOpen(false)}
        tracks={categoryTracks}
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onSelectTrack={handleSelectTrack}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        theme={theme}
      />

      {/* 2. "Made with Bhalobasha by" About Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        theme={theme}
      />

      {/* 3. Dhak & Percussion Studio */}
      <DhakStudioModal
        isOpen={isDhakStudioOpen}
        onClose={() => setIsDhakStudioOpen(false)}
        isDhakPlaying={isDhakPlaying}
        onToggleDhak={handleToggleDhak}
        theme={theme}
      />

      {/* 4. Puja Schedule & Calendar */}
      <PujaScheduleModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        theme={theme}
      />

      {/* 5. Theme & Atmosphere Picker */}
      <ThemeSelectorModal
        isOpen={isThemePickerOpen}
        onClose={() => setIsThemePickerOpen(false)}
        currentTheme={theme}
        onSelectTheme={setTheme}
      />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PujoApp />
    </QueryClientProvider>
  );
}
