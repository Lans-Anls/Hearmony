/**
 * Testes — SPEC-2.02: Gerenciamento de Estado Global
 *
 * Valida os critérios de aceite CA-01 a CA-08.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { appReducer } from '../src/store/reducer.js';
import { DEFAULT_STATE } from '../src/store/initial.js';
import type { AppState } from '../src/store/types.js';
import { HarmonicEngine } from '../src/engine/service.js';
import { ChromaticValidator } from '../src/validator/service.js';
import { TuningService } from '../src/tuning/service.js';
import { createNote } from '../src/types/music.js';
import type { FretInput } from '../src/types/validator.js';

const engine = new HarmonicEngine();
const validator = new ChromaticValidator();

// Campo harmônico base para testes
const fieldC = engine.generateField(createNote('C'), 'major');
const tuningStandard = ['E', 'A', 'D', 'G', 'B', 'E'] as const;

function makeState(): AppState {
  return structuredClone(DEFAULT_STATE) as AppState;
}

// ===========================================================================
// CA-01: SELECT_ROOT_NOTE + SELECT_SCALE_TYPE gera harmonicField não-nulo
// ===========================================================================
describe('CA-01: SELECT_ROOT_NOTE + SELECT_SCALE_TYPE', () => {
  it('SELECT_ROOT_NOTE limpa campo e seleção e armazena a nota', () => {
    const s0 = makeState();
    const s1 = appReducer(s0, { type: 'SELECT_ROOT_NOTE', payload: createNote('E') });

    expect(s1.context.rootNote?.name).toBe('E');
    expect(s1.context.harmonicField).toBeNull();
    expect(s1.selection.selectedChordId).toBeNull();
    expect(s1.selection.recommendations).toHaveLength(0);
  });

  it('SELECT_SCALE_TYPE persiste a escala e reseta campo', () => {
    const s0 = makeState();
    const s1 = appReducer(s0, { type: 'SELECT_SCALE_TYPE', payload: 'major' });

    expect(s1.context.scaleType).toBe('major');
    expect(s1.context.harmonicField).toBeNull();
  });

  it('SET_HARMONIC_FIELD gera harmonicField não-nulo após seleção', () => {
    let state = makeState();
    state = appReducer(state, { type: 'SELECT_ROOT_NOTE', payload: createNote('C') });
    state = appReducer(state, { type: 'SELECT_SCALE_TYPE', payload: 'major' });
    state = appReducer(state, { type: 'SET_HARMONIC_FIELD', payload: fieldC });

    expect(state.context.harmonicField).not.toBeNull();
    expect(state.context.harmonicField?.chords).toHaveLength(7);
  });
});

// ===========================================================================
// CA-02: SELECT_CHORD popula recommendations e mappedPositions
// ===========================================================================
describe('CA-02: SELECT_CHORD', () => {
  let state: AppState;

  beforeEach(() => {
    state = makeState();
    state = appReducer(state, { type: 'SET_HARMONIC_FIELD', payload: fieldC });
  });

  it('popula selectedChordId, recommendations e mappedPositions', () => {
    const recs = engine.getRecommendations(fieldC.graph, 'C_MAJ_I');
    const mockPositions = [[{ stringNumber: 5, fret: 3 }]];

    const next = appReducer(state, {
      type: 'SELECT_CHORD',
      payload: { chordId: 'C_MAJ_I', recommendations: recs, mappedPositions: mockPositions },
    });

    expect(next.selection.selectedChordId).toBe('C_MAJ_I');
    expect(next.selection.recommendations.length).toBeGreaterThan(0);
    expect(next.fretboard.mappedPositions).not.toBeNull();
  });
});

// ===========================================================================
// CA-03: CLEAR_SELECTION zera selectedChordId, recommendations, mappedPositions
// ===========================================================================
describe('CA-03: CLEAR_SELECTION', () => {
  it('zera todos os campos de seleção e fretboard', () => {
    let state = makeState();
    const recs = engine.getRecommendations(fieldC.graph, 'C_MAJ_I');

    state = appReducer(state, {
      type: 'SELECT_CHORD',
      payload: { chordId: 'C_MAJ_I', recommendations: recs, mappedPositions: [[{ stringNumber: 5, fret: 3 }]] },
    });

    const cleared = appReducer(state, { type: 'CLEAR_SELECTION' });

    expect(cleared.selection.selectedChordId).toBeNull();
    expect(cleared.selection.recommendations).toHaveLength(0);
    expect(cleared.fretboard.mappedPositions).toBeNull();
  });
});

// ===========================================================================
// CA-04: USER_FRET_INPUT dispara validação e popula validationResult
// ===========================================================================
describe('CA-04: USER_FRET_INPUT', () => {
  it('popula validationResult com resultado da validação', () => {
    let state = makeState();
    state = appReducer(state, { type: 'SET_HARMONIC_FIELD', payload: fieldC });

    const input: FretInput = {
      activeFrets: [
        { stringNumber: 5, fret: 3 },
        { stringNumber: 4, fret: 2 },
        { stringNumber: 3, fret: 0 },
      ],
      instrument: 'guitar',
      tuning: tuningStandard,
    };

    const result = validator.validateChord(input, fieldC);
    const recs = result.inHarmonicField
      ? engine.getRecommendations(fieldC.graph, 'C_MAJ_I')
      : [];

    const next = appReducer(state, {
      type: 'USER_FRET_INPUT',
      payload: { input, result, recommendations: recs },
    });

    expect(next.fretboard.validationResult).not.toBeNull();
    expect(next.fretboard.validationResult?.valid).toBe(true);
    expect(next.fretboard.activeInputFrets).toHaveLength(3);
  });
});

// ===========================================================================
// CA-05: CHANGE_TUNING recalcula mappedPositions se há acorde selecionado
// ===========================================================================
describe('CA-05: CHANGE_TUNING', () => {
  it('recalcula mappedPositions quando há acorde selecionado', () => {
    let state = makeState();
    const recs = engine.getRecommendations(fieldC.graph, 'C_MAJ_I');
    const original = [[{ stringNumber: 5, fret: 3 }]];
    const newPositions = [[{ stringNumber: 6, fret: 8 }]];

    state = appReducer(state, {
      type: 'SELECT_CHORD',
      payload: { chordId: 'C_MAJ_I', recommendations: recs, mappedPositions: original },
    });

    const tuningService = new TuningService('guitar');
    const newConfig = tuningService.applyPreset('guitar_drop_d');

    const next = appReducer(state, {
      type: 'CHANGE_TUNING',
      payload: { config: newConfig, mappedPositions: newPositions },
    });

    expect(next.tuning.config.presetName).toBe('Drop D');
    // mappedPositions devem ter sido recalculadas (porque havia acorde selecionado)
    expect(next.fretboard.mappedPositions).toEqual(newPositions);
  });

  it('NÃO altera mappedPositions quando não há acorde selecionado', () => {
    const state = makeState();
    const tuningService = new TuningService('guitar');
    const newConfig = tuningService.applyPreset('guitar_drop_d');

    const next = appReducer(state, {
      type: 'CHANGE_TUNING',
      payload: { config: newConfig, mappedPositions: [[{ stringNumber: 6, fret: 8 }]] },
    });

    expect(next.fretboard.mappedPositions).toBeNull();
  });
});

// ===========================================================================
// CA-06: CLEAR_SECONDARY_COLOR remove arcos bicolores instantaneamente
// ===========================================================================
describe('CA-06: CLEAR_SECONDARY_COLOR', () => {
  it('remove secondaryColor do fretboard', () => {
    let state = makeState();
    state = appReducer(state, { type: 'SET_SECONDARY_COLOR', payload: '#3498DB' });
    expect(state.fretboard.secondaryColor).toBe('#3498DB');

    const next = appReducer(state, { type: 'CLEAR_SECONDARY_COLOR' });
    expect(next.fretboard.secondaryColor).toBeNull();
  });
});

// ===========================================================================
// CA-07 & CA-08: Estado serializável + propagação O(1)
// ===========================================================================
describe('CA-07 & CA-08: Serializabilidade e performance', () => {
  it('estado é serializável (JSON.stringify/parse)', () => {
    let state = makeState();
    state = appReducer(state, { type: 'SET_HARMONIC_FIELD', payload: fieldC });

    const serialized = JSON.stringify(state);
    const restored = JSON.parse(serialized) as AppState;

    expect(restored.context.harmonicField?.chords).toHaveLength(7);
  });

  it('CA-08: 1000 transições de estado completam em menos de 16ms', () => {
    const recs = engine.getRecommendations(fieldC.graph, 'C_MAJ_I');

    const start = performance.now();
    let state = makeState();
    for (let i = 0; i < 1000; i++) {
      if (i % 2 === 0) {
        state = appReducer(state, {
          type: 'SELECT_CHORD',
          payload: { chordId: 'C_MAJ_I', recommendations: recs, mappedPositions: null },
        });
      } else {
        state = appReducer(state, { type: 'CLEAR_SELECTION' });
      }
    }
    const elapsed = performance.now() - start;

    // 1000 transitions should complete well under 16ms (typically < 5ms)
    expect(elapsed).toBeLessThan(16);
  });
});
