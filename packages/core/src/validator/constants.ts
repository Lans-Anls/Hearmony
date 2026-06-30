/**
 * @hearmony/core — Constantes do Validador Cromático
 *
 * Ref: SPEC-1.03, seção 4
 */

import type { ChordQuality } from '../types/music.js';

export interface ChordTemplate {
  readonly quality: ChordQuality;
  readonly suffix: string;
  readonly intervals: readonly number[];
}

export const CHORD_TEMPLATES: readonly ChordTemplate[] = [
  // Tríades
  { quality: 'major',      suffix: 'Major',       intervals: [0, 4, 7] },
  { quality: 'minor',      suffix: 'Minor',       intervals: [0, 3, 7] },
  { quality: 'diminished', suffix: 'Dim',         intervals: [0, 3, 6] },
  { quality: 'augmented',  suffix: 'Aug',         intervals: [0, 4, 8] },

  // Tétrades
  { quality: 'major',      suffix: 'Maj7',        intervals: [0, 4, 7, 11] },
  { quality: 'major',      suffix: '7',           intervals: [0, 4, 7, 10] },
  { quality: 'minor',      suffix: 'Min7',        intervals: [0, 3, 7, 10] },
  { quality: 'diminished', suffix: 'Dim7',        intervals: [0, 3, 6, 9] },
  // Tétrades estendidas comuns (shell voicings e omit 5)
  { quality: 'major',      suffix: 'Maj9',        intervals: [0, 2, 4, 11] },
  { quality: 'major',      suffix: '9',           intervals: [0, 2, 4, 10] },
  { quality: 'minor',      suffix: 'Min9',        intervals: [0, 2, 3, 10] },
  { quality: 'major',      suffix: '6/9',         intervals: [0, 2, 4, 9] },
  { quality: 'major',      suffix: 'Maj7(13)',    intervals: [0, 4, 9, 11] },
  { quality: 'major',      suffix: '13',          intervals: [0, 4, 9, 10] },
  { quality: 'minor',      suffix: 'Min7(11)',    intervals: [0, 3, 5, 10] },
  
  // Tétrades com inversões comuns ou power chords com 9
  { quality: 'major',      suffix: 'add9',        intervals: [0, 2, 4, 7] },
  { quality: 'minor',      suffix: 'm(add9)',     intervals: [0, 2, 3, 7] },

  // Acordes de 5 notas completos
  { quality: 'major',      suffix: 'Maj9',        intervals: [0, 2, 4, 7, 11] },
  { quality: 'major',      suffix: '9',           intervals: [0, 2, 4, 7, 10] },
  { quality: 'minor',      suffix: 'Min9',        intervals: [0, 2, 3, 7, 10] },
  { quality: 'major',      suffix: '6/9',         intervals: [0, 2, 4, 7, 9] },
];
