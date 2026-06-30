/**
 * @hearmony/core — Serviço do Validador Cromático
 *
 * Ref: SPEC-1.03
 */

import type { Note, Chord } from '../types/music.js';
import type { HarmonicField } from '../types/engine.js';
import type {
  FretPosition,
  FretInput,
  ChordValidationResult,
  IChromaticValidator,
} from '../types/validator.ts';
import { CHROMATIC_NOTES, createNote } from '../types/music.js';
import { TuningService } from '../tuning/service.js';
import { CHORD_TEMPLATES } from './constants.js';

export class ChromaticValidator implements IChromaticValidator {
  public fretToNotes(input: FretInput): readonly Note[] {
    const service = new TuningService(input.instrument);
    const numStrings = input.tuning.length;
    
    const customStrings = input.tuning.map((note, index) => ({
      stringNumber: numStrings - index,
      note,
    }));
    
    service.setCustomTuning(customStrings);

    return input.activeFrets.map((af) => service.getNoteAt(af.stringNumber, af.fret));
  }

  public validateChord(
    input: FretInput,
    activeField: HarmonicField,
  ): ChordValidationResult {
    // 1. Converte posições para notas e calcula MIDI absoluto
    const service = new TuningService(input.instrument);
    const numStrings = input.tuning.length;
    
    const customStrings = input.tuning.map((note, index) => ({
      stringNumber: numStrings - index,
      note,
    }));
    
    service.setCustomTuning(customStrings);

    const playedNotes = input.activeFrets.map((af) => {
      const str = service.getActiveConfig().strings.find((s) => s.stringNumber === af.stringNumber);
      if (!str) {
        throw new Error(`Corda inválida: ${af.stringNumber}`);
      }
      
      const basePos = CHROMATIC_NOTES.indexOf(str.note as any);
      const nBase = (str.octave + 1) * 12 + basePos;
      const nMidi = nBase + af.fret;
      const note = service.getNoteAt(af.stringNumber, af.fret);
      
      return {
        stringNumber: af.stringNumber,
        fret: af.fret,
        midi: nMidi,
        note,
      };
    });

    // 2. Extrai pitch classes únicas (posições 0-11)
    const uniquePositions = Array.from(new Set(playedNotes.map((pn) => pn.note.position)));

    // Rejeita menos de 3 ou mais de 6 notas distintas
    if (uniquePositions.length < 3 || uniquePositions.length > 6) {
      return {
        valid: false,
        detectedChord: null,
        degree: null,
        inHarmonicField: false,
        inversion: 0,
        confidence: 0.0,
      };
    }

    // 3. Testa todos os candidatos a raiz
    const matchedChords: Chord[] = [];
    const inversions: number[] = [];

    for (const rootCandidate of uniquePositions) {
      // Calcula intervalos a partir desta raiz
      const intervals = uniquePositions.map((pos) => (pos - rootCandidate + 12) % 12);
      intervals.sort((a, b) => a - b);

      // Procura match nos templates de acordes
      for (const temp of CHORD_TEMPLATES) {
        const isMatch =
          temp.intervals.length === intervals.length &&
          temp.intervals.every((val, i) => val === intervals[i]);

        if (isMatch) {
          // Cria o acorde correspondente
          const rootNote = createNote(CHROMATIC_NOTES[rootCandidate]);
          const chordNotes = temp.intervals.map((inter) =>
            createNote(CHROMATIC_NOTES[(rootCandidate + inter) % 12]),
          );
          
          // Verifica se pertence ao campo harmônico ativo
          const fieldChord = activeField.chords.find(
            (c) => c.root.position === rootCandidate && c.quality === temp.quality,
          );

          const degree = fieldChord ? fieldChord.degree : '';
          const name = `${CHROMATIC_NOTES[rootCandidate]} ${temp.suffix}`;

          const chord: Chord = {
            name,
            degree,
            root: rootNote,
            quality: temp.quality,
            intervals: [...temp.intervals],
            notes: chordNotes,
          };

          // Calcula inversão com base na nota mais grave
          let lowestNote = playedNotes[0];
          for (const pn of playedNotes) {
            if (pn.midi < lowestNote.midi) {
              lowestNote = pn;
            }
          }
          
          const lowestPosition = lowestNote.note.position;
          const chordPositions = temp.intervals.map((inter) => (rootCandidate + inter) % 12);
          const inversionIndex = chordPositions.indexOf(lowestPosition);
          const inversion = inversionIndex !== -1 ? inversionIndex : 0;

          matchedChords.push(chord);
          inversions.push(inversion);
        }
      }
    }

    if (matchedChords.length === 0) {
      return {
        valid: false,
        detectedChord: null,
        degree: null,
        inHarmonicField: false,
        inversion: 0,
        confidence: 0.0,
      };
    }

    // Prioriza acordes que pertencem ao campo harmônico ativo
    let bestIndex = 0;
    for (let i = 0; i < matchedChords.length; i++) {
      const chord = matchedChords[i];
      const inField = activeField.chords.some(
        (c) => c.root.position === chord.root.position && c.quality === chord.quality,
      );
      if (inField) {
        bestIndex = i;
        break;
      }
    }

    const detectedChord = matchedChords[bestIndex];
    const inversion = inversions[bestIndex];

    const inHarmonicField = activeField.chords.some(
      (c) => c.root.position === detectedChord.root.position && c.quality === detectedChord.quality,
    );

    const degree = inHarmonicField
      ? activeField.chords.find((c) => c.root.position === detectedChord.root.position)!.degree
      : null;

    const alternativeInterpretations = matchedChords.filter((_, idx) => idx !== bestIndex);

    return {
      valid: true,
      detectedChord,
      degree,
      inHarmonicField,
      inversion,
      confidence: inHarmonicField ? 1.0 : 0.8,
      alternativeInterpretations: alternativeInterpretations.length > 0 ? alternativeInterpretations : undefined,
    };
  }

  public findAlternativePositions(
    chord: Chord,
    instrument: FretInput['instrument'],
    tuning: readonly string[],
    maxFretSpan: number = 5,
  ): readonly FretPosition[][] {
    const service = new TuningService(instrument);
    const numStrings = tuning.length;
    
    const customStrings = tuning.map((note, index) => ({
      stringNumber: numStrings - index,
      note,
    }));
    
    service.setCustomTuning(customStrings);

    const targetPitches = new Set(chord.notes.map((n) => n.position));

    // Para cada corda, encontra os trastes válidos que pertencem ao acorde
    const stringOptions: Array<Array<{ stringNumber: number; fret: number; position: number }>> = [];
    for (let stringNum = 1; stringNum <= numStrings; stringNum++) {
      const options: Array<{ stringNumber: number; fret: number; position: number }> = [];
      // Varre trastes de 0 a 15 (suficiente para montar a maioria das posições)
      for (let fret = 0; fret <= 15; fret++) {
        const note = service.getNoteAt(stringNum, fret);
        if (targetPitches.has(note.position)) {
          options.push({ stringNumber: stringNum, fret, position: note.position });
        }
      }
      stringOptions.push(options);
    }

    const results: FretPosition[][] = [];

    // Função de backtracking recursivo
    const backtrack = (
      stringIdx: number,
      currentVoicing: Array<{ stringNumber: number; fret: number; position: number }>,
    ) => {
      if (stringIdx === numStrings) {
        // Valida se todas as notas do acorde estão representadas
        const uniquePitches = new Set(currentVoicing.map((v) => v.position));
        if (uniquePitches.size !== targetPitches.size) {
          return;
        }

        // Valida se o span das notas pressionadas (casas > 0) é <= maxFretSpan
        const pressedFrets = currentVoicing.filter((v) => v.fret > 0).map((v) => v.fret);
        if (pressedFrets.length > 0) {
          const minFret = Math.min(...pressedFrets);
          const maxFret = Math.max(...pressedFrets);
          if (maxFret - minFret > maxFretSpan) {
            return;
          }
        }

        results.push(currentVoicing.map((v) => ({ stringNumber: v.stringNumber, fret: v.fret })));
        return;
      }

      // 1. Tenta pular esta corda (abafar)
      backtrack(stringIdx + 1, currentVoicing);

      // 2. Tenta tocar um traste válido nesta corda
      for (const opt of stringOptions[stringIdx]) {
        backtrack(stringIdx + 1, [...currentVoicing, opt]);
      }
    };

    backtrack(0, []);

    // Ordena alternativas: as que usam menos cordas ou menor span de trastes primeiro
    results.sort((a, b) => {
      const aPressed = a.filter((v) => v.fret > 0).length;
      const bPressed = b.filter((v) => v.fret > 0).length;
      if (aPressed !== bPressed) {
        return aPressed - bPressed;
      }
      
      const aFrets = a.filter((v) => v.fret > 0).map((v) => v.fret);
      const bFrets = b.filter((v) => v.fret > 0).map((v) => v.fret);
      const aSpan = aFrets.length > 0 ? Math.max(...aFrets) - Math.min(...aFrets) : 0;
      const bSpan = bFrets.length > 0 ? Math.max(...bFrets) - Math.min(...bFrets) : 0;
      return aSpan - bSpan;
    });

    // Retorna no máximo as 15 posições mais fáceis/ideais
    return results.slice(0, 15);
  }
}
