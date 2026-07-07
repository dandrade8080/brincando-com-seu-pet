import React from 'react';

export const PET_COLORS = [
  { name: 'Branco',  hex: '#FAF5F0', lum: 240, dark: '#E8DDD4' },
  { name: 'Laranja', hex: '#F4A460', lum: 170, dark: '#D2843A' },
  { name: 'Cinza',   hex: '#B8B0A8', lum: 165, dark: '#908880' },
  { name: 'Marrom',  hex: '#7B4B2A', lum: 70,  dark: '#5A3018' },
  { name: 'Preto',   hex: '#3A3A3A', lum: 40,  dark: '#1A1A1A' },
];

export const OBJECT_COLORS = [
  { name: 'Rosa',     hex: '#FFB6C1', lum: 185, dark: '#E8949E' },
  { name: 'Azul',     hex: '#87CEEB', lum: 175, dark: '#5BA4C8' },
  { name: 'Verde',    hex: '#90EE90', lum: 180, dark: '#5EC45E' },
  { name: 'Amarelo',  hex: '#FFE4B5', lum: 210, dark: '#D4B87A' },
  { name: 'Lilás',    hex: '#DDA0DD', lum: 165, dark: '#B870B8' },
];

export const MAT_PATTERNS = [
  { name: 'Estrela', id: 0 },
  { name: 'Coração', id: 1 },
  { name: 'Peixinho', id: 2 },
  { name: 'Flor', id: 3 },
];

function darken(hex, amt = -30) {
  if (!hex || !hex.startsWith('#')) return hex;
  const n = parseInt(hex.slice(1), 16);
  let r = Math.max(0, Math.min(255, ((n >> 16) & 0xFF) + amt));
  let g = Math.max(0, Math.min(255, ((n >> 8) & 0xFF) + amt));
  let b = Math.max(0, Math.min(255, (n & 0xFF) + amt));
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

function lighten(hex, amt = 30) {
  return darken(hex, amt);
}

// ==================== CAT ====================

export function CatSprite({ color = '#F4A460', fur = 'short', size = 100 }) {
  const c = color;
  const cd = darken(c, -35);
  const cl = lighten(c, 40);
  const s = size / 100;
  const sw = 3.2;

  return (
    <svg width={size} height={size * 1.12} viewBox="0 0 100 112" style={{ overflow: 'visible' }}>
      <defs>
        <radialGradient id={`catBody-${size}`} cx="40%" cy="35%">
          <stop offset="0%" stopColor={cl} />
          <stop offset="70%" stopColor={c} />
          <stop offset="100%" stopColor={cd} />
        </radialGradient>
        <radialGradient id={`catHead-${size}`} cx="42%" cy="32%">
          <stop offset="0%" stopColor={cl} />
          <stop offset="100%" stopColor={c} />
        </radialGradient>
        <filter id={`catShadow-${size}`}>
          <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodOpacity="0.15" />
        </filter>
      </defs>

      {/* Cauda atrás */}
      <path d="M74,78 Q92,60 90,38 Q89,28 84,30" fill="none" stroke={`url(#catBody-${size})`} strokeWidth={10} strokeLinecap="round" />
      <path d="M74,78 Q92,60 90,38 Q89,28 84,30" fill="none" stroke="#000" strokeWidth={sw} strokeLinecap="round" />

      {/* Corpo */}
      <ellipse cx="52" cy="78" rx="26" ry="23" fill={`url(#catBody-${size})`} stroke="#000" strokeWidth={sw} filter={`url(#catShadow-${size})`} />

      {/* Barriga */}
      <ellipse cx="47" cy="84" rx="14" ry="12" fill={lighten(c, 50)} stroke="#000" strokeWidth={1.2} opacity="0.65" />

      {/* Patas traseiras */}
      <ellipse cx="36" cy="100" rx={9} ry={6.5} fill={`url(#catBody-${size})`} stroke="#000" strokeWidth={sw} />
      <ellipse cx="63" cy="100" rx={9} ry={6.5} fill={`url(#catBody-${size})`} stroke="#000" strokeWidth={sw} />
      <ellipse cx="36" cy="102" rx={4.5} ry={2.8} fill="#FFB6C1" stroke="#000" strokeWidth={1} />
      <ellipse cx="63" cy="102" rx={4.5} ry={2.8} fill="#FFB6C1" stroke="#000" strokeWidth={1} />

      {/* Patas dianteiras */}
      <ellipse cx="39" cy="95" rx={7.5} ry={5.5} fill={`url(#catBody-${size})`} stroke="#000" strokeWidth={sw} />
      <ellipse cx="65" cy="95" rx={7.5} ry={5.5} fill={`url(#catBody-${size})`} stroke="#000" strokeWidth={sw} />
      <ellipse cx="39" cy="97" rx={3.8} ry={2.2} fill="#FFB6C1" stroke="#000" strokeWidth={1} />
      <ellipse cx="65" cy="97" rx={3.8} ry={2.2} fill="#FFB6C1" stroke="#000" strokeWidth={1} />

      {/* Cabeça */}
      <circle cx="50" cy="38" r="24" fill={`url(#catHead-${size})`} stroke="#000" strokeWidth={sw} />

      {/* Mancha clara no rosto */}
      <ellipse cx="50" cy="45" rx="12" ry="8.5" fill={lighten(c, 60)} opacity="0.45" />

      {/* Orelhas */}
      <polygon points="28,20 18,-2 38,13" fill={`url(#catBody-${size})`} stroke="#000" strokeWidth={sw} />
      <polygon points="27,18 20,2 35,13" fill="#FFB6C1" stroke="#000" strokeWidth={1.4} />
      <polygon points="72,20 82,-2 62,13" fill={`url(#catBody-${size})`} stroke="#000" strokeWidth={sw} />
      <polygon points="73,18 80,2 65,13" fill="#FFB6C1" stroke="#000" strokeWidth={1.4} />

      {/* Tufos de pelo nas orelhas */}
      {fur === 'long' && (
        <>
          <path d="M20,2 Q16,-4 14,0" fill="none" stroke={c} strokeWidth={3} strokeLinecap="round" />
          <path d="M80,2 Q84,-4 86,0" fill="none" stroke={c} strokeWidth={3} strokeLinecap="round" />
        </>
      )}

      {/* Olhos grandes kawaii */}
      <ellipse cx="38" cy="36" rx="8.5" ry={10} fill="#FFF" stroke="#000" strokeWidth={sw} />
      <ellipse cx="62" cy="36" rx="8.5" ry={10} fill="#FFF" stroke="#000" strokeWidth={sw} />
      {/* Íris */}
      <ellipse cx="39" cy="38" rx={6} ry={7.5} fill="#5B8C3E" />
      <ellipse cx="63" cy="38" rx={6} ry={7.5} fill="#5B8C3E" />
      {/* Gradiente na íris */}
      <ellipse cx="37" cy="36" rx={3} ry={4} fill="#7CAA5E" opacity="0.6" />
      <ellipse cx="61" cy="36" rx={3} ry={4} fill="#7CAA5E" opacity="0.6" />
      {/* Pupila */}
      <ellipse cx="40" cy="38" rx={3.5} ry={5} fill="#111" />
      <ellipse cx="64" cy="38" rx={3.5} ry={5} fill="#111" />
      {/* Brilhos */}
      <ellipse cx="36" cy="33" rx={3.2} ry={2.8} fill="#FFF" />
      <ellipse cx="60" cy="33" rx={3.2} ry={2.8} fill="#FFF" />
      <ellipse cx="42" cy="42" rx={1.8} ry={1.5} fill="#FFF" />
      <ellipse cx="66" cy="42" rx={1.8} ry={1.5} fill="#FFF" />

      {/* Bochechas rosadas */}
      <ellipse cx="31" cy="45" rx={5.5} ry={3.5} fill="#FFB6C1" opacity="0.5" />
      <ellipse cx="69" cy="45" rx={5.5} ry={3.5} fill="#FFB6C1" opacity="0.5" />

      {/* Nariz */}
      <ellipse cx="50" cy="46" rx={3.8} ry={2.8} fill="#FF8C94" stroke="#000" strokeWidth={1.4} />
      {/* Brilho no nariz */}
      <ellipse cx="49" cy="44.5" rx={1.2} ry={0.8} fill="#FFB6C1" opacity="0.7" />

      {/* Boca W */}
      <path d="M44,50 Q47,54 50,50 Q53,54 56,50" fill="none" stroke="#000" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />

      {/* Bigodes */}
      <line x1="18" y1="41" x2="28" y2="43" stroke="#000" strokeWidth={1.4} strokeLinecap="round" />
      <line x1="17" y1="47" x2="28" y2="47" stroke="#000" strokeWidth={1.4} strokeLinecap="round" />
      <line x1="82" y1="41" x2="72" y2="43" stroke="#000" strokeWidth={1.4} strokeLinecap="round" />
      <line x1="83" y1="47" x2="72" y2="47" stroke="#000" strokeWidth={1.4} strokeLinecap="round" />
    </svg>
  );
}

// ==================== DOG ====================

export function DogSprite({ color = '#B8B0A8', fur = 'short', size = 100 }) {
  const c = color;
  const cd = darken(c, -35);
  const cl = lighten(c, 40);
  const sw = 3.2;

  return (
    <svg width={size} height={size * 1.12} viewBox="0 0 100 112" style={{ overflow: 'visible' }}>
      <defs>
        <radialGradient id={`dogBody-${size}`} cx="40%" cy="35%">
          <stop offset="0%" stopColor={cl} />
          <stop offset="70%" stopColor={c} />
          <stop offset="100%" stopColor={cd} />
        </radialGradient>
        <filter id={`dogShadow-${size}`}>
          <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodOpacity="0.15" />
        </filter>
      </defs>

      {/* Cauda */}
      <path d="M74,70 Q94,46 90,24 Q88,16 84,20" fill="none" stroke={`url(#dogBody-${size})`} strokeWidth={9} strokeLinecap="round" />
      <path d="M74,70 Q94,46 90,24 Q88,16 84,20" fill="none" stroke="#000" strokeWidth={sw} strokeLinecap="round" />
      <ellipse cx="86" cy="20" rx={5} ry={4.5} fill={cl} stroke="#000" strokeWidth={1.5} />

      {/* Corpo */}
      <ellipse cx="48" cy="76" rx="25" ry="21" fill={`url(#dogBody-${size})`} stroke="#000" strokeWidth={sw} filter={`url(#dogShadow-${size})`} />

      {/* Barriga */}
      <ellipse cx="44" cy="82" rx={16} ry={11} fill={lighten(c, 50)} stroke="#000" strokeWidth={1.2} opacity="0.6" />

      {/* Patas traseiras */}
      <ellipse cx="34" cy="97" rx={9.5} ry={7} fill={`url(#dogBody-${size})`} stroke="#000" strokeWidth={sw} />
      <ellipse cx="61" cy="97" rx={9.5} ry={7} fill={`url(#dogBody-${size})`} stroke="#000" strokeWidth={sw} />
      <ellipse cx="31" cy="100" rx={3} ry={2} fill="#D4A574" stroke="#000" strokeWidth={1} />
      <ellipse cx="37" cy="100" rx={3} ry={2} fill="#D4A574" stroke="#000" strokeWidth={1} />
      <ellipse cx="58" cy="100" rx={3} ry={2} fill="#D4A574" stroke="#000" strokeWidth={1} />
      <ellipse cx="64" cy="100" rx={3} ry={2} fill="#D4A574" stroke="#000" strokeWidth={1} />

      {/* Patas dianteiras */}
      <ellipse cx="34" cy="91" rx={8.5} ry={6} fill={`url(#dogBody-${size})`} stroke="#000" strokeWidth={sw} />
      <ellipse cx="63" cy="91" rx={8.5} ry={6} fill={`url(#dogBody-${size})`} stroke="#000" strokeWidth={sw} />
      <ellipse cx="31" cy="93" rx={3} ry={2} fill="#D4A574" stroke="#000" strokeWidth={1} />
      <ellipse cx="37" cy="93" rx={3} ry={2} fill="#D4A574" stroke="#000" strokeWidth={1} />
      <ellipse cx="60" cy="93" rx={3} ry={2} fill="#D4A574" stroke="#000" strokeWidth={1} />
      <ellipse cx="66" cy="93" rx={3} ry={2} fill="#D4A574" stroke="#000" strokeWidth={1} />

      {/* Coleira */}
      <path d="M26,56 Q40,68 54,56" fill="none" stroke="#E74C3C" strokeWidth={5} />
      <path d="M26,56 Q40,68 54,56" fill="none" stroke="#000" strokeWidth={sw} />
      <circle cx="40" cy="64" r={6} fill="#FFD700" stroke="#000" strokeWidth={1.8} />
      <circle cx="39" cy="63" r={2} fill="#FFF" opacity="0.5" />

      {/* Cabeça */}
      <circle cx="46" cy="36" r="23" fill={`url(#dogBody-${size})`} stroke="#000" strokeWidth={sw} />

      {/* Focinho */}
      <ellipse cx="33" cy="43" rx={13} ry={9} fill={cl} stroke="#000" strokeWidth={sw} />

      {/* Orelhas caídas */}
      <ellipse cx="57" cy="20" rx={8.5} ry={14} fill={`url(#dogBody-${size})`} stroke="#000" strokeWidth={sw} transform="rotate(14,57,20)" />
      <ellipse cx="57" cy="22" rx={5} ry={10} fill="#D4A574" stroke="#000" strokeWidth={1.4} transform="rotate(14,57,20)" />
      <ellipse cx="65" cy="24" rx={8.5} ry={14} fill={`url(#dogBody-${size})`} stroke="#000" strokeWidth={sw} transform="rotate(28,65,24)" />
      <ellipse cx="65" cy="26" rx={5} ry={10} fill="#D4A574" stroke="#000" strokeWidth={1.4} transform="rotate(28,65,24)" />

      {/* Olhos grandes */}
      <ellipse cx="38" cy="33" rx={7.5} ry={9} fill="#FFF" stroke="#000" strokeWidth={sw} />
      <ellipse cx="58" cy="33" rx={7.5} ry={9} fill="#FFF" stroke="#000" strokeWidth={sw} />
      {/* Íris marrom */}
      <ellipse cx="39" cy="35" rx={5.5} ry={7} fill="#6B4226" />
      <ellipse cx="59" cy="35" rx={5.5} ry={7} fill="#6B4226" />
      <ellipse cx="37" cy="33" rx={2.5} ry={3.5} fill="#8B6240" opacity="0.5" />
      <ellipse cx="57" cy="33" rx={2.5} ry={3.5} fill="#8B6240" opacity="0.5" />
      {/* Pupila */}
      <ellipse cx="40" cy="35" rx={3.2} ry={4.5} fill="#111" />
      <ellipse cx="60" cy="35" rx={3.2} ry={4.5} fill="#111" />
      {/* Brilhos */}
      <ellipse cx="36" cy="30" rx={3} ry={2.5} fill="#FFF" />
      <ellipse cx="56" cy="30" rx={3} ry={2.5} fill="#FFF" />
      <ellipse cx="42" cy="38" rx={1.8} ry={1.5} fill="#FFF" />
      <ellipse cx="62" cy="38" rx={1.8} ry={1.5} fill="#FFF" />

      {/* Sobrancelhas fofas */}
      <path d="M30,24 Q36,20 42,24" fill="none" stroke="#000" strokeWidth={2.8} strokeLinecap="round" />
      <path d="M50,24 Q56,20 62,24" fill="none" stroke="#000" strokeWidth={2.8} strokeLinecap="round" />

      {/* Nariz grande preto */}
      <ellipse cx="29" cy="40" rx={5.5} ry={4} fill="#222" stroke="#000" strokeWidth={1.4} />
      <ellipse cx="28" cy="38.5" rx={2.5} ry={1.5} fill="#555" opacity="0.6" />

      {/* Boca */}
      <path d="M22,45 Q28,49 34,45" fill="none" stroke="#000" strokeWidth={1.6} strokeLinecap="round" />

      {/* Língua */}
      <ellipse cx="29" cy={49} rx={4.5} ry={6} fill="#FF8C94" stroke="#000" strokeWidth={1.6} />
      <line x1="29" y1="46" x2="29" y2="54" stroke="#000" strokeWidth={1.2} />

      {/* Bochechas */}
      <ellipse cx="22" cy="43" rx={4.5} ry={3} fill="#FFB6C1" opacity="0.4" />
      <ellipse cx="68" cy="43" rx={4.5} ry={3} fill="#FFB6C1" opacity="0.4" />

      {/* Pelos longos */}
      {fur === 'long' && (
        <>
          <path d="M66,16 Q76,10 74,22" fill="none" stroke={c} strokeWidth={5} strokeLinecap="round" />
          <path d="M26,54 Q20,62 22,72" fill="none" stroke={c} strokeWidth={4} strokeLinecap="round" />
          <path d="M68,56 Q76,64 72,74" fill="none" stroke={c} strokeWidth={4} strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

// ==================== OBJECTS ====================

export function HouseSprite({ color = '#FFB6C1', size = 110 }) {
  const c = color;
  const cd = darken(c, -30);
  const sw = 3.5;
  return (
    <svg width={size} height={size} viewBox="0 0 100 108" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={`hsRoof-${size}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E74C3C" />
          <stop offset="100%" stopColor="#B5302A" />
        </linearGradient>
        <linearGradient id={`hsWall-${size}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c} />
          <stop offset="100%" stopColor={cd} />
        </linearGradient>
        <filter id={`hsShadow-${size}`}>
          <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodOpacity="0.18" />
        </filter>
      </defs>

      {/* Corpo */}
      <rect x="10" y="38" width="80" height="64" rx="7" fill={`url(#hsWall-${size})`} stroke="#000" strokeWidth={sw} filter={`url(#hsShadow-${size})`} />

      {/* Telhado */}
      <polygon points="4,40 50,6 96,40" fill={`url(#hsRoof-${size})`} stroke="#000" strokeWidth={sw} strokeLinejoin="round" />

      {/* Chaminé */}
      <rect x="68" y="12" width="14" height="24" rx="3" fill="#C0392B" stroke="#000" strokeWidth={sw} />
      <rect x="66" y="10" width="18" height={6} rx="3" fill="#8B1A1A" stroke="#000" strokeWidth={2} />

      {/* Porta */}
      <path d="M37,70 Q37,47 50,47 Q63,47 63,70 Z" fill="#8B4513" stroke="#000" strokeWidth={sw} />
      {/* Detalhe da porta */}
      <path d="M40,70 Q40,50 50,50 Q60,50 60,70 Z" fill="#A0522D" />
      {/* Maçaneta */}
      <circle cx="56" cy="62" r={4.5} fill="#FFD700" stroke="#000" strokeWidth={1.8} />
      <circle cx="55" cy="61" r={1.5} fill="#FFF" opacity="0.6" />

      {/* Janela esquerda */}
      <rect x="18" y="52" width="16" height={16} rx={3} fill="#FFF9C4" stroke="#000" strokeWidth={sw} />
      <line x1="26" y1="52" x2="26" y2="68" stroke="#000" strokeWidth={2} />
      <line x1="18" y1="60" x2="34" y2="60" stroke="#000" strokeWidth={2} />
      {/* Cortina */}
      <path d="M17,50 Q26,48 35,50" fill="none" stroke="#E74C3C" strokeWidth={3} strokeLinecap="round" />

      {/* Janela direita */}
      <rect x="64" y="52" width="16" height={16} rx={3} fill="#FFF9C4" stroke="#000" strokeWidth={sw} />
      <line x1="72" y1="52" x2="72" y2="68" stroke="#000" strokeWidth={2} />
      <line x1="64" y1="60" x2="80" y2="60" stroke="#000" strokeWidth={2} />
      <path d="M63,50 Q72,48 81,50" fill="none" stroke="#E74C3C" strokeWidth={3} strokeLinecap="round" />

      {/* Flores na janela */}
      <circle cx="22" cy="56" r={2} fill="#FF69B4" stroke="#000" strokeWidth={0.8} />
      <circle cx="68" cy="56" r={2} fill="#FFD700" stroke="#000" strokeWidth={0.8} />
    </svg>
  );
}

export function BedSprite({ color = '#90EE90', size = 110 }) {
  const c = color;
  const cd = darken(c, -25);
  const sw = 3.5;
  return (
    <svg width={size} height={size} viewBox="0 0 100 90" style={{ overflow: 'visible' }}>
      {/* Estrutura */}
      <rect x="6" y="44" width="88" height={16} rx={6} fill="#8B4513" stroke="#000" strokeWidth={sw} />
      <rect x="6" y="43" width="88" height={4} fill="#A0522D" />

      {/* Cabeceira */}
      <rect x="4" y="24" width={12} height={40} rx={5} fill="#A0522D" stroke="#000" strokeWidth={sw} />
      <rect x="84" y="24" width={12} height={40} rx={5} fill="#A0522D" stroke="#000" strokeWidth={sw} />
      {/* Bolinhas na cabeceira */}
      <circle cx="10" cy="30" r={2.5} fill="#D2691E" />
      <circle cx="10" cy="40" r={2.5} fill="#D2691E" />
      <circle cx="10" cy="50" r={2.5} fill="#D2691E" />
      <circle cx="90" cy="30" r={2.5} fill="#D2691E" />
      <circle cx="90" cy="40" r={2.5} fill="#D2691E" />
      <circle cx="90" cy="50" r={2.5} fill="#D2691E" />

      {/* Colchão */}
      <rect x="12" y="38" width="76" height={16} rx={10} fill={c} stroke="#000" strokeWidth={sw} />
      <rect x="14" y="40" width="72" height={5} rx={3} fill={lighten(c, 30)} opacity="0.5" />

      {/* Listras */}
      <line x1="32" y1="38" x2="32" y2="54" stroke={cd} strokeWidth={2} opacity="0.4" />
      <line x1="50" y1="38" x2="50" y2="54" stroke={cd} strokeWidth={2} opacity="0.4" />
      <line x1="68" y1="38" x2="68" y2="54" stroke={cd} strokeWidth={2} opacity="0.4" />

      {/* Travesseiro */}
      <ellipse cx="66" cy="34" rx={18} ry={10} fill="#FFF" stroke="#000" strokeWidth={sw} />
      <ellipse cx="66" cy="33" rx={14} ry={7} fill="#F5F5F5" />

      {/* Cobertor */}
      <path d="M14,44 Q40,38 72,44 L72,54 Q40,62 14,54Z" fill={cd} stroke="#000" strokeWidth={sw} />
      <path d="M16,46 Q40,41 70,46" fill="none" stroke={lighten(c, 20)} strokeWidth={2} opacity="0.6" />

      {/* Bichinho de pelúcia */}
      <circle cx="28" cy="40" r={5} fill="#FFB6C1" stroke="#000" strokeWidth={1.2} />
      <circle cx="26" cy="39" r={1} fill="#000" />
      <circle cx="30" cy="39" r={1} fill="#000" />
    </svg>
  );
}

export function BowlSprite({ color = '#FFB6C1', type = 'food', size = 90 }) {
  const c = color;
  const cd = darken(c, -25);
  const sw = 3.5;
  const fill = type === 'food' ? '#8B4513' : '#87CEEB';
  return (
    <svg width={size} height={size} viewBox="0 0 85 78" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={`bwGrad-${size}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c} />
          <stop offset="100%" stopColor={cd} />
        </linearGradient>
      </defs>

      {/* Sombra */}
      <ellipse cx="42" cy="76" rx="28" ry={4} fill="rgba(0,0,0,0.12)" />

      {/* Base */}
      <rect x="33" y="60" width="18" height={8} rx={4} fill={`url(#bwGrad-${size})`} stroke="#000" strokeWidth={sw} />

      {/* Corpo */}
      <path d="M10,38 Q10,64 30,66 L54,66 Q74,64 74,38Z" fill={`url(#bwGrad-${size})`} stroke="#000" strokeWidth={sw} />

      {/* Borda */}
      <ellipse cx="42" cy="38" rx="32" ry={10} fill={cd} stroke="#000" strokeWidth={sw} />
      <ellipse cx="42" cy="37" rx="29" ry={7} fill={c} />

      {/* Conteúdo */}
      {type === 'food' ? (
        <>
          <ellipse cx="42" cy="40" rx="24" ry={7} fill={fill} stroke="#000" strokeWidth={2.5} />
          <ellipse cx="42" cy="39" rx="22" ry={5} fill="#A0522D" opacity="0.5" />
          {/* Ração colorida */}
          <circle cx="33" cy="39" r={3.5} fill="#8B4513" stroke="#000" strokeWidth={0.8} />
          <circle cx="42" cy="37" r={3.5} fill="#C0392B" stroke="#000" strokeWidth={0.8} />
          <circle cx="50" cy="40" r={3.5} fill="#D4A574" stroke="#000" strokeWidth={0.8} />
          <circle cx="38" cy="43" r={3.5} fill="#8B4513" stroke="#000" strokeWidth={0.8} />
          <circle cx="47" cy="42" r={3.5} fill="#C0392B" stroke="#000" strokeWidth={0.8} />
          <circle cx="55" cy="38" r={3.5} fill="#D4A574" stroke="#000" strokeWidth={0.8} />
          <circle cx="29" cy="41" r={3.5} fill="#8B4513" stroke="#000" strokeWidth={0.8} />
          {/* Carinha no pote */}
          <circle cx="36" cy="22" r={3} fill="#000" />
          <circle cx="48" cy="22" r={3} fill="#000" />
          <path d="M38,28 Q42,33 46,28" fill="none" stroke="#000" strokeWidth={2} strokeLinecap="round" />
          <ellipse cx="36" cy="21" r={1} fill="#FFF" opacity="0.6" />
          <ellipse cx="48" cy="21" r={1} fill="#FFF" opacity="0.6" />
        </>
      ) : (
        <>
          <ellipse cx="42" cy="40" rx="24" ry={7} fill={fill} stroke="#000" strokeWidth={2.5} />
          <ellipse cx="42" cy="39" rx="20" ry={5} fill="#B3E5FC" opacity="0.6" />
          {/* Ondinhas */}
          <path d="M24,38 Q32,33 40,38 Q48,43 56,38 Q60,35 62,38" fill="none" stroke="#29B6F6" strokeWidth={2.5} strokeLinecap="round" />
          <path d="M26,42 Q34,37 42,42 Q50,47 58,42" fill="none" stroke="#4FC3F7" strokeWidth={2} strokeLinecap="round" opacity="0.7" />
          {/* Gotinha */}
          <path d="M56,24 Q60,15 60,24 Q60,28 56,28Z" fill="#4FC3F7" stroke="#000" strokeWidth={1.5} />
          <ellipse cx="57" cy="23" r={1.5} fill="#FFF" opacity="0.5" />
        </>
      )}
    </svg>
  );
}

export function LitterBoxSprite({ color = '#DDA0DD', size = 110 }) {
  const c = color;
  const cd = darken(c, -25);
  const sw = 3.5;
  return (
    <svg width={size} height={size} viewBox="0 0 100 85" style={{ overflow: 'visible' }}>
      {/* Borda */}
      <rect x="6" y="20" width="88" height={16} rx={7} fill={c} stroke="#000" strokeWidth={sw} />
      <rect x="8" y="22" width="84" height={5} rx={3} fill={lighten(c, 30)} opacity="0.5" />

      {/* Corpo */}
      <rect x="10" y="32" width="80" height={46} rx={8} fill={cd} stroke="#000" strokeWidth={sw} />

      {/* Areia */}
      <rect x="14" y="38" width="72" height={36} rx={5} fill="#F5DEB3" stroke="#000" strokeWidth={2.5} />

      {/* Textura */}
      {[0,1,2,3,4,5,6,7,8,9,10,11].map(i => (
        <circle key={i} cx={20 + (i % 6) * 13} cy={46 + Math.floor(i / 6) * 13} r={2.5} fill="#D2B48C" opacity="0.7" />
      ))}

      {/* Pegada de gatinho */}
      <g transform="translate(52,54) scale(1.6)">
        <ellipse cx="0" cy="2" rx={4} ry={3.5} fill="#C4A882" stroke="#000" strokeWidth={0.7} />
        <ellipse cx="-4" cy="-3" rx={2} ry={2.5} fill="#C4A882" stroke="#000" strokeWidth={0.7} />
        <ellipse cx="1" cy="-4" rx={2} ry={2.5} fill="#C4A882" stroke="#000" strokeWidth={0.7} />
        <ellipse cx="5" cy="-2" rx={2} ry={2.5} fill="#C4A882" stroke="#000" strokeWidth={0.7} />
      </g>

      {/* Pázinha fofa */}
      <g transform="translate(78,18) rotate(-35)">
        <rect x="0" y="0" width={10} height={16} rx={3} fill="#A0522D" stroke="#000" strokeWidth={2} />
        <line x1="5" y1="18" x2="5" y2="30" stroke="#8B4513" strokeWidth={3} strokeLinecap="round" />
        <line x1="5" y1="18" x2="5" y2="30" stroke="#000" strokeWidth={1.5} strokeLinecap="round" />
      </g>

      {/* Etiqueta decorativa */}
      <rect x="35" y="68" width="30" height={14} rx={4} fill="#FFF" stroke="#000" strokeWidth={2} />
      <text x="50" y="78" fontSize="8" fontWeight="bold" textAnchor="middle" fill="#000" fontFamily="Arial">AREIA</text>
    </svg>
  );
}

export function MatSprite({ color = '#FFE4B5', patternIndex = 0, size = 120 }) {
  const c = color;
  const cd = darken(c, -20);
  const sw = 3.5;
  const icons = ['★','♥','🐟','✿'];
  const positions = [
    [{ x: 25, y: 32 }, { x: 52, y: 50 }, { x: 38, y: 68 }],
    [{ x: 35, y: 28 }, { x: 55, y: 46 }, { x: 22, y: 62 }],
    [{ x: 32, y: 40 }, { x: 55, y: 32 }, { x: 45, y: 66 }, { x: 20, y: 56 }],
    [{ x: 22, y: 36 }, { x: 48, y: 54 }, { x: 64, y: 32 }, { x: 38, y: 66 }],
  ];
  const spots = positions[patternIndex % 4];

  return (
    <svg width={size} height={size} viewBox="0 0 90 90" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={`matGrad-${size}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={c} />
          <stop offset="100%" stopColor={cd} />
        </linearGradient>
      </defs>

      {/* Tapete oval */}
      <ellipse cx="45" cy="45" rx="42" ry="40" fill={`url(#matGrad-${size})`} stroke="#000" strokeWidth={sw} />

      {/* Borda interna */}
      <ellipse cx="45" cy="45" rx="34" ry="32" fill="none" stroke={cd} strokeWidth={2.5} strokeDasharray="9,5" />

      {/* Centro decorado */}
      <ellipse cx="45" cy="45" rx="20" ry="18" fill={lighten(c, 25)} opacity="0.5" stroke="#000" strokeWidth={1} strokeDasharray="4,3" />

      {/* Ícones */}
      {spots.map((p, i) => (
        <text key={i} x={p.x} y={p.y + 4} fontSize={14} textAnchor="middle" fill={cd} stroke="#000" strokeWidth={0.4} fontWeight="bold">
          {icons[patternIndex % 4]}
        </text>
      ))}

      {/* Franjas */}
      {Array.from({length: 12}).map((_, i) => (
        <line key={i} x1={10 + i * 6.5} y1="84" x2={12 + i * 6.5} y2="92" stroke={c} strokeWidth={3.5} strokeLinecap="round" />
      ))}
    </svg>
  );
}

export function DoorSprite({ size = 90 }) {
  const sw = 3.5;
  return (
    <svg width={size} height={size} viewBox="0 0 70 100" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="doorGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8B4513" />
          <stop offset="100%" stopColor="#6B3410" />
        </linearGradient>
        <linearGradient id="doorPanel" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#D2691E" />
          <stop offset="100%" stopColor="#A0522D" />
        </linearGradient>
      </defs>

      {/* Moldura */}
      <rect x="3" y="3" width="64" height="94" rx="8" fill={`url(#doorGrad)`} stroke="#000" strokeWidth={sw} />

      {/* Porta */}
      <rect x="8" y="8" width="54" height="84" rx={6} fill={`url(#doorPanel)`} stroke="#000" strokeWidth={sw} />

      {/* Painéis */}
      <rect x="16" y="16" width="38" height={24} rx={4} fill="#8B4513" stroke="#000" strokeWidth={2} opacity="0.7" />
      <rect x="16" y="50" width="38" height={24} rx={4} fill="#8B4513" stroke="#000" strokeWidth={2} opacity="0.7" />

      {/* Placa */}
      <rect x="14" y="16" width="42" height={18} rx={5} fill="#FFF9C4" stroke="#000" strokeWidth={2.5} />
      <text x="35" y="29" fontSize={10} fontWeight="bold" textAnchor="middle" fill="#000" fontFamily="Arial">SAIR</text>

      {/* Maçaneta */}
      <circle cx="54" cy="55" r={5} fill="#FFD700" stroke="#000" strokeWidth={2} />
      <circle cx="53" cy="54" r={2} fill="#FFF" opacity="0.5" />

      {/* Dobradiças */}
      <rect x="6" y="22" width={6} height={4} rx={1} fill="#555" stroke="#000" strokeWidth={1} />
      <rect x="6" y="72" width={6} height={4} rx={1} fill="#555" stroke="#000" strokeWidth={1} />
    </svg>
  );
}

export function HoleSprite({ size = 70 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 70 50" style={{ overflow: 'visible' }}>
      <defs>
        <radialGradient id="holeGrad" cx="50%" cy="40%">
          <stop offset="0%" stopColor="#111" />
          <stop offset="100%" stopColor="#000" />
        </radialGradient>
      </defs>
      <ellipse cx="35" cy="25" rx="34" ry={14} fill="#333" stroke="#000" strokeWidth={3} />
      <ellipse cx="35" cy="23" rx="30" ry={10} fill="#222" />
      <ellipse cx="35" cy="21" rx="24" ry={7} fill={`url(#holeGrad)`} />
      <path d="M6,22 Q12,18 22,22 Q32,16 42,22 Q52,16 64,22" fill="none" stroke="#444" strokeWidth={2} />
    </svg>
  );
}

export function ToyBallSprite({ size = 70 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 66 66" style={{ overflow: 'visible' }}>
      <defs>
        <radialGradient id="ballGrad" cx="35%" cy="30%">
          <stop offset="0%" stopColor="#FF8A80" />
          <stop offset="50%" stopColor="#FF5252" />
          <stop offset="100%" stopColor="#C62828" />
        </radialGradient>
      </defs>
      <circle cx="33" cy="33" r="30" fill={`url(#ballGrad)`} stroke="#000" strokeWidth={3.5} />
      <path d="M8,22 Q32,46 58,22" fill="none" stroke="#FFD700" strokeWidth={4} strokeLinecap="round" />
      <path d="M8,44 Q32,20 58,44" fill="none" stroke="#FFF" strokeWidth={3.5} strokeLinecap="round" />
      <ellipse cx="24" cy="22" rx={6} ry={4} fill="#FFF" opacity="0.35" />
      <ellipse cx="26" cy="20" rx={3} ry={2} fill="#FFF" opacity="0.7" />
    </svg>
  );
}

export function ToyBoneSprite({ size = 70 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 70 46" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="boneGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFF" />
          <stop offset="100%" stopColor="#E8E8E8" />
        </linearGradient>
      </defs>
      <rect x="18" y="15" width="34" height={16} rx={6} fill={`url(#boneGrad)`} stroke="#000" strokeWidth={3.5} />
      <circle cx="18" cy="15" r={11} fill={`url(#boneGrad)`} stroke="#000" strokeWidth={3.5} />
      <circle cx="52" cy="15" r={11} fill={`url(#boneGrad)`} stroke="#000" strokeWidth={3.5} />
      <circle cx="18" cy="31" r={11} fill={`url(#boneGrad)`} stroke="#000" strokeWidth={3.5} />
      <circle cx="52" cy="31" r={11} fill={`url(#boneGrad)`} stroke="#000" strokeWidth={3.5} />
      {/* Sombras */}
      <ellipse cx="17" cy="17" rx={5} ry={4} fill="#D0D0D0" opacity="0.5" />
      <ellipse cx="51" cy="17" rx={5} ry={4} fill="#D0D0D0" opacity="0.5" />
      <ellipse cx="17" cy="33" rx={5} ry={4} fill="#D0D0D0" opacity="0.5" />
      <ellipse cx="51" cy="33" rx={5} ry={4} fill="#D0D0D0" opacity="0.5" />
    </svg>
  );
}

export function CushionSprite({ size = 70 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 66 56" style={{ overflow: 'visible' }}>
      <defs>
        <radialGradient id="cushGrad" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#FFB6C1" />
          <stop offset="100%" stopColor="#E8949E" />
        </radialGradient>
      </defs>
      <ellipse cx="33" cy="28" rx="31" ry={25} fill={`url(#cushGrad)`} stroke="#000" strokeWidth={3.5} />
      <ellipse cx="33" cy="26" rx="23" ry={17} fill="#FFC0CB" stroke="#000" strokeWidth={1.5} />
      <ellipse cx="33" cy="26" rx="13" ry={9} fill="none" stroke="#FF69B4" strokeWidth={1.8} strokeDasharray="5,4" />
      <circle cx="20" cy="20" r={3} fill="#FF69B4" opacity="0.4" />
      <circle cx="46" cy="20" r={3} fill="#FF69B4" opacity="0.4" />
    </svg>
  );
}

export function SecondAnimalSprite({ species = 'dog', size = 80 }) {
  if (species === 'dog') return <DogSprite color="#D4A574" fur="long" size={size} />;
  return <CatSprite color="#C0B0A0" fur="long" size={size} />;
}
