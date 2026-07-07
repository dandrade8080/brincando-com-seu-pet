import { useState, useCallback, useRef, useEffect } from 'react';
import {
  HouseSprite, BedSprite, BowlSprite,
  CatSprite, DogSprite, DoorSprite,
  SecondAnimalSprite, ToyBallSprite, ToyBoneSprite, CushionSprite,
} from '../svg/Sprites';
import './PlayRoom.css';

const ROOM_POSITIONS = {
  bed:           { left: '10%', top: '12%' },
  houseCushion:  { left: '80%', top: '10%' },
  foodBowl:      { left: '22%', top: '82%' },
  waterBowl:     { left: '75%', top: '82%' },
  door:          { left: '92%', top: '55%' },
  secondAnimal:  { left: '55%', top: '55%' },
};

const TOYS = [
  { id: 'ball1', type: 'ball', left: '30%', top: '38%' },
  { id: 'bone1', type: 'bone', left: '65%', top: '28%' },
  { id: 'ball2', type: 'ball', left: '72%', top: '45%' },
  { id: 'cush1', type: 'cushion', left: '42%', top: '58%' },
  { id: 'cush2', type: 'cushion', left: '18%', top: '52%' },
  { id: 'ball3', type: 'ball', left: '50%', top: '35%' },
  { id: 'cush3', type: 'cushion', left: '82%', top: '58%' },
];

export default function PlayRoom({ gameState, setGameState, audio, speech }) {
  const { pet, objects } = gameState;
  const petColor = pet.color;
  const species = pet.species;
  const otherSpecies = species === 'cat' ? 'dog' : 'cat';

  const [petPos, setPetPos] = useState({ left: '30%', top: '50%' });
  const [isDragging, setIsDragging] = useState(false);
  const [animState, setAnimState] = useState(null);
  const [secondAnimalPos, setSecondAnimalPos] = useState(ROOM_POSITIONS.secondAnimal);
  const [playingTogether, setPlayingTogether] = useState(false);
  const [houseExpanded, setHouseExpanded] = useState(false);
  const [insideHouse, setInsideHouse] = useState(false);
  const [toyPositions, setToyPositions] = useState([...TOYS]);
  const [pettingPet, setPettingPet] = useState(false);

  const roomRef = useRef(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const animTimer = useRef(null);

  useEffect(() => {
    speech.speak('Sala de brincadeiras! Arraste seu pet pela sala. Toque nos brinquedos e na casinha para brincar.');
    return () => { if (animTimer.current) clearTimeout(animTimer.current); };
  }, []);

  useEffect(() => {
    return () => { if (animTimer.current) clearTimeout(animTimer.current); };
  }, []);

  const handleDragStart = useCallback((e) => {
    if (insideHouse) return;
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
  }, [petPos, audio, insideHouse]);

  const handleDragMove = useCallback((e) => {
    if (!isDragging || insideHouse) return;
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
  }, [isDragging, insideHouse]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const moveToTarget = useCallback((targetPos, callback) => {
    const startLeft = parseFloat(petPos.left);
    const startTop = parseFloat(petPos.top);
    const endLeft = parseFloat(targetPos.left) + 8;
    const endTop = parseFloat(targetPos.top) + 8;

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

  const handleToyClick = useCallback((toyId, toyPos) => {
    if (isDragging || playingTogether || insideHouse) return;

    audio.sfx.ballBounce();

    const bounceX = Math.random() * 20 - 10;
    const bounceY = Math.random() * 20 - 10;
    const newLeft = Math.max(5, Math.min(90, parseFloat(toyPos.left) + bounceX));
    const newTop = Math.max(5, Math.min(85, parseFloat(toyPos.top) + bounceY - 15));

    setToyPositions(prev => prev.map(t =>
      t.id === toyId ? { ...t, left: `${newLeft}%`, top: `${newTop}%` } : t
    ));

    speech.speak('Boing! O brinquedo pulou!');
  }, [isDragging, playingTogether, insideHouse, audio, speech]);

  const handleObjectClick = useCallback((key) => {
    if (isDragging || playingTogether || insideHouse) return;
    audio.sfx.click();

    if (key === 'door') {
      audio.stopBGM();
      speech.speak('Saindo da sala de brincadeiras. Até mais!');
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
      speech.speak('Seu pet vai comer. Nhac nhac!');
      moveToTarget(pos, () => {
        setAnimState('eat');
        audio.sfx.eat();
        setTimeout(() => setAnimState(null), 2000);
      });
    } else if (key === 'waterBowl') {
      speech.speak('Seu pet vai beber água. Glub glub!');
      moveToTarget(pos, () => {
        setAnimState('drink');
        audio.sfx.drink();
        setTimeout(() => setAnimState(null), 2000);
      });
    } else if (key === 'houseCushion') {
      speech.speak('A casinha está aumentando! Seu pet vai entrar.');
      setHouseExpanded(true);
      setInsideHouse(true);
      audio.sfx.enterHouse();
    } else if (key === 'bed') {
      speech.speak('Seu pet vai dormir na caminha.');
      moveToTarget(pos, () => {
        setAnimState('sleep');
        audio.sfx.success();
        if (species === 'cat') audio.sfx.purr();
        else audio.sfx.snore();
        setTimeout(() => setAnimState(null), 3500);
      });
    } else if (key === 'secondAnimal') {
      const targetL = parseFloat(petPos.left) + 12;
      const targetT = parseFloat(petPos.top) - 10;

      let s = 0;
      const si = setInterval(() => {
        s++;
        const lt = parseFloat(secondAnimalPos.left) + (targetL - parseFloat(secondAnimalPos.left)) * (s / 30);
        const tt = parseFloat(secondAnimalPos.top) + (targetT - parseFloat(secondAnimalPos.top)) * (s / 30);
        setSecondAnimalPos({ left: `${lt}%`, top: `${tt}%` });
        if (s >= 30) {
          clearInterval(si);
          setPlayingTogether(true);
          speech.speak('Os bichinhos estão brincando juntos! Que fofura!');
          if (species === 'cat') audio.sfx.meow();
          else audio.sfx.bark();
        }
      }, 30);
    }
  }, [isDragging, playingTogether, insideHouse, audio, speech, setGameState, moveToTarget, petPos, secondAnimalPos, species]);

  const handlePetInsideHouse = useCallback(() => {
    setPettingPet(true);
    if (species === 'cat') {
      audio.sfx.meow();
      speech.speak('Miau! Seu gatinho está feliz dentro da casinha!');
    } else {
      audio.sfx.bark();
      speech.speak('Au au! Seu cachorrinho está feliz dentro da casinha!');
    }
    setTimeout(() => setPettingPet(false), 800);
  }, [species, audio, speech]);

  const handleExitHouse = useCallback(() => {
    setHouseExpanded(false);
    setInsideHouse(false);
    speech.speak('Saiu da casinha. Continue brincando!');
  }, [speech]);

  const renderObject = (key, label, Sprite, customPos, customSize = 100) => {
    const pos = customPos || ROOM_POSITIONS[key];
    if (!pos) return null;
    const objColor = objects[key === 'houseCushion' ? 'house' : key] || objects.house;
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
        onFocus={() => speech.speak(`${label}. Toque para interagir.`)}
      >
        <Sprite color={colorHex} size={customSize} />
        {key === 'houseCushion' && <div className="cushion-badge">🛏</div>}
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
      <div className="room-bg" />

      {!houseExpanded && (
        <>
          {renderObject('houseCushion', 'Casinha', HouseSprite)}

          {renderObject('bed', 'Caminha', BedSprite)}

          {renderObject('foodBowl', 'Comida', (p) => BowlSprite({ ...p, type: 'food' }))}

          {renderObject('waterBowl', 'Água', (p) => BowlSprite({ ...p, type: 'water' }))}

          <div
            className="room-object"
            style={{ left: ROOM_POSITIONS.door.left, top: ROOM_POSITIONS.door.top }}
            onClick={() => handleObjectClick('door')}
            role="button"
            tabIndex={0}
            aria-label="Voltar ao início"
            onFocus={() => speech.speak('Porta de saída. Toque para voltar ao início.')}
          >
            <DoorSprite size={70} />
            <span className="obj-label">Sair</span>
          </div>

          {toyPositions.map((toy) => (
            <div
              key={toy.id}
              className="toy-item"
              style={{ left: toy.left, top: toy.top }}
              onClick={() => handleToyClick(toy.id, toy)}
              role="button"
              tabIndex={0}
              aria-label={toy.type === 'ball' ? 'Bola' : toy.type === 'bone' ? 'Osso' : 'Almofada'}
            >
              {toy.type === 'ball' && <ToyBallSprite size={70} />}
              {toy.type === 'bone' && <ToyBoneSprite size={70} />}
              {toy.type === 'cushion' && <CushionSprite size={70} />}
            </div>
          ))}

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
            onFocus={() => speech.speak(`${otherSpecies === 'cat' ? 'Gatinho' : 'Cachorrinho'} amigo. Toque para brincarem juntos!`)}
          >
            <SecondAnimalSprite species={otherSpecies} size={80} />
            <span className="obj-label">{otherSpecies === 'cat' ? 'Gato' : 'Cachorro'} amigo</span>
            {!playingTogether && <span className="tap-hint">Toque!</span>}
          </div>

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
            onFocus={() => speech.speak(`Seu ${species === 'cat' ? 'gatinho' : 'cachorrinho'}. Arraste ele pela sala!`)}
          >
            {species === 'cat' ? (
              <CatSprite
                color={petColor?.hex || '#9E9E9E'}
                fur={pet.fur || 'short'}
                size={100}
              />
            ) : (
              <DogSprite
                color={petColor?.hex || '#9E9E9E'}
                fur={pet.fur || 'short'}
                size={100}
              />
            )}
            {animState === 'eat' && <div className="anim-badge">Comendo!</div>}
            {animState === 'drink' && <div className="anim-badge">Bebendo!</div>}
            {animState === 'play' && <div className="anim-badge">Brincando!</div>}
            {animState === 'sleep' && <div className="anim-badge">Dormindo!</div>}
          </div>

          {playingTogether && (
            <div className="playing-together-overlay">
              <div className="playing-together-text">Brincando juntos!</div>
              <div className="hearts">&#10084; &#10084; &#10084;</div>
              <button
                className="stop-play-btn"
                onClick={() => {
                  setPlayingTogether(false);
                  setSecondAnimalPos(ROOM_POSITIONS.secondAnimal);
                  speech.speak('Os bichinhos pararam de brincar.');
                }}
              >
                Parar
              </button>
            </div>
          )}

          <div className="hint-text" style={{ bottom: '4%' }}>
            Arraste seu pet pela sala! Toque nos objetos para brincar.
          </div>
        </>
      )}

      {houseExpanded && (
        <div className="house-expanded-overlay">
          <div className="house-interior">
            <h2 className="house-interior-title">
              {species === 'cat' ? '🐱' : '🐶'} Dentro da casinha!
            </h2>
            <div
              className="house-interior-pet"
              onClick={handlePetInsideHouse}
              role="button"
              tabIndex={0}
              aria-label="Toque no seu pet para fazer carinho"
              style={{ transform: pettingPet ? 'scale(1.2)' : 'scale(1)' }}
            >
              {species === 'cat' ? (
                <CatSprite
                  color={petColor?.hex || '#9E9E9E'}
                  fur={pet.fur || 'short'}
                  size={180}
                />
              ) : (
                <DogSprite
                  color={petColor?.hex || '#9E9E9E'}
                  fur={pet.fur || 'short'}
                  size={180}
                />
              )}
              <span style={{ fontSize: 'var(--font-size-md)', color: '#000', fontWeight: 700 }}>
                Toque para fazer carinho!
              </span>
            </div>
            {pettingPet && (
              <div style={{
                fontSize: 'var(--font-size-md)',
                color: '#000',
                fontWeight: 700,
                animation: 'heartsFloat 1s ease-in-out infinite alternate',
              }}>
                &#10084; &#10084; &#10084;
              </div>
            )}
            <button
              className="close-phase-btn"
              onClick={handleExitHouse}
              style={{ minWidth: 160, minHeight: 60, fontSize: 'var(--font-size-md)' }}
            >
              SAIR DA CASINHA
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
