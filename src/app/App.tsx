"use client"
import React, { useState } from 'react';
import { ApiProvider } from "gabber-client-react"
import { ScenarioSelector } from './Components/ScenarioSelector';

function App(props: { usageToken: string }) {
  const [isCreating, setIsCreating] = useState(false);

  return (
    <ApiProvider usageToken={props.usageToken}>
      <ScenarioSelector 
        personaId="default"
        onBack={() => {}}
        voiceId={null}
        usageToken={props.usageToken}
      />
    </ApiProvider>
  );
}

export default App;