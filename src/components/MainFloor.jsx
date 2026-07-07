import { useState, useCallback, useRef, useEffect } from 'react';
import {
  HouseSprite, BedSprite, BowlSprite,
  LitterBoxSprite, MatSprite,
  CatSprite, DogSprite, DoorSprite, HoleSprite,
} from '../svg/Sprites';
import './MainFloor.css';

// Posições fixas dos objetos no cenário (em % da tela)
const OBJECT_POSITIONS = {
  house:      { left: '10%', top: '15%' },
  bed:        { left: '60%', top: '8%' },
  waterBowl:  { left: '15%', top: '75%' },
  foodBowl:   { left: '65%', top: '75%' },
  litterBox:  { left: '40%', top: '80%' },
  mat:        { left: '40%', top: '80%' },
  door:       { left: '82%', top: '50%' },
};

const PET_START = { left: '45%', top: '45%' };

export default function MainFloor({ gameState, setGameState, audio }) {
  const { pet, objects } = gameState;
  const petColor = pet.color;

  const [petPos, setPetPos] = useState(PET_START);
  const [isWalking, setIsWalking] = useState(false);
  const [challenge, setChallenge] = useState(null); // null | { type, targetKey, holeIndex, petNearHole }
  const [showWarning, setShowWarning] = useState(false);
  const walkTimerRef = useRef(null);

  // Limpa timers ao desmontar
  useEffect(() => {
    return () => { if (walkTimerRef.current) clearTimeout(walkTimerRef.current); };
  }, []);

  const objectEntries = [
    { key: 'house', label: 'Casinha', Sprite: HouseSprite },
    { key: 'bed', label: 'Caminha', Sprite: BedSprite },
    { key: 'waterBowl', label: 'Potinho de Água', Sprite: (p) => BowlSprite({ ...p, type: 'water' }) },
    { key: 'foodBowl', label: 'Potinho de Ração', Sprite: (p) => BowlSprite({ ...p, type: 'food' }) },
  ];

  if (pet.species === 'cat') {
    objectEntries.push({ key: 'litterBox', label: 'Caixinha de Areia', Sprite: LitterBoxSprite });
  } else {
    objectEntries.push({ key: 'mat', label: 'Tapetinho', Sprite: (p) => MatSprite({ ...p, size: 90, patternIndex: objects.mat?.patternIndex || 0 }) });
  }

  // Função de animação de caminhada
  const walkToTarget = useCallback((targetKey, targetPos) => {
    if (isWalking) return;

    const startPos = petPos;
    const startL = parseFloat(startPos.left);
    const startT = parseFloat(startPos.top);
    const endL = parseFloat(targetPos.left);
    const endT = parseFloat(targetPos.top);

    setIsWalking(true);

    // Verifica se precisa do desafio (caixinha de areia ou tapetinho)
    const needsChallenge =
      (pet.species === 'cat' && targetKey === 'litterBox') ||
      (pet.species === 'dog' && targetKey === 'mat');

    let progress = 0;
    const totalSteps = 60; // frames de animação
    const interval = 16; // ~60fps

    // Posições dos buracos (se houver desafio)
    const holePositions = needsChallenge ? [
      { l: (startL + endL) / 2 - 12, t: (startT + endT) / 2 - 3 },
      { l: (startL + endL) / 2 + 8, t: (startT + endT) / 2 + 8 },
    ] : [];

    const animate = () => {
      progress++;
      const t = progress / totalSteps;
      const currentL = startL + (endL - startL) * t;
      const currentT = startT + (endT - startT) * t;

      // Passo sonoro a cada ~8 frames
      if (progress % 8 === 0) audio.sfx.step();

      // Verifica proximidade do buraco (desafio)
      if (needsChallenge && !challenge) {
        for (let i = 0; i < holePositions.length; i++) {
          const hl = holePositions[i].l;
          const ht = holePositions[i].t;
          const dist = Math.sqrt((currentL - hl) ** 2 + (currentT - ht) ** 2);
          if (dist < 12 && !challenge) {
            setChallenge({
              type: 'hole',
              targetKey,
              holeIndex: i,
              targetPos,
            });
            setShowWarning(true);
            setIsWalking(false);
            clearInterval(walkTimerRef.current);
            walkTimerRef.current = null;
            return;
          }
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

        // Som de chegada
        if (targetKey === 'foodBowl') audio.sfx.eat();
        else if (targetKey === 'waterBowl') audio.sfx.drink();
        else if (targetKey === 'bed') audio.sfx.success();
        else if (targetKey === 'house') audio.sfx.success();
      }
    };

    walkTimerRef.current = setInterval(animate, interval);
  }, [isWalking, petPos, pet.species, challenge, audio]);

  // Jogador toca no pet para pular o buraco
  const handlePetJump = useCallback(() => {
    if (!challenge) return;
    audio.sfx.jump();

    // Animação de pulo
    const currentPetPos = petPos;
    setPetPos(prev => ({ ...prev, top: `${parseFloat(prev.top) - 8}%` }));

    setTimeout(() => {
      setPetPos(currentPetPos);
      setChallenge(null);
      setShowWarning(false);

      // Continua caminhando até o objeto alvo
      const targetPos = challenge.targetPos;
      walkToTarget(challenge.targetKey, challenge.targetPos);
    }, 400);
  }, [challenge, petPos, audio, walkToTarget]);

  // Se o jogador não pular a tempo (5 segundos)
  useEffect(() => {
    if (!challenge || !showWarning) return;
    const timeout = setTimeout(() => {
      // Caiu no buraco
      audio.sfx.fall();
      setChallenge(null);
      setShowWarning(false);
      setIsWalking(false);
      if (walkTimerRef.current) {
        clearInterval(walkTimerRef.current);
        walkTimerRef.current = null;
      }
      // Reinicia fase
      setPetPos(PET_START);
    }, 5000);
    return () => clearTimeout(timeout);
  }, [challenge, showWarning, audio]);

  // Toca num objeto
  const handleObjectClick = useCallback((key) => {
    if (isWalking) return;
    if (key === 'door') {
      audio.sfx.click();
      setGameState(prev => ({ ...prev, screen: 'playRoom' }));
      return;
    }

    const pos = OBJECT_POSITIONS[key];
    if (pos) {
      audio.sfx.click();
      walkToTarget(key, pos);
    }
  }, [isWalking, audio, setGameState, walkToTarget]);

  // Toca no pet (pular buraco)
  const handlePetClick = useCallback(() => {
    if (challenge) {
      handlePetJump();
    } else {
      // Som de interação
      if (pet.species === 'cat') audio.sfx.meow();
      else audio.sfx.bark();
    }
  }, [challenge, handlePetJump, pet.species, audio]);

  const petSize = 80;

  return (
    <div className="main-floor">
      {/* Fundo texturizado (chão) */}
      <div className="floor-bg" />

      {/* Objetos no cenário */}
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
          >
            <Sprite color={colorHex} size={90} />
            <span className="obj-label">{label}</span>
          </div>
        );
      })}

      {/* Portinha */}
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
      >
        <DoorSprite size={70} />
        <span className="obj-label">Brincar!</span>
      </div>

      {/* Buracos do desafio */}
      {challenge && (
        <>
          <div className="hole hole-1" style={{
            left: `${(parseFloat(petPos.left || '45') + parseFloat(OBJECT_POSITIONS[challenge.targetKey]?.left || '45')) / 2 - 6}%`,
            top: `${(parseFloat(petPos.top || '45') + parseFloat(OBJECT_POSITIONS[challenge.targetKey]?.top || '45')) / 2 + 2}%`,
          }}>
            <HoleSprite size={70} />
          </div>
        </>
      )}

      {/* Aviso de buraco */}
      {showWarning && (
        <div className="warning-overlay">
          <p className="warning-text">BURACO À FRENTE!</p>
          <p className="warning-sub">
            Toque no seu pet para pular!
          </p>
        </div>
      )}

      {/* Pet */}
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
      >
        {pet.species === 'cat' ? (
          <CatSprite color={petColor?.hex || '#9E9E9E'} fur={pet.fur || 'short'} size={petSize} />
        ) : (
          <DogSprite color={petColor?.hex || '#9E9E9E'} fur={pet.fur || 'short'} size={petSize} />
        )}
        {/* Indicador visual de que o pet é clicável */}
        {challenge && (
          <div className="click-here-indicator">TOQUE!</div>
        )}
      </div>

      {/* Instrução inicial */}
      {!isWalking && !challenge && (
        <div className="hint-text">
          Toque nos objetos para seu pet interagir!
        </div>
      )}
    </div>
  );
}
