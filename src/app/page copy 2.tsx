// src/app/page.tsx
"use client";
import { unstable_noStore as noStore } from 'next/cache';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Dynamic imports
const GlowingLogo = dynamic(() => import('@/components/GlowingLogo'), { 
  ssr: false,
  loading: () => <div className="h-64 w-64 bg-gray-900 animate-pulse rounded-lg" />
});

const AudioVisualizer = dynamic(() => import('@/components/AudioVisualizer'), {
  ssr: false,
  loading: () => <div className="h-32 w-full bg-black" />
});

// Pre-defined splatter positions (hydration-safe)
const SPLATTER_POSITIONS = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  width: 5 + Math.random() * 20,
  height: 5 + Math.random() * 20,
  left: Math.random() * 100,
  top: Math.random() * 100,
  opacity: 0.3 + Math.random() * 0.7
}));

export default function Home() {
  noStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="min-h-screen bg-black text-red-500 overflow-x-hidden relative">
      {/* Full-screen visualizer with centered logo */}
      <div className="absolute inset-0 z-0">
        <AudioVisualizer 
          audioSrc="/audio/arsenic-preview.mp3" 
          className="h-full w-full opacity-70" 
        />
      </div>

      {/* Main content */}
      <main className="relative z-10 h-screen flex flex-col items-center justify-center p-4 text-center">
        {/* Giant glowing logo */}
        <div className="mb-8 scale-150 transform-gpu">
          <GlowingLogo />
        </div>

        {/* Coming soon text with brutalist typography */}
        <div className="space-y-6">
          <h1 className="text-7xl md:text-9xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">
            COMING<br/>JUNE 2025
          </h1>
          
          <p className="text-xl md:text-3xl font-mono text-white/80">
            WE ARE COOKING SOMETHING TOXIC
          </p>
        </div>

        {/* Play button with pulse animation */}
        {isClient && (
          <button 
            className="mt-16 group relative"
            onClick={() => {
              const audio = new Audio('/audio/arsenic-preview.mp3');
              audio.play().catch(e => console.log("Playback failed:", e));
            }}
          >
            <div className="absolute -inset-4 bg-red-900/30 rounded-full group-hover:bg-red-900/50 transition-all animate-pulse"></div>
            <div className="relative px-8 py-4 border-4 border-red-500 bg-black text-red-500 text-2xl font-bold tracking-wider hover:bg-red-900/20 transition-all">
              PLAY TEASER
            </div>
          </button>
        )}

        {/* Blood splatter decoration - now hydration-safe */}
        <div className="absolute bottom-10 left-0 right-0 flex justify-center">
          <div className="w-64 h-32 relative">
            {SPLATTER_POSITIONS.map((splatter) => (
              <div 
                key={splatter.id}
                className="absolute bg-red-900 rounded-full"
                style={{
                  width: `${splatter.width}px`,
                  height: `${splatter.height}px`,
                  left: `${splatter.left}%`,
                  top: `${splatter.top}%`,
                  opacity: splatter.opacity,
                }}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}