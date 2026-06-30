import { describe, it, expect, beforeEach } from 'vitest';
import { ChromaticValidator } from '../src/validator/service.js';
import { HarmonicEngine } from '../src/engine/service.js';
import { createNote } from '../src/types/music.js';
import type { FretInput } from '../src/types/validator.js';

describe('SPEC-1.03: ChromaticValidator', () => {
  let validator: ChromaticValidator;
  let engine: HarmonicEngine;

  beforeEach(() => {
    validator = new ChromaticValidator();
    engine = new HarmonicEngine();
  });

  const activeField = (() => {
    const engine = new HarmonicEngine();
    return engine.generateField(createNote('C'), 'major');
  })();

  const guitarTuning = ['E', 'A', 'D', 'G', 'B', 'E'] as const;

  // ===========================================================================
  // CA-01: Tríades
  // ===========================================================================
  describe('CA-01: Identificação de Tríades', () => {
    it('detecta tríade de Dó Maior (C Major)', () => {
      // C Major no braço:
      // Corda 5 traste 3 (C3), Corda 4 traste 2 (E3), Corda 3 traste 0 (G3)
      const input: FretInput = {
        activeFrets: [
          { stringNumber: 5, fret: 3 },
          { stringNumber: 4, fret: 2 },
          { stringNumber: 3, fret: 0 },
        ],
        instrument: 'guitar',
        tuning: guitarTuning,
      };

      const result = validator.validateChord(input, activeField);
      expect(result.valid).toBe(true);
      expect(result.detectedChord?.name).toBe('C Major');
      expect(result.detectedChord?.quality).toBe('major');
      expect(result.inHarmonicField).toBe(true);
      expect(result.degree).toBe('I');
      expect(result.inversion).toBe(0); // Posição fundamental (C no baixo)
    });

    it('detecta tríade de Dó Menor (C Minor)', () => {
      // C Minor: C, Eb (D#), G.
      // Corda 5 traste 3 (C), Corda 4 traste 1 (Eb/D#), Corda 3 traste 0 (G)
      const input: FretInput = {
        activeFrets: [
          { stringNumber: 5, fret: 3 },
          { stringNumber: 4, fret: 1 },
          { stringNumber: 3, fret: 0 },
        ],
        instrument: 'guitar',
        tuning: guitarTuning,
      };

      const result = validator.validateChord(input, activeField);
      expect(result.valid).toBe(true);
      expect(result.detectedChord?.name).toBe('C Minor');
      expect(result.detectedChord?.quality).toBe('minor');
      // C Minor não está no campo harmônico de C Maior (onde o I é C Maior)
      expect(result.inHarmonicField).toBe(false);
      expect(result.degree).toBeNull();
    });

    it('detecta tríade de Dó Diminuto (C Dim)', () => {
      // C Dim: C, Eb (D#), Gb (F#).
      // Corda 5 traste 3 (C), Corda 4 traste 1 (D#), Corda 3 traste 11 (F# / Gb)
      const input: FretInput = {
        activeFrets: [
          { stringNumber: 5, fret: 3 },
          { stringNumber: 4, fret: 1 },
          { stringNumber: 3, fret: 11 },
        ],
        instrument: 'guitar',
        tuning: guitarTuning,
      };

      const result = validator.validateChord(input, activeField);
      expect(result.valid).toBe(true);
      expect(result.detectedChord?.name).toBe('C Dim');
      expect(result.detectedChord?.quality).toBe('diminished');
    });

    it('detecta tríade de Dó Aumentado (C Aug)', () => {
      // C Aug: C, E, G#
      const input: FretInput = {
        activeFrets: [
          { stringNumber: 5, fret: 3 }, // C
          { stringNumber: 4, fret: 2 }, // E
          { stringNumber: 3, fret: 1 }, // G#
        ],
        instrument: 'guitar',
        tuning: guitarTuning,
      };

      const result = validator.validateChord(input, activeField);
      expect(result.valid).toBe(true);
      expect(result.detectedChord?.name).toBe('C Aug');
      expect(result.detectedChord?.quality).toBe('augmented');
    });
  });

  // ===========================================================================
  // CA-02: Tétrades
  // ===========================================================================
  describe('CA-02: Identificação de Tétrades', () => {
    it('detecta Dó com 7ª Maior (C Maj7)', () => {
      // C, E, G, B
      const input: FretInput = {
        activeFrets: [
          { stringNumber: 5, fret: 3 }, // C
          { stringNumber: 4, fret: 2 }, // E
          { stringNumber: 3, fret: 0 }, // G
          { stringNumber: 2, fret: 0 }, // B
        ],
        instrument: 'guitar',
        tuning: guitarTuning,
      };

      const result = validator.validateChord(input, activeField);
      expect(result.valid).toBe(true);
      expect(result.detectedChord?.name).toBe('C Maj7');
      expect(result.detectedChord?.quality).toBe('major');
    });

    it('detecta Dó com 7ª menor / Dominante (C 7)', () => {
      // C, E, G, Bb (A#)
      const input: FretInput = {
        activeFrets: [
          { stringNumber: 5, fret: 3 }, // C
          { stringNumber: 4, fret: 2 }, // E
          { stringNumber: 3, fret: 3 }, // Bb / A#
          { stringNumber: 1, fret: 3 }, // G
        ],
        instrument: 'guitar',
        tuning: guitarTuning,
      };

      const result = validator.validateChord(input, activeField);
      expect(result.valid).toBe(true);
      expect(result.detectedChord?.name).toBe('C 7');
    });
  });

  // ===========================================================================
  // CA-03: Inversões
  // ===========================================================================
  describe('CA-03: Reconhecimento de Inversões', () => {
    it('reconhece 1ª inversão de C Major (baixo em Mi / E)', () => {
      // C Major em 1ª inversão: E no baixo, depois G e C.
      // Corda 6 traste 0 (E), Corda 5 traste 10 (G), Corda 4 traste 10 (C)
      const input: FretInput = {
        activeFrets: [
          { stringNumber: 6, fret: 0 },  // E2 (mais grave)
          { stringNumber: 5, fret: 10 }, // G3
          { stringNumber: 4, fret: 10 }, // C4
        ],
        instrument: 'guitar',
        tuning: guitarTuning,
      };

      const result = validator.validateChord(input, activeField);
      expect(result.valid).toBe(true);
      expect(result.detectedChord?.name).toBe('C Major');
      expect(result.inversion).toBe(1); // 1ª inversão (baixo na terça)
    });

    it('reconhece 2ª inversão de C Major (baixo em Sol / G)', () => {
      // C Major em 2ª inversão: G no baixo, depois C e E.
      // Corda 6 traste 3 (G), Corda 5 traste 3 (C), Corda 4 traste 2 (E)
      const input: FretInput = {
        activeFrets: [
          { stringNumber: 6, fret: 3 }, // G2 (mais grave)
          { stringNumber: 5, fret: 3 }, // C3
          { stringNumber: 4, fret: 2 }, // E3
        ],
        instrument: 'guitar',
        tuning: guitarTuning,
      };

      const result = validator.validateChord(input, activeField);
      expect(result.valid).toBe(true);
      expect(result.detectedChord?.name).toBe('C Major');
      expect(result.inversion).toBe(2); // 2ª inversão (baixo na quinta)
    });
  });

  // ===========================================================================
  // CA-04 & CA-05: Pertencimento ao campo harmônico
  // ===========================================================================
  describe('CA-04 & CA-05: Campo Harmônico', () => {
    it('destaca acorde do campo com inHarmonicField e seu grau correto', () => {
      // F# Minor no campo de C Major? Não.
      // Vamos testar G Major (V em C Major): G, B, D
      // Corda 6 traste 3 (G), Corda 5 traste 2 (B), Corda 4 traste 0 (D)
      const input: FretInput = {
        activeFrets: [
          { stringNumber: 6, fret: 3 },
          { stringNumber: 5, fret: 2 },
          { stringNumber: 4, fret: 0 },
        ],
        instrument: 'guitar',
        tuning: guitarTuning,
      };

      const result = validator.validateChord(input, activeField);
      expect(result.valid).toBe(true);
      expect(result.detectedChord?.name).toBe('G Major');
      expect(result.inHarmonicField).toBe(true);
      expect(result.degree).toBe('V');
    });

    it('identifica corretamente acorde correto fora do campo harmônico', () => {
      // Eb Major (Eb, G, Bb) não pertence a C Maior
      const input: FretInput = {
        activeFrets: [
          { stringNumber: 5, fret: 6 }, // Eb
          { stringNumber: 4, fret: 5 }, // G
          { stringNumber: 3, fret: 3 }, // Bb
        ],
        instrument: 'guitar',
        tuning: guitarTuning,
      };

      const result = validator.validateChord(input, activeField);
      expect(result.valid).toBe(true);
      expect(result.detectedChord?.name).toBe('D# Major'); // Eb normalizado para D#
      expect(result.inHarmonicField).toBe(false);
      expect(result.degree).toBeNull();
    });
  });

  // ===========================================================================
  // CA-06: Rejeição de conjuntos inválidos
  // ===========================================================================
  describe('CA-06: Rejeição de notas inválidas', () => {
    it('rejeita se houver apenas 2 notas distintas (pitch classes)', () => {
      const input: FretInput = {
        activeFrets: [
          { stringNumber: 5, fret: 3 }, // C
          { stringNumber: 2, fret: 1 }, // C (oitava duplicada)
        ],
        instrument: 'guitar',
        tuning: guitarTuning,
      };

      const result = validator.validateChord(input, activeField);
      expect(result.valid).toBe(false);
      expect(result.detectedChord).toBeNull();
    });

    it('rejeita se houver 5 notas distintas', () => {
      const input: FretInput = {
        activeFrets: [
          { stringNumber: 6, fret: 0 }, // E
          { stringNumber: 5, fret: 0 }, // A
          { stringNumber: 4, fret: 0 }, // D
          { stringNumber: 3, fret: 0 }, // G
          { stringNumber: 2, fret: 0 }, // B
        ],
        instrument: 'guitar',
        tuning: guitarTuning,
      };

      const result = validator.validateChord(input, activeField);
      expect(result.valid).toBe(false);
    });
  });

  // ===========================================================================
  // CA-07: Posições Alternativas
  // ===========================================================================
  describe('CA-07: Posições Alternativas (findAlternativePositions)', () => {
    it('encontra posições alternativas para C Major e respeita o span de trastes', () => {
      const field = engine.generateField(createNote('C'), 'major');
      const chord = field.chords[0]; // C Major
      
      const alternatives = validator.findAlternativePositions(
        chord,
        'guitar',
        guitarTuning,
        5, // maxFretSpan
      );

      expect(alternatives.length).toBeGreaterThan(0);

      for (const alt of alternatives) {
        // Cada alternativa deve ter no máximo 1 nota por corda
        const stringsUsed = alt.map((v) => v.stringNumber);
        const uniqueStrings = new Set(stringsUsed);
        expect(stringsUsed.length).toBe(uniqueStrings.size);

        // O span dos trastes pressionados (fret > 0) deve ser no máximo 5 casas
        const pressedFrets = alt.filter((v) => v.fret > 0).map((v) => v.fret);
        if (pressedFrets.length > 0) {
          const max = Math.max(...pressedFrets);
          const min = Math.min(...pressedFrets);
          expect(max - min).toBeLessThanOrEqual(5);
        }
      }
    });
  });

  // ===========================================================================
  // CA-08: Desempenho
  // ===========================================================================
  describe('CA-08: Benchmark de desempenho', () => {
    it('executa a validação em menos de 50ms', () => {
      const input: FretInput = {
        activeFrets: [
          { stringNumber: 5, fret: 3 },
          { stringNumber: 4, fret: 2 },
          { stringNumber: 3, fret: 0 },
        ],
        instrument: 'guitar',
        tuning: guitarTuning,
      };

      const start = performance.now();
      for (let i = 0; i < 100; i++) {
        validator.validateChord(input, activeField);
      }
      const duration = performance.now() - start;
      // 100 execuções devem ser muito rápidas, muito abaixo de 50ms (geralmente < 10ms total)
      expect(duration).toBeLessThan(50);
    });
  });
});
