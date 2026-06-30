/**
 * @hearmony/core — Serviço de Afinação Customizável
 *
 * Ref: SPEC-2.01
 */

import type { Note } from '../types/music.js';
import type { TuningConfig, TuningPreset, TuningString, ITuningService } from '../types/tuning.js';
import { CHROMATIC_NOTES, createNote } from '../types/music.js';
import { PRESETS, STANDARD_OCTAVES } from './constants.js';

/**
 * Normaliza nomes de notas para aceitar bemóis e minúsculas.
 */
export function normalizeNoteName(note: string): string {
  const trimmed = note.trim();
  const flatToSharp: Record<string, string> = {
    'Db': 'C#',
    'Eb': 'D#',
    'Gb': 'F#',
    'Ab': 'G#',
    'Bb': 'A#',
    'db': 'C#',
    'eb': 'D#',
    'gb': 'F#',
    'ab': 'G#',
    'bb': 'A#',
    'Cb': 'B',
    'cb': 'B',
    'Fb': 'E',
    'fb': 'E',
  };
  return flatToSharp[trimmed] || trimmed.toUpperCase();
}

/**
 * Calcula a frequência fundamental a partir do nome da nota e oitava.
 * Fórmula: f = 440 * 2^((n - 69) / 12) onde n é o número da nota MIDI.
 */
export function getFrequency(noteName: string, octave: number): number {
  const normName = normalizeNoteName(noteName);
  const position = CHROMATIC_NOTES.indexOf(normName as any);
  if (position === -1) {
    throw new Error(`Nota inválida: ${noteName}`);
  }
  const n = (octave + 1) * 12 + position;
  const freq = 440 * Math.pow(2, (n - 69) / 12);
  return Math.round(freq * 100) / 100;
}

/**
 * Helper para aplicar capo a uma configuração base.
 */
export function applyCapoToConfig(baseConfig: TuningConfig, capo: number): TuningConfig {
  const strings = baseConfig.strings.map((str) => {
    const basePosition = CHROMATIC_NOTES.indexOf(str.note as any);
    const newPosition = (basePosition + capo) % 12;
    const semitonesPassed = basePosition + capo;
    const octaveShift = Math.floor(semitonesPassed / 12);
    const newOctave = str.octave + octaveShift;
    const newNoteName = CHROMATIC_NOTES[newPosition];
    const newFreq = getFrequency(newNoteName, newOctave);

    return {
      stringNumber: str.stringNumber,
      note: newNoteName,
      octave: newOctave,
      frequency: newFreq,
    };
  });

  return {
    instrument: baseConfig.instrument,
    presetName: baseConfig.presetName,
    capo,
    strings,
  };
}

export class TuningService implements ITuningService {
  private baseConfig!: TuningConfig;
  private activeConfig!: TuningConfig;

  constructor(initialInstrument: TuningConfig['instrument'] = 'guitar') {
    this.initDefault(initialInstrument);
  }

  /**
   * Inicializa o instrumento com a afinação standard padrão.
   */
  private initDefault(instrument: TuningConfig['instrument']): void {
    const defaultPreset = PRESETS.find(
      (p) => p.instrument === instrument && p.name === 'Standard',
    );
    if (!defaultPreset) {
      throw new Error(`Preset standard não encontrado para o instrumento: ${instrument}`);
    }
    this.baseConfig = this.buildConfigFromPreset(defaultPreset);
    this.activeConfig = { ...this.baseConfig };
  }

  private buildConfigFromPreset(preset: TuningPreset): TuningConfig {
    const octaves = STANDARD_OCTAVES[preset.instrument];
    const numStrings = preset.notes.length;

    const strings: TuningString[] = preset.notes.map((noteName, index) => {
      // notes são listadas grave → aguda (index 0 é a mais grave)
      // stringNumber: 1 = mais aguda, numStrings = mais grave
      const stringNumber = numStrings - index;
      const octave = octaves[index];
      const normalizedNote = normalizeNoteName(noteName);
      const frequency = getFrequency(normalizedNote, octave);

      return {
        stringNumber,
        note: normalizedNote,
        octave,
        frequency,
      };
    });

    // Ordena strings por stringNumber crescente (1, 2, 3...)
    strings.sort((a, b) => a.stringNumber - b.stringNumber);

    return {
      instrument: preset.instrument,
      presetName: preset.name,
      capo: 0,
      strings,
    };
  }

  public getPresets(instrument: TuningConfig['instrument']): readonly TuningPreset[] {
    return PRESETS.filter((p) => p.instrument === instrument);
  }

  public applyPreset(presetId: string): TuningConfig {
    const preset = PRESETS.find((p) => p.id === presetId);
    if (!preset) {
      throw new Error(`Preset não encontrado: ${presetId}`);
    }

    this.baseConfig = this.buildConfigFromPreset(preset);
    this.activeConfig = { ...this.baseConfig };
    return this.activeConfig;
  }

  public setCustomTuning(
    stringsToModify: Array<{ stringNumber: number; note: string }>,
  ): TuningConfig {
    // Clona as strings da baseConfig
    const newBaseStrings = this.baseConfig.strings.map((s) => ({ ...s }));

    for (const mod of stringsToModify) {
      const idx = newBaseStrings.findIndex((s) => s.stringNumber === mod.stringNumber);
      if (idx === -1) {
        throw new Error(`Corda inválida: ${mod.stringNumber}`);
      }

      const currentString = newBaseStrings[idx];
      const normNoteName = normalizeNoteName(mod.note);
      
      // Encontra a oitava mais próxima
      const targetPos = CHROMATIC_NOTES.indexOf(normNoteName as any);
      if (targetPos === -1) {
        throw new Error(`Nota inválida: ${mod.note}`);
      }

      const currentPos = CHROMATIC_NOTES.indexOf(currentString.note as any);
      const targetMidiCandidate = (currentString.octave + 1) * 12 + targetPos;
      
      // Testa octaves: -1, 0, +1
      let bestOctave = currentString.octave;
      let minDiff = Infinity;
      const currentMidi = (currentString.octave + 1) * 12 + currentPos;

      for (const octOffset of [-1, 0, 1]) {
        const testOctave = currentString.octave + octOffset;
        const testMidi = (testOctave + 1) * 12 + targetPos;
        const diff = Math.abs(testMidi - currentMidi);
        if (diff < minDiff) {
          minDiff = diff;
          bestOctave = testOctave;
        }
      }

      newBaseStrings[idx] = {
        stringNumber: currentString.stringNumber,
        note: normNoteName,
        octave: bestOctave,
        frequency: getFrequency(normNoteName, bestOctave),
      };
    }

    this.baseConfig = {
      instrument: this.baseConfig.instrument,
      presetName: null, // customizado
      capo: this.baseConfig.capo,
      strings: newBaseStrings,
    };

    this.activeConfig = applyCapoToConfig(this.baseConfig, this.baseConfig.capo);
    return this.activeConfig;
  }

  public setCapo(fret: number): TuningConfig {
    if (fret < 0 || fret > 12) {
      throw new Error('O capotraste deve ser colocado entre as casas 0 e 12.');
    }

    this.baseConfig = {
      ...this.baseConfig,
      capo: fret,
    };

    this.activeConfig = applyCapoToConfig(this.baseConfig, fret);
    return this.activeConfig;
  }

  public getNoteAt(stringNumber: number, fret: number): Note {
    const stringConfig = this.activeConfig.strings.find((s) => s.stringNumber === stringNumber);
    if (!stringConfig) {
      throw new Error(`Corda inválida: ${stringNumber}`);
    }

    const basePosition = CHROMATIC_NOTES.indexOf(stringConfig.note as any);
    const targetPosition = (basePosition + fret) % 12;
    return createNote(CHROMATIC_NOTES[targetPosition]);
  }

  public persist(): void {
    const g = globalThis as any;
    if (typeof g.localStorage !== 'undefined' && g.localStorage) {
      g.localStorage.setItem('hearmony_base_config', JSON.stringify(this.baseConfig));
      g.localStorage.setItem('hearmony_capo', String(this.baseConfig.capo));
    }
  }

  public restore(): TuningConfig | null {
    const g = globalThis as any;
    if (typeof g.localStorage !== 'undefined' && g.localStorage) {
      const savedBase = g.localStorage.getItem('hearmony_base_config');
      const savedCapo = g.localStorage.getItem('hearmony_capo');
      
      if (savedBase) {
        try {
          this.baseConfig = JSON.parse(savedBase);
          const capo = savedCapo ? parseInt(savedCapo, 10) : 0;
          this.activeConfig = applyCapoToConfig(this.baseConfig, capo);
          return this.activeConfig;
        } catch (e) {
          // Fallback silencioso
        }
      }
    }
    return null;
  }

  /**
   * Método auxiliar para testes/acesso interno à configuração ativa.
   */
  public getActiveConfig(): TuningConfig {
    return this.activeConfig;
  }
}
