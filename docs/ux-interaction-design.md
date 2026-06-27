# 🎨 UX & Interação do Usuário — Hearmony

> Derivado dos requisitos RF-01 a RF-06 e RNF-01 a RNF-04

Este documento descreve **o que o usuário vê, toca e sente** ao usar a plataforma Hearmony. Serve como briefing para a criação de arte, wireframes e protótipos de alta fidelidade.

---

## 1. Mapa de Telas (Views)

A plataforma possui **5 views** que o usuário navega. No desktop, várias coexistem na mesma tela; no mobile, alternam via tabs.

```mermaid
flowchart LR
    subgraph "Tela Principal"
        A["🎵 Seletor de Contexto"]
        B["🕸️ Grafo de Harmonia"]
        C["🎸 Fretboard"]
        D["🎛️ Painel de Afinação"]
        E["📋 Painel de Detalhes"]
    end

    A -->|"gera"| B
    B -->|"sincroniza"| C
    C -->|"retroalimenta"| B
    D -->|"reconfigura"| C
    B -->|"popula"| E
```

| View | Função Principal | Requisito |
|------|-----------------|-----------|
| **Seletor de Contexto** | Escolher nota raiz + tipo de escala | RF-01 |
| **Grafo de Harmonia** | Visualizar e navegar entre acordes | RF-02, RF-05 |
| **Fretboard** | Ver posições de acordes + montar acordes | RF-03, RF-04 |
| **Painel de Afinação** | Configurar instrumento e afinação | RF-06 |
| **Painel de Detalhes** | Exibir informações do acorde selecionado | RF-03 |

---

## 2. Layouts Responsivos

### Desktop (≥ 1024px) — Visão Integrada

```
┌──────────────────────────────────────────────────────────┐
│  🎵 SELETOR DE CONTEXTO (barra horizontal superior)     │
│  [C] [C#] [D] ... [B]  │  Maior ▼  │  🎛️ Afinação ⚙   │
├────────────────────────┬─────────────────────────────────┤
│                        │                                 │
│   🕸️ GRAFO DE          │   🎸 FRETBOARD                  │
│      HARMONIA          │                                 │
│                        │   ║═══╬═══╬═══╬═══╬═══╬═══║   │
│      ┌───┐    ┌───┐    │   ║   ●   ●       ●       ║   │
│      │ I │────│IV │    │   ║       ●   ●       ●   ║   │
│      └─┬─┘    └───┘    │   ║   ●           ●       ║   │
│        │               │   ║       ●   ●       ●   ║   │
│      ┌─┴─┐    ┌───┐    │   ║═══╬═══╬═══╬═══╬═══╬═══║   │
│      │ V │────│vi │    │                                 │
│      └───┘    └───┘    │                                 │
│                        ├─────────────────────────────────┤
│  📋 DETALHES           │   Recomendações: IV → V → vi    │
│  E Major [E, G#, B]    │   ████████░░ (peso 10)          │
└────────────────────────┴─────────────────────────────────┘
```

### Tablet (768–1023px) — Empilhado

```
┌──────────────────────────────────┐
│  🎵 SELETOR DE CONTEXTO         │
├──────────────────────────────────┤
│         🕸️ GRAFO (reduzido)      │
│     I ── IV ── V ── vi          │
├──────────────────────────────────┤
│         🎸 FRETBOARD             │
│   ║═══╬═══╬═══╬═══╬═══╬═══║    │
├──────────────────────────────────┤
│  📋 Detalhes + Recomendações     │
└──────────────────────────────────┘
```

### Mobile (< 768px) — Tabs

```
┌──────────────────────────┐
│  🎵 SELETOR (compacto)    │
├──────────────────────────┤
│                          │
│   [Conteúdo da tab ativa]│
│                          │
│                          │
├──────────────────────────┤
│  🕸️ Grafo  │ 🎸 Braço    │  ← tabs
└──────────────────────────┘
```

---

## 3. Fluxos de Usuário (User Flows)

### Flow 1 — Explorar Campo Harmônico (RF-01 → RF-02)

> **Caso de uso:** Estudante quer entender quais acordes pertencem à tonalidade de E Maior.

```mermaid
flowchart TD
    A["Usuário abre a plataforma"] --> B["Vê Seletor de Contexto\n(12 notas + dropdown de escala)"]
    B --> C["Clica na nota 'E'"]
    C --> D["Seleciona 'Maior' no dropdown"]
    D --> E["Sistema gera campo harmônico\n(< 500ms)"]
    E --> F["Grafo aparece com 7 nós:\nI(E) ii(F#m) iii(G#m) IV(A) V(B) vi(C#m) vii°(D#°)"]
    F --> G["Arestas conectam os nós\ncom espessuras diferentes"]
    G --> H["Usuário visualiza:\n• Nós verdes = maiores\n• Nós azuis = menores\n• Nó vermelho = diminuto"]

    style C fill:#2ECC71,color:#fff
    style D fill:#3498DB,color:#fff
    style F fill:#1a1a2e,color:#e94560
```

**O que o designer precisa criar:**

| Elemento | Descrição Visual | Interação |
|----------|-----------------|-----------|
| **Grade de notas** | 12 botões (C a B) em linha horizontal ou grade 4×3 | Clique seleciona, estado ativo com borda luminosa |
| **Dropdown de escala** | Select estilizado com 3+ opções | Dropdown abre com animação suave |
| **Animação de transição** | Grafo anterior dissolve, novo aparece | Fade out → fade in com escalonamento dos nós |
| **Estado vazio** | Tela antes de selecionar | Mensagem guia: "Selecione uma nota para começar" |

---

### Flow 2 — Interagir com o Grafo e ver no Braço (RF-02 → RF-03)

> **Caso de uso:** Estudante quer ver como tocar o acorde A Major (IV grau) no violão.

```mermaid
flowchart TD
    A["Grafo de E Maior está renderizado"] --> B["Usuário passa mouse sobre nó 'IV - A Major'"]
    B --> C["Tooltip aparece:\n'A Major - Grau IV\nNotas: A, C#, E\nFunção: Subdominante'"]
    C --> D["Usuário clica no nó"]
    D --> E["Nó fica branco brilhante\n(estado selecionado)"]
    E --> F["Fretboard atualiza em < 300ms"]
    F --> G["Posições do acorde A aparecem\ncom cores por intervalo"]
    G --> H["Painel de detalhes mostra:\nNome, notas, qualidade"]
    E --> I["Vizinhos no grafo pulsam\nem dourado (recomendações)"]

    style D fill:#FFFFFF,color:#000
    style G fill:#2ECC71,color:#fff
    style I fill:#F1C40F,color:#000
```

**O que o designer precisa criar:**

| Elemento | Descrição Visual | Interação |
|----------|-----------------|-----------|
| **Nó em hover** | Leve aumento de escala (1.1x) + sombra glow | Cursor muda para pointer |
| **Nó selecionado** | Fundo branco, borda luminosa, texto escuro | Persiste até clicar outro ou limpar |
| **Tooltip do nó** | Card flutuante com nome, grau, notas, função | Aparece em 200ms, desaparece ao sair |
| **Animação de recomendação** | Nós vizinhos pulsam com glow dourado | Pulso suave em loop (1.5s) |
| **Transição do fretboard** | Notas antigas fadeout → novas fadein com bounce | Escalonado por corda (efeito cascata) |
| **Card de detalhes** | Painel lateral/inferior com infos do acorde | Slide-in animado |

---

### Flow 3 — Montar Acorde no Braço (RF-04) — Modo Prática

> **Caso de uso:** Estudante quer praticar montando acordes e ver se acertou.

```mermaid
flowchart TD
    A["Usuário alterna para\n'Modo Prática'"] --> B["Fretboard entra em\nmodo interativo"]
    B --> C["Usuário clica em notas\nno braço do instrumento"]
    C --> D{"3 ou 4 notas\nselecionadas?"}
    D -->|"Menos de 3"| E["Indicador: 'Selecione\nmais notas'"]
    D -->|"3 ou 4 notas"| F["Sistema valida\nacorde em < 50ms"]
    F --> G{"Acorde válido?"}
    G -->|"Sim"| H["Exibe nome do acorde\nDestaca no grafo"]
    G -->|"Não"| I["Feedback: 'Combinação\nnão reconhecida'"]
    H --> J{"No campo\nharmônico?"}
    J -->|"Sim"| K["Nó correspondente\npulsa no grafo\n+ cor verde"]
    J -->|"Não"| L["Mensagem: 'Acorde\nfora do campo'\n+ cor âmbar"]
    K --> M["Recomendações de\npróximos acordes aparecem"]

    style C fill:#3498DB,color:#fff
    style H fill:#2ECC71,color:#fff
    style L fill:#F39C12,color:#fff
```

**O que o designer precisa criar:**

| Elemento | Descrição Visual | Interação |
|----------|-----------------|-----------|
| **Toggle Exploração/Prática** | Switch estilizado com ícones | Animação de transição entre modos |
| **Nota clicável no braço** | Círculo vazio → preenchido ao clicar | Toggle on/off com animação |
| **Indicador de progresso** | Contador "2/3 notas" ou "3/4 notas" | Atualiza em tempo real |
| **Feedback de validação ✅** | Banner verde com nome do acorde | Slide-in por 3s, auto-dismiss |
| **Feedback de erro ❌** | Banner suave (não agressivo) | Tremor sutil na UI, mensagem descritiva |
| **Conexão grafo ↔ braço** | Linha de energia conectando nó ao braço | Animação de partículas ou glow trail |

---

### Flow 4 — Configurar Afinação (RF-06)

> **Caso de uso:** Guitarrista quer mudar para afinação Drop D.

```mermaid
flowchart TD
    A["Usuário clica no ícone\n⚙️ Afinação"] --> B["Painel de afinação abre\n(slide lateral ou modal)"]
    B --> C["Vê presets disponíveis:\nStandard, Drop D, Open G..."]
    C --> D["Clica em 'Drop D'"]
    D --> E["Preview mostra:\nD-A-D-G-B-E"]
    E --> F["Confirma seleção"]
    F --> G["Fretboard recalcula\ntodas as notas (< 200ms)"]
    G --> H["Se havia acorde selecionado,\nposições atualizam"]

    B --> I["Ou: clica em 'Custom'"]
    I --> J["6 dropdowns individuais\n(uma nota por corda)"]
    J --> K["Ajusta cada corda\nmanualmente"]

    style D fill:#3498DB,color:#fff
    style G fill:#2ECC71,color:#fff
```

**O que o designer precisa criar:**

| Elemento | Descrição Visual | Interação |
|----------|-----------------|-----------|
| **Ícone de afinação** | Engrenagem ou diapasão estilizado | Abre painel ao clicar |
| **Lista de presets** | Cards com nome + visualização das cordas | Hover mostra preview, clique aplica |
| **Modo customizado** | 6 seletores verticais (um por corda) | Cada um é um dropdown com notas C-B |
| **Slider de capotraste** | Slider horizontal 0-12 | Arrasta com feedback visual instantâneo |
| **Visualização de cordas** | Mini-fretboard simplificado | Mostra as notas atuais das cordas soltas |
| **Seletor de instrumento** | Tabs ou cards: Guitarra / Baixo 4 / Baixo 5 | Altera número de cordas no fretboard |

---

## 4. Inventário de Componentes Visuais

### 4.1 Seletor de Contexto

```
┌─────────────────────────────────────────────────────┐
│  Nota:  [C][C#][D][D#][E][F][F#][G][G#][A][A#][B]  │
│                        ▲ ativo                       │
│  Escala: [ Maior          ▼ ]    🎛️ ⚙️              │
└─────────────────────────────────────────────────────┘
```

| Componente | Arte Necessária |
|------------|----------------|
| Botão de nota (12x) | 3 estados: idle / hover / ativo. Formato circular ou pill. |
| Dropdown de escala | Ícone chevron, lista flutuante com hover states. |
| Botão de afinação | Ícone com badge indicando preset ativo. |

### 4.2 Grafo de Harmonia

```
        ┌────────────┐
        │  ii - F#m  │──────────┐
        │    🔵       │          │ W=9
        └────────────┘          ▼
  ┌────────────┐         ┌────────────┐
  │  IV - A    │◄────────│  V - B     │
  │    🟢       │  W=9    │    🟢       │
  └─────┬──────┘         └─────┬──────┘
        │ W=8                  │ W=10
        ▼                      ▼
  ┌────────────────────────────────────┐
  │           I - E Major              │
  │             🟢 (centro)             │
  └────────────────────────────────────┘
        ▲                      ▲
        │ W=7                  │ W=7
  ┌─────┴──────┐         ┌────┴───────┐
  │  vi - C#m  │         │ vii° - D#° │
  │    🔵       │         │    🔴       │
  └────────────┘         └────────────┘
```

| Componente | Arte Necessária |
|------------|----------------|
| **Nó do Grafo** | Círculo com gradiente por qualidade (verde/azul/vermelho). 4 estados: idle, hover (glow), selected (branco), recommended (dourado pulsante). |
| **Label do Nó** | 2 linhas: grau romano (bold) + nome do acorde (regular). Fonte legível sobre fundo colorido. |
| **Aresta forte** (W≥8) | Linha contínua 3px com seta. Cor suave (cinza ou branco translúcido). |
| **Aresta média** (5-7) | Linha contínua 1.5px sem seta proeminente. |
| **Aresta fraca** (<5) | Linha tracejada 1px, quase invisível. |
| **Animação de recomendação** | Glow pulsante dourado nos nós vizinhos. |
| **Fundo do grafo** | Dark mode com textura sutil ou gradiente radial a partir do nó I. |

### 4.3 Fretboard (Braço do Instrumento)

```
  Corda   0    1    2    3    4    5    6    7
  ─────┬────┬────┬────┬────┬────┬────┬────┬────
  E ───┤    │    │    │ 🔴 │    │    │    │ 🟡
  B ───┤    │ 🟢 │    │    │    │ 🔵 │    │
  G ───┤    │    │    │    │ 🟢 │    │    │
  D ───┤    │    │ 🔴 │    │    │    │ 🟡 │
  A ───┤    │    │    │    │ 🔴 │    │    │
  E ───┤ 🔴 │    │    │ 🟢 │    │    │    │
  ─────┴────┴────┴────┴────┴────┴────┴────┴────
              •              •         •
             3º             5º        7º  ← marcadores
```

| Componente | Arte Necessária |
|------------|----------------|
| **Cordas** | 6 linhas horizontais com espessura crescente (aguda → grave). |
| **Trastes** | Linhas verticais com espaçamento decrescente (simula perspectiva). |
| **Marcadores de posição** | Pontos nos trastes 3, 5, 7, 9, 12 (duplo), 15. |
| **Nota simples** | Círculo preenchido com cor do intervalo, borda branca, label centralizado. |
| **Nota bicolor** | Dois semicírculos (esquerdo = cor primária, direito = cor secundária). |
| **Nota Root** | Destaque especial — borda mais espessa ou halo vermelho. |
| **Tooltip de nota** | Popup minimal: "G# — 3ª Maior". |
| **Nota interativa (modo prática)** | Estado vazio (contorno) → preenchido ao clicar. Animação de "pop". |

### 4.4 Painel de Detalhes do Acorde

```
┌──────────────────────────────┐
│  🟢 E Major                  │
│  Grau: I (Tônica)            │
│                              │
│  Notas: E — G# — B          │
│         R    3     5         │
│                              │
│  Próximos recomendados:      │
│  ████████████░░  B (V)  W=10│
│  ████████░░░░░░  A (IV) W=8 │
│  █████░░░░░░░░░  D#° (vii°) │
│  ████░░░░░░░░░░  C#m (vi)   │
└──────────────────────────────┘
```

| Componente | Arte Necessária |
|------------|----------------|
| **Header do acorde** | Ícone de qualidade (cor) + nome grande. |
| **Notas constituintes** | Cada nota com seu label de intervalo (R, 3, 5, 7). |
| **Barra de recomendação** | Barra horizontal preenchida proporcionalmente ao peso (1-10). Cor do acorde alvo. |
| **Lista de recomendações** | Ordenada por peso, com nome do acorde + grau + tipo de movimento. |

### 4.5 Painel de Afinação

```
┌──────────────────────────────────┐
│  🎛️ Afinação                     │
│                                  │
│  Instrumento: [🎸 Guitarra ▼]    │
│                                  │
│  Presets:                        │
│  [● Standard    ] E-A-D-G-B-E   │
│  [  Drop D      ] D-A-D-G-B-E   │
│  [  Open G      ] D-G-D-G-B-D   │
│  [  Custom...   ]                │
│                                  │
│  Capo: ────●──────── Traste 0    │
│                                  │
│  Cordas:                         │
│  6ª [E▼] 5ª [A▼] 4ª [D▼]        │
│  3ª [G▼] 2ª [B▼] 1ª [E▼]        │
└──────────────────────────────────┘
```

---

## 5. Sistema de Feedback Visual

As cores e animações comunicam **significado funcional**, não apenas estética:

### Feedback por Ação

| Ação do Usuário | Feedback Visual | Feedback Sonoro (futuro) |
|-----------------|----------------|------------------------|
| Seleciona nota raiz | Botão ilumina, grafo anterior dissolve | — |
| Muda escala | Grafo transiciona com morph dos nós | — |
| Clica nó do grafo | Nó fica branco, vizinhos pulsam, fretboard atualiza | Nota toca |
| Hover em nó | Glow sutil + tooltip | — |
| Monta acorde correto | Banner verde + nó pulsa no grafo | Acorde toca |
| Monta acorde inválido | Shake sutil + mensagem descritiva | — |
| Acorde fora do campo | Badge âmbar "fora do campo" | — |
| Limpa seleção (botão direito) | Fade out dos arcos bicolores | — |
| Muda afinação | Fretboard faz "refresh" com animação | — |

### Micro-animações Essenciais

| Animação | Duração | Easing | Contexto |
|----------|---------|--------|----------|
| Nó hover scale | 200ms | ease-out | Hover sobre nó do grafo |
| Nó selection glow | 300ms | ease-in-out | Clique em nó |
| Recomendação pulse | 1500ms | ease-in-out (loop) | Nós sugeridos |
| Fretboard note pop | 150ms | spring | Nota aparece no braço |
| Arco bicolor reveal | 250ms | ease-out | Segunda cor aparece |
| Tooltip fade-in | 200ms | linear | Hover em qualquer elemento |
| Panel slide-in | 300ms | cubic-bezier | Painel de detalhes abre |
| Mode switch | 400ms | ease-in-out | Exploração ↔ Prática |

---

## 6. Paleta Cromática Completa

### Cores de Interface (Dark Mode)

| Token | Hex | Uso |
|-------|-----|-----|
| `bg-primary` | `#0D1117` | Fundo principal |
| `bg-secondary` | `#161B22` | Cards, painéis |
| `bg-elevated` | `#21262D` | Dropdowns, modals |
| `border-default` | `#30363D` | Bordas |
| `text-primary` | `#F0F6FC` | Texto principal |
| `text-secondary` | `#8B949E` | Labels, hints |
| `accent` | `#58A6FF` | Links, ações |

### Cores Semânticas de Acordes (da SPEC-3.01)

| Qualidade | Hex | Token |
|-----------|-----|-------|
| Maior | `#2ECC71` | `chord-major` |
| Menor | `#3498DB` | `chord-minor` |
| Diminuto | `#E74C3C` | `chord-diminished` |
| Aumentado | `#F39C12` | `chord-augmented` |
| Selecionado | `#FFFFFF` | `chord-selected` |
| Recomendado | `#F1C40F` | `chord-recommended` |

### Cores de Intervalo no Fretboard (12 cores)

| Intervalo | Hex | Token |
|-----------|-----|-------|
| 0 Root | `#E74C3C` | `note-0` |
| 1 b2 | `#2C3E50` | `note-1` |
| 2 M2 | `#3498DB` | `note-2` |
| 3 m3 | `#27AE60` | `note-3` |
| 4 M3 | `#2ECC71` | `note-4` |
| 5 P4 | `#E67E22` | `note-5` |
| 6 TT | `#9B59B6` | `note-6` |
| 7 P5 | `#F1C40F` | `note-7` |
| 8 m6 | `#E91E63` | `note-8` |
| 9 M6 | `#00BCD4` | `note-9` |
| 10 m7 | `#795548` | `note-10` |
| 11 M7 | `#FF00FF` | `note-11` |

---

## 7. Tipografia

| Uso | Fonte Sugerida | Peso | Tamanho |
|-----|---------------|------|---------|
| Títulos (H1-H2) | **Inter** ou **Outfit** | 700 (Bold) | 24-32px |
| Labels de nó | **Inter** | 600 (SemiBold) | 14-16px |
| Grau romano no nó | **JetBrains Mono** | 700 | 18px |
| Texto de corpo | **Inter** | 400 (Regular) | 14px |
| Labels no fretboard | **Inter** | 700 | 11px |
| Tooltips | **Inter** | 400 | 12px |
| Código/dados | **JetBrains Mono** | 400 | 13px |

---

## 8. Checklist de Arte Necessária

### Assets Gráficos

- [ ] **Ícone do app** — Logotipo Hearmony (variações: dark/light, ícone/full)
- [ ] **Fundo do grafo** — Textura dark com gradiente radial sutil
- [ ] **Ícones de instrumento** — Guitarra, Baixo 4, Baixo 5, Ukulele (outline style)
- [ ] **Ícone de afinação** — Diapasão ou engrenagem musical
- [ ] **Ícone de modo** — Exploração (olho) / Prática (mão)
- [ ] **Marcadores de fretboard** — Dots nos trastes 3, 5, 7, 9, 12, 15
- [ ] **Empty states** — Ilustração "Selecione uma nota para começar"

### Telas para Protótipo (Alta Fidelidade)

- [ ] **Desktop** — Tela principal com grafo + fretboard lado a lado
- [ ] **Desktop** — Acorde selecionado com detalhes e recomendações
- [ ] **Desktop** — Modo prática com notas sendo montadas
- [ ] **Desktop** — Painel de afinação aberto
- [ ] **Tablet** — Layout empilhado
- [ ] **Mobile** — Tab grafo ativa
- [ ] **Mobile** — Tab fretboard ativa
- [ ] **Loading state** — Skeleton/shimmer enquanto gera campo
- [ ] **Onboarding** — Tela de boas-vindas guiando o primeiro uso

---

## 9. Resumo: Requisito → Experiência do Usuário

| Requisito | O que o Usuário Vê | O que o Usuário Faz | O que o Usuário Sente |
|-----------|--------------------|--------------------|----------------------|
| **RF-01** | 12 notas + dropdown de escala | Clica na nota, seleciona escala | Controle imediato da tonalidade |
| **RF-02** | Grafo com 7 nós coloridos e arestas | Observa relações entre acordes | Compreensão visual da harmonia |
| **RF-03** | Nó selecionado + fretboard atualizado | Clica no nó e vê posições no braço | Conexão direta teoria → prática |
| **RF-04** | Notas clicáveis no braço + validação | Monta acordes nota a nota | Sensação de descoberta e validação |
| **RF-05** | Nós vizinhos pulsando em dourado | Segue as sugestões de progressão | Guiado pelo fluxo harmônico |
| **RF-06** | Painel com presets e sliders | Configura a afinação do instrumento | Personalização e flexibilidade |
