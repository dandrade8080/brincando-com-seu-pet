import { useRef, useCallback, useState, useEffect } from 'react';

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

function playNoise(duration, volume = 0.08, filterFreq = 800) {
  try {
    const ctx = getCtx();
    const bufferSize = Math.floor(ctx.sampleRate * duration);
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
    filter.frequency.setValueAtTime(filterFreq, ctx.currentTime);
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

  const startBGM = useCallback(() => {
    if (bgmRef.current) return;
    try {
      const ctx = getCtx();
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(muted ? 0 : 0.03, ctx.currentTime);
      gain.connect(ctx.destination);
      bgmGainRef.current = gain;

      const notes = [262, 294, 330, 349, 392, 349, 330, 294, 262, 330, 392, 440, 392, 349, 330, 294];
      const noteDuration = 0.4;
      const totalDuration = notes.length * noteDuration;

      function scheduleLoop() {
        if (!bgmGainRef.current) return;
        const now = ctx.currentTime;
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const noteGain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + i * noteDuration);
          noteGain.gain.setValueAtTime(0.025, now + i * noteDuration);
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
          newMuted ? 0 : 0.03,
          getCtx().currentTime
        );
      }
      return newMuted;
    });
  }, []);

  useEffect(() => {
    return () => stopBGM();
  }, [stopBGM]);

  const sfx = {
    bark: () => {
      if (muted) return;
      playTone(180, 0.1, 'sawtooth', 0.1);
      setTimeout(() => playTone(160, 0.15, 'sawtooth', 0.09), 80);
      setTimeout(() => playTone(140, 0.1, 'sawtooth', 0.07), 200);
      setTimeout(() => playTone(170, 0.08, 'sawtooth', 0.06), 280);
    },
    meow: () => {
      if (muted) return;
      playTone(550, 0.15, 'sine', 0.08);
      setTimeout(() => playTone(700, 0.1, 'sine', 0.06), 120);
      setTimeout(() => playTone(450, 0.2, 'sine', 0.05), 220);
      setTimeout(() => playTone(650, 0.12, 'sine', 0.04), 350);
    },
    step: () => {
      if (muted) return;
      playNoise(0.04, 0.03, 600);
    },
    eat: () => {
      if (muted) return;
      playNoise(0.12, 0.06, 1000);
      playTone(400, 0.08, 'square', 0.04);
      setTimeout(() => playNoise(0.1, 0.05, 900), 150);
      setTimeout(() => playTone(350, 0.08, 'square', 0.03), 200);
    },
    drink: () => {
      if (muted) return;
      playTone(700, 0.15, 'sine', 0.05);
      setTimeout(() => playTone(900, 0.12, 'sine', 0.04), 100);
      setTimeout(() => playTone(1100, 0.1, 'sine', 0.03), 200);
      setTimeout(() => playTone(800, 0.12, 'sine', 0.04), 300);
    },
    jump: () => {
      if (muted) return;
      playTone(400, 0.06, 'sine', 0.07);
      setTimeout(() => playTone(600, 0.06, 'sine', 0.07), 40);
      setTimeout(() => playTone(800, 0.08, 'sine', 0.06), 80);
    },
    fall: () => {
      if (muted) return;
      playTone(300, 0.1, 'sawtooth', 0.08);
      setTimeout(() => playTone(150, 0.3, 'sawtooth', 0.1), 80);
      setTimeout(() => playNoise(0.2, 0.06, 300), 150);
    },
    click: () => {
      if (muted) return;
      playTone(660, 0.05, 'sine', 0.05);
    },
    success: () => {
      if (muted) return;
      playTone(523, 0.1, 'sine', 0.07);
      setTimeout(() => playTone(659, 0.1, 'sine', 0.07), 120);
      setTimeout(() => playTone(784, 0.15, 'sine', 0.07), 240);
    },
    purr: () => {
      if (muted) return;
      playTone(200, 0.5, 'sine', 0.03);
      setTimeout(() => playTone(210, 0.5, 'sine', 0.03), 500);
    },
    snore: () => {
      if (muted) return;
      playTone(100, 0.6, 'sawtooth', 0.04);
      setTimeout(() => playTone(100, 0.8, 'sawtooth', 0.03), 1500);
    },
    ballBounce: () => {
      if (muted) return;
      playTone(300, 0.08, 'sine', 0.06);
      setTimeout(() => playTone(400, 0.06, 'sine', 0.05), 60);
      setTimeout(() => playTone(500, 0.05, 'sine', 0.04), 120);
    },
    enterHouse: () => {
      if (muted) return;
      playTone(440, 0.1, 'triangle', 0.06);
      setTimeout(() => playTone(550, 0.1, 'triangle', 0.06), 100);
      setTimeout(() => playTone(660, 0.15, 'triangle', 0.06), 200);
    },
  };

  return { muted, toggleMute, startBGM, stopBGM, sfx };
}
