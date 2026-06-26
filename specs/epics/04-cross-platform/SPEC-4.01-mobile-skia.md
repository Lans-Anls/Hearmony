# SPEC-4.01 — Adaptação Mobile (React Native + Skia)

> **Status:** 📝 DRAFT
> **Épico:** 4 — Experiência Cross-Platform e Ergonomia
> **Autor:** Lans-Anls
> **Criado em:** 2026-06-26
> **Última atualização:** 2026-06-26

---

## 1. Resumo

Define a adaptação da plataforma Hearmony para dispositivos móveis utilizando React Native com `react-native-skia` para renderização de alta performance e APIs de haptics para feedback tátil contextualizado.

> **Nota:** Esta spec será detalhada após a conclusão dos Épicos 1–3. Os requisitos listados abaixo são direcionais e serão refinados com base nos aprendizados da implementação web.

## 2. Motivação

A experiência mobile é fundamental para músicos que praticam em movimento. O braço do instrumento no celular precisa ser tátil, responsivo e otimizado para gestos multi-touch — funcionalidades que requerem renderização nativa e feedback háptico.

## 3. Escopo Planejado

### Renderização Nativa
- Fretboard renderizado via `react-native-skia` (GPU-accelerated)
- Grafo de harmonia com animações a 60fps
- Suporte a gestos multi-touch para interação com o braço

### Feedback Háptico
- Vibração leve ao clicar em nota
- Vibração forte ao completar um acorde válido
- Padrão de vibração para acorde fora do campo harmônico

### Gestos
- Pinch-to-zoom no fretboard
- Swipe horizontal para navegar entre posições
- Long press para tooltip detalhado

### Responsividade
- Adaptação por tamanho de tela (phone vs. tablet)
- Orientação landscape obrigatória para fretboard
- Portrait para grafo e seletor

## 4. Dependências

| Spec | Relação |
|------|---------|
| SPEC-1.01–1.03 | Toda lógica de core compartilhada |
| SPEC-2.01–2.02 | Estado e afinação compartilhados |
| SPEC-3.01 | Design tokens reutilizados |
| SPEC-3.03 | API de integração compartilhada |

## 5. Histórico de Revisões

| Versão | Data | Autor | Descrição da Mudança |
|--------|------|-------|---------------------|
| 0.1 | 2026-06-26 | Lans-Anls | Placeholder com escopo direcional |
