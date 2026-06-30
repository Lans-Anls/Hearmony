/**
 * @hearmony/core — Tipos para o Validador Cromático
 *
 * Ref: SPEC-1.03, seção 6
 */

import type { Note, Chord } from './music.js';
import type { HarmonicField } from './engine.js';

export interface FretPosition {
  readonly stringNumber: number;
  readonly fret: number;
}

export interface FretInput {
  readonly activeFrets: readonly FretPosition[];
  readonly instrument: 'guitar' | 'ukulele' | 'bass4' | 'bass5';
  readonly tuning: readonly string[];     // ex: ["E", "A", "D", "G", "B", "E"]
}

export interface ChordValidationResult {
  readonly valid: boolean;
  readonly detectedChord: Chord | null;
  readonly degree: string | null;          // "I", "ii", etc. (null se fora do campo)
  readonly inHarmonicField: boolean;
  readonly inversion: number;              // 0 = posição fundamental, 1 = 1ª inversão, etc.
  readonly confidence: number;             // 0.0–1.0
  readonly alternativeInterpretations?: readonly Chord[];  // acordes ambíguos
}

export interface IChromaticValidator {
  /** Identifica acorde a partir de notas do fretboard */
  validateChord(input: FretInput, activeField: HarmonicField): ChordValidationResult;

  /** Converte posições de fretboard em pitch classes */
  fretToNotes(input: FretInput): readonly Note[];

  /** Busca posições alternativas para um acorde no braço */
  findAlternativePositions(
    chord: Chord,
    instrument: FretInput['instrument'],
    tuning: readonly string[],
    maxFretSpan: number    // padrão: 5
  ): readonly FretPosition[][];
}
