# Logos de marcas parceiras

Espaço reservado para os logos dos parceiros de streaming exibidos nos cards
de plano e no badge do hero.

## Regra obrigatória

**Somente SVG, inserido inline no HTML.** PNG é proibido (DEC-007): cada logo
em PNG viraria uma requisição HTTP nova, anulando o ganho de performance da
home — que hoje faz apenas 9 requisições no total.

Os arquivos desta pasta servem como fonte; o conteúdo do `<svg>` deve ser
**colado dentro do HTML**, não referenciado por `<img src="...">`.

## SVGs necessários

| Arquivo | Marca | Onde aparece hoje |
|---|---|---|
| `netflix.svg` | Netflix | badge do hero, card "600 MEGA + Netflix" |
| `sky-plus.svg` | SKY+ | cards "500 MEGA + SKY+ Light" e "500 MEGA + SKY+ e Prime" |
| `globoplay.svg` | Globoplay | não usado no portfólio de agosto/2026 |
| `hbo-max.svg` | HBO Max | não usado no portfólio de agosto/2026 |
| `telecine.svg` | Telecine | não usado no portfólio de agosto/2026 |
| `premiere.svg` | Premiere | não usado no portfólio de agosto/2026 |

Os quatro últimos ficam pré-listados para quando o book de ofertas voltar a
incluí-los.

## Origem dos arquivos

Obter das centrais de marca oficiais de cada parceiro ou do material
disponibilizado pela Brisanet. **Não desenhar, redesenhar ou reconstruir de
memória** — logo aproximado é logo errado, e o uso da marca é regulamentado.

## Como aplicar

O markup já tem o ponto de inserção marcado por comentário:

```html
<div class="hero-banner__aggregate">
  <span class="aggregate-plus">+</span>
  <!-- logo oficial entra aqui como <svg> inline: ver img/marcas/README.md -->
  <span class="brand-name brand-netflix">Netflix</span>
</div>
```

Substituir o `<span class="brand-name">` pelo `<svg>` do logo, mantendo:

- `role="img"` e `<title>` com o nome da marca (nome acessível — sem isso a
  auditoria `link-name`/`image-alt` volta a falhar);
- `height` fixo via CSS (`.brand-logo { height: 20px; width: auto; }`) para não
  causar salto de layout;
- `aria-hidden="true"` **apenas** se o nome da marca também estiver em texto
  visível ao lado.

Enquanto os SVGs não chegam, o nome fica em tratamento tipográfico: peso 800
na cor da marca (Netflix `#E50914`). Marcas sem cor oficial confirmada usam a
cor de texto padrão do card — não inventar cor de marca.
