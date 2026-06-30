/**
 * @hearmony/core — Matriz de Adjacência Harmônica
 *
 * Contém a matriz 7×7 ponderada e direcionada que modela as relações
 * entre os 7 graus diatônicos de um campo harmônico.
 *
 * Ref: SPEC-1.01, seções 4–5
 *
 * Convenção de índices:
 *   0 = I, 1 = ii, 2 = iii, 3 = IV, 4 = V, 5 = vi, 6 = vii°
 *
 * Cada M[i][j] indica o peso (1–10) da transição do grau i para o grau j.
 * Valor 0 = ausência de aresta direta.
 */

import type { HarmonicMovement } from '../types/graph.js';

// ---------------------------------------------------------------------------
// Graus Diatônicos
// ---------------------------------------------------------------------------

/** Labels dos 7 graus em notação romana */
export const DEGREE_LABELS = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'] as const;

export type DegreeIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

// ---------------------------------------------------------------------------
// Matriz de Adjacência — Escala Maior
// ---------------------------------------------------------------------------

/**
 * Matriz de adjacência base para campos harmônicos maiores.
 *
 * Pesos derivados de regras reais de cadência e voice leading:
 * - V→I  (10): Cadência Autêntica
 * - ii→V  (9): Preparação ii-V
 * - IV→V  (9): Cadência Plagal/Mista
 * - IV→I  (8): Preparação Plagal
 * - vi→IV (8): Progressão por Terças
 * - I→vi  (7): Afastamento Relativo (bidirecional parcial, vi→I = 7)
 * - V→vi  (7): Cadência Deceptiva
 * - iii→vi (7): Passagem Mediana
 * - vii°→I (6): Substituição de Trítono (função dominante menor)
 * - iii→IV (4): Eixo de Conexão Fraca
 */
export const MAJOR_ADJACENCY_MATRIX: readonly (readonly number[])[] = [
  //  I   ii  iii   IV    V   vi  vii°
  [   0,   3,   0,   8,   6,   5,   6 ],   // I   (I→V=6: ida à dominante)
  [   5,   0,   0,   0,   9,   7,   0 ],   // ii  (ii→V=9: preparação ii-V)
  [   4,   0,   0,   0,   0,   3,   0 ],   // iii
  [   8,   4,   5,   0,   9,   8,   0 ],   // IV  (IV→V=9: plagal/mista)
  [  10,   0,   0,   0,   0,   7,   0 ],   // V   (V→I=10: autêntica, V→vi=7: deceptiva)
  [   7,   0,   7,   3,   4,   0,   0 ],   // vi  (vi→V=4: preparação dominante)
  [   6,   0,   0,   5,   0,   0,   0 ],   // vii° (vii°→I=6: trítono)
];

/**
 * Matriz de adjacência para Menor Natural (Eólica).
 *
 * Graus: i, ii°, III, iv, v, VI, VII
 * Pesos ajustados para o modo eólico:
 * - v→i (7): Cadência modal (v é menor, sem trítono, resolução mais suave)
 * - VII→III (9): Progressão modal forte do subtônico
 * - iv→i (8): Plagal menor
 * - VI→VII (8): Progressão descendente modal
 * - III→VI (7): Terças descendentes
 */
export const MINOR_NATURAL_ADJACENCY_MATRIX: readonly (readonly number[])[] = [
  //  i   ii°  III   iv    v   VI  VII
  [   0,   3,   0,   8,   5,   6,   5 ],   // i
  [   5,   0,   0,   0,   7,   6,   0 ],   // ii°
  [   4,   0,   0,   0,   0,   7,   9 ],   // III  (III→VII=9)
  [   8,   4,   4,   0,   7,   8,   0 ],   // iv   (iv→i=8 plagal menor)
  [   7,   0,   0,   0,   0,   6,   0 ],   // v    (v→i=7 cadência modal suave)
  [   5,   0,   7,   4,   4,   0,   8 ],   // VI   (VI→VII=8)
  [   6,   0,   8,   5,   0,   0,   0 ],   // VII  (VII→III=8, VII→i=6)
];

/**
 * Matriz de adjacência para Menor Harmônica.
 *
 * Graus: i, ii°, III+, iv, V, VI, vii°
 * Pesos ajustados para a presença do VII° elevado:
 * - V→i  (10): Cadência autêntica forte (V é maior, trítono resolvido)
 * - vii°→i (9): Sensível pronunciada → resolução
 * - iv→V  (9): Preparação dominante clássica
 * - III+→VI (6): Acorde aumentado cria tensão
 */
export const MINOR_HARMONIC_ADJACENCY_MATRIX: readonly (readonly number[])[] = [
  //  i   ii°  III+  iv    V   VI  vii°
  [   0,   3,   0,   8,   6,   5,   7 ],   // i
  [   5,   0,   0,   0,   9,   6,   0 ],   // ii°  (ii°→V=9 preparação)
  [   3,   0,   0,   0,   0,   6,   0 ],   // III+ (aumentado, tensão)
  [   8,   4,   4,   0,   9,   8,   0 ],   // iv   (iv→V=9)
  [  10,   0,   0,   0,   0,   7,   0 ],   // V    (V→i=10 autêntica)
  [   5,   0,   5,   4,   4,   0,   0 ],   // VI
  [   9,   0,   0,   5,   0,   0,   0 ],   // vii° (vii°→i=9 sensível forte)
];

/**
 * Matriz de adjacência para Menor Melódica (ascendente).
 *
 * Graus: i, ii, III+, IV, V, vi°, vii°
 * Características especiais:
 * - Dois graus diminutos (vi° e vii°) tornam a escala mais tensa
 * - ii→V (9): Preparação clássica de jazz
 * - V→i  (10): Cadência autêntica
 * - IV→V  (9): Subdominante → dominante
 */
export const MINOR_MELODIC_ADJACENCY_MATRIX: readonly (readonly number[])[] = [
  //  i   ii  III+  IV    V  vi°  vii°
  [   0,   3,   0,   8,   6,   4,   5 ],   // i
  [   5,   0,   0,   0,   9,   6,   0 ],   // ii   (ii→V=9)
  [   4,   0,   0,   0,   0,   5,   0 ],   // III+
  [   8,   4,   4,   0,   9,   7,   0 ],   // IV   (IV→V=9)
  [  10,   0,   0,   0,   0,   7,   0 ],   // V    (V→i=10)
  [   5,   0,   6,   4,   4,   0,   0 ],   // vi°
  [   6,   0,   0,   5,   0,   0,   0 ],   // vii°
];

/**
 * Retorna a matriz de adjacência para um tipo de escala.
 * Ref: SPEC-1.01 CA-06
 */
export function getMatrixForScale(
  scale: import('../types/music.js').ScaleType,
): readonly (readonly number[])[] {
  switch (scale) {
    case 'major':          return MAJOR_ADJACENCY_MATRIX;
    case 'minor_natural':  return MINOR_NATURAL_ADJACENCY_MATRIX;
    case 'minor_harmonic': return MINOR_HARMONIC_ADJACENCY_MATRIX;
    case 'minor_melodic':  return MINOR_MELODIC_ADJACENCY_MATRIX;
  }
}

// ---------------------------------------------------------------------------
// Mapa de Movimentos Harmônicos
// ---------------------------------------------------------------------------

/**
 * Metadados descritivos para cada aresta não-zero da matriz.
 * Chave: "sourceIndex-targetIndex"
 */
export interface MovementMetadata {
  readonly movement: HarmonicMovement;
  readonly description: string;
}

/**
 * Mapa que associa cada par (source, target) ao tipo de movimento harmônico.
 * Apenas pares com peso > 0 na matriz estão presentes.
 */
export const MOVEMENT_MAP: ReadonlyMap<string, MovementMetadata> = new Map([
  // Saídas de I   [0, 3, 0, 8, 6, 5, 6]
  ['0-1', { movement: 'weak_connection',     description: 'I → ii (preparação fraca)' }],
  ['0-3', { movement: 'plagal',              description: 'I → IV (subdominante)' }],
  ['0-4', { movement: 'weak_connection',     description: 'I → V (ida à dominante)' }],
  ['0-5', { movement: 'relative',            description: 'I → vi (relativo menor)' }],
  ['0-6', { movement: 'tritone_sub',         description: 'I → vii° (trítono)' }],

  // Saídas de ii  [5, 0, 0, 0, 9, 7, 0]
  ['1-0', { movement: 'plagal',              description: 'ii → I (resolução)' }],
  ['1-4', { movement: 'preparation_ii_V',    description: 'ii → V (preparação ii-V)' }],
  ['1-5', { movement: 'mediant_passage',     description: 'ii → vi (passagem)' }],

  // Saídas de iii [4, 0, 0, 0, 0, 3, 0]
  ['2-0', { movement: 'weak_connection',     description: 'iii → I (conexão fraca)' }],
  ['2-5', { movement: 'mediant_passage',     description: 'iii → vi (passagem mediana)' }],

  // Saídas de IV  [8, 4, 5, 0, 9, 8, 0]
  ['3-0', { movement: 'plagal',              description: 'IV → I (plagal)' }],
  ['3-1', { movement: 'weak_connection',     description: 'IV → ii (preparação)' }],
  ['3-2', { movement: 'weak_connection',     description: 'IV → iii (conexão fraca)' }],
  ['3-4', { movement: 'plagal_mixed',        description: 'IV → V (plagal/mista)' }],
  ['3-5', { movement: 'tertian_progression', description: 'IV → vi (terças)' }],

  // Saídas de V   [10, 0, 0, 0, 0, 7, 0]
  ['4-0', { movement: 'authentic',           description: 'V → I (cadência autêntica)' }],
  ['4-5', { movement: 'deceptive',           description: 'V → vi (cadência deceptiva)' }],

  // Saídas de vi  [7, 0, 7, 3, 4, 0, 0]
  ['5-0', { movement: 'relative',            description: 'vi → I (relativo)' }],
  ['5-2', { movement: 'mediant_passage',     description: 'vi → iii (mediana)' }],
  ['5-3', { movement: 'tertian_progression', description: 'vi → IV (terças)' }],
  ['5-4', { movement: 'weak_connection',     description: 'vi → V (preparação dominante)' }],

  // Saídas de vii° [6, 0, 0, 5, 0, 0, 0]
  ['6-0', { movement: 'tritone_sub',         description: 'vii° → I (substituição trítono)' }],
  ['6-3', { movement: 'weak_connection',     description: 'vii° → IV (subdominante)' }],
]);

// ---------------------------------------------------------------------------
// Qualidades dos Graus por Tipo de Escala
// ---------------------------------------------------------------------------

import type { ChordQuality, ScaleType } from '../types/music.js';

/**
 * Qualidade de acorde para cada grau (0–6) em cada tipo de escala.
 */
export const DEGREE_QUALITIES: Record<ScaleType, readonly ChordQuality[]> = {
  major:          ['major', 'minor', 'minor', 'major', 'major', 'minor', 'diminished'],
  minor_natural:  ['minor', 'diminished', 'major', 'minor', 'minor', 'major', 'major'],
  minor_harmonic: ['minor', 'diminished', 'augmented', 'minor', 'major', 'major', 'diminished'],
  minor_melodic:  ['minor', 'minor', 'augmented', 'major', 'major', 'diminished', 'diminished'],
};

/**
 * Intervalos de escala em semitons para cada tipo.
 */
export const SCALE_INTERVALS: Record<ScaleType, readonly number[]> = {
  major:          [0, 2, 4, 5, 7, 9, 11],
  minor_natural:  [0, 2, 3, 5, 7, 8, 10],
  minor_harmonic: [0, 2, 3, 5, 7, 8, 11],
  minor_melodic:  [0, 2, 3, 5, 7, 9, 11],
};

/**
 * Intervalos de tríade por qualidade de acorde.
 */
export const TRIAD_INTERVALS: Record<ChordQuality, readonly number[]> = {
  major:      [0, 4, 7],
  minor:      [0, 3, 7],
  diminished: [0, 3, 6],
  augmented:  [0, 4, 8],
};
