import { useAppState, useAppDispatch } from '../../store/AppContext';
import { HarmonyGraph } from '../../components/HarmonyGraph/HarmonyGraph';
import { Fretboard } from '../../components/Fretboard/Fretboard';
import { CHROMATIC_NOTES, createNote, TuningService, type HarmonicField } from '@hearmony/core';

const SCALE_OPTIONS: Array<{ value: HarmonicField['scaleType']; label: string }> = [
  { value: 'major',          label: 'Maior' },
  { value: 'minor_natural',  label: 'Menor Natural' },
  { value: 'minor_harmonic', label: 'Menor Harmônica' },
  { value: 'minor_melodic',  label: 'Menor Melódica' },
];

const GUITAR_PRESETS = new TuningService('guitar').getPresets('guitar');

function ExplorationSidebar() {
  const state    = useAppState();
  const dispatch = useAppDispatch();

  const { rootNote, scaleType } = state.context;
  const { config } = state.tuning;

  function handleRootChange(name: string) {
    dispatch({ type: 'SELECT_ROOT_NOTE', payload: createNote(name) });
  }

  function handleScaleChange(scale: HarmonicField['scaleType']) {
    dispatch({ type: 'SELECT_SCALE_TYPE', payload: scale });
  }

  function handlePreset(presetId: string) {
    const svc = new TuningService(config.instrument);
    const newConfig = svc.applyPreset(presetId);
    dispatch({ type: 'CHANGE_TUNING', payload: { config: newConfig, mappedPositions: null } });
  }

  function handleCapo(fret: number) {
    const svc = new TuningService(config.instrument);
    svc.applyPreset(config.presetName ? `${config.instrument}_${config.presetName.toLowerCase().replace(/\s/g, '_')}` : 'guitar_standard');
    const newConfig = svc.setCapo(fret);
    dispatch({ type: 'SET_CAPO', payload: { config: newConfig, mappedPositions: null } });
  }

  return (
    <aside className="sidebar">
      {/* Seletor de Contexto */}
      <div className="panel" id="context-panel">
        <p className="panel-title">Contexto Harmônico</p>
        <div className="context-selector">
          <div className="select-group">
            <label htmlFor="root-note-select" className="select-label">Nota Raiz</label>
            <select
              id="root-note-select"
              className="styled-select"
              value={rootNote?.name ?? ''}
              onChange={e => handleRootChange(e.target.value)}
            >
              <option value="" disabled>Selecionar nota…</option>
              {CHROMATIC_NOTES.map((n: string) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          <div className="select-group">
            <label htmlFor="scale-type-select" className="select-label">Tipo de Escala</label>
            <select
              id="scale-type-select"
              className="styled-select"
              value={scaleType ?? ''}
              onChange={e => handleScaleChange(e.target.value as HarmonicField['scaleType'])}
            >
              <option value="" disabled>Selecionar escala…</option>
              {SCALE_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Afinação */}
      <div className="panel" id="tuning-panel">
        <p className="panel-title">Afinação — {config.instrument}</p>
        <div className="tuning-panel">
          <div className="preset-grid">
            {GUITAR_PRESETS.map((p: any) => (
              <button
                key={p.id}
                id={`preset-btn-${p.id}`}
                type="button"
                className={`preset-btn ${config.presetName === p.name ? 'active' : ''}`}
                onClick={() => handlePreset(p.id)}
              >
                {p.name}
              </button>
            ))}
          </div>

          <div className="capo-row">
            <label htmlFor="capo-input" className="capo-label">Capotraste</label>
            <input
              id="capo-input"
              type="number"
              className="capo-input"
              min={0}
              max={12}
              value={config.capo}
              onChange={e => handleCapo(parseInt(e.target.value) || 0)}
            />
          </div>
        </div>
      </div>

      {/* Info das notas da escala ativa */}
      {state.context.harmonicField && (
        <div className="panel" id="scale-notes-panel">
          <p className="panel-title">Notas da Escala</p>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {state.context.harmonicField.scaleNotes.map((n: any, i: number) => (
              <span
                key={i}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                }}
              >
                {n.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}

export function ExplorationPage() {
  const state = useAppState();
  const { harmonicField } = state.context;

  return (
    <main className="app-main">
      <ExplorationSidebar />

      <section id="graph-section" aria-label="Grafo de Harmonia">
        {harmonicField ? (
          <HarmonyGraph graph={harmonicField.graph} />
        ) : (
          <div className="empty-state">
            <span className="empty-icon">🎶</span>
            <p>Selecione uma nota raiz e um tipo de escala para ver o grafo harmônico</p>
          </div>
        )}
      </section>

      <section id="fretboard-section" aria-label="Braço do instrumento">
        <Fretboard />
      </section>
    </main>
  );
}
