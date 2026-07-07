import { useCallback, useRef } from 'react';

export default function useSpeech() {
  const lastSpoken = useRef('');

  const speak = useCallback((text) => {
    if (!text || text === lastSpoken.current) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 1;
      window.speechSynthesis.speak(utterance);
      lastSpoken.current = text;
    } catch (e) { /* ignora erros de fala */ }
  }, []);

  const stop = useCallback(() => {
    try { window.speechSynthesis.cancel(); } catch (e) { /* ignora */ }
  }, []);

  return { speak, stop };
}
