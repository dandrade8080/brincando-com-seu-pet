import { useState, useCallback, useRef, useEffect } from 'react';
import {
  HouseSprite, BedSprite, BowlSprite,
  LitterBoxSprite, MatSprite,
  CatSprite, DogSprite, DoorSprite, HoleSprite,
} from '../svg/Sprites';
import './MainFloor.css';

const OBJECT_POSITIONS = {
  house:      { left: '15%', top: '20%' },
  bed:        { left: '70%', top: '15%' },
  waterBowl:  { left: '20%', top: '80%' },
  foodBowl:   { left: '70%', top: '80%' },
  litterBox:  { left: '45%', top: '85%' },
  mat:        { left: '45%', top: '85%' },
  door:       { left: '88%', top: '55%' },
};

const PET_START = { left: '50%', top: '50%' };

export default function MainFloor({ gameState, setGameState, audio, speech }) {
  const { pet, objects } = gameState;
  const petColor = pet.color;

  const [petPos, setPetPos] = useState(PET_START);
  const [isWalking, setIsWalking] = useState(false);
  const [challenge, setChallenge] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  const [activePhase, setActivePhase] = useState(null);
  const [phaseData, setPhaseData] = useState({});
  const walkTimerRef = useRef(null);

  useEffect(() => {
    speech.speak('Você está no andar principal. Toque nos objetos para seu pet interagir com eles.');
    return () => { if (walkTimerRef.current) clearInterval(walkTimerRef.current); };
  }, []);

  useEffect(() => {
    return () => { if (walkTimerRef.current) clearInterval(walkTimerRef.current); };
  }, []);

  const objectEntries = [
    { key: 'house', label: 'Casinha', Sprite: HouseSprite, phaseDesc: 'Entrar na casinha' },
    { key: 'bed', label: 'Caminha', Sprite: BedSprite, phaseDesc: 'Dormir na caminha' },
    { key: 'waterBowl', label: 'Potinho de Água', Sprite: (p) => BowlSprite({ ...p, type: 'water' }), phaseDesc: 'Beber água' },
    { key: 'foodBowl', label: 'Potinho de Ração', Sprite: (p) => BowlSprite({ ...p, type: 'food' }), phaseDesc: 'Comer ração' },
  ];

  if (pet.species === 'cat') {
    objectEntries.push({ key: 'litterBox', label: 'Caixinha de Areia', Sprite: LitterBoxSprite, phaseDesc: 'Usar caixinha de areia' });
  } else {
    objectEntries.push({ key: 'mat', label: 'Tapetinho', Sprite: (p) => MatSprite({ ...p, size: 110, patternIndex: objects.mat?.patternIndex || 0 }), phaseDesc: 'Sentar no tapetinho' });
  }

  const walkToTarget = useCallback((targetKey, targetPos, onArrive) => {
    if (isWalking) return;

    const startL = parseFloat(petPos.left);
    const startT = parseFloat(petPos.top);
    const endL = parseFloat(targetPos.left);
    const endT = parseFloat(targetPos.top);

    setIsWalking(true);

    const needsChallenge =
      (pet.species === 'cat' && targetKey === 'litterBox') ||
      (pet.species === 'dog' && targetKey === 'mat');

    let progress = 0;
    const totalSteps = 80;
    const interval = 16;

    let holeChecked = false;

    const animate = () => {
      progress++;
      const t = progress / totalSteps;
      const currentL = startL + (endL - startL) * t;
      const currentT = startT + (endT - startT) * t;

      if (progress % 6 === 0) audio.sfx.step();

      if (needsChallenge && !holeChecked && progress > totalSteps * 0.3 && progress < totalSteps * 0.7) {
        const hl = (startL + endL) / 2;
        const ht = (startT + endT) / 2;
        const dist = Math.sqrt((currentL - hl) ** 2 + (currentT - ht) ** 2);
        if (dist < 15 && Math.random() < 0.5) {
          holeChecked = true;
          setChallenge({
            type: 'hole',
            targetKey,
            targetPos,
            onArrive,
          });
          setShowWarning(true);
          setIsWalking(false);
          clearInterval(walkTimerRef.current);
          walkTimerRef.current = null;
          speech.speak('Cuidado! Um buraco! Toque no seu pet para pular!');
          return;
        }
      }

      setPetPos({ left: `${currentL}%`, top: `${currentT}%` });

      if (progress >= totalSteps) {
        clearInterval(walkTimerRef.current);
        walkTimerRef.current = null;
        setIsWalking(false);
        setPetPos(targetPos);
        setChallenge(null);
        setShowWarning(false);

        if (onArrive) onArrive(targetKey);
      }
    };

    walkTimerRef.current = setInterval(animate, interval);
  }, [isWalking, petPos, pet.species, audio, speech]);

  const handlePetJump = useCallback(() => {
    if (!challenge) return;
    audio.sfx.jump();
    speech.speak('Ufa! Você pulou o buraco!');

    const currentPetPos = petPos;
    setPetPos(prev => ({ ...prev, top: `${parseFloat(prev.top) - 10}%` }));

    setTimeout(() => {
      setPetPos(currentPetPos);
      setChallenge(null);
      setShowWarning(false);

      if (challenge.onArrive) {
        walkToTarget(challenge.targetKey, challenge.targetPos, challenge.onArrive);
      } else {
        walkToTarget(challenge.targetKey, challenge.targetPos);
      }
    }, 400);
  }, [challenge, petPos, audio, walkToTarget, speech]);

  useEffect(() => {
    if (!challenge || !showWarning) return;
    const timeout = setTimeout(() => {
      audio.sfx.fall();
      speech.speak('Opa! Seu pet caiu no buraco! Vamos tentar de novo.');
      setChallenge(null);
      setShowWarning(false);
      setIsWalking(false);
      if (walkTimerRef.current) {
        clearInterval(walkTimerRef.current);
        walkTimerRef.current = null;
      }
      setPetPos(PET_START);
    }, 6000);
    return () => clearTimeout(timeout);
  }, [challenge, showWarning, audio, speech]);

  const startPhase = useCallback((key) => {
    const animal = pet.species === 'cat' ? 'gato' : 'cachorro';
    const label = objectEntries.find(e => e.key === key)?.label || key;

    if (key === 'foodBowl') {
      setActivePhase('eating');
      setPhaseData({ foodPieces: [0, 1, 2, 3, 4].map(() => true) });
      audio.sfx.eat();
      speech.speak(`Seu ${animal} está comendo a ração! Que delícia!`);
    } else if (key === 'waterBowl') {
      setActivePhase('drinking');
      audio.sfx.drink();
      speech.speak(`Seu ${animal} está bebendo água! Que refrescante!`);
    } else if (key === 'bed') {
      setActivePhase('sleeping');
      audio.sfx.success();
      speech.speak(`Seu ${animal} está dormindo na caminha! Shhh!`);
      if (pet.species === 'cat') audio.sfx.purr();
      else audio.sfx.snore();
    } else if (key === 'house') {
      setActivePhase('insideHouse');
      audio.sfx.enterHouse();
      speech.speak(`Seu ${animal} entrou na casinha! Que lugar aconchegante!`);
    } else if (key === 'litterBox') {
      setActivePhase('usingLitterBox');
      audio.sfx.success();
      speech.speak(`Seu gatinho está usando a caixinha de areia. Muito bem!`);
    } else if (key === 'mat') {
      setActivePhase('onMat');
      audio.sfx.success();
      speech.speak(`Seu cachorrinho sentou no tapetinho! Que lindo!`);
    }
  }, [pet.species, audio, speech]);

  const closePhase = useCallback(() => {
    setActivePhase(null);
    setPhaseData({});
    setPetPos(PET_START);
    speech.speak('Seu pet voltou. Toque em outro objeto para brincar.');
  }, [speech]);

  const handleEatPiece = useCallback((index) => {
    audio.sfx.eat();
    setPhaseData(prev => ({
      ...prev,
      foodPieces: prev.foodPieces.map((v, i) => i === index ? false : v),
    }));
    const remaining = phaseData.foodPieces.filter((v, i) => i !== index && v).length;
    if (remaining === 0) {
      speech.speak('Seu pet comeu tudinho! Está satisfeito!');
    } else {
      speech.speak('Nhac nhac! Que gostoso!');
    }
  }, [audio, speech, phaseData.foodPieces]);

  const handleObjectClick = useCallback((key) => {
    if (isWalking || activePhase) return;

    if (key === 'door') {
      audio.sfx.click();
      speech.speak('Indo para a sala de brincadeiras!');
      setGameState(prev => ({ ...prev, screen: 'playRoom' }));
      return;
    }

    const pos = OBJECT_POSITIONS[key];
    if (pos) {
      audio.sfx.click();
      walkToTarget(key, pos, (arrivedKey) => {
        startPhase(arrivedKey);
      });
    }
  }, [isWalking, activePhase, audio, setGameState, walkToTarget, startPhase, speech]);

  const handlePetClick = useCallback(() => {
    if (challenge) {
      handlePetJump();
    } else {
      if (pet.species === 'cat') {
        audio.sfx.meow();
        speech.speak('Miau!');
      } else {
        audio.sfx.bark();
        speech.speak('Au au!');
      }
    }
  }, [challenge, handlePetJump, pet.species, audio, speech]);

  const petSize = 100;

  const renderPhaseOverlay = () => {
    if (!activePhase) return null;

    const animal = pet.species === 'cat' ? 'gato' : 'cachorro';
    const animalEmoji = pet.species === 'cat' ? '🐱' : '🐶';

    switch (activePhase) {
      case 'eating':
        return (
          <div className="phase-interaction">
            <h2 className="phase-title">{animalEmoji} Comendo!</h2>
            <div className="food-pieces">
              {phaseData.foodPieces.map((active, i) => (
                <div
                  key={i}
                  className={`food-piece ${!active ? 'gone' : ''}`}
                  onClick={() => active && handleEatPiece(i)}
                  role="button"
                  tabIndex={0}
                  aria-label={active ? 'Ração. Toque para comer.' : 'Ração comida'}
                  style={{ cursor: active ? 'pointer' : 'default' }}
                />
              ))}
            </div>
            <p className="phase-animation">
              {phaseData.foodPieces.some(v => v)
                ? 'Toque na ração para o pet comer!'
                : 'Seu pet comeu tudo!'}
            </p>
            <button className="close-phase-btn" onClick={closePhase}>VOLTAR</button>
          </div>
        );

      case 'drinking':
        return (
          <div className="phase-interaction">
            <h2 className="phase-title">{animalEmoji} Bebendo água!</h2>
            <div style={{ margin: '16px 0' }}>
              <BowlSprite color={objects.waterBowl?.hex || '#A1887F'} type="water" size={160} />
            </div>
            <p className="phase-animation">Glub glub glub... Que refrescante!</p>
            <button className="close-phase-btn" onClick={closePhase}>VOLTAR</button>
          </div>
        );

      case 'sleeping':
        return (
          <div className="phase-interaction">
            <h2 className="phase-title">{animalEmoji} Dormindo!</h2>
            <div style={{ margin: '16px 0', animation: 'sleepBreathe 2s ease-in-out infinite' }}>
              {pet.species === 'cat'
                ? <CatSprite color={petColor?.hex || '#9E9E9E'} fur={pet.fur || 'short'} size={140} />
                : <DogSprite color={petColor?.hex || '#9E9E9E'} fur={pet.fur || 'short'} size={140} />
              }
            </div>
            <p className="phase-animation">Zzz Zzz Zzz...</p>
            <button className="close-phase-btn" onClick={closePhase}>ACORDAR</button>
          </div>
        );

      case 'insideHouse':
        return (
          <div className="inside-house">
            <h2 className="phase-title" style={{ fontSize: 'var(--font-size-lg)', color: '#000' }}>
              {animalEmoji} Dentro da casinha!
            </h2>
            <div style={{
              background: '#FFF8E1',
              border: '6px solid #000',
              borderRadius: 20,
              padding: 32,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 16,
            }}>
              {pet.species === 'cat'
                ? <CatSprite color={petColor?.hex || '#9E9E9E'} fur={pet.fur || 'short'} size={160} />
                : <DogSprite color={petColor?.hex || '#9E9E9E'} fur={pet.fur || 'short'} size={160} />
              }
              <p className="phase-animation">Seu pet está confortável na casinha!</p>
            </div>
            <button className="close-phase-btn" onClick={closePhase} style={{ marginTop: 16 }}>
              SAIR DA CASINHA
            </button>
          </div>
        );

      case 'usingLitterBox':
        return (
          <div className="phase-interaction">
            <h2 className="phase-title">🐱 Usando a caixinha!</h2>
            <div style={{ margin: '16px 0' }}>
              <LitterBoxSprite color={objects.litterBox?.hex || '#A1887F'} size={160} />
            </div>
            <p className="phase-animation">Seu gatinho está usando a caixinha de areia. Muito bem!</p>
            <button className="close-phase-btn" onClick={closePhase}>PRONTO!</button>
          </div>
        );

      case 'onMat':
        return (
          <div className="phase-interaction">
            <h2 className="phase-title">🐶 No tapetinho!</h2>
            <div style={{ margin: '16px 0' }}>
              <MatSprite
                color={objects.mat?.hex || '#D7CCC8'}
                patternIndex={objects.mat?.patternIndex || 0}
                size={180}
              />
            </div>
            <p className="phase-animation">Seu cachorrinho está sentadinho no tapetinho!</p>
            <button className="close-phase-btn" onClick={closePhase}>LEVANTAR</button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="main-floor">
      <div className="floor-bg" />

      {objectEntries.map(({ key, label, Sprite }) => {
        const objColor = objects[key];
        const colorHex = objColor?.hex || '#888';
        const pos = OBJECT_POSITIONS[key] || {};
        return (
          <div
            key={key}
            className="floor-object"
            style={{
              left: pos.left,
              top: pos.top,
            }}
            onClick={() => handleObjectClick(key)}
            role="button"
            tabIndex={0}
            aria-label={label}
            onFocus={() => speech.speak(`${label}. Toque para interagir.`)}
          >
            <Sprite color={colorHex} size={110} />
            <span className="obj-label phase-label">{label}</span>
          </div>
        );
      })}

      <div
        className="floor-object door-object"
        style={{
          left: OBJECT_POSITIONS.door.left,
          top: OBJECT_POSITIONS.door.top,
        }}
        onClick={() => handleObjectClick('door')}
        role="button"
        tabIndex={0}
        aria-label="Ir para Sala de Brincar"
        onFocus={() => speech.speak('Porta para a sala de brincadeiras. Toque para entrar.')}
      >
        <DoorSprite size={80} />
        <span className="obj-label phase-label">Brincar!</span>
      </div>

      {challenge && (
        <>
          <div className="hole hole-1" style={{
            left: `${(parseFloat(petPos.left || '50') + parseFloat(OBJECT_POSITIONS[challenge.targetKey]?.left || '50')) / 2}%`,
            top: `${(parseFloat(petPos.top || '50') + parseFloat(OBJECT_POSITIONS[challenge.targetKey]?.top || '50')) / 2 + 2}%`,
          }}>
            <HoleSprite size={80} />
          </div>
        </>
      )}

      {showWarning && (
        <div className="warning-overlay">
          <p className="warning-text">BURACO À FRENTE!</p>
          <p className="warning-sub">
            Toque no seu pet para pular!
          </p>
        </div>
      )}

      {!activePhase && (
        <div
          className={`pet-on-floor ${isWalking ? 'walking' : ''} ${challenge ? 'in-danger' : ''}`}
          style={{
            left: petPos.left,
            top: petPos.top,
            transition: isWalking ? 'none' : 'left 0.3s ease, top 0.3s ease',
          }}
          onClick={handlePetClick}
          role="button"
          tabIndex={0}
          aria-label={challenge ? 'Toque para pular!' : `Seu ${pet.species === 'cat' ? 'gato' : 'cachorro'}`}
          onFocus={() => !challenge && speech.speak(`Este é seu ${pet.species === 'cat' ? 'gatinho' : 'cachorrinho'}. Toque nele para ouvir o som.`)}
        >
          {pet.species === 'cat' ? (
            <CatSprite color={petColor?.hex || '#9E9E9E'} fur={pet.fur || 'short'} size={petSize} />
          ) : (
            <DogSprite color={petColor?.hex || '#9E9E9E'} fur={pet.fur || 'short'} size={petSize} />
          )}
          {challenge && (
            <div className="click-here-indicator">TOQUE!</div>
          )}
        </div>
      )}

      {!isWalking && !challenge && !activePhase && (
        <div className="hint-text">
          Toque nos objetos para seu pet interagir!
        </div>
      )}

      {renderPhaseOverlay()}
    </div>
  );
}
