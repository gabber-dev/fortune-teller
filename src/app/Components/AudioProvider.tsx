"use client";
import React, { createContext, useContext, useEffect, useRef } from 'react';

const AudioContext = createContext<{
  playHum: () => void;
  stopHum: () => void;
  setHumVolume: (volume: number) => void;
  playSpirits: () => void;
}>({
  playHum: () => {},
  stopHum: () => {},
  setHumVolume: () => {},
  playSpirits: () => {},
});

export const useAudio = () => useContext(AudioContext);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);
  const humSoundRef = useRef<HTMLAudioElement | null>(null);
  const spiritsSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    backgroundMusicRef.current = new Audio('/ambient.mp3');
    humSoundRef.current = new Audio('/hum.mp3');
    spiritsSoundRef.current = new Audio('/spirits.mp3');
    
    backgroundMusicRef.current.loop = true;
    humSoundRef.current.loop = true;
    
    const bgMusic = backgroundMusicRef.current;
    bgMusic.volume = 0.15;

    // Play ambient music immediately
    const playAmbient = () => {
      bgMusic.play().catch(() => {
        // If autoplay fails, try again on user interaction
        document.addEventListener('click', function playOnClick() {
          bgMusic.play();
          document.removeEventListener('click', playOnClick);
        }, { once: true });
      });
    };

    playAmbient();
    
    return () => {
      bgMusic.pause();
    };
  }, []);

  const playHum = () => {
    if (humSoundRef.current) {
      humSoundRef.current.volume = 0.05;
      humSoundRef.current.play();
    }
  };

  const stopHum = () => {
    if (humSoundRef.current) {
      humSoundRef.current.pause();
      humSoundRef.current.currentTime = 0;
    }
  };

  const setHumVolume = (volume: number) => {
    if (humSoundRef.current) {
      humSoundRef.current.volume = Math.min(Math.max(volume, 0), 1);
    }
  };

  const playSpirits = () => {
    if (spiritsSoundRef.current) {
      spiritsSoundRef.current.volume = 0.2;
      spiritsSoundRef.current.play();
    }
  };

  return (
    <AudioContext.Provider value={{ playHum, stopHum, setHumVolume, playSpirits }}>
      {children}
    </AudioContext.Provider>
  );
} 