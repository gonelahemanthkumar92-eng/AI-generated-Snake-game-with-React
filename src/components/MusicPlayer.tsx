import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music, Disc } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Track {
  id: number;
  title: string;
  artist: string;
  url: string;
  cover: string;
  color: string;
}

const TRACKS: Track[] = [
  {
    id: 1,
    title: "Cyber Pulse",
    artist: "Aether Neural",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://picsum.photos/seed/cyber/400/400",
    color: "var(--color-neon-cyan)"
  },
  {
    id: 2,
    title: "Neon Nights",
    artist: "Synth Ghost",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "https://picsum.photos/seed/neon/400/400",
    color: "var(--color-neon-pink)"
  },
  {
    id: 3,
    title: "Grid Runner",
    artist: "Matrix Wave",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "https://picsum.photos/seed/grid/400/400",
    color: "var(--color-neon-lime)"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(console.error);
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleSkipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleSkipBack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const onTrackEnded = () => {
    handleSkipForward();
  };

  return (
    <div className="glass rounded-3xl p-6 flex flex-col gap-6 w-full max-w-[400px] shadow-2xl relative overflow-hidden group">
      {/* Background Glow */}
      <div 
        className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] opacity-20 transition-colors duration-1000"
        style={{ backgroundColor: currentTrack.color }}
      />
      
      <audio 
        ref={audioRef} 
        src={currentTrack.url}
        onTimeUpdate={onTimeUpdate}
        onEnded={onTrackEnded}
      />

      <div className="flex items-center gap-4">
        <div className="relative">
          <motion.div 
            animate={isPlaying ? { rotate: 360 } : {}}
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
            className="w-20 h-20 rounded-full border-4 border-zinc-800 p-1 bg-zinc-900"
          >
            <img 
              src={currentTrack.cover} 
              alt={currentTrack.title} 
              className="w-full h-full rounded-full object-cover grayscale opacity-80"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 bg-zinc-950 rounded-full border-2 border-zinc-800" />
            </div>
          </motion.div>
          {isPlaying && (
            <div className="absolute -bottom-1 -right-1 flex gap-0.5 items-end h-6">
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ height: ["20%", "100%", "20%"] }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 0.5 + Math.random() * 0.5,
                    delay: i * 0.1
                  }}
                  className="w-1 bg-neon-cyan neon-shadow-cyan rounded-full"
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-display font-bold text-white truncate truncate-ellipsis">
            {currentTrack.title}
          </h3>
          <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest truncate">
            {currentTrack.artist}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 h-full transition-colors duration-1000"
            style={{ 
              width: `${progress}%`,
              backgroundColor: currentTrack.color,
              boxShadow: `0 0 10px ${currentTrack.color}`
            }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleSkipBack}
              className="p-2 text-zinc-400 hover:text-white transition-colors"
            >
              <SkipBack size={24} />
            </button>
            <button 
              onClick={togglePlay}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-white text-zinc-950 hover:scale-105 active:scale-95 transition-transform"
            >
              {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
            </button>
            <button 
              onClick={handleSkipForward}
              className="p-2 text-zinc-400 hover:text-white transition-colors"
            >
              <SkipForward size={24} />
            </button>
          </div>

          <div className="flex items-center gap-2 group/volume">
            <Volume2 size={16} className="text-zinc-500" />
            <input 
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-20 h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-neon-cyan"
            />
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-white/5">
        <div className="flex items-center gap-2 text-zinc-600">
          <Music size={12} />
          <span className="text-[10px] font-mono uppercase tracking-tighter">AI Generated Soundtrack v2.4</span>
        </div>
      </div>
    </div>
  );
}
