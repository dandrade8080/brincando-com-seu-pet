import { useState, useCallback, useEffect } from 'react';
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

export default function ObjectSelection({ gameState, setGameState, audio, speech }) {
  const [currentObjIndex, setCurrentObjIndex] = useState(0);
  const [matStep, setMatStep] = useState(null);
  const [matCarouselIndex, setMatCarouselIndex] = useState(0);
  const [matChosen, setMatChosen] = useState(false);

  const species = gameState.pet.species;
  const petColor = gameState.pet.color;

  const objects = [...OBJECTS_BASE];
  if (species === 'cat') {
    objects.push({ key: 'litterBox', label: 'Caixinha de Areia', Sprite: LitterBoxSprite });
  } else {
    objects.push({ key: 'mat', label: 'Tapetinho', Sprite: (p) => MatSprite({ ...p, size: 130 }) });
  }

  useEffect(() => {
    const obj = objects[currentObjIndex];
    if (obj.key === 'mat' && matStep === 'carousel') return;
    speech.speak(`Escolha a cor ${obj.key === 'mat' ? 'do' : 'da'} ${obj.label}. Toque na cor que você quer.`);
  }, [currentObjIndex]);

  const handleColorChoice = useCallback((color) => {
    audio.sfx.click();
    const key = objects[currentObjIndex].key;
    setGameState(prev => ({
      ...prev,
      objects: { ...prev.objects, [key]: color },
    }));

    speech.speak(`Você escolheu a cor ${color.name} para ${objects[currentObjIndex].label}.`);

    if (key === 'mat' && species === 'dog') {
      setMatStep('carousel');
      return;
    }

    if (currentObjIndex < objects.length - 1) {
      setCurrentObjIndex(currentObjIndex + 1);
    } else {
      speech.speak('Todos os objetos estão prontos! Vamos brincar!');
      audio.startBGM();
      setGameState(prev => ({ ...prev, screen: 'mainFloor' }));
    }
  }, [currentObjIndex, objects, species, audio, speech, setGameState]);

  const handleMatNext = () => {
    audio.sfx.click();
    const next = (matCarouselIndex + 1) % MAT_PATTERNS.length;
    setMatCarouselIndex(next);
    speech.speak(`Estampa ${MAT_PATTERNS[next].name}.`);
  };

  const handleMatChoose = () => {
    audio.sfx.success();
    setMatChosen(true);
    const matData = {
      ...gameState.objects.mat,
      patternIndex: MAT_PATTERNS[matCarouselIndex].id,
    };
    setGameState(prev => ({
      ...prev,
      objects: { ...prev.objects, mat: matData },
    }));

    speech.speak('Seu cachorrinho adorou o tapetinho! Muito bem!');

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

  if (matStep === 'carousel') {
    return (
      <div className="screen object-selection">
        {matChosen ? (
          <div className="mat-animation">
            <h1 className="screen-title">Muito bem!</h1>
            <div className="mat-dog-walk">
              <div className="dog-animating" style={{
                animation: 'dogWalkToMat 1.5s ease-in-out forwards',
              }}>
                <DogSprite
                  color={petColor?.hex || '#9E9E9E'}
                  fur={gameState.pet.fur || 'short'}
                  size={140}
                />
              </div>
              <div className="mat-target">
                <MatSprite
                  color={gameState.objects.mat?.hex || '#D7CCC8'}
                  patternIndex={MAT_PATTERNS[matCarouselIndex].id}
                  size={150}
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
                  size={180}
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

  const currentObj = objects[currentObjIndex];
  const CurrentSprite = currentObj.Sprite;

  return (
    <div className="screen object-selection">
      <button className="back-btn" onClick={handleBack} aria-label="Voltar">⬅</button>
      <h1 className="screen-title">
        Escolha a cor {currentObj.key === 'mat' ? 'do' : 'da'} {currentObj.label}
      </h1>

      <div className="obj-preview">
        <CurrentSprite color={OBJECT_COLORS[0].hex} size={140} />
        {currentObj.key === 'mat' && (
          <span className="patinha-hint">🐾</span>
        )}
      </div>

      <div className="choice-grid">
        {OBJECT_COLORS.map(c => (
          <div
            key={c.name}
            className={`choice-card ${gameState.objects[currentObj.key]?.name === c.name ? 'selected' : ''}`}
            onClick={() => handleColorChoice(c)}
            role="button"
            tabIndex={0}
            aria-label={`Cor ${c.name}`}
            onFocus={() => speech.speak(`Cor ${c.name}.`)}
            style={{
              borderColor: '#000',
              boxShadow: `0 0 0 5px #000`,
              backgroundImage: c.lum > 150
                ? 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(0,0,0,0.05) 4px, rgba(0,0,0,0.05) 8px)'
                : 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.05) 4px, rgba(255,255,255,0.05) 8px)',
            }}
          >
            <CurrentSprite color={c.hex} size={110} />
            <span className="label" style={{ color: '#000' }}>
              {c.name.toUpperCase()}
            </span>
          </div>
        ))}
      </div>

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
