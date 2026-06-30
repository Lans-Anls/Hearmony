/**
 * @hearmony/core — Tipos do Motor Harmônico
 *
 * Ref: SPEC-1.02, seção 6
 */

import type { Note, Chord } from './music.js';
import type { HarmonyGraph, GraphNode, GraphEdge } from './graph.js';

export interface HarmonicField {
  readonly tonality: Note;
  readonly scaleType: 'major' | 'minor_natural' | 'minor_harmonic' | 'minor_melodic';
  readonly scaleNotes: readonly Note[];     // 7 notas da escala
  readonly chords: readonly Chord[];        // 7 acordes diatônicos
  readonly graph: HarmonyGraph;             // grafo ponderado
}

export interface Recommendation {
  readonly targetNode: GraphNode;
  readonly edge: GraphEdge;
}

export interface IHarmonicEngine {
  /** Gera campo harmônico completo a partir de nota raiz + escala */
  generateField(root: Note, scaleType: HarmonicField['scaleType']): HarmonicField;

  /** Retorna recomendações ordenadas por peso */
  getRecommendations(graph: HarmonyGraph, currentChordId: string): readonly Recommendation[];

  /** Calcula peso dinâmico entre dois acordes por voice leading */
  calculateDynamicWeight(source: Chord, target: Chord): number;
}
