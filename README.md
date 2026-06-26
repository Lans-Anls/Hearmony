# 🎸 Plataforma de Aprendizagem Harmônica (Harmonic Learning Platform)

[![Cross-Platform](https://img.shields.io/badge/Platform-Web%20%7C%20Mobile-blue.svg)]()
[![Stack](https://img.shields.io/badge/Stack-React%20%7C%20Skia%20%7C%20Python-2ea44f.svg)]()
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)]()

Bem-vindo ao repositório oficial da Plataforma de Aprendizagem Harmônica. Este projeto é um ecossistema *cross-platform* (Web e Mobile) focado no ensino de harmonia musical através da visualização gráfica avançada (teoria dos grafos) integrada a um simulador tátil e dinâmico de braço de instrumentos de corda.

---

## 📖 Índice

1. [Visão Geral e Arquitetura](#visão-geral-e-arquitetura)
2. [Estrutura do Monorepo](#estrutura-do-monorepo)
3. [Instalação e Setup Local](#instalação-e-setup-local)
4. [Especificações Técnicas de Implementação (Specs)](#especificações-técnicas-de-implementação-specs)
    - [Épico 1: Núcleo Matemático e Motor de Harmonia](#épico-1-núcleo-matemático-e-motor-de-harmonia)
    - [Épico 2: Gerenciamento de Estado e Afinação](#épico-2-gerenciamento-de-estado-e-afinação)
    - [Épico 3: Renderização Gráfica e UI](#épico-3-renderização-gráfica-e-ui)
    - [Épico 4: Experiência Cross-Platform e Ergonomia](#épico-4-experiência-cross-platform-e-ergonomia)

---

## 🏗️ Visão Geral e Arquitetura

A plataforma utiliza um modelo de dados orientado a matrizes de adjacência para calcular o peso e a probabilidade de movimentos harmônicos (progressões de acordes). O motor visual do braço do instrumento escuta estas estruturas matemáticas e as traduz em formas geométricas interativas, suportando afinações customizadas, cálculos em tempo real e visualização bicolor (função primária vs. tensão).

**Padrões Adotados:**
* **Spec-Driven Development (SDD):** Todo código deve satisfazer as especificações descritas neste documento.
* **Isolamento Lógico:** Regras de teoria musical não habitam componentes de UI. Toda validação cromática ocorre no pacote `@plataforma/core`.

---

## 📂 Estrutura do Monorepo

O projeto é mantido via Turborepo/Nx para garantir o compartilhamento de código estrito entre as plataformas cliente.

```text
/
├── packages/
│   ├── core/                # (Épico 1) Matriz de adjacência, validadores, engine geométrica
│   ├── ui/                  # Componentes base e design system (Hitboxes, cores semânticas)
│   └── fret-bridge/         # Adaptador Python (modo headless) para cálculos físicos
├── apps/
│   ├── web/                 # (Épico 3) Frontend React/Vue (D3.js, Canvas API)
│   └── mobile/              # (Épico 4) App React Native (react-native-skia, Haptics)
├── docs/                    # Diagramas ER, esquemas JSON e manuais
└── package.json