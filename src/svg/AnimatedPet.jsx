import React, { useState, useEffect, useRef } from 'react';
import './AnimatedPet.css';

function darken(hex, amt = -30) {
  if (!hex || !hex.startsWith('#')) return hex;
  const n = parseInt(hex.slice(1), 16);
  let r = Math.max(0, Math.min(255, ((n >> 16) & 0xFF) + amt));
  let g = Math.max(0, Math.min(255, ((n >> 8) & 0xFF) + amt));
  let b = Math.max(0, Math.min(255, (n & 0xFF) + amt));
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

function lighten(hex, amt = 30) { return darken(hex, amt); }

export default function AnimatedPet({ species, color = '#F4A460', fur = 'short', size = 100, state = 'idle', direction = 'right', className = '' }) {
  const [blinking, setBlinking] = useState(false);
  const blinkTimer = useRef(null);
  const flip = direction === 'left' ? -1 : 1;
  const sw = 3.2;
  const isCat = species === 'cat';
  const c = color;
  const cd = darken(c, -35);
  const cl = lighten(c, 40);

  useEffect(() => {
    const blink = () => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 150);
      blinkTimer.current = setTimeout(blink, 2000 + Math.random() * 3000);
    };
    blinkTimer.current = setTimeout(blink, 2000 + Math.random() * 2000);
    return () => clearTimeout(blinkTimer.current);
  }, []);

  const animClass = `pet-sprite state-${state} dir-${direction}`;
  const uid = `${species}-${size}-${color}-${state}`;

  if (isCat) {
    return (
      <svg className={`${animClass} ${className}`} width={size} height={size * 1.12} viewBox="0 0 100 112" style={{ overflow: 'visible', transform: `scaleX(${flip})` }}>
        <defs>
          <radialGradient id={`acBody-${uid}`} cx="40%" cy="35%"><stop offset="0%" stopColor={cl} /><stop offset="70%" stopColor={c} /><stop offset="100%" stopColor={cd} /></radialGradient>
          <radialGradient id={`acHead-${uid}`} cx="42%" cy="32%"><stop offset="0%" stopColor={cl} /><stop offset="100%" stopColor={c} /></radialGradient>
        </defs>

        <ellipse className="pet-shadow" cx="50" cy="110" rx="28" ry="5" fill="rgba(0,0,0,0.15)" />

        <g className="pet-tail">
          <path d="M74,78 Q92,60 90,38 Q89,28 84,30" fill="none" stroke={`url(#acBody-${uid})`} strokeWidth={10} strokeLinecap="round" />
          <path d="M74,78 Q92,60 90,38 Q89,28 84,30" fill="none" stroke="#000" strokeWidth={sw} strokeLinecap="round" />
        </g>

        <g className="pet-body">
          <ellipse cx="52" cy="78" rx="26" ry="23" fill={`url(#acBody-${uid})`} stroke="#000" strokeWidth={sw} />
          <ellipse cx="47" cy="84" rx="14" ry="12" fill={lighten(c, 50)} stroke="#000" strokeWidth={1.2} opacity="0.65" />
        </g>

        <g className="pet-back-legs">
          <ellipse cx="36" cy="100" rx={9} ry={6.5} fill={`url(#acBody-${uid})`} stroke="#000" strokeWidth={sw} />
          <ellipse cx="63" cy="100" rx={9} ry={6.5} fill={`url(#acBody-${uid})`} stroke="#000" strokeWidth={sw} />
          <ellipse cx="36" cy="102" rx={4.5} ry={2.8} fill="#FFB6C1" stroke="#000" strokeWidth={1} />
          <ellipse cx="63" cy="102" rx={4.5} ry={2.8} fill="#FFB6C1" stroke="#000" strokeWidth={1} />
        </g>

        <g className="pet-front-legs">
          <ellipse cx="39" cy="95" rx={7.5} ry={5.5} fill={`url(#acBody-${uid})`} stroke="#000" strokeWidth={sw} />
          <ellipse cx="65" cy="95" rx={7.5} ry={5.5} fill={`url(#acBody-${uid})`} stroke="#000" strokeWidth={sw} />
          <ellipse cx="39" cy="97" rx={3.8} ry={2.2} fill="#FFB6C1" stroke="#000" strokeWidth={1} />
          <ellipse cx="65" cy="97" rx={3.8} ry={2.2} fill="#FFB6C1" stroke="#000" strokeWidth={1} />
        </g>

        <g className="pet-head">
          <circle cx="50" cy="38" r="24" fill={`url(#acHead-${uid})`} stroke="#000" strokeWidth={sw} />
          <ellipse cx="50" cy="45" rx="12" ry={8.5} fill={lighten(c, 60)} opacity="0.45" />
        </g>

        <g className="pet-ears">
          <polygon points="28,20 18,-2 38,13" fill={`url(#acBody-${uid})`} stroke="#000" strokeWidth={sw} />
          <polygon points="27,18 20,2 35,13" fill="#FFB6C1" stroke="#000" strokeWidth={1.4} />
          <polygon points="72,20 82,-2 62,13" fill={`url(#acBody-${uid})`} stroke="#000" strokeWidth={sw} />
          <polygon points="73,18 80,2 65,13" fill="#FFB6C1" stroke="#000" strokeWidth={1.4} />
        </g>

        <g className="pet-eyes">
          <ellipse cx="38" cy="36" rx="8.5" ry="10" fill="#FFF" stroke="#000" strokeWidth={sw} />
          <ellipse cx="62" cy="36" rx="8.5" ry="10" fill="#FFF" stroke="#000" strokeWidth={sw} />
          {!blinking && <>
            <ellipse cx="39" cy="38" rx="6" ry="7.5" fill="#5B8C3E" />
            <ellipse cx="63" cy="38" rx="6" ry="7.5" fill="#5B8C3E" />
            <ellipse cx="37" cy="36" rx="3" ry="4" fill="#7CAA5E" opacity="0.6" />
            <ellipse cx="61" cy="36" rx="3" ry="4" fill="#7CAA5E" opacity="0.6" />
            <ellipse cx="40" cy="38" rx="3.5" ry="5" fill="#111" />
            <ellipse cx="64" cy="38" rx="3.5" ry="5" fill="#111" />
            <ellipse cx="36" cy="33" rx="3.2" ry="2.8" fill="#FFF" />
            <ellipse cx="60" cy="33" rx="3.2" ry="2.8" fill="#FFF" />
            <ellipse cx="42" cy="42" rx="1.8" ry="1.5" fill="#FFF" />
            <ellipse cx="66" cy="42" rx="1.8" ry="1.5" fill="#FFF" />
          </>}
        </g>

        <ellipse cx="31" cy="45" rx="5.5" ry="3.5" fill="#FFB6C1" opacity="0.5" />
        <ellipse cx="69" cy="45" rx="5.5" ry="3.5" fill="#FFB6C1" opacity="0.5" />
        <ellipse cx="50" cy="46" rx="3.8" ry="2.8" fill="#FF8C94" stroke="#000" strokeWidth={1.4} />
        <ellipse cx="49" cy="44.5" rx="1.2" ry="0.8" fill="#FFB6C1" opacity="0.7" />
        <path d="M44,50 Q47,54 50,50 Q53,54 56,50" fill="none" stroke="#000" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
        <line x1="18" y1="41" x2="28" y2="43" stroke="#000" strokeWidth={1.4} strokeLinecap="round" />
        <line x1="17" y1="47" x2="28" y2="47" stroke="#000" strokeWidth={1.4} strokeLinecap="round" />
        <line x1="82" y1="41" x2="72" y2="43" stroke="#000" strokeWidth={1.4} strokeLinecap="round" />
        <line x1="83" y1="47" x2="72" y2="47" stroke="#000" strokeWidth={1.4} strokeLinecap="round" />
      </svg>
    );
  }

  // DOG
  return (
    <svg className={`${animClass} ${className}`} width={size} height={size * 1.12} viewBox="0 0 100 112" style={{ overflow: 'visible', transform: `scaleX(${flip})` }}>
      <defs>
        <radialGradient id={`adBody-${uid}`} cx="40%" cy="35%"><stop offset="0%" stopColor={cl} /><stop offset="70%" stopColor={c} /><stop offset="100%" stopColor={cd} /></radialGradient>
      </defs>

      <ellipse className="pet-shadow" cx="48" cy="110" rx="28" ry="5" fill="rgba(0,0,0,0.15)" />

      <g className="pet-tail">
        <path d="M74,70 Q94,46 90,24 Q88,16 84,20" fill="none" stroke={`url(#adBody-${uid})`} strokeWidth={9} strokeLinecap="round" />
        <path d="M74,70 Q94,46 90,24 Q88,16 84,20" fill="none" stroke="#000" strokeWidth={sw} strokeLinecap="round" />
        <ellipse cx="86" cy="20" rx={5} ry={4.5} fill={cl} stroke="#000" strokeWidth={1.5} />
      </g>

      <g className="pet-body">
        <ellipse cx="48" cy="76" rx="25" ry="21" fill={`url(#adBody-${uid})`} stroke="#000" strokeWidth={sw} />
        <ellipse cx="44" cy="82" rx="16" ry="11" fill={lighten(c, 50)} stroke="#000" strokeWidth={1.2} opacity="0.6" />
      </g>

      <g className="pet-back-legs">
        <ellipse cx="34" cy="97" rx={9.5} ry={7} fill={`url(#adBody-${uid})`} stroke="#000" strokeWidth={sw} />
        <ellipse cx="61" cy="97" rx={9.5} ry={7} fill={`url(#adBody-${uid})`} stroke="#000" strokeWidth={sw} />
        <ellipse cx="31" cy="100" rx={3} ry={2} fill="#D4A574" stroke="#000" strokeWidth={1} />
        <ellipse cx="37" cy="100" rx={3} ry={2} fill="#D4A574" stroke="#000" strokeWidth={1} />
        <ellipse cx="58" cy="100" rx={3} ry={2} fill="#D4A574" stroke="#000" strokeWidth={1} />
        <ellipse cx="64" cy="100" rx={3} ry={2} fill="#D4A574" stroke="#000" strokeWidth={1} />
      </g>

      <g className="pet-front-legs">
        <ellipse cx="34" cy="91" rx={8.5} ry={6} fill={`url(#adBody-${uid})`} stroke="#000" strokeWidth={sw} />
        <ellipse cx="63" cy="91" rx={8.5} ry={6} fill={`url(#adBody-${uid})`} stroke="#000" strokeWidth={sw} />
        <ellipse cx="31" cy="93" rx={3} ry={2} fill="#D4A574" stroke="#000" strokeWidth={1} />
        <ellipse cx="37" cy="93" rx={3} ry={2} fill="#D4A574" stroke="#000" strokeWidth={1} />
        <ellipse cx="60" cy="93" rx={3} ry={2} fill="#D4A574" stroke="#000" strokeWidth={1} />
        <ellipse cx="66" cy="93" rx={3} ry={2} fill="#D4A574" stroke="#000" strokeWidth={1} />
      </g>

      <path d="M26,56 Q40,68 54,56" fill="none" stroke="#E74C3C" strokeWidth={5} />
      <path d="M26,56 Q40,68 54,56" fill="none" stroke="#000" strokeWidth={sw} />
      <circle cx="40" cy="64" r={6} fill="#FFD700" stroke="#000" strokeWidth={1.8} />
      <circle cx="39" cy="63" r={2} fill="#FFF" opacity="0.5" />

      <g className="pet-head">
        <circle cx="46" cy="36" r="23" fill={`url(#adBody-${uid})`} stroke="#000" strokeWidth={sw} />
        <ellipse cx="33" cy="43" rx="13" ry="9" fill={cl} stroke="#000" strokeWidth={sw} />
      </g>

      <g className="pet-ears">
        <ellipse cx="57" cy="20" rx={8.5} ry={14} fill={`url(#adBody-${uid})`} stroke="#000" strokeWidth={sw} transform="rotate(14,57,20)" />
        <ellipse cx="57" cy="22" rx={5} ry={10} fill="#D4A574" stroke="#000" strokeWidth={1.4} transform="rotate(14,57,20)" />
        <ellipse cx="65" cy="24" rx={8.5} ry={14} fill={`url(#adBody-${uid})`} stroke="#000" strokeWidth={sw} transform="rotate(28,65,24)" />
        <ellipse cx="65" cy="26" rx={5} ry={10} fill="#D4A574" stroke="#000" strokeWidth={1.4} transform="rotate(28,65,24)" />
      </g>

      <g className="pet-eyes">
        <ellipse cx="38" cy="33" rx="7.5" ry="9" fill="#FFF" stroke="#000" strokeWidth={sw} />
        <ellipse cx="58" cy="33" rx="7.5" ry="9" fill="#FFF" stroke="#000" strokeWidth={sw} />
        {!blinking && <>
          <ellipse cx="39" cy="35" rx="5.5" ry="7" fill="#6B4226" />
          <ellipse cx="59" cy="35" rx="5.5" ry="7" fill="#6B4226" />
          <ellipse cx="37" cy="33" rx="2.5" ry="3.5" fill="#8B6240" opacity="0.5" />
          <ellipse cx="57" cy="33" rx="2.5" ry="3.5" fill="#8B6240" opacity="0.5" />
          <ellipse cx="40" cy="35" rx="3.2" ry="4.5" fill="#111" />
          <ellipse cx="60" cy="35" rx="3.2" ry="4.5" fill="#111" />
          <ellipse cx="36" cy="30" rx="3" ry="2.5" fill="#FFF" />
          <ellipse cx="56" cy="30" rx="3" ry="2.5" fill="#FFF" />
          <ellipse cx="42" cy="38" rx="1.8" ry="1.5" fill="#FFF" />
          <ellipse cx="62" cy="38" rx="1.8" ry="1.5" fill="#FFF" />
        </>}
      </g>

      <path d="M30,24 Q36,20 42,24" fill="none" stroke="#000" strokeWidth={2.8} strokeLinecap="round" />
      <path d="M50,24 Q56,20 62,24" fill="none" stroke="#000" strokeWidth={2.8} strokeLinecap="round" />
      <ellipse cx="29" cy="40" rx="5.5" ry="4" fill="#222" stroke="#000" strokeWidth={1.4} />
      <ellipse cx="28" cy="38.5" rx="2.5" ry="1.5" fill="#555" opacity="0.6" />
      <path d="M22,45 Q28,49 34,45" fill="none" stroke="#000" strokeWidth={1.6} strokeLinecap="round" />
      <g className="pet-tongue">
        <ellipse cx="29" cy="49" rx="4.5" ry="6" fill="#FF8C94" stroke="#000" strokeWidth={1.6} />
        <line x1="29" y1="46" x2="29" y2="54" stroke="#000" strokeWidth={1.2} />
      </g>
      <ellipse cx="22" cy="43" rx="4.5" ry="3" fill="#FFB6C1" opacity="0.4" />
      <ellipse cx="68" cy="43" rx="4.5" ry="3" fill="#FFB6C1" opacity="0.4" />
    </svg>
  );
}
