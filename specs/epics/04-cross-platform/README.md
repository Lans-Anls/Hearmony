# Épico 4 — Experiência Cross-Platform e Ergonomia

> **Pacote:** `apps/mobile`

## Objetivo

Adaptar a experiência da plataforma para dispositivos móveis com feedback tátil (haptics), renderização de alta performance via Skia e ergonomia otimizada para toque.

## Specs deste Épico

| Spec | Título | Status | Requisitos |
|------|--------|--------|------------|
| [SPEC-4.01](SPEC-4.01-mobile-skia.md) | Adaptação Mobile (React Native + Skia) | 📝 DRAFT | — |

> **Nota:** Este épico será detalhado após a conclusão dos Épicos 1–3. A SPEC-4.01 contém o escopo direcional planejado.

## Escopo Planejado

- Renderização nativa via react-native-skia (GPU-accelerated)
- Feedback háptico contextualizado (nota, acorde válido, fora do campo)
- Gestos multi-touch otimizados (pinch-to-zoom, swipe, long press)
- Responsividade adaptativa por tamanho de tela (phone vs. tablet)
- Orientação landscape para fretboard, portrait para grafo
