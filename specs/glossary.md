# 📖 Glossário do Domínio — Hearmony

Definições canônicas dos termos utilizados nas especificações do projeto.

---

## Teoria Musical

| Termo | Definição |
|-------|-----------|
| **Harmonia** | Estudo das relações entre notas simultâneas e progressões de acordes. |
| **Progressão de Acordes** | Sequência ordenada de acordes que forma a base harmônica de uma composição. |
| **Campo Harmônico** | Conjunto dos 7 acordes diatônicos derivados de uma escala, com suas relações internas. |
| **Escala Cromática** | Série de 12 semitons: C, C#, D, D#, E, F, F#, G, G#, A, A#, B. |
| **Grau Diatônico** | Posição do acorde na escala (I, ii, iii, IV, V, vi, vii°). |
| **Tríade** | Acorde de 3 notas (fundamental, 3ª, 5ª). |
| **Tétrade** | Acorde de 4 notas (fundamental, 3ª, 5ª, 7ª). |
| **Inversão** | Reordenação das notas de um acorde onde a fundamental não é a nota mais grave. |
| **Cadência** | Movimento harmônico padronizado entre dois acordes (autêntica, plagal, deceptiva, etc.). |
| **Cadência Autêntica** | Movimento V → I, resolução de máxima tensão. |
| **Cadência Plagal** | Movimento IV → I, resolução sem trítono ("cadência amém"). |
| **Cadência Deceptiva** | Movimento V → vi, resolução frustrada da dominante. |
| **Voice Leading** | Técnica de condução de vozes que minimiza o movimento entre notas de acordes consecutivos. |
| **Tensão** | Nota ou intervalo que cria instabilidade harmônica, demandando resolução. |
| **Função Primária** | Papel fundamental de um acorde na tonalidade (Tônica, Subdominante, Dominante). |
| **Trítono** | Intervalo de 6 semitons (3 tons inteiros), máxima instabilidade. |
| **Afinação (Tuning)** | Configuração das frequências base atribuídas a cada corda do instrumento. |
| **Capotraste** | Dispositivo que eleva uniformemente a afinação em N semitons. |
| **Pitch Class** | Classe de altura — nota sem oitava (0–11 no espaço cromático). |
| **Normal Form** | Representação canônica compacta de um conjunto de pitch classes. |

## Arquitetura

| Termo | Definição |
|-------|-----------|
| **Spec** | Documento de especificação técnica que define requisitos, contratos e critérios de aceite para uma unidade funcional. |
| **SDD (Spec-Driven Development)** | Metodologia onde toda implementação é precedida e guiada por uma spec aprovada. |
| **Épico** | Agrupamento de specs relacionadas que formam uma macro-funcionalidade. |
| **Monorepo** | Repositório único que contém múltiplos pacotes/aplicações compartilhando código. |
| **Hitbox** | Área interativa no braço do instrumento que responde a toques/cliques. |
| **Arco Bicolor** | Nota renderizada com dois semicírculos de cores distintas: cor primária (acorde atual) e secundária (sugestão de progressão). |
| **Headless Mode** | Execução de um programa sem interface gráfica, comunicando via stdin/stdout. |
| **Fluxo Unidirecional** | Padrão onde dados fluem em uma só direção: ação → estado → view. |
| **Slice** | Fatia isolada do estado global com seu próprio reducer/mutator. |
| **Force-Directed Layout** | Algoritmo de posicionamento de nós de grafo baseado em simulação de forças. |
| **Edge Crossing** | Cruzamento de arestas no grafo — indesejável por aumentar carga cognitiva. |

## Plataforma

| Termo | Definição |
|-------|-----------|
| **@hearmony/core** | Pacote contendo o núcleo matemático, motor harmônico e validador cromático. |
| **@hearmony/ui** | Pacote com componentes base, design system e design tokens. |
| **@hearmony/fret-bridge** | Adaptador Python para cálculos de geometria do fretboard em modo headless. |
| **Braço do Instrumento (Fretboard)** | Representação visual interativa do braço de um instrumento de corda. |
| **fret.py** | Script Python de referência que implementa o fretboard em Tkinter. |
| **fret_bridge.py** | Adaptador headless derivado do fret.py para comunicação via JSON stdin/stdout. |
| **HarmonicEngine** | Serviço central que gera campos harmônicos e calcula recomendações de progressão. |
| **ChromaticValidator** | Serviço que identifica acordes a partir de notas individuais (validação reversa). |
| **TuningService** | Serviço que gerencia afinações, presets e capotraste. |
