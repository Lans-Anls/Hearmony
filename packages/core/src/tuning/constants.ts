/**
 * @hearmony/core — Constantes do Sistema de Afinação
 *
 * Ref: SPEC-2.01, seção 4 (Tabela de Presets) e seção 6
 */

import type { TuningPreset } from '../types/tuning.js';

export const STANDARD_OCTAVES = {
  guitar:  [2, 2, 3, 3, 3, 4], // grave → aguda: E2, A2, D3, G3, B3, E4
  bass4:   [1, 1, 2, 2],       // grave → aguda: E1, A1, D2, G2
  bass5:   [0, 1, 1, 2, 2],    // grave → aguda: B0, E1, A1, D2, G2
  ukulele: [4, 4, 4, 4],       // grave → aguda: G4, C4, E4, A4
} as const;

export const PRESETS: readonly TuningPreset[] = [
  // Guitarra (6 cordas)
  {
    id: 'guitar_standard',
    name: 'Standard',
    instrument: 'guitar',
    notes: ['E', 'A', 'D', 'G', 'B', 'E'],
  },
  {
    id: 'guitar_drop_d',
    name: 'Drop D',
    instrument: 'guitar',
    notes: ['D', 'A', 'D', 'G', 'B', 'E'],
  },
  {
    id: 'guitar_open_g',
    name: 'Open G',
    instrument: 'guitar',
    notes: ['D', 'G', 'D', 'G', 'B', 'D'],
  },
  {
    id: 'guitar_open_d',
    name: 'Open D',
    instrument: 'guitar',
    notes: ['D', 'A', 'D', 'F#', 'A', 'D'],
  },
  {
    id: 'guitar_dadgad',
    name: 'DADGAD',
    instrument: 'guitar',
    notes: ['D', 'A', 'D', 'G', 'A', 'D'],
  },
  {
    id: 'guitar_half_step_down',
    name: 'Half-Step Down',
    instrument: 'guitar',
    notes: ['Eb', 'Ab', 'Db', 'Gb', 'Bb', 'Eb'],
  },

  // Baixo 4 cordas
  {
    id: 'bass4_standard',
    name: 'Standard',
    instrument: 'bass4',
    notes: ['E', 'A', 'D', 'G'],
  },
  {
    id: 'bass4_drop_d',
    name: 'Drop D',
    instrument: 'bass4',
    notes: ['D', 'A', 'D', 'G'],
  },

  // Baixo 5 cordas
  {
    id: 'bass5_standard',
    name: 'Standard',
    instrument: 'bass5',
    notes: ['B', 'E', 'A', 'D', 'G'],
  },

  // Ukulele (4 cordas)
  {
    id: 'ukulele_standard',
    name: 'Standard',
    instrument: 'ukulele',
    notes: ['G', 'C', 'E', 'A'],
  },
];
