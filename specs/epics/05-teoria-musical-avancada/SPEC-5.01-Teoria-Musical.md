# SPEC 5.01 — Teoria Musical Avançada

Esta especificação define o alicerce matemático e musical da plataforma Hearmony. A inteligência do aplicativo depende inteiramente das tolerâncias e regras descritas abaixo para processar adequadamente a teoria musical e traduzi-la para o braço do instrumento (fretboard).

## 1. As Notas da Escala
O sistema mapeia o ciclo de quintas abrangendo **15 tonalidades maiores** (variando de 7 bemóis a 7 sustenidos).
- **Abstração Cromática:** O motor opera primariamente em um espaço modular `mod 12` (onde `C=0`, `C#=1`... `B=11`). 
- **Enarmonia:** A resolução de enarmonias (diferenciar D# de Eb) ocorre no momento de *apresentação (UI)*, mas o core engine trata ambas as notas pelo mesmo identificador posicional `3`.

## 2. Intervalos
Os intervalos são calculados através de distâncias absolutas em semitons a partir da raiz (Root) selecionada:
- `0`: Root (Tônica)
- `1, 2`: Segundas (Menor, Maior)
- `3, 4`: Terças (Menor, Maior)
- `5, 6, 7`: Quartas e Quintas (Justa, Dim/Aum, Justa)
- `8, 9`: Sextas (Menor, Maior)
- `10, 11`: Sétimas (Menor, Maior)

## 3. Tríades (Diatônicas)
Toda tríade básica é validada por exigir *obrigatoriamente* 3 pitch classes distintos (Tônica, Terça e Quinta).
- **Maior:** `[0, 4, 7]`
- **Menor:** `[0, 3, 7]`
- **Diminuta:** `[0, 3, 6]`
- **Aumentada:** `[0, 4, 8]`

## 4. Tétrades
O acréscimo de sétimas requer 4 notas distintas na teoria pura.
- **Maj7:** `[0, 4, 7, 11]`
- **7 (Dominante):** `[0, 4, 7, 10]`
- **m7:** `[0, 3, 7, 10]`
- **dim7:** `[0, 3, 6, 9]`
- **m7b5:** `[0, 3, 6, 10]`

## 5. Acordes Estendidos e Omissões Toleradas (Shell Voicings)
**REGRAS CRÍTICAS PARA INSTRUMENTOS DE CORDAS:**
Devido a limitações físicas no violão/guitarra, é prática comum e tolerada a **omissão da Quinta Justa (P5)** para dar lugar a extensões (9ªs, 11ªs, 13ªs). O motor matemático **DEVE** conter *templates* independentes para essas supressões, a fim de evitar falsos-positivos na validação de acordes.

**Exemplos de Omissão Válidos (Drop Voicings & Shells):**
- Cmaj9 (omit 5): `[0, 2, 4, 11]` (C, D, E, B)
- C9 (omit 5): `[0, 2, 4, 10]` (C, D, E, Bb)
- Cm9 (omit 5): `[0, 2, 3, 10]` (C, D, Eb, Bb)
- C6/9 (omit 5): `[0, 2, 4, 9]` (C, D, E, A)

## 6. Escalas (Modos)
As escalas não devem ser rigidamente fixadas, mas sempre derivadas do campo harmônico. Os modos (Jônio, Dórico, Frígio, Lídio, Mixolídio, Eólio, Lócrio) são tratados como **Permutações** da sequência original dos intervalos de uma escala matriz.

## 7. Arpejos
Um arpejo nada mais é do que a desconstrução linear de um `Chord`.
O sistema diferencia um acorde tocado simultaneamente no braço (uma coluna de notas) de um arpejo pela sua representação temporal (as notas são realçadas e sonorizadas em sequência, seguindo a ordem de frequências da mais grave para a mais aguda, ou ditadas pelo input do usuário).
