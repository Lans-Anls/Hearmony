/**
 * @hearmony/core — Tipos para o Sistema de Afinação Customizável
 *
 * Ref: SPEC-2.01, seção 6
 */

export interface TuningString {
  readonly stringNumber: number;      // 1 = mais aguda, 6 = mais grave (guitarra)
  readonly note: string;              // "E", "D", etc.
  readonly octave: number;            // ex: 2 para E2 (6ª corda guitarra)
  readonly frequency: number;         // Hz calculado
}

export interface TuningConfig {
  readonly instrument: 'guitar' | 'ukulele' | 'bass4' | 'bass5';
  readonly strings: readonly TuningString[];
  readonly capo: number;               // 0 = sem capo, 1-12 = posição do capotraste
  readonly presetName: string | null;  // null = customizado
}

export interface TuningPreset {
  readonly id: string;
  readonly name: string;              // "Standard", "Drop D", etc.
  readonly instrument: TuningConfig['instrument'];
  readonly notes: readonly string[];  // grave → aguda: ["E", "A", "D", "G", "B", "E"]
}

export interface ITuningService {
  /** Retorna lista de presets para o instrumento */
  getPresets(instrument: TuningConfig['instrument']): readonly TuningPreset[];

  /** Aplica preset de afinação */
  applyPreset(presetId: string): TuningConfig;

  /** Configura afinação customizada */
  setCustomTuning(strings: Array<{ stringNumber: number; note: string }>): TuningConfig;

  /** Aplica capotraste */
  setCapo(fret: number): TuningConfig;

  /** Retorna a nota real de uma corda em um traste específico */
  getNoteAt(stringNumber: number, fret: number): import('./music.js').Note;

  /** Salva afinação ativa localmente */
  persist(): void;

  /** Restaura última afinação salva */
  restore(): TuningConfig | null;
}
