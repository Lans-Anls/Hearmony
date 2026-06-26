# 📖 Glossário do Domínio — Hearmony

Definições canônicas dos termos utilizados nas especificações do projeto.

---

## Teoria Musical

| Termo | Definição |
|-------|-----------|
| **Harmonia** | Estudo das relações entre notas simultâneas e progressões de acordes. |
| **Progressão de Acordes** | Sequência ordenada de acordes que forma a base harmônica de uma composição. |
| **Matriz de Adjacência** | Representação matricial de um grafo onde cada célula indica o peso/probabilidade da transição entre dois acordes. |
| **Afinação (Tuning)** | Configuração das frequências base atribuídas a cada corda do instrumento. |
| **Cromático** | Relativo à escala cromática (12 semitons). |
| **Tensão** | Nota ou intervalo que cria instabilidade harmônica, demandando resolução. |
| **Função Primária** | Papel fundamental de um acorde na tonalidade (Tônica, Subdominante, Dominante). |

## Arquitetura

| Termo | Definição |
|-------|-----------|
| **Spec** | Documento de especificação técnica que define requisitos, contratos e critérios de aceite para uma unidade funcional. |
| **SDD (Spec-Driven Development)** | Metodologia onde toda implementação é precedida e guiada por uma spec aprovada. |
| **Épico** | Agrupamento de specs relacionadas que formam uma macro-funcionalidade. |
| **Monorepo** | Repositório único que contém múltiplos pacotes/aplicações compartilhando código. |
| **Hitbox** | Área interativa no braço do instrumento que responde a toques/cliques. |

## Plataforma

| Termo | Definição |
|-------|-----------|
| **@hearmony/core** | Pacote contendo o núcleo matemático e motor de harmonia. |
| **@hearmony/ui** | Pacote com componentes base e design system. |
| **@hearmony/fret-bridge** | Adaptador Python para cálculos físicos em modo headless. |
| **Braço do Instrumento (Fretboard)** | Representação visual interativa do braço de um instrumento de corda. |
