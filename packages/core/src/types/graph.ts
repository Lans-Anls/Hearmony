/**
 * @hearmony/core — Tipos do Grafo de Harmonia
 *
 * Define as estruturas de dados do grafo ponderado e direcionado
 * que modela relações harmônicas entre acordes diatônicos.
 *
 * Ref: SPEC-1.01, seção 6 (Interface / Contrato)
 */

import type { Chord } from './music.js';

// ---------------------------------------------------------------------------
// Movimentos Harmônicos
// ---------------------------------------------------------------------------

/**
 * Tipos de movimento harmônico padronizado.
 * Cada aresta do grafo carrega um destes tipos.
 */
export type HarmonicMovement =
  | 'authentic'            // V → I
  | 'plagal'               // IV → I
  | 'plagal_mixed'         // IV → V
  | 'deceptive'            // V → vi
  | 'preparation_ii_V'     // ii → V
  | 'relative'             // I ↔ vi
  | 'tritone_sub'          // vii° → I
  | 'mediant_passage'      // iii → vi
  | 'tertian_progression'  // vi → IV
  | 'weak_connection';     // iii → IV

// ---------------------------------------------------------------------------
// Nó do Grafo
// ---------------------------------------------------------------------------

/**
 * Representa um acorde diatônico como nó do grafo.
 */
export interface GraphNode {
  readonly chordId: string;
  readonly chord: Chord;
  readonly position: { x: number; y: number };
}

// ---------------------------------------------------------------------------
// Aresta do Grafo
// ---------------------------------------------------------------------------

/**
 * Conexão ponderada e direcionada entre dois acordes.
 * `weight` varia de 1 a 10 (10 = máxima afinidade harmônica).
 */
export interface GraphEdge {
  readonly source: string;
  readonly target: string;
  readonly weight: number;
  readonly movement: HarmonicMovement;
}

// ---------------------------------------------------------------------------
// Grafo de Harmonia
// ---------------------------------------------------------------------------

/**
 * Grafo completo de um campo harmônico.
 * Contém nós (acordes), arestas (movimentos) e a matriz de adjacência.
 */
export interface HarmonyGraph {
  readonly nodes: readonly GraphNode[];
  readonly edges: readonly GraphEdge[];
  readonly adjacencyMatrix: readonly (readonly number[])[];
}
