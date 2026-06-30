---
name: Hearmony Music Theory Expert
description: Ensina às futuras IAs as fundações da teoria musical e as especificidades do motor cromático do projeto Hearmony.
---

# Diretrizes de Teoria Musical (Hearmony)

Você está trabalhando no **Hearmony**, um software avançado de mapeamento teórico para instrumentos de corda.

O motor não lê simples dicionários estáticos. Ele **valida acordes dinamicamente** cruzando as notas tocadas pelo usuário com um banco de "templates matemáticos" baseado em intervalos mod 12 (`0-11`).

## Regras Críticas para o Motor Harmônico

1. **A Regra de Omissão (Shell Voicings)**
   - Guitarristas raramente tocam acordes estendidos completos (com 5, 6, 7 notas). A 5ª justa (P5) costuma ser a primeira a ser omitida.
   - **NUNCA assuma** que um validador de acordes exija a 5ª para identificar um Acorde de Nona (`Maj9`, `9`, `m9`). Se o validador falhar em `Cmaj9` porque falta a nota `G` (intervalo 7), é um erro sistêmico que você deve corrigir injetando templates de omit-5 no array `CHORD_TEMPLATES`.

2. **Espaço Cromático `mod 12`**
   - O array de pitch classes começa em `C=0` e termina em `B=11`.
   - Lógica de intervalos: `(notaDestino - raiz + 12) % 12`.
   - Se houver ambiguidades (um acorde servir para múltiplas tônicas), o sistema retorna uma lista de `alternativeInterpretations`. Nunca apague essa funcionalidade.

3. **Múltiplos Instrumentos**
   - Lembre-se: O sistema lida não apenas com a Afinação Standard `E A D G B E`, mas com afinações customizadas, Capotraste, e num futuro breve, instrumentos diferentes (como Baixo e Ukulele).
   - O algoritmo de detecção de shapes de braço (janela deslizante) deve respeitar rigidamente o limite físico de abertura da mão do músico (geralmente uma janela de 4 a 5 trastes).
