/**
 * @hearmony/core — Reducer Puro do Estado Global
 *
 * Implementa o fluxo unidirecional de dados: action → state → view.
 * Puro TypeScript sem dependência de framework.
 *
 * Ref: SPEC-2.02, seção 4 (Fluxo de Ações) e seção 7 (Critérios de Aceite)
 */

import type { AppState, AppAction } from './types.js';

/**
 * Reducer puro — dado um estado e uma ação, retorna o novo estado.
 * Imutável: nunca muta o estado, sempre retorna um novo objeto.
 */
export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    // CA-01: SELECT_ROOT_NOTE — atualiza nota raiz e reseta seleção
    case 'SELECT_ROOT_NOTE': {
      return {
        ...state,
        context: {
          ...state.context,
          rootNote: action.payload,
          // O campo harmônico será recalculado externamente e enviado via SET_HARMONIC_FIELD
          harmonicField: null,
        },
        selection: {
          ...state.selection,
          selectedChordId: null,
          recommendations: [],
        },
        fretboard: {
          ...state.fretboard,
          mappedPositions: null,
          validationResult: null,
        },
      };
    }

    // CA-01: SELECT_SCALE_TYPE — atualiza tipo de escala e reseta seleção
    case 'SELECT_SCALE_TYPE': {
      return {
        ...state,
        context: {
          ...state.context,
          scaleType: action.payload,
          harmonicField: null,
        },
        selection: {
          ...state.selection,
          selectedChordId: null,
          recommendations: [],
        },
        fretboard: {
          ...state.fretboard,
          mappedPositions: null,
          validationResult: null,
        },
      };
    }

    // Ação auxiliar: SET_HARMONIC_FIELD — armazena o campo harmônico calculado
    case 'SET_HARMONIC_FIELD': {
      return {
        ...state,
        context: {
          ...state.context,
          harmonicField: action.payload,
        },
      };
    }

    // CA-02: SELECT_CHORD — popula recommendations e mappedPositions
    case 'SELECT_CHORD': {
      return {
        ...state,
        selection: {
          ...state.selection,
          selectedChordId: action.payload.chordId,
          recommendations: action.payload.recommendations,
        },
        fretboard: {
          ...state.fretboard,
          mappedPositions: action.payload.mappedPositions,
          activeShapeIndex: 0,
          activeInputFrets: [],
          validationResult: null,
        },
      };
    }

    // CA-03: CLEAR_SELECTION — zera selectedChordId, recommendations e mappedPositions
    case 'CLEAR_SELECTION': {
      return {
        ...state,
        selection: {
          ...state.selection,
          selectedChordId: null,
          recommendations: [],
        },
        fretboard: {
          ...state.fretboard,
          mappedPositions: null,
          activeInputFrets: [],
          validationResult: null,
        },
      };
    }

    // CA-04: USER_FRET_INPUT — valida acorde e popula validationResult
    case 'USER_FRET_INPUT': {
      return {
        ...state,
        fretboard: {
          ...state.fretboard,
          activeInputFrets: action.payload.input.activeFrets,
          validationResult: action.payload.result,
        },
        selection: {
          ...state.selection,
          // Se o acorde pertence ao campo, atualiza seleção e recomendações
          selectedChordId: action.payload.result.inHarmonicField && action.payload.result.degree
            ? action.payload.result.detectedChord?.name ?? state.selection.selectedChordId
            : state.selection.selectedChordId,
          recommendations: action.payload.recommendations,
        },
      };
    }

    // CA-05: CHANGE_TUNING — recalcula mappedPositions se há acorde selecionado
    case 'CHANGE_TUNING': {
      return {
        ...state,
        tuning: {
          ...state.tuning,
          config: action.payload.config,
          instrument: action.payload.config.instrument,
        },
        fretboard: {
          ...state.fretboard,
          mappedPositions: state.selection.selectedChordId !== null
            ? action.payload.mappedPositions
            : state.fretboard.mappedPositions,
        },
      };
    }

    // SET_CAPO — similar ao CHANGE_TUNING mas específico para capo
    case 'SET_CAPO': {
      return {
        ...state,
        tuning: {
          ...state.tuning,
          config: action.payload.config,
        },
        fretboard: {
          ...state.fretboard,
          mappedPositions: state.selection.selectedChordId !== null
            ? action.payload.mappedPositions
            : state.fretboard.mappedPositions,
        },
      };
    }

    // CA-06: CLEAR_SECONDARY_COLOR — remove arcos bicolores
    case 'CLEAR_SECONDARY_COLOR': {
      return {
        ...state,
        fretboard: {
          ...state.fretboard,
          secondaryColor: null,
        },
      };
    }

    // CA-XX: SET_SHAPE_INDEX — altera o índice do voicing ativo
    case 'SET_SHAPE_INDEX': {
      return {
        ...state,
        fretboard: {
          ...state.fretboard,
          activeShapeIndex: action.payload,
        },
      };
    }

    // SET_MODE — alterna entre modos de interação
    case 'SET_MODE': {
      return {
        ...state,
        selection: {
          ...state.selection,
          selectedChordId: null,
          recommendations: [],
          mode: action.payload,
        },
        fretboard: {
          ...state.fretboard,
          mappedPositions: null,
          activeShapeIndex: 0,
          activeInputFrets: [],
          validationResult: null,
        },
      };
    }

    // SET_SECONDARY_COLOR — define cor do arco bicolor
    case 'SET_SECONDARY_COLOR': {
      return {
        ...state,
        fretboard: {
          ...state.fretboard,
          secondaryColor: action.payload,
        },
      };
    }

    // CHANGE_INSTRUMENT — muda instrumento e reseta afinação
    case 'CHANGE_INSTRUMENT': {
      return {
        ...state,
        tuning: {
          config: action.payload.config,
          instrument: action.payload.config.instrument,
        },
        fretboard: {
          ...state.fretboard,
          mappedPositions: null,
          activeInputFrets: [],
          validationResult: null,
        },
      };
    }

    default: {
      return state;
    }
  }
}
