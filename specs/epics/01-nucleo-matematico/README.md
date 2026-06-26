# Épico 1 — Núcleo Matemático e Motor de Harmonia

> **Pacote:** `@hearmony/core`

## Objetivo

Implementar o motor matemático que representa relações harmônicas como grafos ponderados, utilizando matrizes de adjacência para calcular probabilidades de progressão de acordes, gerar campos harmônicos e validar acordes formados pelo usuário.

## Specs deste Épico

| Spec | Título | Status | Requisitos |
|------|--------|--------|------------|
| [SPEC-1.01](SPEC-1.01-matriz-adjacencia.md) | Matriz de Adjacência Harmônica | ✅ APPROVED | RF-02 |
| [SPEC-1.02](SPEC-1.02-motor-harmonico.md) | Motor Harmônico e Recomendação | ✅ APPROVED | RF-01, RF-05 |
| [SPEC-1.03](SPEC-1.03-validador-cromatico.md) | Validador Cromático | ✅ APPROVED | RF-04 |

## Escopo

- Representação de acordes e notas como nós de um grafo ponderado
- Matriz de adjacência 7×7 com pesos baseados em teoria musical real
- Geração de campos harmônicos para escalas maiores, menores e variantes
- Cálculo de recomendações de progressão ordenadas por peso
- Validação reversa de acordes a partir de notas individuais
- Suporte a tríades e tétrades com reconhecimento de inversões
- Cálculo dinâmico de pesos por voice leading
