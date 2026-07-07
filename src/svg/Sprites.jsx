import React from 'react';

// ============================================================
// Sprites SVG com contornos grossos e alto contraste
// Todas as cores recebidas por prop (hex), garantindo
// diferenciação por luminância para acromatopsia
//
// No futuro, trocar os SVGs inline por imagens PNG/SVG
// externas com assets mais elaborados
// ============================================================

// Mapeamento de nome de cor -> hex com bom contraste em escala de cinza
export const PET_COLORS = [
  { name: 'Branco',  hex: '#E8E8E8', lum: 230 },
  { name: 'Cinza',   hex: '#9E9E9E', lum: 158 },
  { name: 'Marrom',  hex: '#4E342E', lum: 55 },
  { name: 'Preto',   hex: '#212121', lum: 33 },
];

export const OBJECT_COLORS = [
  { name: 'Claro',      hex: '#D7CCC8', lum: 200 },
  { name: 'Areia',      hex: '#A1887F', lum: 140 },
  { name: 'Escuro',     hex: '#4E342E', lum: 55 },
  { name: 'Azulado',    hex: '#37474F', lum: 70 },
];

export const MAT_PATTERNS = [
  { name: 'Patinha 1', id: 0 },
  { name: 'Patinha 2', id: 1 },
  { name: 'Patinha 3', id: 2 },
  { name: 'Patinha 4', id: 3 },
];

// =========== PET SPRITES ===========

export function CatSprite({ color = '#9E9E9E', fur = 'short', size = 80 }) {
  const sc = size / 80;
  const strokeW = 3;
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" style={{ overflow: 'visible' }}>
      {/* Corpo */}
      <ellipse cx="35" cy="55" rx="20" ry="18" fill={color} stroke="#000" strokeWidth={strokeW} />
      {/* Cabeça */}
      <circle cx="32" cy="32" r="16" fill={color} stroke="#000" strokeWidth={strokeW} />
      {/* Orelhas */}
      <polygon points="18,22 14,4 28,16" fill={color} stroke="#000" strokeWidth={strokeW} />
      <polygon points="46,22 50,4 36,16" fill={color} stroke="#000" strokeWidth={strokeW} />
      {/* Olhos (grandes, expressivos) */}
      <ellipse cx="26" cy="30" rx="5" ry="6" fill="#000" stroke="#000" strokeWidth={1} />
      <ellipse cx="38" cy="30" rx="5" ry="6" fill="#000" stroke="#000" strokeWidth={1} />
      {/* Nariz */}
      <polygon points="30,36 34,36 32,38" fill="#FF6666" stroke="#000" strokeWidth={1.5} />
      {/* Boca */}
      <line x1="29" y1="39" x2="35" y2="39" stroke="#000" strokeWidth={1.5} />
      {/* Bigodes */}
      <line x1="16" y1="34" x2="22" y2="36" stroke="#000" strokeWidth={1.5} />
      <line x1="16" y1="38" x2="22" y2="38" stroke="#000" strokeWidth={1.5} />
      <line x1="48" y1="34" x2="42" y2="36" stroke="#000" strokeWidth={1.5} />
      <line x1="48" y1="38" x2="42" y2="38" stroke="#000" strokeWidth={1.5} />
      {/* Cauda */}
      <path d="M55,50 Q70,40 65,30 Q63,26 60,28" fill="none" stroke={color} strokeWidth={strokeW * 2} strokeLinecap="round" />
      <path d="M55,50 Q70,40 65,30" fill="none" stroke="#000" strokeWidth={strokeW} />
      {/* Patas */}
      <ellipse cx="24" cy="70" rx="6" ry="4" fill={color} stroke="#000" strokeWidth={strokeW} />
      <ellipse cx="44" cy="70" rx="6" ry="4" fill={color} stroke="#000" strokeWidth={strokeW} />
      {/* Pelos extras (fur = long) */}
      {fur === 'long' && (
        <>
          <path d="M14,16 Q8,8 6,14" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" />
          <path d="M50,16 Q56,8 58,14" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" />
          <path d="M16,48 Q12,52 14,56" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

export function DogSprite({ color = '#9E9E9E', fur = 'short', size = 80 }) {
  const strokeW = 3;
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" style={{ overflow: 'visible' }}>
      {/* Corpo */}
      <ellipse cx="38" cy="50" rx="22" ry="16" fill={color} stroke="#000" strokeWidth={strokeW} />
      {/* Cabeça */}
      <circle cx="30" cy="28" r="14" fill={color} stroke="#000" strokeWidth={strokeW} />
      {/* Focinho */}
      <ellipse cx="22" cy="32" rx="8" ry="6" fill={color} stroke="#000" strokeWidth={strokeW} />
      {/* Orelhas caídas */}
      <ellipse cx="38" cy="16" rx="6" ry="10" fill={color} stroke="#000" strokeWidth={strokeW} transform="rotate(15,38,16)" />
      <ellipse cx="44" cy="18" rx="6" ry="10" fill={color} stroke="#000" strokeWidth={strokeW} transform="rotate(30,44,18)" />
      {/* Olhos */}
      <circle cx="26" cy="27" r="3" fill="#000" />
      <circle cx="35" cy="26" r="3" fill="#000" />
      {/* Nariz */}
      <ellipse cx="18" cy="31" rx="3" ry="2.5" fill="#000" />
      {/* Boca */}
      <path d="M14,35 Q18,38 22,35" fill="none" stroke="#000" strokeWidth={1.5} />
      {/* Língua */}
      {fur === 'short' && (
        <ellipse cx="18" cy="37" rx="2.5" ry="3" fill="#FF8888" stroke="#000" strokeWidth={1} />
      )}
      {/* Cauda (levantada) */}
      <path d="M60,45 Q72,32 68,22" fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" />
      <path d="M60,45 Q72,32 68,22" fill="none" stroke="#000" strokeWidth={strokeW} />
      {/* Patas */}
      <rect x="26" y="62" width="7" height="8" rx="3" fill={color} stroke="#000" strokeWidth={strokeW} />
      <rect x="43" y="62" width="7" height="8" rx="3" fill={color} stroke="#000" strokeWidth={strokeW} />
      {/* Coleira */}
      <path d="M24,38 Q30,44 36,38" fill="none" stroke="#CC0000" strokeWidth={3} />
      {/* Pelos extras */}
      {fur === 'long' && (
        <>
          <path d="M48,14 Q56,10 54,18" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" />
          <path d="M18,44 Q12,48 16,52" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

// =========== OBJECT SPRITES ===========

export function HouseSprite({ color = '#A1887F', size = 90 }) {
  const strokeW = 3;
  return (
    <svg width={size} height={size} viewBox="0 0 90 90" style={{ overflow: 'visible' }}>
      {/* Base */}
      <rect x="10" y="35" width="70" height="50" rx="2" fill={color} stroke="#000" strokeWidth={strokeW} />
      {/* Telhado */}
      <polygon points="5,38 45,5 85,38" fill="#5D4037" stroke="#000" strokeWidth={strokeW} />
      {/* Porta */}
      <rect x="35" y="55" width="20" height="28" rx="10" fill="#3E2723" stroke="#000" strokeWidth={2} />
      {/* Maçaneta */}
      <circle cx="50" cy="70" r="2.5" fill="#FFD600" stroke="#000" strokeWidth={1} />
      {/* Janela */}
      <rect x="18" y="48" width="14" height="12" rx="1" fill="#90CAF9" stroke="#000" strokeWidth={2} />
    </svg>
  );
}

export function BedSprite({ color = '#D7CCC8', size = 90 }) {
  const strokeW = 3;
  return (
    <svg width={size} height={size} viewBox="0 0 90 90" style={{ overflow: 'visible' }}>
      {/* Estrutura */}
      <rect x="8" y="40" width="74" height="12" rx="4" fill="#5D4037" stroke="#000" strokeWidth={strokeW} />
      {/* Cabeceira */}
      <rect x="8" y="25" width="8" height="28" rx="4" fill="#5D4037" stroke="#000" strokeWidth={strokeW} />
      {/* Colchão */}
      <rect x="14" y="36" width="66" height="12" rx="6" fill={color} stroke="#000" strokeWidth={strokeW} />
      {/* Travesseiro */}
      <rect x="62" y="32" width="20" height="8" rx="4" fill="#FFFFFF" stroke="#000" strokeWidth={2} />
      {/* Cobertor dobrado */}
      <rect x="20" y="42" width="30" height="6" rx="3" fill={color} stroke="#000" strokeWidth={1.5} opacity="0.7" />
    </svg>
  );
}

export function BowlSprite({ color = '#D7CCC8', type = 'food', size = 80 }) {
  const strokeW = 3;
  const innerColor = type === 'food' ? '#5D4037' : '#4FC3F7';
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" style={{ overflow: 'visible' }}>
      {/* Pote */}
      <ellipse cx="40" cy="48" rx="28" ry="10" fill={color} stroke="#000" strokeWidth={strokeW} />
      <path d="M12,48 Q12,60 40,60 Q68,60 68,48" fill={color} stroke="#000" strokeWidth={strokeW} />
      {/* Conteúdo */}
      <ellipse cx="40" cy="47" rx="22" ry="7" fill={innerColor} stroke="#000" strokeWidth={1.5} />
      {type === 'food' ? (
        // Ração (bolinhas)
        <>
          <circle cx="34" cy="46" r="2" fill="#3E2723" stroke="#000" strokeWidth={0.5} />
          <circle cx="40" cy="44" r="2" fill="#3E2723" stroke="#000" strokeWidth={0.5} />
          <circle cx="46" cy="47" r="2" fill="#3E2723" stroke="#000" strokeWidth={0.5} />
          <circle cx="37" cy="49" r="2" fill="#3E2723" stroke="#000" strokeWidth={0.5} />
          <circle cx="44" cy="45" r="2" fill="#3E2723" stroke="#000" strokeWidth={0.5} />
        </>
      ) : (
        // Água
        <ellipse cx="40" cy="46" rx="18" ry="5" fill="#81D4FA" stroke="#000" strokeWidth={1} opacity="0.8" />
      )}
    </svg>
  );
}

export function LitterBoxSprite({ color = '#A1887F', size = 90 }) {
  const strokeW = 3;
  return (
    <svg width={size} height={size} viewBox="0 0 90 90" style={{ overflow: 'visible' }}>
      {/* Caixa */}
      <rect x="10" y="30" width="70" height="40" rx="6" fill={color} stroke="#000" strokeWidth={strokeW} />
      {/* Borda elevada */}
      <rect x="6" y="25" width="78" height="12" rx="4" fill={color} stroke="#000" strokeWidth={strokeW} />
      {/* Areia visível */}
      <rect x="14" y="35" width="62" height="30" rx="2" fill="#D7CCC8" stroke="#000" strokeWidth={1.5} />
      {/* Textura da areia (pontinhos) */}
      {[...Array(12)].map((_, i) => (
        <circle key={i} cx={18 + (i % 6) * 11} cy={42 + Math.floor(i / 6) * 12} r="1" fill="#8D6E63" />
      ))}
      {/* Pegadas na areia */}
      <ellipse cx="45" cy="48" rx="3" ry="2.5" fill="#8D6E63" opacity="0.6" transform="rotate(-15,45,48)" />
      <ellipse cx="52" cy="50" rx="3" ry="2.5" fill="#8D6E63" opacity="0.6" transform="rotate(10,52,50)" />
    </svg>
  );
}

export function MatSprite({ color = '#D7CCC8', patternIndex = 0, size = 100 }) {
  const strokeW = 3;
  // Diferentes estampas de patinha
  const pawPositions = [
    [{ cx: 30, cy: 35 }, { cx: 55, cy: 50 }, { cx: 45, cy: 65 }],
    [{ cx: 40, cy: 30 }, { cx: 60, cy: 45 }, { cx: 25, cy: 60 }],
    [{ cx: 35, cy: 45 }, { cx: 55, cy: 35 }, { cx: 45, cy: 65 }, { cx: 20, cy: 55 }],
    [{ cx: 25, cy: 40 }, { cx: 50, cy: 55 }, { cx: 65, cy: 35 }, { cx: 40, cy: 65 }],
  ];

  const paws = pawPositions[patternIndex] || pawPositions[0];

  return (
    <svg width={size} height={size} viewBox="0 0 90 90" style={{ overflow: 'visible' }}>
      {/* Tapete */}
      <rect x="5" y="5" width="80" height="80" rx="10" fill={color} stroke="#000" strokeWidth={strokeW} />
      {/* Franja */}
      {[...Array(8)].map((_, i) => (
        <line key={i} x1={10 + i * 10} y1="84" x2={12 + i * 10} y2="90" stroke={color} strokeWidth={2.5} />
      ))}
      {/* Patinhas estampadas */}
      {paws.map((p, i) => (
        <g key={i}>
          {/* Almofada principal */}
          <ellipse cx={p.cx} cy={p.cy} rx="6" ry="5" fill={color} stroke="#000" strokeWidth={1.5} opacity="0.5" />
          {/* Dedos */}
          <ellipse cx={p.cx - 5} cy={p.cy - 6} rx="2.5" ry="3.5" fill={color} stroke="#000" strokeWidth={1} opacity="0.5" />
          <ellipse cx={p.cx + 1} cy={p.cy - 7} rx="2.5" ry="3.5" fill={color} stroke="#000" strokeWidth={1} opacity="0.5" />
          <ellipse cx={p.cx + 6} cy={p.cy - 5} rx="2.5" ry="3.5" fill={color} stroke="#000" strokeWidth={1} opacity="0.5" />
        </g>
      ))}
    </svg>
  );
}

export function DoorSprite({ size = 80 }) {
  const strokeW = 3;
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" style={{ overflow: 'visible' }}>
      <rect x="15" y="10" width="50" height="65" rx="6" fill="#5D4037" stroke="#000" strokeWidth={strokeW} />
      <rect x="20" y="15" width="40" height="55" rx="4" fill="#795548" stroke="#000" strokeWidth={2} />
      <circle cx="55" cy="42" r="3" fill="#FFD600" stroke="#000" strokeWidth={1.5} />
      {/* Placa "SAIR" */}
      <rect x="25" y="22" width="30" height="16" rx="3" fill="#FFF9C4" stroke="#000" strokeWidth={1.5} />
      <text x="40" y="34" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#000" fontFamily="Arial">SAIR</text>
    </svg>
  );
}

export function HoleSprite({ size = 60 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" style={{ overflow: 'visible' }}>
      <ellipse cx="30" cy="30" rx="25" ry="12" fill="#1a1a1a" stroke="#000" strokeWidth={3} />
      <ellipse cx="30" cy="28" rx="22" ry="9" fill="#0d0d0d" />
      {/* Bordas irregulares */}
      <path d="M5,28 Q8,24 14,28 Q18,22 24,28 Q28,24 36,28 Q42,22 48,28 Q52,24 55,28" fill="none" stroke="#2a2a2a" strokeWidth={2} />
    </svg>
  );
}

export function ToyBallSprite({ size = 60 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" style={{ overflow: 'visible' }}>
      <circle cx="30" cy="30" r="25" fill="#FFCC02" stroke="#000" strokeWidth={3} />
      <path d="M10,20 Q30,40 50,20" fill="none" stroke="#CC0000" strokeWidth={2.5} />
      <path d="M10,40 Q30,20 50,40" fill="none" stroke="#0000CC" strokeWidth={2.5} />
    </svg>
  );
}

export function ToyBoneSprite({ size = 60 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" style={{ overflow: 'visible' }}>
      <rect x="15" y="20" width="30" height="12" rx="3" fill="#FFF" stroke="#000" strokeWidth={3} />
      <circle cx="16" cy="20" r="7" fill="#FFF" stroke="#000" strokeWidth={3} />
      <circle cx="44" cy="20" r="7" fill="#FFF" stroke="#000" strokeWidth={3} />
      <circle cx="16" cy="32" r="7" fill="#FFF" stroke="#000" strokeWidth={3} />
      <circle cx="44" cy="32" r="7" fill="#FFF" stroke="#000" strokeWidth={3} />
    </svg>
  );
}

export function CushionSprite({ size = 60 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" style={{ overflow: 'visible' }}>
      <ellipse cx="30" cy="30" rx="25" ry="20" fill="#E0E0E0" stroke="#000" strokeWidth={3} />
      <ellipse cx="30" cy="28" rx="18" ry="13" fill="#F5F5F5" stroke="#000" strokeWidth={1.5} />
      {/* Costura decorativa */}
      <ellipse cx="30" cy="28" rx="10" ry="7" fill="none" stroke="#9E9E9E" strokeWidth={1} strokeDasharray="3,3" />
    </svg>
  );
}

export function SecondAnimalSprite({ species = 'dog', size = 70 }) {
  // Versão genérica do outro animal, sem customização
  if (species === 'dog') {
    return <DogSprite color="#8D6E63" fur="short" size={size} />;
  }
  return <CatSprite color="#BCAAA4" fur="short" size={size} />;
}
