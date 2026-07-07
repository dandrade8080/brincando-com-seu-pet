import { useRef, useCallback, useState, useEffect } from 'react';

// Gera sons simples usando Web Audio API (sem arquivos externos)
// No futuro, trocar por arquivos de áudio reais (.mp3/.ogg)

const audioCtxRef = { current: null };

function getCtx() {
  if (!audioCtxRef.current) {
    audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtxRef.current;
}

function playTone(freq, duration, type = 'sine', volume = 0.15, rampDown = true) {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    if (rampDown) {
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    }
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch (e) { /* ignora erros de áudio */ }
}

function playNoise(duration, volume = 0.08) {
  try {
    const ctx = getCtx();
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.5;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, ctx.currentTime);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start(ctx.currentTime);
    source.stop(ctx.currentTime + duration);
  } catch (e) { /* ignora */ }
}

export default function useAudio() {
  const [muted, setMuted] = useState(false);
  const bgmRef = useRef(null);
  const bgmGainRef = useRef(null);

  // Inicia música de fundo (loop simples com notas)
  const startBGM = useCallback(() => {
    if (bgmRef.current) return;
    try {
      const ctx = getCtx();
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(muted ? 0 : 0.04, ctx.currentTime);
      gain.connect(ctx.destination);
      bgmGainRef.current = gain;

      // Melodia infantil simples em loop (escala maior)
      const notes = [262, 294, 330, 349, 392, 349, 330, 294, 262, 330, 392, 440, 392, 349, 330, 294];
      const noteDuration = 0.35;
      const totalDuration = notes.length * noteDuration;

      function scheduleLoop() {
        if (!bgmGainRef.current) return;
        const now = ctx.currentTime;
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const noteGain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + i * noteDuration);
          noteGain.gain.setValueAtTime(0.03, now + i * noteDuration);
          noteGain.gain.exponentialRampToValueAtTime(0.001, now + (i + 0.8) * noteDuration);
          osc.connect(noteGain);
          noteGain.connect(gain);
          osc.start(now + i * noteDuration);
          osc.stop(now + (i + 0.9) * noteDuration);
        });
        bgmRef.current = setTimeout(scheduleLoop, totalDuration * 1000 - 100);
      }
      scheduleLoop();
    } catch (e) { /* ignora */ }
  }, [muted]);

  const stopBGM = useCallback(() => {
    if (bgmRef.current) {
      clearTimeout(bgmRef.current);
      bgmRef.current = null;
    }
    bgmGainRef.current = null;
  }, []);

  const toggleMute = useCallback(() => {
    setMuted(prev => {
      const newMuted = !prev;
      if (bgmGainRef.current) {
        bgmGainRef.current.gain.setValueAtTime(
          newMuted ? 0 : 0.04,
          getCtx().currentTime
        );
      }
      return newMuted;
    });
  }, []);

  useEffect(() => {
    return () => stopBGM();
  }, [stopBGM]);

  // Efeitos sonoros
  const sfx = {
    bark: () => { if (!muted) { playTone(200, 0.15, 'sawtooth', 0.08); setTimeout(() => playTone(180, 0.1, 'sawtooth', 0.07), 150); } },
    meow: () => { if (!muted) { playTone(600, 0.2, 'sine', 0.06); setTimeout(() => playTone(500, 0.25, 'sine', 0.05), 100); } },
    step: () => { if (!muted) { playNoise(0.05, 0.03); } },
    eat: () => { if (!muted) { playNoise(0.15, 0.05); playTone(400, 0.1, 'square', 0.03); } },
    drink: () => { if (!muted) { playTone(800, 0.2, 'sine', 0.04); setTimeout(() => playTone(1000, 0.15, 'sine', 0.03), 100); } },
    jump: () => { if (!muted) { playTone(500, 0.08, 'sine', 0.06); setTimeout(() => playTone(700, 0.08, 'sine', 0.06), 50); } },
    fall: () => { if (!muted) { playTone(150, 0.5, 'sawtooth', 0.1); } },
    click: () => { if (!muted) { playTone(660, 0.06, 'sine', 0.04); } },
    success: () => { if (!muted) { playTone(523, 0.12, 'sine', 0.06); setTimeout(() => playTone(659, 0.12, 'sine', 0.06), 120); setTimeout(() => playTone(784, 0.15, 'sine', 0.06), 240); } },
  };

  return { muted, toggleMute, startBGM, stopBGM, sfx };
}
