# 📋 Especificações Técnicas (Specs)

Este diretório contém todas as especificações técnicas que guiam o desenvolvimento da plataforma Hearmony.

## Estrutura

```text
specs/
├── epics/                    # Especificações organizadas por Épico
│   ├── 01-nucleo-matematico/  # Épico 1: Núcleo Matemático e Motor de Harmonia
│   ├── 02-estado-afinacao/    # Épico 2: Gerenciamento de Estado e Afinação
│   ├── 03-renderizacao-ui/    # Épico 3: Renderização Gráfica e UI
│   └── 04-cross-platform/    # Épico 4: Experiência Cross-Platform e Ergonomia
├── glossary.md               # Glossário de termos do domínio
├── architecture.md           # Visão geral da arquitetura técnica
└── README.md                 # Este arquivo
```

## Convenções

### Nomenclatura de Specs

Cada spec segue o padrão:

```
SPEC-{EPIC_NUMBER}.{SPEC_NUMBER}-{slug-descritivo}.md
```

**Exemplo:** `SPEC-1.01-matriz-adjacencia.md`

### Status das Specs

| Status       | Emoji | Descrição                                |
|-------------|-------|------------------------------------------|
| `DRAFT`     | 📝    | Rascunho em elaboração                   |
| `REVIEW`    | 🔍    | Em revisão / aguardando feedback         |
| `APPROVED`  | ✅    | Aprovada e pronta para implementação     |
| `IN_PROGRESS` | 🚧  | Implementação em andamento               |
| `DONE`      | ✔️    | Implementação concluída e validada       |
| `DEPRECATED`| ⛔    | Descontinuada / substituída              |

### Template de Spec

Cada spec **deve** seguir o template definido em `_template.md`.

## Filosofia: Spec-Driven Development (SDD)

> **"Nenhum código é escrito sem uma spec aprovada."**

1. **Spec First** — Toda feature começa como uma especificação.
2. **Implementação Rastreável** — Todo código referencia sua spec de origem.
3. **Validação Contínua** — Testes são derivados diretamente das specs (critérios de aceite).
4. **Evolução Documentada** — Alterações em specs geram novas versões, nunca edições silenciosas.
