"use client"
import { ApiProvider, RealtimeSessionEngineProvider } from "gabber-client-react";
import { ChatContainer } from "./ChatContainer";

interface Persona {
  id: string;
  name: string;
  description: string;
  gender: 'male' | 'female';
  voice: string;
}

interface ChatPageProps {
  usageToken: string;
  voice: string;
  context: string;
}

function ChatPageContent() {
    return <ChatContainer />;
}

const SFW_LLM = "21892bb9-9809-4b6f-8c3e-e40093069f04"


export function ChatPage({ context, usageToken, voice }: ChatPageProps) {
  return (
    <RealtimeSessionEngineProvider connectionOpts={{
        token: usageToken,
        config: {
            generative: {
                llm: SFW_LLM,
                voice_override: voice,
                context: context
            },
            general: {},
            input: { interruptable: true, parallel_listening: true },
            output: {
                stream_transcript: true,
                speech_synthesis_enabled: true
            }
        },
      }}>
      <ApiProvider usageToken={usageToken}>
        <ChatPageContent />
      </ApiProvider>
    </RealtimeSessionEngineProvider>
  );
} 