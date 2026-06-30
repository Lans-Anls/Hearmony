/**
 * Testes — SPEC-1.01: Matriz de Adjacência Harmônica
 *
 * Valida os critérios de aceite CA-01 a CA-06.
 */

import { describe, it, expect } from 'vitest';
import {
  MAJOR_ADJACENCY_MATRIX,
  MINOR_NATURAL_ADJACENCY_MATRIX,
  MINOR_HARMONIC_ADJACENCY_MATRIX,
  MINOR_MELODIC_ADJACENCY_MATRIX,
  DEGREE_LABELS,
  MOVEMENT_MAP,
  DEGREE_QUALITIES,
  SCALE_INTERVALS,
  TRIAD_INTERVALS,
  getMatrixForScale,
} from '../src/matrix/constants';
import {
  buildDiatonicChords,
  buildHarmonyGraph,
  buildChordId,
} from '../src/matrix/builder';
import { createNote } from '../src/types/music';

// ===========================================================================
// CA-01: Matriz 7×7 é gerada para qualquer tonalidade maior
// ===========================================================================
describe('CA-01: Matriz 7×7 com pesos corretos', () => {
  it('tem dimensão 7×7', () => {
    expect(MAJOR_ADJACENCY_MATRIX).toHaveLength(7);
    for (const row of MAJOR_ADJACENCY_MATRIX) {
      expect(row).toHaveLength(7);
    }
  });

  it('diagonal é zero (acorde não transiciona para si mesmo)', () => {
    for (let i = 0; i < 7; i++) {
      expect(MAJOR_ADJACENCY_MATRIX[i][i]).toBe(0);
    }
  });

  it('V→I tem peso 10 (cadência autêntica)', () => {
    // V = índice 4, I = índice 0
    expect(MAJOR_ADJACENCY_MATRIX[4][0]).toBe(10);
  });

  it('ii→V tem peso 9 (preparação ii-V)', () => {
    // ii = índice 1, V = índice 4
    expect(MAJOR_ADJACENCY_MATRIX[1][4]).toBe(9);
  });

  it('IV→V tem peso 9 (plagal/mista)', () => {
    expect(MAJOR_ADJACENCY_MATRIX[3][4]).toBe(9);
  });

  it('IV→I tem peso 8 (plagal)', () => {
    expect(MAJOR_ADJACENCY_MATRIX[3][0]).toBe(8);
  });

  it('vi→IV tem peso 3 (terças)', () => {
    expect(MAJOR_ADJACENCY_MATRIX[5][3]).toBe(3);
  });

  it('todos os pesos estão entre 0 e 10', () => {
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        expect(MAJOR_ADJACENCY_MATRIX[i][j]).toBeGreaterThanOrEqual(0);
        expect(MAJOR_ADJACENCY_MATRIX[i][j]).toBeLessThanOrEqual(10);
      }
    }
  });
});

// ===========================================================================
// CA-02: Todos os movimentos primários possuem arestas no grafo
// ===========================================================================
describe('CA-02: Movimentos primários (peso ≥ 8) têm arestas', () => {
  const graph = buildHarmonyGraph(createNote('E'), 'major');

  it('V→I existe com peso 10', () => {
    // V = índice 4, I = índice 0
    const edge = graph.edges.find(
      (e) => e.source === graph.nodes[4].chordId && e.target === graph.nodes[0].chordId,
    );
    expect(edge).toBeDefined();
    expect(edge?.weight).toBe(10);
    expect(edge?.movement).toBe('authentic');
  });

  it('IV→I existe com peso 8', () => {
    // IV = índice 3, I = índice 0
    const edge = graph.edges.find(
      (e) => e.source === graph.nodes[3].chordId && e.target === graph.nodes[0].chordId,
    );
    expect(edge).toBeDefined();
    expect(edge?.weight).toBe(8);
    expect(edge?.movement).toBe('plagal');
  });
});

// ===========================================================================
// CA-03: Valor 0 na matriz resulta em ausência de aresta
// ===========================================================================
describe('CA-03: Zeros na matriz = sem aresta', () => {
  const graph = buildHarmonyGraph(createNote('C'), 'major');

  it('não há aresta I→iii (peso 0 na matriz)', () => {
    // I = índice 0, iii = índice 2, matriz[0][2] = 0
    expect(MAJOR_ADJACENCY_MATRIX[0][2]).toBe(0);
    // No grafo de C Major: I = C_MAJ_I, iii = E_MIN_iii
    const edge = graph.edges.find(
      (e) => e.source === graph.nodes[0].chordId && e.target === graph.nodes[2].chordId,
    );
    expect(edge).toBeUndefined();
  });

  it('não há aresta vii°→vii° (diagonal)', () => {
    const selfEdge = graph.edges.find(
      (e) => e.source === e.target,
    );
    expect(selfEdge).toBeUndefined();
  });

  it('total de arestas = total de pesos não-zero na matriz', () => {
    let nonZeroCount = 0;
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        if (MAJOR_ADJACENCY_MATRIX[i][j] > 0) nonZeroCount++;
      }
    }
    expect(graph.edges).toHaveLength(nonZeroCount);
  });
});

// ===========================================================================
// CA-04: Grafo contém exatamente 7 nós
// ===========================================================================
describe('CA-04: Grafo com 7 nós', () => {
  it('E Major gera 7 nós', () => {
    const graph = buildHarmonyGraph(createNote('E'), 'major');
    expect(graph.nodes).toHaveLength(7);
  });

  it('C Major gera 7 nós', () => {
    const graph = buildHarmonyGraph(createNote('C'), 'major');
    expect(graph.nodes).toHaveLength(7);
  });

  it('todos os 7 graus estão presentes', () => {
    const graph = buildHarmonyGraph(createNote('E'), 'major');
    const degrees = graph.nodes.map((n) => n.chord.degree);
    expect(degrees).toEqual(['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°']);
  });
});

// ===========================================================================
// CA-05: Pesos simétricos apenas onde indicado "Bidirecional"
// ===========================================================================
describe('CA-05: Simetria apenas onde bidirecional', () => {
  it('I↔vi é bidirecional (ambos têm peso > 0)', () => {
    expect(MAJOR_ADJACENCY_MATRIX[0][5]).toBeGreaterThan(0); // I→vi
    expect(MAJOR_ADJACENCY_MATRIX[5][0]).toBeGreaterThan(0); // vi→I
  });

  it('V→I é direcional (I→V ≠ V→I)', () => {
    const VI = MAJOR_ADJACENCY_MATRIX[4][0]; // V→I = 10 (máximo, autêntica)
    const IV_val = MAJOR_ADJACENCY_MATRIX[0][4]; // I→V = 6
    expect(VI).not.toBe(IV_val);
  });
});

// ===========================================================================
// Testes de buildDiatonicChords
// ===========================================================================
describe('buildDiatonicChords', () => {
  it('E Major gera acordes corretos', () => {
    const chords = buildDiatonicChords(createNote('E'), 'major');
    expect(chords).toHaveLength(7);

    expect(chords[0].name).toBe('E Major');
    expect(chords[0].degree).toBe('I');
    expect(chords[0].quality).toBe('major');

    expect(chords[1].name).toBe('F# Minor');
    expect(chords[1].degree).toBe('ii');
    expect(chords[1].quality).toBe('minor');

    expect(chords[6].name).toBe('D# Dim');
    expect(chords[6].degree).toBe('vii°');
    expect(chords[6].quality).toBe('diminished');
  });

  it('C Major gera acordes corretos', () => {
    const chords = buildDiatonicChords(createNote('C'), 'major');
    expect(chords[0].name).toBe('C Major');
    expect(chords[3].name).toBe('F Major');
    expect(chords[4].name).toBe('G Major');
  });

  it('cada acorde tem 3 notas (tríade)', () => {
    const chords = buildDiatonicChords(createNote('A'), 'major');
    for (const chord of chords) {
      expect(chord.notes).toHaveLength(3);
    }
  });

  it('funciona para as 12 notas cromáticas', () => {
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    for (const noteName of notes) {
      const chords = buildDiatonicChords(createNote(noteName), 'major');
      expect(chords).toHaveLength(7);
      expect(chords[0].quality).toBe('major');
    }
  });
});

// ===========================================================================
// Testes de buildChordId
// ===========================================================================
describe('buildChordId', () => {
  it('gera ID legível sem caracteres especiais', () => {
    const chord = buildDiatonicChords(createNote('E'), 'major')[0];
    const id = buildChordId(chord);
    expect(id).toBe('E_MAJ_I');
  });

  it('trata sustenido corretamente', () => {
    const chord = buildDiatonicChords(createNote('E'), 'major')[1]; // F# Minor
    const id = buildChordId(chord);
    expect(id).toBe('Fs_MIN_ii');
  });
});

// ===========================================================================
// Testes de buildHarmonyGraph (integração)
// ===========================================================================
describe('buildHarmonyGraph', () => {
  const graph = buildHarmonyGraph(createNote('E'), 'major');

  it('retorna adjacencyMatrix 7×7', () => {
    expect(graph.adjacencyMatrix).toHaveLength(7);
    for (const row of graph.adjacencyMatrix) {
      expect(row).toHaveLength(7);
    }
  });

  it('nós têm posições x,y válidas', () => {
    for (const node of graph.nodes) {
      expect(node.position.x).toBeGreaterThanOrEqual(0);
      expect(node.position.y).toBeGreaterThanOrEqual(0);
    }
  });

  it('arestas referenciam chordIds existentes', () => {
    const nodeIds = new Set(graph.nodes.map((n) => n.chordId));
    for (const edge of graph.edges) {
      expect(nodeIds.has(edge.source)).toBe(true);
      expect(nodeIds.has(edge.target)).toBe(true);
    }
  });

  it('todas as arestas têm peso entre 1 e 10', () => {
    for (const edge of graph.edges) {
      expect(edge.weight).toBeGreaterThanOrEqual(1);
      expect(edge.weight).toBeLessThanOrEqual(10);
    }
  });

  it('todas as arestas têm um movement definido', () => {
    for (const edge of graph.edges) {
      expect(edge.movement).toBeDefined();
      expect(typeof edge.movement).toBe('string');
    }
  });
});

// ===========================================================================
// CA-06: Matrizes para escalas menores derivam da base maior com ajustes
// ===========================================================================
describe('CA-06: Matrizes para Escalas Menores', () => {
  it('getMatrixForScale retorna matrizes distintas para cada tipo de escala', () => {
    const majorMatrix  = getMatrixForScale('major');
    const naturalMatrix = getMatrixForScale('minor_natural');
    const harmonicMatrix = getMatrixForScale('minor_harmonic');
    const melodicMatrix  = getMatrixForScale('minor_melodic');

    // Cada matriz deve ser diferente da maior
    expect(naturalMatrix).not.toEqual(majorMatrix);
    expect(harmonicMatrix).not.toEqual(majorMatrix);
    expect(melodicMatrix).not.toEqual(majorMatrix);
  });

  it('todas as matrizes menores têm dimensão 7×7', () => {
    const matrices = [
      MINOR_NATURAL_ADJACENCY_MATRIX,
      MINOR_HARMONIC_ADJACENCY_MATRIX,
      MINOR_MELODIC_ADJACENCY_MATRIX,
    ];
    for (const matrix of matrices) {
      expect(matrix).toHaveLength(7);
      for (const row of matrix) {
        expect(row).toHaveLength(7);
      }
    }
  });

  it('matrizes menores têm pesos no intervalo 0–10', () => {
    const matrices = [
      MINOR_NATURAL_ADJACENCY_MATRIX,
      MINOR_HARMONIC_ADJACENCY_MATRIX,
      MINOR_MELODIC_ADJACENCY_MATRIX,
    ];
    for (const matrix of matrices) {
      for (const row of matrix) {
        for (const w of row) {
          expect(w).toBeGreaterThanOrEqual(0);
          expect(w).toBeLessThanOrEqual(10);
        }
      }
    }
  });

  it('buildHarmonyGraph gera 7 nós e arestas para minor_harmonic (A)', () => {
    const graph = buildHarmonyGraph(createNote('A'), 'minor_harmonic');
    expect(graph.nodes).toHaveLength(7);
    expect(graph.edges.length).toBeGreaterThan(0);
    // V→i deve ter peso 10 (cadência autêntica forte na menor harmônica)
    const vToI = graph.edges.find(
      (e) => e.source === graph.nodes[4].chordId && e.target === graph.nodes[0].chordId
    );
    expect(vToI?.weight).toBe(10);
  });

  it('buildHarmonyGraph gera 7 nós e arestas para minor_natural (A)', () => {
    const graph = buildHarmonyGraph(createNote('A'), 'minor_natural');
    expect(graph.nodes).toHaveLength(7);
    // v→i = 7 (cadência modal suave, sem trítono)
    const vToI = graph.edges.find(
      (e) => e.source === graph.nodes[4].chordId && e.target === graph.nodes[0].chordId
    );
    expect(vToI?.weight).toBe(7);
  });

  it('buildHarmonyGraph para minor_harmonic: V é acorde maior (sensível resolvida)', () => {
    const chords = buildDiatonicChords(createNote('A'), 'minor_harmonic');
    // Grau 4 (index 4) deve ser E Major na menor harmônica de A
    expect(chords[4].quality).toBe('major');
    expect(chords[4].root.name).toBe('E');
  });

  it('buildHarmonyGraph para minor_natural: v é acorde menor', () => {
    const chords = buildDiatonicChords(createNote('A'), 'minor_natural');
    // Grau 4 (index 4) deve ser E Minor na menor natural de A
    expect(chords[4].quality).toBe('minor');
    expect(chords[4].root.name).toBe('E');
  });
});

