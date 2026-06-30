/**
 * @hearmony/core — Voicing Generator
 * 
 * Gera diferentes "shapes" (voicings) para um acorde em uma afinação específica,
 * através de um algoritmo de janela deslizante no fretboard.
 */

import { Chord, createNote, FretPosition } from '../types/index.js';

/**
 * Gera múltiplas formas (shapes) válidas de um acorde no braço do instrumento.
 * @param chord O acorde a ser desenhado.
 * @param tuningNotes As notas das cordas soltas (ex: ['E', 'A', 'D', 'G', 'B', 'E']).
 * @param maxFrets O número máximo de trastes a considerar.
 */
export function generateVoicings(chord: Chord, tuningNotes: string[], maxFrets = 15): (readonly FretPosition[])[] {
  const STRINGS = tuningNotes.length;
  const chordPositions = new Set(chord.notes.map(n => n.position));
  const openStringPositions = tuningNotes.map(name => createNote(name).position);

  const allShapes = new Map<string, FretPosition[]>();

  // Helper para validar um shape
  function isValidShape(shape: FretPosition[]): boolean {
    if (shape.length < 3) return false; // Muito poucas notas

    const notesInShape = new Set(
      shape.map(pos => (openStringPositions[pos.stringNumber - 1] + pos.fret) % 12)
    );

    // Deve conter a tônica
    if (!notesInShape.has(chord.root.position)) return false;

    // Para tríades/tétrades, idealmente queremos todas as notas,
    // mas na guitarra é comum omitir a 5ª. Vamos ser estritos e exigir todas
    // as notas para um shape "completo", ou pelo menos 3 notas distintas.
    if (notesInShape.size < Math.min(3, chord.notes.length)) return false;
    
    // Se for tétrade e tiver só 3 notas, garantir que tem tônica, 3ª e 7ª
    if (chord.notes.length === 4 && notesInShape.size === 3) {
      const thirdPos = chord.notes[1].position;
      const seventhPos = chord.notes[3].position;
      if (!notesInShape.has(thirdPos) || !notesInShape.has(seventhPos)) return false;
    }

    return true;
  }

  // Gera combinações para uma janela
  function exploreWindow(windowStart: number) {
    const validFretsPerString: number[][] = [];

    // Determina os trastes válidos para cada corda nesta janela
    for (let s = 0; s < STRINGS; s++) {
      const openPos = openStringPositions[s];
      const validForThisString: number[] = [];

      // Sempre permite corda solta se fizer parte do acorde
      if (chordPositions.has(openPos)) {
        validForThisString.push(0);
      }

      // Procura trastes dentro da janela
      for (let f = windowStart; f <= windowStart + 3; f++) {
        if (f === 0 || f > maxFrets) continue;
        const notePos = (openPos + f) % 12;
        if (chordPositions.has(notePos)) {
          validForThisString.push(f);
        }
      }
      validFretsPerString.push(validForThisString);
    }

    // Backtracking para montar os shapes
    function backtrack(strIdx: number, currentShape: FretPosition[]) {
      if (strIdx === STRINGS) {
        if (isValidShape(currentShape)) {
          // Serializa para chave única para evitar duplicatas
          const key = currentShape.map(p => `${p.stringNumber}-${p.fret}`).join('|');
          if (!allShapes.has(key)) {
            allShapes.set(key, [...currentShape]);
          }
        }
        return;
      }

      // Opção 1: Corda mutada (não toca)
      backtrack(strIdx + 1, currentShape);

      // Opção 2: Tocar uma das opções válidas para esta corda
      const options = validFretsPerString[strIdx];
      for (const fret of options) {
        currentShape.push({ stringNumber: strIdx + 1, fret });
        backtrack(strIdx + 1, currentShape);
        currentShape.pop();
      }
    }

    backtrack(0, []);
  }

  // Desliza a janela do traste 1 até maxFrets - 3
  // Janela 0 é implícita nas cordas soltas
  for (let w = 1; w <= maxFrets - 2; w++) {
    exploreWindow(w);
  }

  // Processa e ordena os shapes resultantes
  let shapes = Array.from(allShapes.values());

  // Ordena por "qualidade" do shape:
  // 1. Shapes com mais cordas tocadas
  // 2. Shapes mais próximos do nut (trastes menores)
  shapes.sort((a, b) => {
    if (b.length !== a.length) {
      return b.length - a.length;
    }
    const sumA = a.reduce((sum, p) => sum + p.fret, 0);
    const sumB = b.reduce((sum, p) => sum + p.fret, 0);
    return sumA - sumB;
  });

  // Retorna no máximo 8 shapes para não poluir a UI
  return shapes.slice(0, 8);
}
