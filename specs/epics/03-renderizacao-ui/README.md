# Épico 3 — Renderização Gráfica e UI

> **Pacotes:** `@hearmony/ui` + `apps/web` + `@hearmony/fret-bridge`

## Objetivo

Construir o sistema visual da plataforma: design system com cores semânticas, renderização do fretboard com arcos bicolores, e camada de API para comunicação entre frontend e fret-bridge headless.

## Specs deste Épico

| Spec | Título | Status | Requisitos |
|------|--------|--------|------------|
| [SPEC-3.01](SPEC-3.01-design-system.md) | Design System e Linguagem Visual | ✅ APPROVED | RNF-02 |
| [SPEC-3.02](SPEC-3.02-renderizacao-fretboard.md) | Renderização do Fretboard | ✅ APPROVED | RF-03 |
| [SPEC-3.03](SPEC-3.03-api-integracao.md) | API de Integração (WebSocket/REST) | ✅ APPROVED | RNF-04 |

## Escopo

- Paleta de cores semânticas por qualidade de acorde e por intervalo
- Regras de layout do grafo (posicionamento por função harmônica)
- Estilos de aresta por peso (contínua, tracejada, espessura)
- Renderização do fretboard baseada na lógica do fret.py
- Arcos bicolores para intersecção de funções harmônicas
- Hitboxes interativas com clique e hover
- Comunicação WebSocket em tempo real com fret-bridge
- REST fallback para diagnóstico e inicialização
- Contratos de payload JSON padronizados
