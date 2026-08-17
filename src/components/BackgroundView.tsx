import React, { useEffect, useRef } from 'react';
import { ThemeId } from '../types';
import durgaMurtiBg from '../assets/images/durga_murti_bg_1786903452527.jpg';
import durgaMurtiGold from '../assets/images/durga_murti_gold_1786903469043.jpg';
import durgaMurtiDawn from '../assets/images/durga_murti_dawn_1786903486583.jpg';



interface BackgroundViewProps {
  theme: ThemeId;
  isDhakPlaying: boolean;
}

export const BackgroundView: React.FC<BackgroundViewProps> = ({ theme, isDhakPlaying }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Floating ambient festive particles (Kash ful blossoms, glowing golden embers, fairy lights)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const particleCount = theme === 'dawn_light' ? 45 : 65;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.5 + (theme === 'golden_pandal' ? 2 : 1),
      speedY: Math.random() * 0.4 + 0.15,
      speedX: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.7 + 0.2,
      pulseSpeed: Math.random() * 0.03 + 0.01,
      angle: Math.random() * Math.PI * 2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.angle += p.pulseSpeed;
        const currentOpacity = p.opacity + Math.sin(p.angle) * 0.25;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        if (theme === 'dawn_light') {
          // Soft white/cream Kash flower pollen
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, currentOpacity * 0.7)})`;
        } else if (theme === 'golden_pandal') {
          // Warm golden glowing bokeh particles
          ctx.fillStyle = `rgba(251, 191, 36, ${Math.max(0.15, currentOpacity)})`;
          ctx.shadowBlur = 14;
          ctx.shadowColor = 'rgba(245, 158, 11, 0.7)';
        } else {
          // Amber fairy lights
          ctx.fillStyle = `rgba(253, 230, 138, ${Math.max(0.15, currentOpacity * 0.9)})`;
          ctx.shadowBlur = 10;
          ctx.shadowColor = 'rgba(251, 191, 36, 0.5)';
        }

        ctx.fill();
        ctx.shadowBlur = 0;

        // Movement reacts dynamically to dhak rhythm
        p.y -= p.speedY * (isDhakPlaying ? 1.75 : 1);
        p.x += p.speedX + Math.sin(p.angle * 0.5) * 0.35;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [theme, isDhakPlaying]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* 1. PRIMARY THEME: MAJESTIC DURGA MURTI PANDAL (Default) */}
      <div
        className={`absolute inset-0 bg-[#090b10] transition-opacity duration-1000 ease-in-out ${
          theme === 'illustrated' ? 'opacity-100 z-10' : 'opacity-0 z-0'
        }`}
      >
        {/* High-res Durga Murti background artwork with Ken Burns motion */}
        <img
          src={durgaMurtiBg}
          alt="Maa Durga Murti Pratima"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover object-center md:object-[60%_center] opacity-80 sm:opacity-85 scale-105 animate-kenburns"
        />

        {/* Deep atmospheric gradients for typography legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#080911]/80 via-[#0b0e1a]/45 to-[#0e0c12]/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_45%,_transparent_15%,_#090b10_85%)]" />

        {/* Warm hanging festoon fairy light strings */}
        <div className="absolute top-0 left-0 right-0 h-28 opacity-75">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1200 120">
            <path d="M0,20 Q300,70 600,20 T1200,20" fill="none" stroke="#ca8a04" strokeWidth="1.2" strokeDasharray="3 4" opacity="0.6" />
            <path d="M0,45 Q400,95 800,45 T1200,45" fill="none" stroke="#eab308" strokeWidth="1" strokeDasharray="2 3" opacity="0.4" />
            {/* String light bulbs */}
            {[60, 140, 220, 310, 400, 490, 580, 670, 760, 850, 940, 1030, 1120].map((cx, i) => (
              <g key={i}>
                <circle cx={cx} cy={28 + Math.sin(i * 0.9) * 16} r="4" fill="#fef08a" className="animate-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
                <circle cx={cx} cy={28 + Math.sin(i * 0.9) * 16} r="10" fill="#eab308" opacity="0.25" />
              </g>
            ))}
          </svg>
        </div>

        {/* Ambient Altar Glow behind Maa Durga */}
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[34rem] h-[34rem] rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
            isDhakPlaying ? 'bg-amber-500/25 scale-110' : 'bg-amber-500/15 scale-100'
          }`}
        />
      </div>

      {/* 2. ILLUMINATED GOLDEN PANDAL DURGA MURTI */}
      <div
        className={`absolute inset-0 bg-[#0c0908] transition-opacity duration-1000 ease-in-out ${
          theme === 'golden_pandal' ? 'opacity-100 z-10' : 'opacity-0 z-0'
        }`}
      >
        <img
          src={durgaMurtiGold}
          alt="Golden Illuminated Durga Idol"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-70 sm:opacity-75 scale-105 animate-kenburns"
        />

        {/* Deep royal golden night vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0e0a08]/85 via-[#130d0a]/60 to-[#070505]/95" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-950/40 via-transparent to-[#070505]/90" />

        {/* Shimmering Chandelier Gold Aura */}
        <div
          className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[38rem] h-[38rem] rounded-full blur-3xl transition-opacity duration-700 ${
            isDhakPlaying ? 'bg-amber-400/25' : 'bg-amber-500/15'
          }`}
        />
      </div>

      {/* 3. TWILIGHT NIGHT THEME (Durga Murti in Starry Midnight Aura) */}
      <div
        className={`absolute inset-0 bg-[#090b10] transition-opacity duration-1000 ease-in-out ${
          theme === 'twilight' ? 'opacity-100 z-10' : 'opacity-0 z-0'
        }`}
      >
        <img
          src={durgaMurtiBg}
          alt="Midnight Durga Murti"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-40 brightness-75 contrast-125 animate-kenburns"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#050608]/90 via-[#0d121f]/75 to-[#1e131d]/90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-purple-900/15 to-black/80" />
      </div>

      {/* 4. SHARODIYO DAWN DURGA MURTI (Light Mode) */}
      <div
        className={`absolute inset-0 bg-sky-50 transition-opacity duration-1000 ease-in-out ${
          theme === 'dawn_light' ? 'opacity-100 z-10' : 'opacity-0 z-0'
        }`}
      >
        <img
          src={durgaMurtiDawn}
          alt="Sharodiyo Autumn Durga Murti"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-65 scale-100 animate-kenburns"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-sky-200/80 via-amber-50/75 to-emerald-50/85 backdrop-blur-[1px]" />

        {/* White Autumn Clouds */}
        <div className="absolute top-8 left-12 w-64 h-24 bg-white/60 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-16 right-24 w-80 h-28 bg-white/70 rounded-full blur-xl animate-pulse" />
      </div>

      {/* Floating Canvas Particles */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-20" />

      {/* Subtle Vignette border for cinematic quality */}
      <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.65)] pointer-events-none z-20" />
    </div>
  );
};

