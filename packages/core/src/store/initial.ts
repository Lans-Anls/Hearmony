/**
 * @hearmony/core — Estado Inicial (DEFAULT_STATE)
 *
 * Ref: SPEC-2.02
 */

import type { AppState } from './types.js';
import { TuningService } from '../tuning/service.js';

function buildDefaultTuningConfig() {
  const service = new TuningService('guitar');
  return service.getActiveConfig();
}

export const DEFAULT_STATE: AppState = {
  context: {
    rootNote: null,
    scaleType: null,
    harmonicField: null,
  },
  selection: {
    selectedChordId: null,
    recommendations: [],
    mode: 'exploration',
  },
  fretboard: {
    mappedPositions: null,
    activeShapeIndex: 0,
    activeInputFrets: [],
    validationResult: null,
    secondaryColor: null,
  },
  tuning: {
    config: buildDefaultTuningConfig(),
    instrument: 'guitar',
  },
};
