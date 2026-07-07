import { useState, useCallback } from 'react';
import PetCreation from './components/PetCreation';
import ObjectSelection from './components/ObjectSelection';
import MainFloor from './components/MainFloor';
import PlayRoom from './components/PlayRoom';
import useAudio from './hooks/useAudio';
import './App.css';

// Estado global do jogo (reseta ao recarregar a página - MVP sem persistência)

export const DEFAULT_GAME_STATE = {
  screen: 'petCreation', // petCreation | objectSelection | mainFloor | playRoom
  pet: {
    species: null,     // 'cat' | 'dog'
    fur: null,         // 'short' | 'long'
    color: null,       // { name, hex, lum }
  },
  objects: {
    house: null,       // { name, hex, lum }
    bed: null,
    waterBowl: null,
    foodBowl: null,
    litterBox: null,   // só gato
    mat: null,         // { name, hex, lum, patternIndex } - só cachorro
  },
};

export default function App() {
  const [gameState, setGameState] = useState(DEFAULT_GAME_STATE);
  const audio = useAudio();

  const navigateTo = useCallback((screen) => {
    setGameState(prev => ({ ...prev, screen }));
    audio.sfx.click();
  }, [audio]);

  const resetGame = useCallback(() => {
    audio.stopBGM();
    setGameState(DEFAULT_GAME_STATE);
  }, [audio]);

  const renderScreen = () => {
    switch (gameState.screen) {
      case 'petCreation':
        return (
          <PetCreation
            gameState={gameState}
            setGameState={setGameState}
            audio={audio}
          />
        );
      case 'objectSelection':
        return (
          <ObjectSelection
            gameState={gameState}
            setGameState={setGameState}
            audio={audio}
          />
        );
      case 'mainFloor':
        return (
          <MainFloor
            gameState={gameState}
            setGameState={setGameState}
            audio={audio}
          />
        );
      case 'playRoom':
        return (
          <PlayRoom
            gameState={gameState}
            setGameState={setGameState}
            audio={audio}
          />
        );
      default:
        return <PetCreation gameState={gameState} setGameState={setGameState} audio={audio} />;
    }
  };

  return (
    <div className="app-container">
      {renderScreen()}
      {/* Botão de mute sempre visível */}
      <button
        className="mute-btn"
        onClick={audio.toggleMute}
        aria-label={audio.muted ? 'Ativar som' : 'Desativar som'}
        title={audio.muted ? 'Ativar som' : 'Desativar som'}
      >
        {audio.muted ? '🔇' : '🔊'}
      </button>
    </div>
  );
}
