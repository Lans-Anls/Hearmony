/**
 * @hearmony/core — Tipos do Estado Global
 *
 * Ref: SPEC-2.02, seção 6 (Interface / Contrato)
 */

import type { Note } from '../types/music.js';
import type { HarmonicField, Recommendation } from '../types/engine.js';
import type { FretInput, FretPosition, ChordValidationResult } from '../types/validator.js';
import type { TuningConfig } from '../types/tuning.js';

// ---------------------------------------------------------------------------
// Slices de Estado
// ---------------------------------------------------------------------------

/**
 * Contexto harmônico: nota raiz + escala + campo gerado.
 */
export interface ContextState {
  rootNote: Note | null;
  scaleType: HarmonicField['scaleType'] | null;
  harmonicField: HarmonicField | null;
}

/**
 * Seleção ativa no grafo e modo de interação.
 */
export interface SelectionState {
  selectedChordId: string | null;
  recommendations: readonly Recommendation[];
  mode: 'exploration' | 'practice';
}

/**
 * Estado do braço do instrumento.
 */
export interface FretboardState {
  mappedPositions: readonly (readonly FretPosition[])[] | null;
  activeShapeIndex: number;
  activeInputFrets: readonly { stringNumber: number; fret: number }[];
  validationResult: ChordValidationResult | null;
  secondaryColor: string | null;
}

/**
 * Afinação ativa.
 */
export interface TuningState {
  config: TuningConfig;
  instrument: TuningConfig['instrument'];
}

/**
 * Estado global completo da aplicação.
 */
export interface AppState {
  context: ContextState;
  selection: SelectionState;
  fretboard: FretboardState;
  tuning: TuningState;
}

// ---------------------------------------------------------------------------
// Ações
// ---------------------------------------------------------------------------

export type AppAction =
  | { type: 'SELECT_ROOT_NOTE'; payload: Note }
  | { type: 'SELECT_SCALE_TYPE'; payload: HarmonicField['scaleType'] }
  | { type: 'SET_HARMONIC_FIELD'; payload: HarmonicField }
  | {
      type: 'SELECT_CHORD';
      payload: {
        chordId: string | null;
        recommendations: readonly Recommendation[];
        mappedPositions: readonly (readonly FretPosition[])[] | null;
      };
    }
  | { type: 'SET_SHAPE_INDEX'; payload: number }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'USER_FRET_INPUT'; payload: { input: FretInput; result: ChordValidationResult; recommendations: readonly Recommendation[] } }
  | { type: 'CHANGE_TUNING'; payload: { config: TuningConfig; mappedPositions: readonly (readonly FretPosition[])[] | null } }
  | { type: 'SET_CAPO'; payload: { config: TuningConfig; mappedPositions: readonly (readonly FretPosition[])[] | null } }
  | { type: 'CLEAR_SECONDARY_COLOR' }
  | { type: 'CHANGE_INSTRUMENT'; payload: { config: TuningConfig } }
  | { type: 'SET_MODE'; payload: 'exploration' | 'practice' }
  | { type: 'SET_SECONDARY_COLOR'; payload: string };
