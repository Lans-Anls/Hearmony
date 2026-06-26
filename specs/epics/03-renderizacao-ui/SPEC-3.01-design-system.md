# SPEC-3.01 — Design System e Linguagem Visual

> **Status:** ✅ APPROVED
> **Épico:** 3 — Renderização Gráfica e UI
> **Autor:** Lans-Anls
> **Criado em:** 2026-06-26
> **Última atualização:** 2026-06-26

---

## 1. Resumo

Define o sistema de design visual da plataforma Hearmony, incluindo a paleta de cores semânticas para qualidades de acordes, regras de layout do grafo, estilos de arestas baseados em peso, e padrões de responsividade. Este documento é a referência canônica para toda decisão visual.

## 2. Motivação

A plataforma comunica conceitos abstratos de teoria musical (tensão, resolução, função harmônica) através de metáforas visuais. Cores, espessuras e posicionamento não são decorativos — são semânticos. Um design system coeso garante que a linguagem visual seja consistente e pedagogicamente eficaz.

## 3. Definições e Glossário

| Termo | Definição |
|-------|-----------|
| **Cor Semântica** | Cor que carrega significado funcional (não estético) |
| **Arco Bicolor** | Nota renderizada com dois semicírculos de cores distintas |
| **Force-Directed Layout** | Algoritmo de posicionamento de nós baseado em simulação de forças |
| **Edge Crossing** | Cruzamento de arestas — indesejável por aumentar carga cognitiva |

## 4. Requisitos Funcionais

### Paleta de Cores — Qualidade de Acordes

| Qualidade | Cor | Hex | Uso |
|-----------|-----|-----|-----|
| Maior (I, IV, V) | Verde Soft | `#2ECC71` | Estabilidade, resolução |
| Menor (ii, iii, vi) | Azul Profundo | `#3498DB` | Estabilidade intermediária |
| Diminuto (vii°) | Carmim/Vermelho | `#E74C3C` | Instabilidade máxima, tensão |
| Aumentado | Âmbar | `#F39C12` | Tensão cromática |
| Selecionado (ativo) | Branco brilhante | `#FFFFFF` | Destaque do nó clicado |
| Recomendado | Ouro com glow | `#F1C40F` | Sugestões de progressão |

### Paleta de Cores — Notas no Fretboard

Cada intervalo possui uma cor primária derivada do mapa de cores do `fret.py`:

| Intervalo | Nome | Cor |
|-----------|------|-----|
| 0 (Root) | Fundamental | Vermelho `#E74C3C` |
| 1 | 2ª menor | Azul escuro `#2C3E50` |
| 2 | 2ª maior | Azul `#3498DB` |
| 3 | 3ª menor | Verde escuro `#27AE60` |
| 4 | 3ª maior | Verde `#2ECC71` |
| 5 | 4ª justa | Laranja `#E67E22` |
| 6 | Trítono | Roxo `#9B59B6` |
| 7 | 5ª justa | Amarelo `#F1C40F` |
| 8 | 6ª menor | Rosa `#E91E63` |
| 9 | 6ª maior | Ciano `#00BCD4` |
| 10 | 7ª menor | Marrom `#795548` |
| 11 | 7ª maior | Magenta `#FF00FF` |

### Regras de Layout do Grafo

#### Posicionamento de Nós (Âncoras de Força)

| Função Harmônica | Nós | Posição Preferencial |
|-----------------|-----|---------------------|
| Tônica | I | Centro geométrico da viewport |
| Subdominante | ii, IV | Órbita superior / esquerda |
| Dominante | V, vii° | Órbita inferior / direita |
| Mediante | iii, vi | Posições intermediárias |

> **Objetivo:** Criar separação espacial clara entre **tensão** (direita/baixo) e **resolução** (centro/esquerda), reduzindo a carga cognitiva.

#### Estilos de Aresta por Peso

| Faixa de Peso | Estilo | Espessura | Descrição Visual |
|---------------|--------|-----------|-----------------|
| W ≥ 8 | Linha contínua + seta direcional nítida | 3px | Movimento forte, caminho principal |
| 5 ≤ W ≤ 7 | Linha contínua | 1.5px | Movimento secundário, alternativa válida |
| W < 5 | Linha tracejada (`stroke-dasharray: 4`) | 1px | Conexão fraca, transição de bloco |

### Arcos Bicolores (Interseção de Funções)

Quando o sistema exibe simultaneamente um acorde selecionado e a sugestão de progressão:

| Arco | Ângulo | Cor | Representa |
|------|--------|-----|------------|
| Esquerdo | Start 90°, Extent 180° | Cor primária (c1) | Nota do acorde atual |
| Direito | Start 270°, Extent 180° | Cor secundária (c2) | Nota do próximo acorde sugerido |

> A limpeza dos arcos bicolores é feita via ação `CLEAR_SECONDARY_COLOR` (botão direito).

### Responsividade

| Breakpoint | Layout | Adaptações |
|-----------|--------|------------|
| Desktop (≥ 1024px) | Grafo à esquerda, Fretboard à direita | Lado a lado |
| Tablet (768–1023px) | Grafo acima, Fretboard abaixo | Empilhado, grafo reduzido |
| Mobile (< 768px) | Tabs alternando grafo/fretboard | Um componente por vez |

## 5. Requisitos Não-Funcionais

- **Acessibilidade:** Contraste mínimo de 4.5:1 para texto sobre cores de fundo.
- **Performance:** Re-render do grafo após mudança de estado em < 16ms (60fps).
- **Consistência:** Todas as cores devem vir de tokens do design system, nunca hard-coded em componentes.

## 6. Interface / Contrato

```typescript
/**
 * Tokens de Design — fonte única de verdade para cores
 */
interface DesignTokens {
  chordColors: {
    major: string;      // #2ECC71
    minor: string;      // #3498DB
    diminished: string; // #E74C3C
    augmented: string;  // #F39C12
    selected: string;   // #FFFFFF
    recommended: string;// #F1C40F
  };
  noteColors: Record<number, string>;  // 0-11 → hex
  edgeStyles: {
    strong: { width: number; dash: null };      // W ≥ 8
    medium: { width: number; dash: null };      // 5 ≤ W ≤ 7
    weak: { width: number; dash: string };      // W < 5
  };
  breakpoints: {
    mobile: number;     // 768
    tablet: number;     // 1024
    desktop: number;    // 1440
  };
}
```

## 7. Critérios de Aceite

- [ ] CA-01: Acordes maiores são renderizados em verde `#2ECC71`.
- [ ] CA-02: Acordes menores são renderizados em azul `#3498DB`.
- [ ] CA-03: Acordes diminutos são renderizados em vermelho `#E74C3C`.
- [ ] CA-04: Arestas com peso ≥ 8 são linhas contínuas de 3px com seta.
- [ ] CA-05: Arestas com peso < 5 são linhas tracejadas de 1px.
- [ ] CA-06: Nó selecionado recebe destaque visual em branco.
- [ ] CA-07: Arcos bicolores exibem duas cores simultâneas em semicírculos.
- [ ] CA-08: Layout é responsivo em mobile, tablet e desktop.
- [ ] CA-09: Contraste de texto sobre fundo atende WCAG AA (4.5:1).
- [ ] CA-10: Todas as cores vêm de `DesignTokens`, nenhuma hard-coded.

## 8. Dependências

| Spec | Relação |
|------|---------|
| SPEC-1.01 | Consome pesos para definir estilo visual das arestas |
| SPEC-3.02 | Aplica `noteColors` no fretboard |

## 9. Histórico de Revisões

| Versão | Data | Autor | Descrição da Mudança |
|--------|------|-------|---------------------|
| 1.0 | 2026-06-26 | Lans-Anls | Consolidação de RNF-02, Seção 11, regras de layout/cores |
