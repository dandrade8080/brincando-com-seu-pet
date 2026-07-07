import React from 'react';

export const PET_COLORS = [
  { name: 'Branco',  hex: '#F5F0EB', lum: 240 },
  { name: 'Laranja',  hex: '#F4A460', lum: 170 },
  { name: 'Cinza',   hex: '#B0A8A0', lum: 165 },
  { name: 'Marrom',  hex: '#6B4226', lum: 65 },
  { name: 'Preto',   hex: '#2C2C2C', lum: 40 },
];

export const OBJECT_COLORS = [
  { name: 'Rosa',       hex: '#FFB6C1', lum: 185 },
  { name: 'Azul',        hex: '#87CEEB', lum: 175 },
  { name: 'Verde',      hex: '#90EE90', lum: 180 },
  { name: 'Amarelo',    hex: '#FFE4B5', lum: 210 },
  { name: 'Lilás',    hex: '#DDA0DD', lum: 165 },
];

export const MAT_PATTERNS = [
  { name: 'Estrela', id: 0 },
  { name: 'Coração', id: 1 },
  { name: 'Peixinho', id: 2 },
  { name: 'Flor', id: 3 },
];

// =========== CAT SPRITE (estilo cartoon fofo) ===========

export function CatSprite({ color = '#F4A460', fur = 'short', size = 100 }) {
  const s = size / 100;
  const darkColor = adjustBrightness(color, -30);
  const innerEar = '#FFB6C1';
  const eyeWhite = '#FFFFFF';
  const eyeColor = '#2C5A2C';
  const noseColor = '#FF8C94';
  const strokeW = 3.5;

  return (
    <svg width={size} height={size} viewBox="0 0 100 120" style={{ overflow: 'visible' }}>
      {/* Sombra no chão */}
      <ellipse cx="50" cy="118" rx="30" ry="6" fill="#00000020" />

      {/* Cauda (atrás do corpo) */}
      <path d="M78,88 Q95,70 92,48 Q90,36 84,38" fill="none" stroke={color} strokeWidth={10} strokeLinecap="round" />
      <path d="M78,88 Q95,70 92,48 Q90,36 84,38" fill="none" stroke="#000" strokeWidth={strokeW} strokeLinecap="round" />

      {/* Corpo (oval rechonchudo) */}
      <ellipse cx="52" cy="82" rx="28" ry="26" fill={color} stroke="#000" strokeWidth={strokeW} />

      {/* Peito/barriga clara */}
      <ellipse cx="45" cy="88" rx="16" ry="14" fill={adjustBrightness(color, 25)} stroke="#000" strokeWidth={1.5} opacity="0.6" />

      {/* Patas traseiras */}
      <ellipse cx="34" cy="106" rx="10" ry="7" fill={color} stroke="#000" strokeWidth={strokeW} />
      <ellipse cx="62" cy="106" rx="10" ry="7" fill={color} stroke="#000" strokeWidth={strokeW} />
      {/* Almofadinhas */}
      <ellipse cx="34" cy="108" rx="5" ry="3" fill={innerEar} stroke="#000" strokeWidth={1} />
      <ellipse cx="62" cy="108" rx="5" ry="3" fill={innerEar} stroke="#000" strokeWidth={1} />

      {/* Patas dianteiras */}
      <ellipse cx="38" cy="100" rx="8" ry="6" fill={color} stroke="#000" strokeWidth={strokeW} />
      <ellipse cx="66" cy="100" rx="8" ry="6" fill={color} stroke="#000" strokeWidth={strokeW} />
      <ellipse cx="38" cy="102" rx="4" ry="2.5" fill={innerEar} stroke="#000" strokeWidth={1} />
      <ellipse cx="66" cy="102" rx="4" ry="2.5" fill={innerEar} stroke="#000" strokeWidth={1} />

      {/* Cabeça (grande e redonda) */}
      <circle cx="50" cy="42" r="26" fill={color} stroke="#000" strokeWidth={strokeW} />

      {/* Orelhas (triangulares com interior rosa) */}
      <polygon points="26,26 18,0 38,18" fill={color} stroke="#000" strokeWidth={strokeW} />
      <polygon points="25,24 20,4 35,18" fill={innerEar} stroke="#000" strokeWidth={1.5} />

      <polygon points="74,26 82,0 62,18" fill={color} stroke="#000" strokeWidth={strokeW} />
      <polygon points="75,24 80,4 65,18" fill={innerEar} stroke="#000" strokeWidth={1.5} />

      {/* Mancha na cabeça (opcional, cor mais clara) */}
      <ellipse cx="50" cy="48" rx="14" ry="10" fill={adjustBrightness(color, 20)} opacity="0.5" />

      {/* Olhos grandes estilo anime */}
      <ellipse cx="38" cy="38" rx="9" ry="10" fill={eyeWhite} stroke="#000" strokeWidth={strokeW} />
      <ellipse cx="62" cy="38" rx="9" ry="10" fill={eyeWhite} stroke="#000" strokeWidth={strokeW} />
      {/* Íris verde */}
      <ellipse cx="39" cy="40" rx="6" ry="7" fill={eyeColor} />
      <ellipse cx="63" cy="40" rx="6" ry="7" fill={eyeColor} />
      {/* Pupila */}
      <ellipse cx="39" cy="40" rx="4" ry="5" fill="#111" />
      <ellipse cx="63" cy="40" rx="4" ry="5" fill="#111" />
      {/* Brilho no olho */}
      <ellipse cx="36" cy="36" rx="3.5" ry="3" fill="#FFF" />
      <ellipse cx="60" cy="36" rx="3.5" ry="3" fill="#FFF" />
      <circle cx="42" cy="43" r="1.5" fill="#FFF" />
      <circle cx="66" cy="43" r="1.5" fill="#FFF" />

      {/* Bochechas rosadas */}
      <ellipse cx="30" cy="48" rx="5" ry="3.5" fill="#FFB6C1" opacity="0.5" />
      <ellipse cx="70" cy="48" rx="5" ry="3.5" fill="#FFB6C1" opacity="0.5" />

      {/* Nariz */}
      <ellipse cx="50" cy="48" rx="4" ry="3" fill={noseColor} stroke="#000" strokeWidth={1.5} />

      {/* Boca (formato W fofo) */}
      <path d="M44,52 Q47,56 50,52 Q53,56 56,52" fill="none" stroke="#000" strokeWidth={1.5} strokeLinecap="round" />

      {/* Bigodes */}
      <line x1="18" y1="44" x2="30" y2="46" stroke="#000" strokeWidth={1.5} strokeLinecap="round" />
      <line x1="16" y1="50" x2="30" y2="50" stroke="#000" strokeWidth={1.5} strokeLinecap="round" />
      <line x1="82" y1="44" x2="70" y2="46" stroke="#000" strokeWidth={1.5} strokeLinecap="round" />
      <line x1="84" y1="50" x2="70" y2="50" stroke="#000" strokeWidth={1.5} strokeLinecap="round" />

      {/* Pelos longos extras */}
      {fur === 'long' && (
        <>
          <path d="M82,28 Q92,24 90,34" fill="none" stroke={color} strokeWidth={5} strokeLinecap="round" />
          <path d="M18,28 Q8,24 10,34" fill="none" stroke={color} strokeWidth={5} strokeLinecap="round" />
          <path d="M32,60 Q24,70 28,76" fill="none" stroke={color} strokeWidth={5} strokeLinecap="round" />
          <path d="M72,60 Q80,70 76,76" fill="none" stroke={color} strokeWidth={5} strokeLinecap="round" />
          <ellipse cx="50" cy="80" rx="30" ry="28" fill={color} stroke="#000" strokeWidth={strokeW} />
          <ellipse cx="45" cy="86" rx="17" ry="15" fill={adjustBrightness(color, 25)} opacity="0.5" />
        </>
      )}
    </svg>
  );
}

// =========== DOG SPRITE (estilo cartoon fofo) ===========

export function DogSprite({ color = '#B0A8A0', fur = 'short', size = 100 }) {
  const s = size / 100;
  const darkColor = adjustBrightness(color, -30);
  const innerEar = '#D4A574';
  const eyeWhite = '#FFFFFF';
  const eyeColor = '#4A2810';
  const noseColor = '#222';
  const tongueColor = '#FF8C94';
  const collarColor = '#FF4444';
  const strokeW = 3.5;

  return (
    <svg width={size} height={size} viewBox="0 0 100 120" style={{ overflow: 'visible' }}>
      {/* Sombra */}
      <ellipse cx="50" cy="118" rx="30" ry="6" fill="#00000020" />

      {/* Cauda (feliz, levantada) */}
      <path d="M75,75 Q92,50 88,30 Q86,22 82,26" fill="none" stroke={color} strokeWidth={9} strokeLinecap="round" />
      <path d="M75,75 Q92,50 88,30 Q86,22 82,26" fill="none" stroke="#000" strokeWidth={strokeW} strokeLinecap="round" />
      {/* Ponta da cauda mais clara */}
      <circle cx="84" cy="26" r="5" fill={adjustBrightness(color, 30)} stroke="#000" strokeWidth={1.5} />

      {/* Corpo (oval) */}
      <ellipse cx="48" cy="80" rx="27" ry="23" fill={color} stroke="#000" strokeWidth={strokeW} />

      {/* Barriga clara */}
      <ellipse cx="44" cy="86" rx="18" ry="13" fill={adjustBrightness(color, 30)} stroke="#000" strokeWidth={1.5} opacity="0.6" />

      {/* Patas traseiras */}
      <ellipse cx="32" cy="104" rx="10" ry="8" fill={color} stroke="#000" strokeWidth={strokeW} />
      <ellipse cx="62" cy="104" rx="10" ry="8" fill={color} stroke="#000" strokeWidth={strokeW} />
      {/* Almofadinhas */}
      <ellipse cx="29" cy="107" rx="3" ry="2" fill={innerEar} stroke="#000" strokeWidth={1} />
      <ellipse cx="35" cy="107" rx="3" ry="2" fill={innerEar} stroke="#000" strokeWidth={1} />
      <ellipse cx="59" cy="107" rx="3" ry="2" fill={innerEar} stroke="#000" strokeWidth={1} />
      <ellipse cx="65" cy="107" rx="3" ry="2" fill={innerEar} stroke="#000" strokeWidth={1} />

      {/* Patas dianteiras */}
      <ellipse cx="32" cy="97" rx="9" ry="7" fill={color} stroke="#000" strokeWidth={strokeW} />
      <ellipse cx="64" cy="97" rx="9" ry="7" fill={color} stroke="#000" strokeWidth={strokeW} />
      <ellipse cx="29" cy="99" rx="3.5" ry="2.5" fill={innerEar} stroke="#000" strokeWidth={1} />
      <ellipse cx="35" cy="99" rx="3.5" ry="2.5" fill={innerEar} stroke="#000" strokeWidth={1} />
      <ellipse cx="61" cy="99" rx="3.5" ry="2.5" fill={innerEar} stroke="#000" strokeWidth={1} />
      <ellipse cx="67" cy="99" rx="3.5" ry="2.5" fill={innerEar} stroke="#000" strokeWidth={1} />

      {/* Cabeça (grande e redonda) */}
      <circle cx="46" cy="40" r="25" fill={color} stroke="#000" strokeWidth={strokeW} />

      {/* Focinho (oval saliente) */}
      <ellipse cx="34" cy="46" rx="14" ry="10" fill={adjustBrightness(color, 20)} stroke="#000" strokeWidth={strokeW} />

      {/* Orelhas caídas (floppy) */}
      <ellipse cx="58" cy="24" rx="10" ry="16" fill={color} stroke="#000" strokeWidth={strokeW} transform="rotate(15,58,24)" />
      <ellipse cx="58" cy="26" rx="6" ry="12" fill={innerEar} stroke="#000" strokeWidth={1.5} transform="rotate(15,58,24)" />
      <ellipse cx="66" cy="28" rx="10" ry="16" fill={color} stroke="#000" strokeWidth={strokeW} transform="rotate(30,66,28)" />
      <ellipse cx="66" cy="30" rx="6" ry="12" fill={innerEar} stroke="#000" strokeWidth={1.5} transform="rotate(30,66,28)" />

      {/* Olhos grandes */}
      <ellipse cx="38" cy="36" rx="8" ry="9" fill={eyeWhite} stroke="#000" strokeWidth={strokeW} />
      <ellipse cx="58" cy="36" rx="8" ry="9" fill={eyeWhite} stroke="#000" strokeWidth={strokeW} />
      {/* Íris marrom */}
      <ellipse cx="39" cy="38" rx="5.5" ry="6.5" fill={eyeColor} />
      <ellipse cx="59" cy="38" rx="5.5" ry="6.5" fill={eyeColor} />
      {/* Pupila */}
      <ellipse cx="39" cy="38" rx="3.5" ry="4.5" fill="#111" />
      <ellipse cx="59" cy="38" rx="3.5" ry="4.5" fill="#111" />
      {/* Brilho */}
      <ellipse cx="36" cy="34" rx="3" ry="2.5" fill="#FFF" />
      <ellipse cx="56" cy="34" rx="3" ry="2.5" fill="#FFF" />
      <circle cx="41" cy="41" r="1.5" fill="#FFF" />
      <circle cx="61" cy="41" r="1.5" fill="#FFF" />

      {/* Sobrancelhas fofas */}
      <path d="M30,27 Q36,23 42,27" fill="none" stroke="#000" strokeWidth={2.5} strokeLinecap="round" />
      <path d="M50,27 Q56,23 62,27" fill="none" stroke="#000" strokeWidth={2.5} strokeLinecap="round" />

      {/* Nariz */}
      <ellipse cx="32" cy="43" rx="5" ry="4" fill={noseColor} stroke="#000" strokeWidth={1.5} />

      {/* Boca */}
      <path d="M26,48 Q32,52 36,48" fill="none" stroke="#000" strokeWidth={1.5} strokeLinecap="round" />

      {/* Língua para fora */}
      <ellipse cx="31" cy="52" rx="4" ry="5" fill={tongueColor} stroke="#000" strokeWidth={1.5} />
      <line x1="31" y1="49" x2="31" y2="55" stroke="#000" strokeWidth={1} />

      {/* Coleira */}
      <path d="M26,56 Q40,68 54,56" fill="none" stroke={collarColor} strokeWidth={4} />
      <path d="M26,56 Q40,68 54,56" fill="none" stroke="#000" strokeWidth={strokeW} />
      {/* Pingente */}
      <circle cx="40" cy="65" r="5" fill="#FFD700" stroke="#000" strokeWidth={1.5} />

      {/* Bochechas */}
      <ellipse cx="22" cy="46" rx="4" ry="3" fill="#FFB6C1" opacity="0.4" />
      <ellipse cx="68" cy="46" rx="4" ry="3" fill="#FFB6C1" opacity="0.4" />

      {/* Pelos longos */}
      {fur === 'long' && (
        <>
          <path d="M68,20 Q78,14 76,24" fill="none" stroke={color} strokeWidth={5} strokeLinecap="round" />
          <path d="M28,62 Q20,72 24,80" fill="none" stroke={color} strokeWidth={5} strokeLinecap="round" />
          <path d="M70,62 Q78,72 74,80" fill="none" stroke={color} strokeWidth={5} strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

// =========== OBJECT SPRITES ===========

export function HouseSprite({ color = '#87CEEB', size = 110 }) {
  const strokeW = 3.5;
  return (
    <svg width={size} height={size} viewBox="0 0 100 110" style={{ overflow: 'visible' }}>
      {/* Sombra */}
      <ellipse cx="50" cy="108" rx="40" ry="5" fill="#00000020" />
      {/* Base */}
      <rect x="10" y="40" width="80" height="62" rx="8" fill={color} stroke="#000" strokeWidth={strokeW} />
      {/* Telhado triangular */}
      <polygon points="5,42 50,8 95,42" fill="#E74C3C" stroke="#000" strokeWidth={strokeW} />
      {/* Porta em arco */}
      <path d="M38,72 Q38,48 50,48 Q62,48 62,72 Z" fill="#8B4513" stroke="#000" strokeWidth={strokeW} />
      {/* Maçaneta */}
      <circle cx="56" cy="64" r="3.5" fill="#FFD700" stroke="#000" strokeWidth={1.5} />
      {/* Janela esquerda */}
      <rect x="20" y="54" width="16" height="14" rx="4" fill="#FFF9C4" stroke="#000" strokeWidth={strokeW} />
      <line x1="28" y1="54" x2="28" y2="68" stroke="#000" strokeWidth={1.5} />
      <line x1="20" y1="61" x2="36" y2="61" stroke="#000" strokeWidth={1.5} />
      {/* Janela direita com flores */}
      <rect x="64" y="54" width="16" height="14" rx="4" fill="#FFF9C4" stroke="#000" strokeWidth={strokeW} />
      <line x1="72" y1="54" x2="72" y2="68" stroke="#000" strokeWidth={1.5} />
      <line x1="64" y1="61" x2="80" y2="61" stroke="#000" strokeWidth={1.5} />
      {/* Chaminé */}
      <rect x="68" y="15" width="14" height="24" rx="3" fill="#C0392B" stroke="#000" strokeWidth={strokeW} />
      {/* Coração na porta */}
      <path d="M48,56 Q48,52 52,52 Q56,52 56,56 Q56,60 52,63 Q48,60 48,56Z" fill="#FF8C94" stroke="#000" strokeWidth={1} transform="scale(0.6) translate(32,30)" />
    </svg>
  );
}

export function BedSprite({ color = '#90EE90', size = 110 }) {
  const strokeW = 3.5;
  return (
    <svg width={size} height={size} viewBox="0 0 100 90" style={{ overflow: 'visible' }}>
      {/* Estrutura de madeira */}
      <rect x="8" y="48" width="84" height="14" rx="6" fill="#8B4513" stroke="#000" strokeWidth={strokeW} />
      {/* Cabeceira */}
      <rect x="6" y="28" width="10" height="36" rx="5" fill="#A0522D" stroke="#000" strokeWidth={strokeW} />
      <rect x="84" y="28" width="10" height="36" rx="5" fill="#A0522D" stroke="#000" strokeWidth={strokeW} />
      {/* Colchão */}
      <rect x="12" y="42" width="76" height="14" rx="10" fill={color} stroke="#000" strokeWidth={strokeW} />
      {/* Listras no colchão */}
      <line x1="30" y1="44" x2="30" y2="54" stroke="#000" strokeWidth={1} opacity="0.3" />
      <line x1="50" y1="44" x2="50" y2="54" stroke="#000" strokeWidth={1} opacity="0.3" />
      <line x1="70" y1="44" x2="70" y2="54" stroke="#000" strokeWidth={1} opacity="0.3" />
      {/* Travesseiro */}
      <ellipse cx="70" cy="38" rx="18" ry="10" fill="#FFFFFF" stroke="#000" strokeWidth={strokeW} />
      {/* Cobertor */}
      <path d="M16,44 Q40,40 70,44 L70,54 Q40,60 16,54Z" fill={adjustBrightness(color, -15)} stroke="#000" strokeWidth={strokeW} />
      {/* Estrelinha no cobertor */}
      <text x="40" y="52" fontSize="8" textAnchor="middle" fill="#FFD700" stroke="#000" strokeWidth={0.3}>★</text>
    </svg>
  );
}

export function BowlSprite({ color = '#FFB6C1', type = 'food', size = 90 }) {
  const strokeW = 3.5;
  const innerColor = type === 'food' ? '#8B4513' : '#87CEEB';
  return (
    <svg width={size} height={size} viewBox="0 0 90 80" style={{ overflow: 'visible' }}>
      {/* Sombra */}
      <ellipse cx="45" cy="78" rx="30" ry="4" fill="#00000020" />
      {/* Base do pote */}
      <rect x="35" y="62" width="20" height="8" rx="4" fill={color} stroke="#000" strokeWidth={strokeW} />
      {/* Corpo do pote */}
      <path d="M12,38 Q12,62 30,64 L60,64 Q78,62 78,38Z" fill={color} stroke="#000" strokeWidth={strokeW} />
      {/* Borda superior */}
      <ellipse cx="45" cy="38" rx="33" ry="10" fill={adjustBrightness(color, -10)} stroke="#000" strokeWidth={strokeW} />
      {/* Conteúdo */}
      {type === 'food' ? (
        <>
          <ellipse cx="45" cy="40" rx="26" ry="7" fill={innerColor} stroke="#000" strokeWidth={2} />
          {/* Ração em formato de estrelinha/bolinha */}
          <circle cx="35" cy="39" r="3" fill="#5D3A1A" stroke="#000" strokeWidth={0.8} />
          <circle cx="43" cy="37" r="3" fill="#5D3A1A" stroke="#000" strokeWidth={0.8} />
          <circle cx="51" cy="40" r="3" fill="#5D3A1A" stroke="#000" strokeWidth={0.8} />
          <circle cx="38" cy="43" r="3" fill="#5D3A1A" stroke="#000" strokeWidth={0.8} />
          <circle cx="47" cy="42" r="3" fill="#5D3A1A" stroke="#000" strokeWidth={0.8} />
          <circle cx="55" cy="37" r="3" fill="#5D3A1A" stroke="#000" strokeWidth={0.8} />
          <circle cx="30" cy="41" r="3" fill="#5D3A1A" stroke="#000" strokeWidth={0.8} />
          {/* Carinha feliz no pote */}
          <circle cx="36" cy="22" r="2.5" fill="#000" />
          <circle cx="54" cy="22" r="2.5" fill="#000" />
          <path d="M40,28 Q45,32 50,28" fill="none" stroke="#000" strokeWidth={1.5} strokeLinecap="round" />
        </>
      ) : (
        <>
          <ellipse cx="45" cy="40" rx="26" ry="7" fill={innerColor} stroke="#000" strokeWidth={2} />
          {/* Ondinhas na água */}
          <path d="M28,38 Q35,35 42,38 Q49,41 56,38 Q63,35 62,38" fill="none" stroke="#4FC3F7" strokeWidth={2} strokeLinecap="round" />
          {/* Gotinha decorativa */}
          <path d="M55,26 Q58,22 58,26 Q58,30 55,30Z" fill="#4FC3F7" stroke="#000" strokeWidth={1} />
        </>
      )}
    </svg>
  );
}

export function LitterBoxSprite({ color = '#DDA0DD', size = 110 }) {
  const strokeW = 3.5;
  return (
    <svg width={size} height={size} viewBox="0 0 100 85" style={{ overflow: 'visible' }}>
      {/* Borda elevada */}
      <rect x="8" y="22" width="84" height="14" rx="6" fill={color} stroke="#000" strokeWidth={strokeW} />
      {/* Caixa */}
      <rect x="12" y="32" width="76" height="44" rx="8" fill={color} stroke="#000" strokeWidth={strokeW} />
      {/* Interior (areia) */}
      <rect x="16" y="38" width="68" height="34" rx="4" fill="#F5DEB3" stroke="#000" strokeWidth={2} />
      {/* Textura da areia */}
      {[...Array(10)].map((_, i) => (
        <circle key={i} cx={22 + (i % 5) * 14} cy={46 + Math.floor(i / 5) * 14} r="2.5" fill="#D2B48C" />
      ))}
      {/* Pegada de gatinho */}
      <g transform="translate(50,52) scale(1.3)">
        <ellipse cx="0" cy="2" rx="4" ry="3.5" fill="#C4A882" stroke="#000" strokeWidth={0.8} />
        <ellipse cx="-4" cy="-3" rx="2" ry="2.5" fill="#C4A882" stroke="#000" strokeWidth={0.8} />
        <ellipse cx="1" cy="-4" rx="2" ry="2.5" fill="#C4A882" stroke="#000" strokeWidth={0.8} />
        <ellipse cx="5" cy="-2" rx="2" ry="2.5" fill="#C4A882" stroke="#000" strokeWidth={0.8} />
      </g>
      {/* Pázinha */}
      <line x1="80" y1="26" x2="74" y2="34" stroke="#8B4513" strokeWidth={3} strokeLinecap="round" />
      <rect x="70" y="32" width="8" height="10" rx="2" fill="#A0522D" stroke="#000" strokeWidth={1.5} transform="rotate(-30,74,37)" />
    </svg>
  );
}

export function MatSprite({ color = '#FFE4B5', patternIndex = 0, size = 120 }) {
  const strokeW = 3.5;
  const patterns = [
    { name: 'Estrela', render: (cx, cy) => (
      <text x={cx} y={cy+3} fontSize="12" textAnchor="middle" fill={adjustBrightness(color, -20)} stroke="#000" strokeWidth={0.3}>★</text>
    )},
    { name: 'Coração', render: (cx, cy) => (
      <text x={cx} y={cy+3} fontSize="10" textAnchor="middle" fill="#FF8C94" stroke="#000" strokeWidth={0.3}>♥</text>
    )},
    { name: 'Peixinho', render: (cx, cy) => (
      <path d={`M${cx-6},${cy} Q${cx-3},${cy-5} ${cx},${cy} Q${cx+3},${cy-5} ${cx+6},${cy}`} fill="none" stroke="#4FC3F7" strokeWidth={2} strokeLinecap="round" />
    )},
    { name: 'Flor', render: (cx, cy) => (
      <text x={cx} y={cy+3} fontSize="10" textAnchor="middle" fill="#FF69B4" stroke="#000" strokeWidth={0.3}>✿</text>
    )},
  ];

  const positions = [
    [{ cx: 28, cy: 30 }, { cx: 55, cy: 50 }, { cx: 40, cy: 68 }],
    [{ cx: 38, cy: 28 }, { cx: 58, cy: 45 }, { cx: 25, cy: 60 }],
    [{ cx: 35, cy: 40 }, { cx: 55, cy: 32 }, { cx: 45, cy: 65 }, { cx: 22, cy: 55 }],
    [{ cx: 25, cy: 38 }, { cx: 50, cy: 55 }, { cx: 65, cy: 32 }, { cx: 40, cy: 65 }],
  ];

  const spots = positions[patternIndex % positions.length];
  const pat = patterns[patternIndex % patterns.length];

  return (
    <svg width={size} height={size} viewBox="0 0 90 90" style={{ overflow: 'visible' }}>
      {/* Tapete oval */}
      <ellipse cx="45" cy="45" rx="40" ry="38" fill={color} stroke="#000" strokeWidth={strokeW} />
      {/* Borda decorativa */}
      <ellipse cx="45" cy="45" rx="32" ry="30" fill="none" stroke={adjustBrightness(color, -15)} strokeWidth={2} strokeDasharray="8,4" />
      {/* Franjas */}
      {[...Array(10)].map((_, i) => (
        <line key={i} x1={14 + i * 7} y1="82" x2={16 + i * 7} y2="88" stroke={color} strokeWidth={3} strokeLinecap="round" />
      ))}
      {/* Padrões decorativos */}
      {spots.map((s, i) => (
        <g key={i}>
          {pat.render(s.cx, s.cy)}
        </g>
      ))}
    </svg>
  );
}

export function DoorSprite({ size = 90 }) {
  const strokeW = 3.5;
  return (
    <svg width={size} height={size} viewBox="0 0 70 100" style={{ overflow: 'visible' }}>
      {/* Moldura */}
      <rect x="5" y="5" width="60" height="90" rx="8" fill="#8B4513" stroke="#000" strokeWidth={strokeW} />
      {/* Porta */}
      <rect x="10" y="10" width="50" height="80" rx="6" fill="#D2691E" stroke="#000" strokeWidth={strokeW} />
      {/* Painéis */}
      <rect x="18" y="18" width="34" height="22" rx="4" fill="#A0522D" stroke="#000" strokeWidth={2} />
      <rect x="18" y="50" width="34" height="22" rx="4" fill="#A0522D" stroke="#000" strokeWidth={2} />
      {/* Maçaneta */}
      <circle cx="52" cy="55" r="4" fill="#FFD700" stroke="#000" strokeWidth={1.5} />
      {/* Placa */}
      <rect x="16" y="18" width="38" height="16" rx="4" fill="#FFF9C4" stroke="#000" strokeWidth={2} />
      <text x="35" y="30" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#000" fontFamily="Arial">SAIR</text>
    </svg>
  );
}

export function HoleSprite({ size = 70 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 70 50" style={{ overflow: 'visible' }}>
      <ellipse cx="35" cy="25" rx="32" ry="14" fill="#1a1a1a" stroke="#000" strokeWidth={3} />
      <ellipse cx="35" cy="23" rx="28" ry="10" fill="#0d0d0d" />
      <ellipse cx="35" cy="21" rx="22" ry="7" fill="#000" />
      <path d="M8,22 Q12,18 20,22 Q28,16 38,22 Q48,16 58,22" fill="none" stroke="#333" strokeWidth={2} />
    </svg>
  );
}

export function ToyBallSprite({ size = 70 }) {
  const strokeW = 3;
  return (
    <svg width={size} height={size} viewBox="0 0 65 65" style={{ overflow: 'visible' }}>
      <defs>
        <radialGradient id="ballShine" cx="35%" cy="30%" r="50%">
          <stop offset="0%" stopColor="#FFF" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#FFF" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="28" fill="#FF6347" stroke="#000" strokeWidth={strokeW} />
      <path d="M10,22 Q32,44 54,22" fill="none" stroke="#FFD700" strokeWidth={3} />
      <path d="M10,42 Q32,20 54,42" fill="none" stroke="#FFF" strokeWidth={3} />
      <circle cx="32" cy="32" r="28" fill="url(#ballShine)" />
      <circle cx="26" cy="24" r="4" fill="#FFF" opacity="0.5" />
    </svg>
  );
}

export function ToyBoneSprite({ size = 70 }) {
  const strokeW = 3;
  return (
    <svg width={size} height={size} viewBox="0 0 70 45" style={{ overflow: 'visible' }}>
      <rect x="18" y="15" width="34" height="14" rx="5" fill="#FFF" stroke="#000" strokeWidth={strokeW} />
      <circle cx="18" cy="15" r="9" fill="#FFF" stroke="#000" strokeWidth={strokeW} />
      <circle cx="52" cy="15" r="9" fill="#FFF" stroke="#000" strokeWidth={strokeW} />
      <circle cx="18" cy="29" r="9" fill="#FFF" stroke="#000" strokeWidth={strokeW} />
      <circle cx="52" cy="29" r="9" fill="#FFF" stroke="#000" strokeWidth={strokeW} />
      <circle cx="16" cy="15" r="4" fill="#E8E8E8" />
      <circle cx="50" cy="15" r="4" fill="#E8E8E8" />
      <circle cx="16" cy="29" r="4" fill="#E8E8E8" />
      <circle cx="50" cy="29" r="4" fill="#E8E8E8" />
    </svg>
  );
}

export function CushionSprite({ size = 70 }) {
  const strokeW = 3;
  return (
    <svg width={size} height={size} viewBox="0 0 65 55" style={{ overflow: 'visible' }}>
      <ellipse cx="32" cy="28" rx="30" ry="24" fill="#FFB6C1" stroke="#000" strokeWidth={strokeW} />
      <ellipse cx="32" cy="26" rx="22" ry="16" fill="#FFC0CB" stroke="#000" strokeWidth={1.5} />
      <ellipse cx="32" cy="26" rx="12" ry="8" fill="none" stroke="#FF69B4" strokeWidth={1.5} strokeDasharray="4,3" />
    </svg>
  );
}

export function SecondAnimalSprite({ species = 'dog', size = 80 }) {
  if (species === 'dog') {
    return <DogSprite color="#D4A574" fur="long" size={size} />;
  }
  return <CatSprite color="#C0B0A0" fur="long" size={size} />;
}

// =========== HELPER ===========

function adjustBrightness(hex, amount) {
  let r, g, b;
  if (hex.startsWith('#')) {
    const num = parseInt(hex.slice(1), 16);
    r = (num >> 16) & 0xFF;
    g = (num >> 8) & 0xFF;
    b = num & 0xFF;
  } else {
    return hex;
  }
  r = Math.max(0, Math.min(255, r + amount));
  g = Math.max(0, Math.min(255, g + amount));
  b = Math.max(0, Math.min(255, b + amount));
  return `rgb(${r},${g},${b})`;
}
