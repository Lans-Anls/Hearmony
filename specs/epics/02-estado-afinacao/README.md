# Épico 2 — Gerenciamento de Estado e Afinação

> **Pacote:** `@hearmony/core`

## Objetivo

Gerenciar o estado global reativo da aplicação e o sistema de afinação customizável, garantindo fluxo unidirecional de dados e sincronização entre todos os componentes.

## Specs deste Épico

| Spec | Título | Status | Requisitos |
|------|--------|--------|------------|
| [SPEC-2.01](SPEC-2.01-sistema-afinacao.md) | Sistema de Afinação Customizável | ✅ APPROVED | RF-06 |
| [SPEC-2.02](SPEC-2.02-gerenciamento-estado.md) | Gerenciamento de Estado Global | ✅ APPROVED | RNF-01, RNF-03 |

## Escopo

- Presets de afinação para guitarra, baixo 4/5 cordas
- Afinação customizada por corda individual
- Suporte a capotraste com recálculo automático
- Estado global centralizado com 4 slices (Context, Selection, Fretboard, Tuning)
- Fluxo unidirecional: ação → estado → view
- Persistência de configurações entre sessões
- Propagação reativa em < 16ms (60fps)
