/**
 * @hearmony/core — Construtor de Grafo a partir da Matriz de Adjacência
 *
 * Transforma a matriz 7×7 + os acordes diatônicos em um `HarmonyGraph`
 * completo com nós, arestas ponderadas e classificação de movimento.
 *
 * Ref: SPEC-1.01, critérios CA-01 a CA-05
 */

import type { Chord, ChordQuality, Note, ScaleType } from '../types/music.js';
import type { GraphEdge, GraphNode, HarmonyGraph } from '../types/graph.js';
import {
  CHROMATIC_NOTES,
  createNote,
} from '../types/music.js';
import {
  DEGREE_LABELS,
  DEGREE_QUALITIES,
  MAJOR_ADJACENCY_MATRIX,
  MOVEMENT_MAP,
  SCALE_INTERVALS,
  TRIAD_INTERVALS,
} from './constants.js';

// ---------------------------------------------------------------------------
// Geração de Acordes Diatônicos
// ---------------------------------------------------------------------------

/**
 * Gera os 7 acordes diatônicos para uma nota raiz e tipo de escala.
 *
 * @param root  Nota raiz do campo harmônico (ex: createNote('E'))
 * @param scale Tipo de escala
 * @returns Array de 7 Chords com grau, qualidade e notas
 */
export function buildDiatonicChords(root: Note, scale: ScaleType): Chord[] {
  const intervals = SCALE_INTERVALS[scale];
  const qualities = DEGREE_QUALITIES[scale];

  return intervals.map((interval, degreeIndex) => {
    const rootPosition = (root.position + interval) % 12;
    const rootName = CHROMATIC_NOTES[rootPosition];
    const chordRoot = createNote(rootName);
    const quality = qualities[degreeIndex];
    const triadIntervals = TRIAD_INTERVALS[quality];

    const notes: Note[] = triadIntervals.map((ti) => {
      const pos = (rootPosition + ti) % 12;
      return createNote(CHROMATIC_NOTES[pos]);
    });

    const degree = DEGREE_LABELS[degreeIndex];
    const qualityLabel = formatQuality(quality);
    const name = `${rootName} ${qualityLabel}`;

    return {
      name,
      degree,
      root: chordRoot,
      quality,
      intervals: triadIntervals,
      notes,
    };
  });
}

/**
 * Formata a qualidade de acorde para display.
 */
function formatQuality(quality: ChordQuality): string {
  switch (quality) {
    case 'major':      return 'Major';
    case 'minor':      return 'Minor';
    case 'diminished': return 'Dim';
    case 'augmented':  return 'Aug';
  }
}

// ---------------------------------------------------------------------------
// ID de Acorde
// ---------------------------------------------------------------------------

/**
 * Gera um chordId único e legível.
 * Ex: "E_MAJ_I", "F#_MIN_ii", "D#_DIM_vii°"
 */
export function buildChordId(chord: Chord): string {
  const qualityCode: Record<ChordQuality, string> = {
    major: 'MAJ',
    minor: 'MIN',
    diminished: 'DIM',
    augmented: 'AUG',
  };
  const rootClean = chord.root.name.replace('#', 's');
  return `${rootClean}_${qualityCode[chord.quality]}_${chord.degree}`;
}

// ---------------------------------------------------------------------------
// Construção do Grafo
// ---------------------------------------------------------------------------

/**
 * Posições iniciais dos nós, distribuídas por função harmônica.
 * Tônica no centro, subdominantes à esquerda/acima, dominantes à direita/abaixo.
 */
const DEFAULT_POSITIONS: readonly { x: number; y: number }[] = [
  { x: 300, y: 250 },  // I  — centro
  { x: 150, y: 100 },  // ii — subdominante (esquerda-acima)
  { x: 100, y: 300 },  // iii — mediante (esquerda)
  { x: 300, y:  50 },  // IV — subdominante (acima)
  { x: 500, y: 100 },  // V  — dominante (direita-acima)
  { x: 450, y: 350 },  // vi — mediante (direita-abaixo)
  { x: 500, y: 300 },  // vii° — dominante (direita)
];

/**
 * Constrói um `HarmonyGraph` completo a partir de uma nota raiz e tipo de escala.
 *
 * 1. Gera os 7 acordes diatônicos
 * 2. Cria os 7 nós com IDs e posições
 * 3. Percorre a matriz de adjacência e cria arestas para pesos > 0
 * 4. Classifica cada aresta com seu tipo de movimento harmônico
 *
 * @param root  Nota raiz (ex: createNote('E'))
 * @param scale Tipo de escala (default: 'major')
 * @returns HarmonyGraph completo
 */
export function buildHarmonyGraph(
  root: Note,
  scale: ScaleType = 'major',
): HarmonyGraph {
  const chords = buildDiatonicChords(root, scale);
  const matrix = getAdjacencyMatrix(scale);

  // Nós
  const nodes: GraphNode[] = chords.map((chord, i) => ({
    chordId: buildChordId(chord),
    chord,
    position: { ...DEFAULT_POSITIONS[i] },
  }));

  // Arestas
  const edges: GraphEdge[] = [];

  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 7; j++) {
      const weight = matrix[i][j];
      if (weight > 0) {
        const key = `${i}-${j}`;
        const meta = MOVEMENT_MAP.get(key);
        edges.push({
          source: nodes[i].chordId,
          target: nodes[j].chordId,
          weight,
          movement: meta?.movement ?? 'weak_connection',
        });
      }
    }
  }

  return {
    nodes,
    edges,
    adjacencyMatrix: matrix,
  };
}

/**
 * Retorna a matriz de adjacência para o tipo de escala.
 * Para escalas maiores, retorna a matriz base.
 * Para outros tipos, retorna a mesma base (extensível no futuro — CA-06).
 */
export function getAdjacencyMatrix(
  scale: ScaleType,
): readonly (readonly number[])[] {
  // Atualmente, a matriz base é usada para todas as escalas.
  // Matrizes específicas para menores serão implementadas na SPEC-1.02.
  switch (scale) {
    case 'major':
      return MAJOR_ADJACENCY_MATRIX;
    default:
      // Placeholder: usa a mesma base, ajustes futuros conforme CA-06
      return MAJOR_ADJACENCY_MATRIX;
  }
}
