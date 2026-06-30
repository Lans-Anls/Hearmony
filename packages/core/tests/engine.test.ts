import { describe, it, expect, beforeEach } from 'vitest';
import { HarmonicEngine } from '../src/engine/service.js';
import { createNote } from '../src/types/music.js';

describe('SPEC-1.02: HarmonicEngine', () => {
  let engine: HarmonicEngine;

  beforeEach(() => {
    engine = new HarmonicEngine();
  });

  // ===========================================================================
  // CA-01, CA-02, CA-03: generateField
  // ===========================================================================
  describe('generateField', () => {
    it('CA-01: generateField(E, major) gera os acordes corretos da escala de E Maior', () => {
      const field = engine.generateField(createNote('E'), 'major');
      expect(field.tonality.name).toBe('E');
      expect(field.scaleType).toBe('major');
      expect(field.scaleNotes.map((n) => n.name)).toEqual(['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#']);
      
      const chordNames = field.chords.map((c) => c.name);
      expect(chordNames).toEqual([
        'E Major',
        'F# Minor',
        'G# Minor',
        'A Major',
        'B Major',
        'C# Minor',
        'D# Dim',
      ]);
    });

    it('CA-02: funciona para todas as 12 notas cromáticas', () => {
      const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
      for (const noteName of notes) {
        const field = engine.generateField(createNote(noteName), 'major');
        expect(field.chords).toHaveLength(7);
        expect(field.scaleNotes).toHaveLength(7);
        expect(field.graph.nodes).toHaveLength(7);
      }
    });

    it('CA-03: suporta pelo menos 3 tipos de escala (major, minor_natural, minor_harmonic)', () => {
      const scales: Array<'major' | 'minor_natural' | 'minor_harmonic' | 'minor_melodic'> = [
        'major',
        'minor_natural',
        'minor_harmonic',
        'minor_melodic',
      ];
      for (const scale of scales) {
        const field = engine.generateField(createNote('A'), scale);
        expect(field.scaleType).toBe(scale);
        expect(field.chords).toHaveLength(7);
      }
    });
  });

  // ===========================================================================
  // CA-04 & CA-05: getRecommendations
  // ===========================================================================
  describe('getRecommendations', () => {
    it('CA-04 & CA-05: retorna recomendações ordenadas por peso e filtra apenas saídas', () => {
      const field = engine.generateField(createNote('C'), 'major');
      
      // I = C Major ("C_MAJ_I")
      const recommendations = engine.getRecommendations(field.graph, 'C_MAJ_I');
      
      expect(recommendations.length).toBeGreaterThan(0);
      
      // Verifica se todas as recomendações têm o nó de origem correto (saindo de C_MAJ_I)
      for (const rec of recommendations) {
        expect(rec.edge.source).toBe('C_MAJ_I');
      }

      // Verifica ordenação decrescente por peso
      for (let i = 0; i < recommendations.length - 1; i++) {
        expect(recommendations[i].edge.weight).toBeGreaterThanOrEqual(
          recommendations[i + 1].edge.weight,
        );
      }
    });
  });

  // ===========================================================================
  // CA-06, CA-07, CA-08: calculateDynamicWeight
  // ===========================================================================
  describe('calculateDynamicWeight', () => {
    it('CA-06: retorna valor entre 1.0 e 10.0', () => {
      const field = engine.generateField(createNote('C'), 'major');
      const chordI = field.chords[0]; // C Major
      const chordii = field.chords[1]; // D Minor

      const weight = engine.calculateDynamicWeight(chordI, chordii);
      expect(weight).toBeGreaterThanOrEqual(1.0);
      expect(weight).toBeLessThanOrEqual(10.0);
    });

    it('CA-07: aplica bônus por notas em comum (voice leading)', () => {
      const field = engine.generateField(createNote('C'), 'major');
      const chordI = field.chords[0];  // C Major: C, E, G
      const chordvi = field.chords[5]; // A Minor: A, C, E
      const chordV = field.chords[4];  // G Major: G, B, D

      // C Major e A Minor compartilham 2 notas (C, E)
      // C Major e G Major compartilham 1 nota (G)
      // Portanto, o peso de I -> vi por notas em comum deve ser maior que I -> V
      const weightI_vi = engine.calculateDynamicWeight(chordI, chordvi);
      const weightI_V = engine.calculateDynamicWeight(chordI, chordV);

      // Ambos têm resoluções de raíz (C->A é terça, C->G é quinta).
      // Mas o bônus de notas em comum do vi (2 notas) deve torná-lo significativamente forte.
      expect(weightI_vi).toBeGreaterThanOrEqual(weightI_V);
    });

    it('CA-08: aplica bônus para intervalos de 4ª/5ª justa', () => {
      const field = engine.generateField(createNote('C'), 'major');
      const chordI = field.chords[0];  // C Major (root: C)
      const chordV = field.chords[4];  // G Major (root: G, 5ª justa de C)
      const chordii = field.chords[1]; // D Minor (root: D, 2ª maior de C)

      // C -> G é uma quinta justa, deve ganhar o bônus de +2.0
      // C -> D é uma segunda maior, ganha bônus de +1.0
      const weightI_V = engine.calculateDynamicWeight(chordI, chordV);
      const weightI_ii = engine.calculateDynamicWeight(chordI, chordii);

      expect(weightI_V).toBeGreaterThan(weightI_ii);
    });
  });

  // ===========================================================================
  // CA-09 & CA-10: Performance Checks
  // ===========================================================================
  describe('Performance', () => {
    it('CA-09: generateField executa em menos de 500ms', () => {
      const start = performance.now();
      for (let i = 0; i < 50; i++) {
        engine.generateField(createNote('C'), 'major');
      }
      const duration = performance.now() - start;
      // 50 execuções devem ser extremamente rápidas, muito abaixo de 500ms
      expect(duration).toBeLessThan(500);
    });

    it('CA-10: getRecommendations executa em menos de 100ms', () => {
      const field = engine.generateField(createNote('C'), 'major');
      const start = performance.now();
      for (let i = 0; i < 100; i++) {
        engine.getRecommendations(field.graph, 'C_MAJ_I');
      }
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(100);
    });
  });
});
