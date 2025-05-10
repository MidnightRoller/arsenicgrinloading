'use client';
import { useEffect, useRef, useState } from 'react';

interface Window {
  webkitAudioContext: typeof AudioContext;
}

export default function AudioVisualizer({ 
  audioSrc, 
  className = 'h-24 w-full bg-black' 
}: { 
  audioSrc: string; 
  className?: string 
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Resize canvas on mount and resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth * window.devicePixelRatio;
      canvas.height = canvas.clientHeight * window.devicePixelRatio;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const drawWaveform = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const analyser = analyserRef.current;
    if (!canvas || !ctx || !analyser) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      analyser.getByteTimeDomainData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 2 * window.devicePixelRatio;
      ctx.strokeStyle = '#ef4444';
      ctx.beginPath();

      const sliceWidth = canvas.width / bufferLength;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        x += sliceWidth;
      }
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
      animationRef.current = requestAnimationFrame(draw);
    };

    draw();
  };

  const handlePlayPause = async () => {
    if (isPlaying) {
      sourceRef.current?.stop();
      cancelAnimationFrame(animationRef.current!);
      setIsPlaying(false);
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    try {
      const audioCtx = new ((window as any).AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = audioCtx;

      const response = await fetch(audioSrc);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

      const source = audioCtx.createBufferSource();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;

      source.buffer = audioBuffer;
      source.connect(analyser);
      analyser.connect(audioCtx.destination);

      source.start(0);

      sourceRef.current = source;
      analyserRef.current = analyser;

      drawWaveform();
      setIsPlaying(true);
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  // Cleanup
  useEffect(() => {
    return () => {
      sourceRef.current?.stop();
      cancelAnimationFrame(animationRef.current!);
      audioCtxRef.current?.close();
    };
  }, []);

  return (
    <div className="relative group">
      <canvas 
        ref={canvasRef} 
        className={className} 
        onClick={handlePlayPause} 
      />
      {!isPlaying && (
        <div 
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
          onClick={handlePlayPause}
        >
          <button className=" text-white rounded-full p-4 transition-all group-hover:scale-110">
          <div className="relative px-8 py-4 border-4 border-red-500 bg-black text-red-500 text-2xl font-bold tracking-wider hover:bg-red-900/20 transition-all">
            PLAY TEASER
          </div>
          </button>
        </div>
      )}
    </div>
  );
}
