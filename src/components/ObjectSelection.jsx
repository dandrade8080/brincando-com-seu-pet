import { useState, useCallback } from 'react';
import {
  HouseSprite, BedSprite, BowlSprite,
  LitterBoxSprite, MatSprite,
  CatSprite, DogSprite,
  OBJECT_COLORS, MAT_PATTERNS,
} from '../svg/Sprites';
import './ObjectSelection.css';

const OBJECTS_BASE = [
  { key: 'house', label: 'Casinha', Sprite: HouseSprite },
  { key: 'bed', label: 'Caminha', Sprite: BedSprite },
  { key: 'waterBowl', label: 'Potinho de Água', Sprite: (p) => BowlSprite({ ...p, type: 'water' }) },
  { key: 'foodBowl', label: 'Potinho de Ração', Sprite: (p) => BowlSprite({ ...p, type: 'food' }) },
];

export default function ObjectSelection({ gameState, setGameState, audio }) {
  const [currentObjIndex, setCurrentObjIndex] = useState(0);
  // Estado do carrossel de tapetinhos (só cachorro)
  const [matStep, setMatStep] = useState(null); // null | 'color' | 'carousel'
  const [matCarouselIndex, setMatCarouselIndex] = useState(0);
  const [matChosen, setMatChosen] = useState(false);

  const species = gameState.pet.species;
  const petColor = gameState.pet.color;

  const objects = [...OBJECTS_BASE];
  if (species === 'cat') {
    objects.push({ key: 'litterBox', label: 'Caixinha de Areia', Sprite: LitterBoxSprite });
  } else {
    objects.push({ key: 'mat', label: 'Tapetinho', Sprite: (p) => MatSprite({ ...p, size: 100 }) });
  }

  const handleColorChoice = useCallback((color) => {
    audio.sfx.click();
    const key = objects[currentObjIndex].key;
    setGameState(prev => ({
      ...prev,
      objects: { ...prev.objects, [key]: color },
    }));

    // Se for o tapetinho, inicia o carrossel
    if (key === 'mat' && species === 'dog') {
      setMatStep('carousel');
      return;
    }

    // Próximo objeto ou finaliza
    if (currentObjIndex < objects.length - 1) {
      setCurrentObjIndex(currentObjIndex + 1);
    } else {
      // Todos objetos escolhidos, iniciar música e ir para tela principal
      audio.startBGM();
      setGameState(prev => ({ ...prev, screen: 'mainFloor' }));
    }
  }, [currentObjIndex, objects, species, audio, setGameState]);

  const handleMatNext = () => {
    audio.sfx.click();
    setMatCarouselIndex((matCarouselIndex + 1) % MAT_PATTERNS.length);
  };

  const handleMatChoose = () => {
    // O jogador escolheu este tapetinho → cachorro vai até ele e senta
    audio.sfx.success();
    setMatChosen(true);
    // Salva o tapetinho escolhido
    const matData = {
      ...gameState.objects.mat,
      patternIndex: MAT_PATTERNS[matCarouselIndex].id,
    };
    setGameState(prev => ({
      ...prev,
      objects: { ...prev.objects, mat: matData },
    }));

    // Animação curta: cachorro anda até o tapetinho e senta
    setTimeout(() => {
      audio.startBGM();
      setGameState(prev => ({ ...prev, screen: 'mainFloor' }));
      setMatChosen(false);
      setMatStep(null);
    }, 2000);
  };

  const handleBack = () => {
    audio.sfx.click();
    if (matStep === 'carousel') {
      setMatStep(null);
      return;
    }
    if (currentObjIndex > 0) {
      setCurrentObjIndex(currentObjIndex - 1);
    } else {
      setGameState(prev => ({
        ...prev,
        screen: 'petCreation',
        pet: { ...prev.pet },
      }));
    }
  };

  // Render do carrossel de tapetinhos
  if (matStep === 'carousel') {
    return (
      <div className="screen object-selection">
        {matChosen ? (
          // Animação: cachorro andando até o tapetinho e sentando
          <div className="mat-animation">
            <h1 className="screen-title">Muito bem!</h1>
            <div className="mat-dog-walk">
              <div className="dog-animating" style={{
                animation: 'dogWalkToMat 1.5s ease-in-out forwards',
              }}>
                <DogSprite
                  color={petColor?.hex || '#9E9E9E'}
                  fur={gameState.pet.fur || 'short'}
                  size={100}
                />
              </div>
              <div className="mat-target">
                <MatSprite
                  color={gameState.objects.mat?.hex || '#D7CCC8'}
                  patternIndex={MAT_PATTERNS[matCarouselIndex].id}
                  size={120}
                />
              </div>
            </div>
            <p className="label">Seu cachorrinho adorou o tapetinho!</p>
          </div>
        ) : (
          <>
            <h1 className="screen-title">Escolha a estampa do tapetinho</h1>
            <p className="subtitle">Toque no tapetinho que você mais gostar!</p>
            <div className="mat-carousel">
              <div
                className="mat-display"
                onClick={handleMatChoose}
                role="button"
                tabIndex={0}
                aria-label="Escolher este tapetinho"
              >
                <MatSprite
                  color={gameState.objects.mat?.hex || '#D7CCC8'}
                  patternIndex={MAT_PATTERNS[matCarouselIndex].id}
                  size={160}
                />
              </div>
              <div className="carousel-controls">
                <button onClick={handleMatNext} className="carousel-btn">
                  PRÓXIMO ▶
                </button>
                <p className="label">Ou toque no tapetinho para escolher!</p>
              </div>
              <p className="pattern-label">
                {MAT_PATTERNS[matCarouselIndex].name} ({matCarouselIndex + 1}/{MAT_PATTERNS.length})
              </p>
            </div>
          </>
        )}
      </div>
    );
  }

  // Render normal de escolha de cor para cada objeto
  const currentObj = objects[currentObjIndex];
  const CurrentSprite = currentObj.Sprite;

  const isLast = currentObjIndex === objects.length - 1;

  return (
    <div className="screen object-selection">
      <button className="back-btn" onClick={handleBack} aria-label="Voltar">⬅</button>
      <h1 className="screen-title">
        Escolha a cor {currentObj.key === 'mat' ? 'do' : 'da'} {currentObj.label}
      </h1>

      {/* Preview do objeto */}
      <div className="obj-preview">
        <CurrentSprite color={OBJECT_COLORS[0].hex} size={120} />
        {currentObj.key === 'mat' && (
          <span className="patinha-hint">🐾</span>
        )}
      </div>

      {/* Escolha de cores */}
      <div className="choice-grid">
        {OBJECT_COLORS.map(c => (
          <div
            key={c.name}
            className={`choice-card ${gameState.objects[currentObj.key]?.name === c.name ? 'selected' : ''}`}
            onClick={() => handleColorChoice(c)}
            role="button"
            tabIndex={0}
            aria-label={`Cor ${c.name}`}
            style={{
              borderColor: c.hex,
              boxShadow: `0 0 0 4px ${c.hex}`,
              backgroundImage: c.lum > 150
                ? 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(0,0,0,0.05) 4px, rgba(0,0,0,0.05) 8px)'
                : 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.05) 4px, rgba(255,255,255,0.05) 8px)',
            }}
          >
            <CurrentSprite color={c.hex} size={90} />
            <span className="label" style={{ color: c.lum > 150 ? '#000' : '#fff' }}>
              {c.name.toUpperCase()}
            </span>
          </div>
        ))}
      </div>

      {/* Progresso */}
      <div className="obj-progress">
        {objects.map((_, i) => (
          <div key={i} className={`step-dot ${i <= currentObjIndex ? 'active' : ''}`} />
        ))}
      </div>

      <p className="progress-label">
        {currentObjIndex + 1} de {objects.length}
      </p>
    </div>
  );
}
