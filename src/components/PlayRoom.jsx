import { useState, useCallback, useRef, useEffect } from 'react';
import {
  HouseSprite, BedSprite, BowlSprite,
  CatSprite, DogSprite, DoorSprite,
  SecondAnimalSprite, ToyBallSprite, ToyBoneSprite, CushionSprite,
} from '../svg/Sprites';
import './PlayRoom.css';

// Posições fixas dos objetos na sala de brincar
const ROOM_POSITIONS = {
  bed:           { left: '8%', top: '8%' },
  houseCushion:  { left: '78%', top: '5%' },
  houseNoCushion:{ left: '48%', top: '5%' },
  foodBowl:      { left: '20%', top: '78%' },
  waterBowl:     { left: '70%', top: '78%' },
  door:          { left: '90%', top: '50%' },
  secondAnimal:  { left: '55%', top: '55%' },
};

// Posições de brinquedos e almofadas
const TOYS = [
  { type: 'ball', left: '25%', top: '40%' },
  { type: 'bone', left: '65%', top: '30%' },
  { type: 'ball', left: '75%', top: '45%' },
  { type: 'cushion', left: '40%', top: '60%' },
  { type: 'cushion', left: '15%', top: '55%' },
  { type: 'ball', left: '50%', top: '35%' },
  { type: 'cushion', left: '80%', top: '60%' },
];

export default function PlayRoom({ gameState, setGameState, audio }) {
  const { pet, objects } = gameState;
  const petColor = pet.color;
  const species = pet.species;
  const otherSpecies = species === 'cat' ? 'dog' : 'cat';

  const [petPos, setPetPos] = useState({ left: '30%', top: '50%' });
  const [isDragging, setIsDragging] = useState(false);
  const [animState, setAnimState] = useState(null); // 'eat' | 'drink' | 'play' | 'sleep' | 'together'
  const [secondAnimalPos, setSecondAnimalPos] = useState(ROOM_POSITIONS.secondAnimal);
  const [playingTogether, setPlayingTogether] = useState(false);

  const roomRef = useRef(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const animTimer = useRef(null);

  useEffect(() => {
    return () => { if (animTimer.current) clearTimeout(animTimer.current); };
  }, []);

  // Drag handlers
  const handleDragStart = useCallback((e) => {
    e.preventDefault();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const roomRect = roomRef.current?.getBoundingClientRect();
    if (!roomRect) return;

    const petLeft = parseFloat(petPos.left) / 100 * roomRect.width;
    const petTop = parseFloat(petPos.top) / 100 * roomRect.height;

    dragOffset.current = {
      x: clientX - roomRect.left - petLeft,
      y: clientY - roomRect.top - petTop,
    };

    setIsDragging(true);
    audio.sfx.click();
  }, [petPos, audio]);

  const handleDragMove = useCallback((e) => {
    if (!isDragging) return;
    e.preventDefault();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const roomRect = roomRef.current?.getBoundingClientRect();
    if (!roomRect) return;

    const newLeft = clientX - roomRect.left - dragOffset.current.x;
    const newTop = clientY - roomRect.top - dragOffset.current.y;

    const percentLeft = Math.max(5, Math.min(90, (newLeft / roomRect.width) * 100));
    const percentTop = Math.max(5, Math.min(88, (newTop / roomRect.height) * 100));

    setPetPos({ left: `${percentLeft}%`, top: `${percentTop}%` });
  }, [isDragging]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Pet vai para um alvo (animação de caminhada curta)
  const moveToTarget = useCallback((targetPos, callback) => {
    const startLeft = parseFloat(petPos.left);
    const startTop = parseFloat(petPos.top);
    const endLeft = parseFloat(targetPos.left) + 5; // ao lado
    const endTop = parseFloat(targetPos.top) + 5;

    const steps = 30;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      const t = step / steps;
      const l = startLeft + (endLeft - startLeft) * t;
      const tp = startTop + (endTop - startTop) * t;
      setPetPos({ left: `${l}%`, top: `${tp}%` });
      if (step % 5 === 0) audio.sfx.step();

      if (step >= steps) {
        clearInterval(interval);
        if (callback) callback();
      }
    }, 20);
  }, [petPos, audio]);

  // Interações
  const handleObjectClick = useCallback((key) => {
    if (isDragging || playingTogether) return;
    audio.sfx.click();

    if (key === 'door') {
      audio.stopBGM();
      // Reseta completamente o estado do jogo (MVP sem persistência)
      setGameState(prev => ({
        screen: 'petCreation',
        pet: { species: null, fur: null, color: null },
        objects: { house: null, bed: null, waterBowl: null, foodBowl: null, litterBox: null, mat: null },
      }));
      return;
    }

    const pos = ROOM_POSITIONS[key];
    if (!pos) return;

    if (key === 'foodBowl') {
      moveToTarget(pos, () => {
        setAnimState('eat');
        audio.sfx.eat();
        setTimeout(() => setAnimState(null), 2000);
      });
    } else if (key === 'waterBowl') {
      moveToTarget(pos, () => {
        setAnimState('drink');
        audio.sfx.drink();
        setTimeout(() => setAnimState(null), 2000);
      });
    } else if (key === 'houseCushion' || key === 'houseNoCushion') {
      moveToTarget(pos, () => {
        setAnimState(key === 'houseCushion' ? 'play' : 'sleep');
        audio.sfx.success();
        setTimeout(() => setAnimState(null), 3500);
      });
    } else if (key === 'secondAnimal') {
      // Segundo animal se aproxima
      const petL = parseFloat(petPos.left);
      const petT = parseFloat(petPos.top);
      const targetL = petL + 12;
      const targetT = petT - 10;

      // Anima segundo animal se aproximando
      let s = 0;
      const si = setInterval(() => {
        s++;
        const lt = parseFloat(secondAnimalPos.left) + (targetL - parseFloat(secondAnimalPos.left)) * (s / 30);
        const tt = parseFloat(secondAnimalPos.top) + (targetT - parseFloat(secondAnimalPos.top)) * (s / 30);
        setSecondAnimalPos({ left: `${lt}%`, top: `${tt}%` });
        if (s >= 30) {
          clearInterval(si);
          setPlayingTogether(true);
          if (species === 'cat') audio.sfx.meow();
          else audio.sfx.bark();
        }
      }, 30);
    }
  }, [isDragging, playingTogether, audio, setGameState, moveToTarget, petPos, secondAnimalPos, species]);

  // Renderiza objetos posicionados
  const renderObject = (key, label, Sprite, customPos, customSize = 85) => {
    const pos = customPos || ROOM_POSITIONS[key];
    if (!pos) return null;
    const objColor = objects[key === 'houseCushion' ? 'house' : key === 'houseNoCushion' ? 'house' : key] || objects.house;
    const colorHex = objColor?.hex || '#888';

    return (
      <div
        key={key}
        className="room-object"
        style={{ left: pos.left, top: pos.top }}
        onClick={() => handleObjectClick(key)}
        role="button"
        tabIndex={0}
        aria-label={label}
      >
        <Sprite color={colorHex} size={customSize} />
        {key === 'houseCushion' && <div className="cushion-badge">🛏</div>}
        {key === 'houseNoCushion' && <div className="cushion-badge no-cushion">📦</div>}
        <span className="obj-label">{label}</span>
      </div>
    );
  };

  return (
    <div
      className="play-room"
      ref={roomRef}
      onMouseMove={handleDragMove}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchMove={handleDragMove}
      onTouchEnd={handleDragEnd}
    >
      {/* Fundo da sala */}
      <div className="room-bg" />

      {/* Casinha com almofadas */}
      {renderObject('houseCushion', 'Casinha com Almofadas', HouseSprite)}

      {/* Casinha sem almofadas */}
      {renderObject('houseNoCushion', 'Casinha sem Almofadas', HouseSprite)}

      {/* Caminha */}
      {renderObject('bed', 'Caminha', BedSprite)}

      {/* Potinho de comida */}
      {renderObject('foodBowl', 'Comida', (p) => BowlSprite({ ...p, type: 'food' }))}

      {/* Potinho de água */}
      {renderObject('waterBowl', 'Água', (p) => BowlSprite({ ...p, type: 'water' }))}

      {/* Portinha */}
      <div
        className="room-object"
        style={{ left: ROOM_POSITIONS.door.left, top: ROOM_POSITIONS.door.top }}
        onClick={() => handleObjectClick('door')}
        role="button"
        tabIndex={0}
        aria-label="Voltar ao início"
      >
        <DoorSprite size={60} />
        <span className="obj-label">Sair</span>
      </div>

      {/* Brinquedos e almofadas espalhados (apenas decorativos, não interativos) */}
      {TOYS.map((toy, i) => (
        <div key={`toy-${i}`} className="toy-item" style={{ left: toy.left, top: toy.top }}>
          {toy.type === 'ball' && <ToyBallSprite size={50} />}
          {toy.type === 'bone' && <ToyBoneSprite size={50} />}
          {toy.type === 'cushion' && <CushionSprite size={50} />}
        </div>
      ))}

      {/* Segundo animal */}
      <div
        className="room-object second-animal"
        style={{
          left: secondAnimalPos.left,
          top: secondAnimalPos.top,
          transition: playingTogether ? 'none' : 'left 0.8s, top 0.8s',
        }}
        onClick={() => handleObjectClick('secondAnimal')}
        role="button"
        tabIndex={0}
        aria-label={`${otherSpecies === 'cat' ? 'Gato' : 'Cachorro'} amigo`}
      >
        <SecondAnimalSprite species={otherSpecies} size={70} />
        <span className="obj-label">{otherSpecies === 'cat' ? 'Gato' : 'Cachorro'} amigo</span>
        {!playingTogether && <span className="tap-hint">Toque!</span>}
      </div>

      {/* Pet principal (draggable) */}
      <div
        className={`playroom-pet ${isDragging ? 'dragging' : ''} ${animState ? animState : ''}`}
        style={{
          left: petPos.left,
          top: petPos.top,
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
        role="button"
        tabIndex={0}
        aria-label={`Seu ${species === 'cat' ? 'gato' : 'cachorro'} - arraste!`}
      >
        {species === 'cat' ? (
          <CatSprite
            color={petColor?.hex || '#9E9E9E'}
            fur={pet.fur || 'short'}
            size={80}
          />
        ) : (
          <DogSprite
            color={petColor?.hex || '#9E9E9E'}
            fur={pet.fur || 'short'}
            size={80}
          />
        )}
        {/* Indicador de estado */}
        {animState === 'eat' && <div className="anim-badge">Comendo...</div>}
        {animState === 'drink' && <div className="anim-badge">Bebendo...</div>}
        {animState === 'play' && <div className="anim-badge">Brincando!</div>}
        {animState === 'sleep' && <div className="anim-badge">Dormindo...</div>}
      </div>

      {/* Estado "brincando juntos" */}
      {playingTogether && (
        <div className="playing-together-overlay">
          <div className="playing-together-text">Brincando juntos!</div>
          <div className="hearts">❤ ❤ ❤</div>
          <button
            className="stop-play-btn"
            onClick={() => {
              setPlayingTogether(false);
              setSecondAnimalPos(ROOM_POSITIONS.secondAnimal);
            }}
          >
            Parar
          </button>
        </div>
      )}

      {/* Instrução */}
      <div className="hint-text" style={{ bottom: '4%' }}>
        Arraste seu pet pela sala! Toque nos objetos para brincar.
      </div>
    </div>
  );
}
