"use client";
import React, { useState, useRef } from 'react';
import { ApiProvider, RealtimeSessionEngineProvider } from "gabber-client-react";
import { useAudio } from './AudioProvider';
import { MinimalChat } from '@/src/app/Components/MinimalChat';

interface CrystalBallProps {
  usageToken: string;
}

export function CrystalBall({ usageToken }: CrystalBallProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showSession, setShowSession] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const { playHum, stopHum, setHumVolume, playSpirits } = useAudio();
  const chatRef = useRef<{ handleSendMessage: (text: string) => void }>();
  
  const handleMouseEnter = () => {
    setIsHovered(true);
    playHum();
  };

  const handleBallClick = () => {
    if (showSession && isHovered) {
      setShowFlash(true);
      setTimeout(() => setShowFlash(false), 1200);
      chatRef.current?.handleSendMessage("tell me my future");
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isHovered) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const distance = Math.sqrt(
      Math.pow((e.clientX - centerX) / (rect.width / 2), 2) +
      Math.pow((e.clientY - centerY) / (rect.height / 2), 2)
    );
    
    const volume = Math.max(0, 1 - distance);
    setHumVolume(volume);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    stopHum();
  };

  const handleStartSession = () => {
    setShowSession(true);
    playSpirits();
  };

  return (
    <div className="relative flex flex-col items-center justify-center">
      {showFlash && (
        <div className="fixed inset-0 bg-black dark-flash pointer-events-none z-50" />
      )}
      <div 
        className="relative group"
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleBallClick}
      >
        <div className={`absolute inset-0 rounded-full bg-purple-500 blur-2xl transition-opacity duration-500 ${isHovered ? 'opacity-30' : 'opacity-0'}`} />
        <img
          src="/ball.png"
          alt="Crystal Ball"
          className={`w-64 h-64 relative transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
        />
        {isHovered && showSession && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="absolute inset-0 bg-purple-900/50 blur-xl -z-10" />
            <div className="text-purple-200 font-mystical text-2xl text-center whitespace-nowrap tracking-wider px-8 py-4">
              Click to gaze into your future
            </div>
          </div>
        )}
      </div>

      {!showSession && (
        <button
          onClick={handleStartSession}
          className="mt-16 px-8 py-4 bg-purple-800/50 text-purple-200 rounded-full font-mystical text-2xl hover:bg-purple-700/50 transition-all tracking-wider"
        >
          Contact Spirits
        </button>
      )}

      {showSession && (
        <div className="fixed right-8 bottom-8 z-50">
          <ApiProvider usageToken={usageToken}>
            <RealtimeSessionEngineProvider
              connectionOpts={{
                token: usageToken,
                config: {
                  generative: {
                    llm: "21892bb9-9809-4b6f-8c3e-e40093069f04",
                    persona: "87134b2f-24f2-44ef-a30e-8502ec5a9ce7",
                    scenario: "8c7401bb-b1ce-469e-8b64-25e0646b66a9",
                    voice: "9b80821f-c96f-445b-a211-638938edd775",
                    tool_definitions: [
                      "9e67d646-7dbc-4f3b-a850-6966113d2675",
                    ]
                  },
                  general: {},
                  input: { interruptable: true, parallel_listening: true },
                  output: {
                    stream_transcript: true,
                    speech_synthesis_enabled: true
                  }
                },
              }}
            >
              <MinimalChat ref={chatRef} />
            </RealtimeSessionEngineProvider>
          </ApiProvider>
        </div>
      )}
    </div>
  );
} 