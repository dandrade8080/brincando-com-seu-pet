import { useState, useCallback } from 'react';
import PetCreation from './components/PetCreation';
import ObjectSelection from './components/ObjectSelection';
import MainFloor from './components/MainFloor';
import PlayRoom from './components/PlayRoom';
import useAudio from './hooks/useAudio';
import useSpeech from './hooks/useSpeech';
import './App.css';

export const DEFAULT_GAME_STATE = {
  screen: 'petCreation',
  pet: {
    species: null,
    fur: null,
    color: null,
  },
  objects: {
    house: null,
    bed: null,
    waterBowl: null,
    foodBowl: null,
    litterBox: null,
    mat: null,
  },
};

export default function App() {
  const [gameState, setGameState] = useState(DEFAULT_GAME_STATE);
  const audio = useAudio();
  const speech = useSpeech();

  const navigateTo = useCallback((screen) => {
    setGameState(prev => ({ ...prev, screen }));
    audio.sfx.click();
  }, [audio]);

  const resetGame = useCallback(() => {
    audio.stopBGM();
    speech.stop();
    setGameState(DEFAULT_GAME_STATE);
  }, [audio, speech]);

  const renderScreen = () => {
    switch (gameState.screen) {
      case 'petCreation':
        return (
          <PetCreation
            gameState={gameState}
            setGameState={setGameState}
            audio={audio}
            speech={speech}
          />
        );
      case 'objectSelection':
        return (
          <ObjectSelection
            gameState={gameState}
            setGameState={setGameState}
            audio={audio}
            speech={speech}
          />
        );
      case 'mainFloor':
        return (
          <MainFloor
            gameState={gameState}
            setGameState={setGameState}
            audio={audio}
            speech={speech}
          />
        );
      case 'playRoom':
        return (
          <PlayRoom
            gameState={gameState}
            setGameState={setGameState}
            audio={audio}
            speech={speech}
          />
        );
      default:
        return <PetCreation gameState={gameState} setGameState={setGameState} audio={audio} speech={speech} />;
    }
  };

  return (
    <div className="app-container">
      {renderScreen()}
      <button
        className="mute-btn"
        onClick={audio.toggleMute}
        aria-label={audio.muted ? 'Ativar som' : 'Desativar som'}
        title={audio.muted ? 'Ativar som' : 'Desativar som'}
      >
        {audio.muted ? '🔇' : '🔊'}
      </button>
      <button
        className="back-btn"
        style={{ left: 'auto', right: '80px' }}
        onClick={() => speech.speak('Você está no jogo Brincando com seu Pet. Toque nos botões grandes para jogar.')}
        aria-label="Ouvir instruções"
        title="Ouvir instruções"
      >
        🗣
      </button>
    </div>
  );
}
