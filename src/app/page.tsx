// src/app/page.tsx
"use client";
import { unstable_noStore as noStore } from 'next/cache';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';

// Dynamic imports for heavy components (better performance)
const GlowingLogo = dynamic(() => import('@/components/GlowingLogo'), { 
  ssr: false,
  loading: () => <div className="h-32 w-64 bg-gray-900 animate-pulse rounded-lg" />
});

const AudioVisualizer = dynamic(() => import('@/components/AudioVisualizer'), {
  ssr: false
});

export default function Home() {
  noStore(); // Opt out of static rendering for dynamic content

  return (
    <div className="min-h-screen bg-black text-red-500 font-mono overflow-x-hidden">
      {/* Hero Section with Audio Visualizer */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover opacity-20"
            src="/videos/arsenic-bg-loop.mp4"
          />
        </div>
        
        <div className="text-center px-4 w-full max-w-4xl mx-auto">
          {/* Responsive logo scaling */}
          <div className="xs:scale-110 lg:scale-130 transform-gpu w-full flex justify-center">
            <div className="w-full md:w-full">
              <GlowingLogo />
            </div>
          </div>

          <AudioVisualizer 
            audioSrc="/audio/arsenic-preview.mp3" 
            className="h-32 w-full" 
          />

          {/* Coming soon text with brutalist typography */}
          <div className="space-y-6 px-2">
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">
              COMING<br/>JUNE 2025
            </h1>
            
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-mono text-white/80">
              WE ARE COOKING SOMETHING TOXIC
            </p>
          </div>

          {/* Responsive buttons */}
          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4 px-4">
            <Link 
              href="/music" 
              className="px-6 py-3 sm:px-8 sm:py-3 border-2 border-white text-white hover:bg-red-900/50 transition-all text-base sm:text-lg font-bold text-center whitespace-nowrap"
            >
              JOIN THE MAILING LIST
            </Link>
            <Link 
              href="/shows" 
              className="px-6 py-3 sm:px-8 sm:py-3 bg-red-900 hover:bg-red-800 transition-all text-base sm:text-lg font-bold text-center whitespace-nowrap"
            >
              SEE US LIVE
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Release Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900/50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">LATEST RELEASE</h2>
          <div className="max-w-4xl mx-auto bg-gray-900/50 p-8 rounded-xl border border-red-900/30 hover:border-red-900/60 transition-all">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="col-span-1">
                <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden relative">
                  <Image 
                    src="/images/album-art-placeholder.png" 
                    alt="Album Art" 
                    fill 
                    className="object-cover w-full h-full" 
                  />
                </div>
              </div>
              <div className="col-span-2">
                <h3 className="text-3xl font-bold mb-2">TOXIC WHISPERS</h3>
                <p className="text-gray-400 mb-6">Out now on all platforms</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="px-6 py-3 bg-red-900 hover:bg-red-800 transition-all font-bold">
                    STREAM NOW
                  </button>
                  <button className="px-6 py-3 border border-red-900 hover:bg-red-900/20 transition-all font-bold">
                    BUY DIGITAL
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}