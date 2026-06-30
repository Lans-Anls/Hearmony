/**
 * @hearmony/core — Tipos de domínio base
 *
 * Define as unidades atômicas do domínio musical:
 * Note (nota), Chord (acorde) e suas qualidades.
 *
 * Ref: SPEC-1.01, SPEC-1.02
 */

// ---------------------------------------------------------------------------
// Nota Musical
// ---------------------------------------------------------------------------

/**
 * Representação de uma nota musical no espaço cromático.
 * `position` é o índice 0–11 na oitava (C=0, C#=1, ..., B=11).
 */
export interface Note {
  readonly name: string;
  readonly position: number;
  readonly frequency?: number;
}

/**
 * As 12 notas cromáticas em notação com sustenido.
 */
export const CHROMATIC_NOTES = [
  'C', 'C#', 'D', 'D#', 'E', 'F',
  'F#', 'G', 'G#', 'A', 'A#', 'B',
] as const;

/**
 * Cria um objeto Note a partir do nome.
 */
export function createNote(name: string): Note {
  const position = CHROMATIC_NOTES.indexOf(
    name as (typeof CHROMATIC_NOTES)[number],
  );
  if (position === -1) {
    throw new Error(`Nota inválida: "${name}". Use: ${CHROMATIC_NOTES.join(', ')}`);
  }
  return { name, position };
}

// ---------------------------------------------------------------------------
// Qualidade de Acorde
// ---------------------------------------------------------------------------

export type ChordQuality = 'major' | 'minor' | 'diminished' | 'augmented';

// ---------------------------------------------------------------------------
// Acorde
// ---------------------------------------------------------------------------

/**
 * Representação de um acorde diatônico com grau, qualidade e notas.
 */
export interface Chord {
  readonly name: string;
  readonly degree: string;
  readonly root: Note;
  readonly quality: ChordQuality;
  readonly intervals: readonly number[];
  readonly notes: readonly Note[];
}

// ---------------------------------------------------------------------------
// Tipo de Escala
// ---------------------------------------------------------------------------

export type ScaleType =
  | 'major'
  | 'minor_natural'
  | 'minor_harmonic'
  | 'minor_melodic';
