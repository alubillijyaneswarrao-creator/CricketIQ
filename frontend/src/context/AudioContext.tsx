import React, { createContext, useContext, useState, useRef } from 'react';

interface AudioContextType {
  isVoiceResponseEnabled: boolean;
  toggleVoiceResponse: () => void;
  isPlaying: boolean;
  playSpeech: (base64Audio: string) => void;
  stopSpeech: () => void;
  startVoiceInput: (onResult: (text: string) => void, onEnd?: () => void) => void;
  isListening: boolean;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isVoiceResponseEnabled, setIsVoiceResponseEnabled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);

  const toggleVoiceResponse = () => {
    setIsVoiceResponseEnabled((prev) => !prev);
    if (isPlaying) stopSpeech();
  };

  const playSpeech = (base64Audio: string) => {
    try {
      stopSpeech();
      const audioUrl = `data:audio/mp3;base64,${base64Audio}`;
      audioRef.current = new Audio(audioUrl);
      setIsPlaying(true);
      
      audioRef.current.onended = () => {
        setIsPlaying(false);
      };
      
      audioRef.current.play().catch(err => {
        console.error("Audio playback blocked or failed:", err);
        setIsPlaying(false);
      });
    } catch (e) {
      console.error("Failed to play synthesized speech:", e);
      setIsPlaying(false);
    }
  };

  const stopSpeech = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsPlaying(false);
    }
  };

  const startVoiceInput = (onResult: (text: string) => void, onEnd?: () => void) => {
    // Check for webkitSpeechRecognition or SpeechRecognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const speechToText = event.results[0][0].transcript;
      onResult(speechToText);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      if (onEnd) onEnd();
    };

    recognition.start();
  };

  return (
    <AudioContext.Provider value={{
      isVoiceResponseEnabled,
      toggleVoiceResponse,
      isPlaying,
      playSpeech,
      stopSpeech,
      startVoiceInput,
      isListening
    }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) throw new Error('useAudio must be used within an AudioProvider');
  return context;
};
