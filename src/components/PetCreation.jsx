import { useState, useEffect } from 'react';
import { CatSprite, DogSprite, PET_COLORS } from '../svg/Sprites';
import AnimatedPet from '../svg/AnimatedPet';
import './PetCreation.css';

const STEPS = ['species', 'fur', 'color'];
const STEP_LABELS = ['Escolha seu Pet!', 'Qual a pelagem?', 'Qual a cor do seu pet?'];

export default function PetCreation({ gameState, setGameState, audio, speech }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const isCat = gameState.pet.species === 'cat';
    const isDog = gameState.pet.species === 'dog';
    if (step === 0) {
      speech.speak('Escolha seu pet: Gato ou Cachorro. Toque no bichinho que você quer.');
    } else if (step === 1) {
      speech.speak(`Você escolheu ${isCat ? 'um gato' : 'um cachorro'}. Agora escolha a pelagem: pouco pelo ou muito pelo.`);
    } else if (step === 2) {
      speech.speak('Agora escolha a cor do seu pet.');
    }
  }, [step]);

  const handleSpecies = (species) => {
    audio.sfx.click();
    setGameState(prev => ({
      ...prev,
      pet: { ...prev.pet, species },
    }));
    setStep(1);
    speech.speak(species === 'cat'
      ? 'Você escolheu um gatinho! Miaaaau!'
      : 'Você escolheu um cachorrinho! Au au au!');
    if (species === 'cat') audio.sfx.meow();
    else audio.sfx.bark();
  };

  const handleFur = (fur) => {
    audio.sfx.click();
    setGameState(prev => ({
      ...prev,
      pet: { ...prev.pet, fur },
    }));
    setStep(2);
    speech.speak(fur === 'short'
      ? 'Pouco pelo. Um bichinho de pelo curto.'
      : 'Muito pelo. Um bichinho bem peludo!');
  };

  const handleColor = (color) => {
    audio.sfx.click();
    const species = gameState.pet.species;
    const animal = species === 'cat' ? 'gato' : 'cachorro';
    const updated = {
      ...gameState,
      pet: { ...gameState.pet, color },
      screen: 'objectSelection',
    };
    setGameState(updated);
    speech.speak(`Seu ${animal} ${color.name.toLowerCase()} está pronto! Agora vamos escolher os objetos.`);
  };

  const handleBack = () => {
    audio.sfx.click();
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const renderSpeciesStep = () => (
    <div className="screen">
      <h1 className="screen-title">Escolha seu Pet!</h1>
      <div className="choice-grid">
        <div
          className={`choice-card ${gameState.pet.species === 'cat' ? 'selected' : ''}`}
          onClick={() => handleSpecies('cat')}
          role="button"
          tabIndex={0}
          aria-label="Escolher Gato"
          onFocus={() => speech.speak('Gato. Toque para escolher um gatinho.')}
        >
          <CatSprite color="#9E9E9E" fur="short" size={140} />
          <span className="label">GATO</span>
          <span className="label-icon">🐱</span>
        </div>
        <div
          className={`choice-card ${gameState.pet.species === 'dog' ? 'selected' : ''}`}
          onClick={() => handleSpecies('dog')}
          role="button"
          tabIndex={0}
          aria-label="Escolher Cachorro"
          onFocus={() => speech.speak('Cachorro. Toque para escolher um cachorrinho.')}
        >
          <DogSprite color="#9E9E9E" fur="short" size={140} />
          <span className="label">CACHORRO</span>
          <span className="label-icon">🐶</span>
        </div>
      </div>
    </div>
  );

  const renderFurStep = () => (
    <div className="screen">
      <h1 className="screen-title">Qual a pelagem?</h1>
      <div className="choice-grid">
        <div
          className={`choice-card ${gameState.pet.fur === 'short' ? 'selected' : ''}`}
          onClick={() => handleFur('short')}
          role="button"
          tabIndex={0}
          aria-label="Pouco pelo"
          onFocus={() => speech.speak('Pouco pelo. Toque para escolher pelo curto.')}
        >
          {gameState.pet.species === 'cat'
            ? <CatSprite color="#9E9E9E" fur="short" size={140} />
            : <DogSprite color="#9E9E9E" fur="short" size={140} />
          }
          <span className="label">POUCO PELO</span>
        </div>
        <div
          className={`choice-card ${gameState.pet.fur === 'long' ? 'selected' : ''}`}
          onClick={() => handleFur('long')}
          role="button"
          tabIndex={0}
          aria-label="Muito pelo"
          onFocus={() => speech.speak('Muito pelo. Toque para escolher pelo longo.')}
        >
          {gameState.pet.species === 'cat'
            ? <CatSprite color="#9E9E9E" fur="long" size={140} />
            : <DogSprite color="#9E9E9E" fur="long" size={140} />
          }
          <span className="label">MUITO PELO</span>
        </div>
      </div>
    </div>
  );

  const renderColorStep = () => (
    <div className="screen">
      <h1 className="screen-title">Qual a cor do seu pet?</h1>
      <div className="choice-grid">
        {PET_COLORS.map(c => (
          <div
            key={c.name}
            className={`choice-card ${gameState.pet.color?.name === c.name ? 'selected' : ''}`}
            onClick={() => handleColor(c)}
            role="button"
            tabIndex={0}
            aria-label={`Cor ${c.name}`}
            onFocus={() => speech.speak(`Cor ${c.name}. Toque para escolher.`)}
            style={{
              borderColor: '#000',
              boxShadow: `0 0 0 5px #000`,
              backgroundImage: c.lum > 150
                ? 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(0,0,0,0.05) 4px, rgba(0,0,0,0.05) 8px)'
                : 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.05) 4px, rgba(255,255,255,0.05) 8px)',
            }}
          >
            {gameState.pet.species === 'cat'
              ? <CatSprite color={c.hex} fur={gameState.pet.fur || 'short'} size={140} />
              : <DogSprite color={c.hex} fur={gameState.pet.fur || 'short'} size={140} />
            }
            <span className="label" style={{ color: c.lum > 150 ? '#000' : '#000' }}>
              {c.name.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="pet-creation-container">
      {step > 0 && (
        <button className="back-btn" onClick={handleBack} aria-label="Voltar">⬅</button>
      )}
      {step === 0 && renderSpeciesStep()}
      {step === 1 && renderFurStep()}
      {step === 2 && renderColorStep()}
      <div className="step-indicator">
        {STEPS.map((_, i) => (
          <div key={i} className={`step-dot ${i <= step ? 'active' : ''}`} />
        ))}
      </div>
    </div>
  );
}
