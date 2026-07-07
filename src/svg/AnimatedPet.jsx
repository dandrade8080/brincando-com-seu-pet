import React, { useState, useEffect, useRef } from 'react';
import './AnimatedPet.css';

function adjustBrightness(hex, amount) {
  if (!hex || !hex.startsWith('#')) return hex;
  const num = parseInt(hex.slice(1), 16);
  let r = (num >> 16) & 0xFF;
  let g = (num >> 8) & 0xFF;
  let b = num & 0xFF;
  r = Math.max(0, Math.min(255, r + amount));
  g = Math.max(0, Math.min(255, g + amount));
  b = Math.max(0, Math.min(255, b + amount));
  return `rgb(${r},${g},${b})`;
}

export default function AnimatedPet({ species, color = '#F4A460', fur = 'short', size = 100, state = 'idle', direction = 'right', className = '' }) {
  const [blinking, setBlinking] = useState(false);
  const blinkTimer = useRef(null);
  const s = size / 100;
  const flip = direction === 'left' ? -1 : 1;
  const strokeW = 3.5;
  const isCat = species === 'cat';
  const darkColor = adjustBrightness(color, -25);
  const lightColor = adjustBrightness(color, 30);
  const innerEar = '#FFB6C1';
  const eyeWhite = '#FFFFFF';
  const eyeColor = isCat ? '#2C5A2C' : '#4A2810';
  const noseColor = isCat ? '#FF8C94' : '#222';
  const tongueColor = '#FF8C94';

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

  if (isCat) {
    return (
      <svg className={`${animClass} ${className}`} width={size} height={size * 1.15} viewBox="0 0 100 115" style={{ overflow: 'visible', transform: `scaleX(${flip})` }}>
        {/* Sombra */}
        <ellipse className="pet-shadow" cx="50" cy="112" rx="28" ry="5" fill="rgba(0,0,0,0.15)" />

        {/* Cauda - balança no idle/walk */}
        <g className="pet-tail">
          <path d="M78,82 Q96,64 94,42 Q92,30 86,34" fill="none" stroke={color} strokeWidth={9} strokeLinecap="round" />
          <path d="M78,82 Q96,64 94,42 Q92,30 86,34" fill="none" stroke="#000" strokeWidth={strokeW} strokeLinecap="round" />
        </g>

        {/* Corpo */}
        <g className="pet-body">
          <ellipse cx="52" cy="80" rx="27" ry="24" fill={color} stroke="#000" strokeWidth={strokeW} />
          <ellipse cx="46" cy="86" rx="15" ry="13" fill={lightColor} stroke="#000" strokeWidth={1.5} opacity="0.5" />

          {/* Patas traseiras */}
          <g className="pet-back-legs">
            <ellipse cx="35" cy="102" rx={9} ry={7} fill={color} stroke="#000" strokeWidth={strokeW} />
            <ellipse cx="62" cy="102" rx={9} ry={7} fill={color} stroke="#000" strokeWidth={strokeW} />
            <ellipse cx="35" cy="104" rx={4.5} ry={3} fill={innerEar} stroke="#000" strokeWidth={1} />
            <ellipse cx="62" cy="104" rx={4.5} ry={3} fill={innerEar} stroke="#000" strokeWidth={1} />
          </g>

          {/* Patas dianteiras */}
          <g className="pet-front-legs">
            <ellipse cx="39" cy="97" rx={7.5} ry={6} fill={color} stroke="#000" strokeWidth={strokeW} />
            <ellipse cx="65" cy="97" rx={7.5} ry={6} fill={color} stroke="#000" strokeWidth={strokeW} />
            <ellipse cx="39" cy="99" rx={4} ry={2.5} fill={innerEar} stroke="#000" strokeWidth={1} />
            <ellipse cx="65" cy="99" rx={4} ry={2.5} fill={innerEar} stroke="#000" strokeWidth={1} />
          </g>
        </g>

        {/* Cabeça */}
        <g className="pet-head">
          <circle cx="50" cy="40" r="25" fill={color} stroke="#000" strokeWidth={strokeW} />
          <ellipse cx="50" cy="46" rx="13" ry="9" fill={lightColor} opacity="0.5" />

          {/* Orelhas */}
          <g className="pet-ears">
            <polygon points="27,24 18,0 38,16" fill={color} stroke="#000" strokeWidth={strokeW} />
            <polygon points="26,22 20,3 35,16" fill={innerEar} stroke="#000" strokeWidth={1.5} />
            <polygon points="73,24 82,0 62,16" fill={color} stroke="#000" strokeWidth={strokeW} />
            <polygon points="74,22 80,3 65,16" fill={innerEar} stroke="#000" strokeWidth={1.5} />
          </g>

          {/* Olhos */}
          <g className="pet-eyes">
            <ellipse cx="38" cy="37" rx="8.5" ry="9.5" fill={eyeWhite} stroke="#000" strokeWidth={strokeW} />
            <ellipse cx="62" cy="37" rx="8.5" ry="9.5" fill={eyeWhite} stroke="#000" strokeWidth={strokeW} />
            {!blinking && (
              <>
                <ellipse cx="39" cy="39" rx="5.5" ry="6.5" fill={eyeColor} />
                <ellipse cx="63" cy="39" rx="5.5" ry="6.5" fill={eyeColor} />
                <ellipse cx="39" cy="39" rx="3.5" ry="4.5" fill="#111" />
                <ellipse cx="63" cy="39" rx="3.5" ry="4.5" fill="#111" />
                <ellipse cx="36" cy="35" rx={3} ry={2.5} fill="#FFF" />
                <ellipse cx="60" cy="35" rx={3} ry={2.5} fill="#FFF" />
                <circle cx="42" cy="42" r={1.5} fill="#FFF" />
                <circle cx="66" cy="42" r={1.5} fill="#FFF" />
              </>
            )}
          </g>

          {/* Bochechas */}
          <ellipse cx="30" cy="46" rx={5} ry={3.5} fill="#FFB6C1" opacity="0.45" />
          <ellipse cx="70" cy="46" rx={5} ry={3.5} fill="#FFB6C1" opacity="0.45" />

          {/* Nariz e boca */}
          <ellipse cx="50" cy="47" rx={3.5} ry={2.5} fill={noseColor} stroke="#000" strokeWidth={1.5} />
          <path d="M44,51 Q47,55 50,51 Q53,55 56,51" fill="none" stroke="#000" strokeWidth={1.5} strokeLinecap="round" />

          {/* Bigodes */}
          <line x1="18" y1="42" x2="28" y2="44" stroke="#000" strokeWidth={1.5} strokeLinecap="round" />
          <line x1="16" y1="48" x2="28" y2="48" stroke="#000" strokeWidth={1.5} strokeLinecap="round" />
          <line x1="82" y1="42" x2="72" y2="44" stroke="#000" strokeWidth={1.5} strokeLinecap="round" />
          <line x1="84" y1="48" x2="72" y2="48" stroke="#000" strokeWidth={1.5} strokeLinecap="round" />
        </g>
      </svg>
    );
  }

  // Dog
  return (
    <svg className={`${animClass} ${className}`} width={size} height={size * 1.15} viewBox="0 0 100 115" style={{ overflow: 'visible', transform: `scaleX(${flip})` }}>
      {/* Sombra */}
      <ellipse className="pet-shadow" cx="48" cy="112" rx="28" ry="5" fill="rgba(0,0,0,0.15)" />

      {/* Cauda - balança */}
      <g className="pet-tail">
        <path d="M74,72 Q94,48 90,26 Q88,18 84,22" fill="none" stroke={color} strokeWidth={9} strokeLinecap="round" />
        <path d="M74,72 Q94,48 90,26 Q88,18 84,22" fill="none" stroke="#000" strokeWidth={strokeW} strokeLinecap="round" />
        <circle cx="86" cy="22" r={5} fill={lightColor} stroke="#000" strokeWidth={1.5} />
      </g>

      {/* Corpo */}
      <g className="pet-body">
        <ellipse cx="48" cy="78" rx="26" ry="22" fill={color} stroke="#000" strokeWidth={strokeW} />
        <ellipse cx="44" cy="84" rx="17" ry={12} fill={lightColor} stroke="#000" strokeWidth={1.5} opacity="0.5" />

        {/* Patas traseiras */}
        <g className="pet-back-legs">
          <ellipse cx="33" cy="100" rx={9.5} ry={7.5} fill={color} stroke="#000" strokeWidth={strokeW} />
          <ellipse cx="61" cy="100" rx={9.5} ry={7.5} fill={color} stroke="#000" strokeWidth={strokeW} />
          <ellipse cx="30" cy="103" rx={3} ry={2} fill={innerEar} stroke="#000" strokeWidth={1} />
          <ellipse cx="36" cy="103" rx={3} ry={2} fill={innerEar} stroke="#000" strokeWidth={1} />
          <ellipse cx="58" cy="103" rx={3} ry={2} fill={innerEar} stroke="#000" strokeWidth={1} />
          <ellipse cx="64" cy="103" rx={3} ry={2} fill={innerEar} stroke="#000" strokeWidth={1} />
        </g>

        {/* Patas dianteiras */}
        <g className="pet-front-legs">
          <ellipse cx="33" cy="94" rx={8.5} ry={6.5} fill={color} stroke="#000" strokeWidth={strokeW} />
          <ellipse cx="63" cy="94" rx={8.5} ry={6.5} fill={color} stroke="#000" strokeWidth={strokeW} />
          <ellipse cx="30" cy="96" rx={3} ry={2} fill={innerEar} stroke="#000" strokeWidth={1} />
          <ellipse cx="36" cy="96" rx={3} ry={2} fill={innerEar} stroke="#000" strokeWidth={1} />
          <ellipse cx="60" cy="96" rx={3} ry={2} fill={innerEar} stroke="#000" strokeWidth={1} />
          <ellipse cx="66" cy="96" rx={3} ry={2} fill={innerEar} stroke="#000" strokeWidth={1} />
        </g>

        {/* Coleira */}
        <path d="M26,54 Q40,66 54,54" fill="none" stroke="#CC0000" strokeWidth={4} />
        <path d="M26,54 Q40,66 54,54" fill="none" stroke="#000" strokeWidth={strokeW} />
        <circle cx="40" cy="63" r={5} fill="#FFD700" stroke="#000" strokeWidth={1.5} />
      </g>

      {/* Cabeça */}
      <g className="pet-head">
        <circle cx="46" cy="38" r="24" fill={color} stroke="#000" strokeWidth={strokeW} />
        <ellipse cx="34" cy="44" rx={13} ry={9.5} fill={lightColor} stroke="#000" strokeWidth={strokeW} />

        {/* Orelhas caídas */}
        <g className="pet-ears">
          <ellipse cx="58" cy="22" rx={9.5} ry={15} fill={color} stroke="#000" strokeWidth={strokeW} transform="rotate(15,58,22)" />
          <ellipse cx="58" cy="24" rx={5.5} ry={11} fill={innerEar} stroke="#000" strokeWidth={1.5} transform="rotate(15,58,22)" />
          <ellipse cx="66" cy="26" rx={9.5} ry={15} fill={color} stroke="#000" strokeWidth={strokeW} transform="rotate(30,66,26)" />
          <ellipse cx="66" cy="28" rx={5.5} ry={11} fill={innerEar} stroke="#000" strokeWidth={1.5} transform="rotate(30,66,26)" />
        </g>

        {/* Olhos */}
        <g className="pet-eyes">
          <ellipse cx="38" cy="34" rx={7.5} ry={8.5} fill={eyeWhite} stroke="#000" strokeWidth={strokeW} />
          <ellipse cx="58" cy="34" rx={7.5} ry={8.5} fill={eyeWhite} stroke="#000" strokeWidth={strokeW} />
          {!blinking && (
            <>
              <ellipse cx="39" cy="36" rx={5} ry={6} fill={eyeColor} />
              <ellipse cx="59" cy="36" rx={5} ry={6} fill={eyeColor} />
              <ellipse cx="39" cy="36" rx={3} ry={4} fill="#111" />
              <ellipse cx="59" cy="36" rx={3} ry={4} fill="#111" />
              <ellipse cx="36" cy="32" rx={2.5} ry={2} fill="#FFF" />
              <ellipse cx="56" cy="32" rx={2.5} ry={2} fill="#FFF" />
              <circle cx="41" cy="39" r={1.5} fill="#FFF" />
              <circle cx="61" cy="39" r={1.5} fill="#FFF" />
            </>
          )}
        </g>

        {/* Sobrancelhas */}
        <path d="M30,25 Q36,21 42,25" fill="none" stroke="#000" strokeWidth={2.5} strokeLinecap="round" />
        <path d="M50,25 Q56,21 62,25" fill="none" stroke="#000" strokeWidth={2.5} strokeLinecap="round" />

        {/* Nariz */}
        <ellipse cx="31" cy="41" rx={4.5} ry={3.5} fill={noseColor} stroke="#000" strokeWidth={1.5} />

        {/* Boca */}
        <path d="M25,46 Q30,50 34,46" fill="none" stroke="#000" strokeWidth={1.5} strokeLinecap="round" />

        {/* Língua */}
        <g className="pet-tongue">
          <ellipse cx="30" cy={50} rx={3.5} ry={4.5} fill={tongueColor} stroke="#000" strokeWidth={1.5} />
          <line x1="30" y1="47" x2="30" y2="53" stroke="#000" strokeWidth={1} />
        </g>

        {/* Bochechas */}
        <ellipse cx="22" cy="44" rx={4} ry={3} fill="#FFB6C1" opacity="0.35" />
        <ellipse cx="68" cy="44" rx={4} ry={3} fill="#FFB6C1" opacity="0.35" />
      </g>

      {/* Pelos longos */}
      {fur === 'long' && (
        <>
          <path d="M66,18 Q76,12 74,22" fill="none" stroke={color} strokeWidth={5} strokeLinecap="round" />
          <path d="M28,58 Q20,68 24,76" fill="none" stroke={color} strokeWidth={5} strokeLinecap="round" />
          <path d="M68,58 Q78,68 72,76" fill="none" stroke={color} strokeWidth={5} strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}
