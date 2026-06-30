/**
 * @hearmony/core — Motor Harmônico e Recomendação
 *
 * Ref: SPEC-1.02
 */

import type { Note, Chord } from '../types/music.js';
import type { HarmonyGraph, GraphNode } from '../types/graph.js';
import type { HarmonicField, Recommendation, IHarmonicEngine } from '../types/engine.js';
import { CHROMATIC_NOTES, createNote } from '../types/music.js';
import { SCALE_INTERVALS } from '../matrix/constants.js';
import { buildDiatonicChords, buildHarmonyGraph } from '../matrix/builder.js';

export class HarmonicEngine implements IHarmonicEngine {
  public generateField(
    root: Note,
    scaleType: HarmonicField['scaleType'],
  ): HarmonicField {
    // 1. Calcula as 7 notas da escala
    const intervals = SCALE_INTERVALS[scaleType];
    const scaleNotes = intervals.map((interval) => {
      const pos = (root.position + interval) % 12;
      return createNote(CHROMATIC_NOTES[pos]);
    });

    // 2. Gera os 7 acordes diatônicos
    const chords = buildDiatonicChords(root, scaleType);

    // 3. Constrói o grafo harmônico com a matriz de adjacência
    const graph = buildHarmonyGraph(root, scaleType);

    return {
      tonality: root,
      scaleType,
      scaleNotes,
      chords,
      graph,
    };
  }

  public getRecommendations(
    graph: HarmonyGraph,
    currentChordId: string,
  ): readonly Recommendation[] {
    // Filtra apenas as arestas que saem do acorde selecionado
    const outgoingEdges = graph.edges.filter((e) => e.source === currentChordId);

    // Cria as recomendações mapeando para os nós de destino corretos
    const recommendations: Recommendation[] = outgoingEdges
      .map((edge) => {
        const targetNode = graph.nodes.find((n) => n.chordId === edge.target);
        if (!targetNode) return null;
        return { targetNode, edge };
      })
      .filter((rec): rec is Recommendation => rec !== null);

    // Ordena de forma decrescente pelo peso da aresta
    recommendations.sort((a, b) => b.edge.weight - a.edge.weight);

    return recommendations;
  }

  public calculateDynamicWeight(source: Chord, target: Chord): number {
    let weight = 5.0; // peso base

    // 1. Bônus de notas comuns (voice leading)
    const sourcePositions = new Set(source.notes.map((n) => n.position));
    const targetPositions = target.notes.map((n) => n.position);
    
    let commonNotesCount = 0;
    for (const pos of targetPositions) {
      if (sourcePositions.has(pos)) {
        commonNotesCount++;
      }
    }
    // Cada nota comum adiciona +1.5 ao peso
    weight += commonNotesCount * 1.5;

    // 2. Bônus por intervalos harmônicos na raiz (resoluções fortes)
    const interval = (target.root.position - source.root.position + 12) % 12;

    if (interval === 7 || interval === 5) {
      // 5ª justa (7 semitons) ou 4ª justa (5 semitons)
      weight += 2.0;
    } else if (interval === 1 || interval === 2 || interval === 10 || interval === 11) {
      // Movimento de grau conjunto (2ª menor/maior acima ou abaixo)
      weight += 1.0;
    } else if (interval === 3 || interval === 4 || interval === 8 || interval === 9) {
      // Movimento de terça/relativo
      weight += 1.0;
    }

    // Garante que o peso fique entre 1.0 e 10.0
    const clampedWeight = Math.max(1.0, Math.min(10.0, weight));

    // Arredonda para 1 casa decimal
    return Math.round(clampedWeight * 10) / 10;
  }
}
