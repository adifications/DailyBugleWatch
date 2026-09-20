"use client";
import { useState, useRef, useEffect } from "react";
import { Radio, VolumeX, Volume2 } from "lucide-react";

export default function BugleRadio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // We set the volume low so it doesn't overpower your presentation voice!
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3; 
    }
  }, []);

  const toggleRadio = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <audio ref={audioRef} src="/bgm.mp3" loop />
      
      <button 
        onClick={toggleRadio}
        className={`flex items-center gap-2 px-4 py-3 border-4 border-black font-black uppercase text-sm shadow-[6px_6px_0px_0px_#000] transition active:translate-x-1 active:translate-y-1 active:shadow-none ${
          isPlaying ? "bg-green-400 text-black" : "bg-white text-black hover:bg-yellow-200"
        }`}
      >
        {isPlaying ? (
          <>
            <Volume2 className="h-5 w-5 animate-pulse" />
            LIVE BUGLE RADIO ON
          </>
        ) : (
          <>
            <VolumeX className="h-5 w-5" />
            TURN ON RADIO
          </>
        )}
      </button>
    </div>
  );
}