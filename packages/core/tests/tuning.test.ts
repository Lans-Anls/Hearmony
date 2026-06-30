import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TuningService } from '../src/tuning/service.js';
import { CHROMATIC_NOTES } from '../src/types/music.js';

describe('SPEC-2.01: TuningService', () => {
  let service: TuningService;

  beforeEach(() => {
    service = new TuningService('guitar');
  });

  // ===========================================================================
  // CA-01 & CA-08: Presets and instruments support
  // ===========================================================================
  describe('CA-01 & CA-08: Presets e Instrumentos', () => {
    it('inicia por padrão como guitar no modo Standard', () => {
      const config = service.getActiveConfig();
      expect(config.instrument).toBe('guitar');
      expect(config.presetName).toBe('Standard');
      expect(config.capo).toBe(0);
      expect(config.strings).toHaveLength(6);
      
      // E2, A2, D3, G3, B3, E4
      expect(config.strings[0].note).toBe('E'); // String 1: E4 (mais aguda)
      expect(config.strings[0].octave).toBe(4);
      expect(config.strings[5].note).toBe('E'); // String 6: E2 (mais grave)
      expect(config.strings[5].octave).toBe(2);
    });

    it('retorna os presets corretos para cada instrumento', () => {
      const guitarPresets = service.getPresets('guitar');
      expect(guitarPresets.map((p) => p.name)).toContain('Standard');
      expect(guitarPresets.map((p) => p.name)).toContain('Drop D');
      expect(guitarPresets.map((p) => p.name)).toContain('Open G');
      expect(guitarPresets.map((p) => p.name)).toContain('Open D');
      expect(guitarPresets.map((p) => p.name)).toContain('DADGAD');
      expect(guitarPresets.map((p) => p.name)).toContain('Half-Step Down');

      const bass4Presets = service.getPresets('bass4');
      expect(bass4Presets.map((p) => p.name)).toContain('Standard');
      expect(bass4Presets.map((p) => p.name)).toContain('Drop D');

      const bass5Presets = service.getPresets('bass5');
      expect(bass5Presets.map((p) => p.name)).toContain('Standard');

      const ukulelePresets = service.getPresets('ukulele');
      expect(ukulelePresets.map((p) => p.name)).toContain('Standard');
    });

    it('aplica presets corretamente', () => {
      // Drop D Guitar
      let config = service.applyPreset('guitar_drop_d');
      expect(config.presetName).toBe('Drop D');
      expect(config.strings[5].note).toBe('D'); // String 6 (grave) dropped to D2
      expect(config.strings[5].octave).toBe(2);

      // Bass 4 Standard
      config = service.applyPreset('bass4_standard');
      expect(config.instrument).toBe('bass4');
      expect(config.strings).toHaveLength(4);
      expect(config.strings[3].note).toBe('E'); // String 4: E1 (grave)
      expect(config.strings[3].octave).toBe(1);

      // Ukulele Standard (reentrante)
      config = service.applyPreset('ukulele_standard');
      expect(config.instrument).toBe('ukulele');
      expect(config.strings).toHaveLength(4);
      // G4 (string 4), C4 (string 3), E4 (string 2), A4 (string 1)
      expect(config.strings[3].note).toBe('G'); // String 4
      expect(config.strings[3].octave).toBe(4);
      expect(config.strings[2].note).toBe('C'); // String 3
      expect(config.strings[2].octave).toBe(4);
      expect(config.strings[1].note).toBe('E'); // String 2
      expect(config.strings[1].octave).toBe(4);
      expect(config.strings[0].note).toBe('A'); // String 1
      expect(config.strings[0].octave).toBe(4);
    });
  });

  // ===========================================================================
  // CA-02: Custom Tuning
  // ===========================================================================
  describe('CA-02: Customização Cromática', () => {
    it('permite customizar qualquer corda para qualquer nota cromática', () => {
      // Muda a 6ª corda (E2) de guitarra para F# e a 5ª (A2) para G
      const config = service.setCustomTuning([
        { stringNumber: 6, note: 'F#' },
        { stringNumber: 5, note: 'G' },
      ]);
      expect(config.presetName).toBeNull(); // customizado
      expect(config.strings[5].note).toBe('F#');
      expect(config.strings[5].octave).toBe(2); // manteve a oitava próxima
      expect(config.strings[4].note).toBe('G');
      expect(config.strings[4].octave).toBe(2);
    });

    it('aceita notas bemóis e normaliza para sustenido', () => {
      const config = service.setCustomTuning([
        { stringNumber: 6, note: 'Gb' },
      ]);
      expect(config.strings[5].note).toBe('F#');
    });

    it('lança erro para nota inválida ou corda inexistente', () => {
      expect(() => service.setCustomTuning([{ stringNumber: 6, note: 'Z' }])).toThrow();
      expect(() => service.setCustomTuning([{ stringNumber: 7, note: 'E' }])).toThrow();
    });
  });

  // ===========================================================================
  // CA-03 & CA-04: getNoteAt
  // ===========================================================================
  describe('CA-03 & CA-04: getNoteAt', () => {
    it('retorna a nota correta solta (fret 0)', () => {
      // CA-03: getNoteAt(6, 0) com tuning Standard retorna "E"
      const note = service.getNoteAt(6, 0);
      expect(note.name).toBe('E');
      expect(note.position).toBe(4);
    });

    it('retorna a nota correta no traste (fret 5)', () => {
      // CA-04: getNoteAt(6, 5) com tuning Standard retorna "A"
      const note = service.getNoteAt(6, 5);
      expect(note.name).toBe('A');
      expect(note.position).toBe(9);
    });

    it('funciona corretamente ao transpor várias oitavas', () => {
      const note = service.getNoteAt(6, 12);
      expect(note.name).toBe('E');
    });
  });

  // ===========================================================================
  // CA-05: Capo Support
  // ===========================================================================
  describe('CA-05: Suporte a Capotraste', () => {
    it('aplica o capo elevando a afinação das cordas em semitons', () => {
      // CA-05: Capo em fret 2 com Standard resulta em "F#, B, E, A, C#, F#"
      const config = service.setCapo(2);
      expect(config.capo).toBe(2);

      // E4 -> F#4, B3 -> C#4, G3 -> A3, D3 -> E3, A2 -> B2, E2 -> F#2
      expect(config.strings[0].note).toBe('F#'); // 1
      expect(config.strings[0].octave).toBe(4);
      expect(config.strings[1].note).toBe('C#'); // 2
      expect(config.strings[1].octave).toBe(4);
      expect(config.strings[2].note).toBe('A');  // 3
      expect(config.strings[2].octave).toBe(3);
      expect(config.strings[3].note).toBe('E');  // 4
      expect(config.strings[3].octave).toBe(3);
      expect(config.strings[4].note).toBe('B');  // 5
      expect(config.strings[4].octave).toBe(2);
      expect(config.strings[5].note).toBe('F#'); // 6
      expect(config.strings[5].octave).toBe(2);
    });

    it('calcula notas relativas ao capo usando getNoteAt', () => {
      service.setCapo(2); // 6ª corda vira F#
      // getNoteAt(6, 0) agora deve retornar F#
      expect(service.getNoteAt(6, 0).name).toBe('F#');
      // getNoteAt(6, 3) deve retornar A (F# -> G -> G# -> A)
      expect(service.getNoteAt(6, 3).name).toBe('A');
    });

    it('rejeita valores de capo fora do intervalo 0-12', () => {
      expect(() => service.setCapo(-1)).toThrow();
      expect(() => service.setCapo(13)).toThrow();
    });
  });

  // ===========================================================================
  // CA-06: Performance Check
  // ===========================================================================
  describe('CA-06: Desempenho do recálculo', () => {
    it('executa recálculos em menos de 200ms', () => {
      const start = performance.now();
      for (let i = 0; i < 100; i++) {
        service.setCapo(i % 12);
        service.setCustomTuning([{ stringNumber: 6, note: CHROMATIC_NOTES[i % 12] }]);
      }
      const duration = performance.now() - start;
      // 100 iterações devem ser muito rápidas (geralmente < 5ms total)
      expect(duration).toBeLessThan(200);
    });
  });

  // ===========================================================================
  // CA-07: Persistence and Restore
  // ===========================================================================
  describe('CA-07: Persistência', () => {
    const localStorageMock = (() => {
      let store: Record<string, string> = {};
      return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
          store[key] = value.toString();
        },
        clear: () => {
          store = {};
        },
      };
    })();

    beforeEach(() => {
      vi.stubGlobal('localStorage', localStorageMock);
      localStorageMock.clear();
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it('persiste a afinação ativa e restaura corretamente', () => {
      // Configura customizada
      service.setCapo(3);
      service.setCustomTuning([{ stringNumber: 6, note: 'D' }]);
      service.persist();

      // Cria um novo service e restaura
      const anotherService = new TuningService('guitar');
      const restored = anotherService.restore();

      expect(restored).not.toBeNull();
      expect(restored?.capo).toBe(3);
      expect(restored?.strings[5].note).toBe('F'); // D2 + 3 capo semitones = F2
    });

    it('retorna null se não houver afinação persistida', () => {
      const anotherService = new TuningService('guitar');
      const restored = anotherService.restore();
      expect(restored).toBeNull();
    });
  });
});
