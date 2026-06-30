import { useState } from 'react';
import { useAppState } from '../../store/AppContext';
import { Fretboard } from '../../components/Fretboard/Fretboard';
import './PracticePage.css';

export function PracticePage() {
  const state = useAppState();
  const [subMode, setSubMode] = useState<'free' | 'guided' | 'identify' | 'arpeggio'>('free');

  return (
    <main className="practice-main">
      {/* Esquerda: Contexto e Métricas */}
      <aside className="practice-sidebar left-sidebar">
        <div className="panel">
          <p className="panel-title">Sessão de Prática</p>
          <div className="metrics">
            <div className="metric-box">
              <span>Vidas</span>
              <strong>3</strong>
            </div>
            <div className="metric-box">
              <span>Tempo</span>
              <strong>00:00</strong>
            </div>
            <div className="metric-box">
              <span>Acertos</span>
              <strong>0</strong>
            </div>
          </div>
        </div>

        {/* Tonalidade herdada ou sobreposta */}
        <div className="panel">
          <p className="panel-title">Contexto Local</p>
          <p style={{ fontSize: '0.85rem', color: '#999' }}>
            Herdado: {state.context.rootNote?.name} {state.context.scaleType}
          </p>
          {/* Futuramente: Dropdowns independentes para prática */}
        </div>
      </aside>

      {/* Centro: Fretboard Gigante */}
      <section className="practice-fretboard-section">
        <h2 className="practice-title">Estação de Treinamento</h2>
        <div className="fretboard-wrapper-large">
          <Fretboard />
        </div>
      </section>

      {/* Direita: Sub-modos e Controles */}
      <aside className="practice-sidebar right-sidebar">
        <div className="panel">
          <p className="panel-title">Modos de Treino</p>
          <div className="submode-selector">
            <button 
              className={`mode-btn ${subMode === 'free' ? 'active' : ''}`}
              onClick={() => setSubMode('free')}
            >
              🛠️ Construção Livre
            </button>
            <button 
              className={`mode-btn ${subMode === 'guided' ? 'active' : ''}`}
              onClick={() => setSubMode('guided')}
            >
              🎯 Desafio Guiado
            </button>
            <button 
              className={`mode-btn ${subMode === 'identify' ? 'active' : ''}`}
              onClick={() => setSubMode('identify')}
            >
              👁️ Identificação
            </button>
            <button 
              className={`mode-btn ${subMode === 'arpeggio' ? 'active' : ''}`}
              onClick={() => setSubMode('arpeggio')}
            >
              🎶 Arpejos (BPM)
            </button>
          </div>
        </div>

        {/* Dynamic Panel based on Sub-mode */}
        <div className="panel flex-fill">
          {subMode === 'free' && (
            <div className="submode-content">
              <p className="panel-title">Análise Reversa</p>
              <input type="text" placeholder="Digite um acorde (Ex: C7M)" className="reverse-input" />
              <button className="action-btn">Visualizar</button>
              
              <div className="analysis-box">
                <p>Análise Teórica:</p>
                <div className="analysis-result">
                  {/* Resultado da validação do Fretboard aparecerá aqui ou no próprio braço */}
                  <span style={{ color: '#888', fontStyle: 'italic' }}>Aguardando interação no braço...</span>
                </div>
              </div>
            </div>
          )}

          {subMode === 'guided' && (
            <div className="submode-content">
              <p className="panel-title">Desafio: MMR</p>
              <div className="challenge-box">
                <h3>Monte um:</h3>
                <h1 className="challenge-target">Dmaj9</h1>
                <p className="challenge-hint">Dica: Tônica, 3ª, 7ª, 9ª (Drop 5)</p>
              </div>
            </div>
          )}

          {subMode === 'identify' && (
            <div className="submode-content">
              <p className="panel-title">O que é isso?</p>
              <div className="multiple-choice">
                <button>Cmaj7</button>
                <button>Am9</button>
                <button>Em7</button>
                <button>G6</button>
              </div>
            </div>
          )}

          {subMode === 'arpeggio' && (
            <div className="submode-content">
              <p className="panel-title">Metrônomo</p>
              <div className="bpm-control">
                <input type="range" min="60" max="200" defaultValue="120" />
                <span>120 BPM</span>
              </div>
              <button className="play-btn">▶ Play Arpejo</button>
            </div>
          )}
        </div>
      </aside>
    </main>
  );
}
