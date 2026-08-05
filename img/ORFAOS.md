# Imagens sem uso no repositorio

Levantamento atualizado em 2026-08-05 (Fase 3.2, itens 3.2.1d e 3.2.4d).

**Nada foi apagado.** Esta lista existe para o autorizador decidir a remocao.

## Metodo

Para cada imagem em `img/`, procurou-se o nome do arquivo (e a variante url-encoded)
em todo arquivo de texto do repositorio, incluindo `empresas.html` e
`empresas/telefonia.html`. Separa dois casos:

- **Sem nenhuma referencia** — o nome nao aparece em lugar nenhum.
- **Referencia so em comentario** — o nome so aparece dentro de codigo comentado,
  entao nenhum navegador chega a pedir o arquivo.

**26 arquivos, 53.9 MB no total.**

## Sem nenhuma referencia

| # | Arquivo | Dimensoes | Tamanho |
|---|---|---|---|
| 1 | `img/banner-desktop.png` | 1800x576 | 792 KB |
| 2 | `img/banner-empresas-desktop.png` | 1800x576 | 792 KB |
| 3 | `img/banner-empresas-mobile.png` | 750x794 | 432 KB |
| 4 | `img/banner-mobile.png` | 750x794 | 432 KB |
| 5 | `img/hero-brisanet-mob-v4-375.webp` | 375x510 | 6 KB |
| 6 | `img/hero-brisanet-mob-v4.png` | 1886x2048 | 3334 KB |
| 7 | `img/hero-brisanet-web-v4-2200.avif` | 2200x762 | 16 KB |
| 8 | `img/hero-brisanet-web-v4-2200.webp` | 2200x762 | 22 KB |
| 9 | `img/hero-mob-empresas-dez-v2.png` | 1856x2304 | 3930 KB |
| 10 | `img/hero-mob-residencial-dez-v2.png` | 1385x1384 | 2861 KB |
| 11 | `img/hero-mob-residencial-dez-v3.png` | 2048x2048 | 3984 KB |
| 12 | `img/hero-mobile-empresas-dezembro.png` | 1856x2304 | 5050 KB |
| 13 | `img/hero-mobile-residencia-dezembro.png` | 1856x2304 | 4722 KB |
| 14 | `img/hero-web-empresas-dez-v2.png` | 1883x1059 | 2502 KB |
| 15 | `img/hero-web-empresas-dezembro.png` | 2752x1536 | 5058 KB |
| 16 | `img/hero-web-residencia-dezembro.png` | 2752x1536 | 4498 KB |
| 17 | `img/hero-web-residencial-dez-v2.png` | 2561x1515 | 5609 KB |
| 18 | `img/hero-web-residencial-dez-v3.png` | 3584x1184 | 3848 KB |
| 19 | `img/logo-assinatura.png` | 949x243 | 27 KB |
| 20 | `img/logo-brisanet-empresas-branca.png` | 2708x764 | 50 KB |
| 21 | `img/logo-brisanet-empresas.png` | 2708x763 | 54 KB |
| 22 | `img/logo.png` | 5046x1281 | 82 KB |
| 23 | `img/modelo-empresarial.png` | 960x540 | 264 KB |
| 24 | `img/modelo-residencial.png` | 1800x576 | 232 KB |

## Referenciados apenas em codigo comentado

| # | Arquivo | Dimensoes | Tamanho | Onde aparece |
|---|---|---|---|---|
| 1 | `img/hero-brisanet-mob-v4 (2).png` | 375x510 | 84 KB | `./fwa.html`, `./index.html` |
| 2 | `img/hero-brisanet-web-v4.png` | 3417x1184 | 3974 KB | `./fwa.html`, `./index.html` |

## Duplicatas byte-identicas

- `img/banner-desktop.png` == `img/banner-empresas-desktop.png` (792 KB cada)
- `img/banner-empresas-mobile.png` == `img/banner-mobile.png` (432 KB cada)

## Mudancas desta fase (3.2)

- `img/hero-mob-empresas-dez-v2.png` (1856x2304, 3930 KB) e
  `img/hero-web-empresas-dez-v2.png` (1883x1059, 2502 KB) **deixaram de ser
  carregados**: o item 3.2.1 trocou os fundos de hero de `empresas.html` e
  `empresas/telefonia.html` pelos derivados AVIF/WebP. Os PNGs foram mantidos
  como fonte, conforme o pacote.
- `img/hero-brisanet-web-v4-2200.avif` e `.webp`, mais
  `img/hero-brisanet-mob-v4-375.webp`, sairam de uso com a DEC-011: a arte
  "MEGA BLACK" nao e' mais exibida na `fwa-campanha.html`. Ficam guardados
  caso a peca sazonal volte.
- `img/hero-brisanet-web-v4.png` e `img/hero-brisanet-mob-v4 (2).png` continuam
  citados apenas em comentario, como ja estavam desde a Fase 3.1.

## Nenhuma imagem pesada em uso

Depois do item 3.2.1 nao restou nenhuma imagem acima de 100 KB sendo carregada
por qualquer pagina. Os maiores assets ativos passam a ser:

| Arquivo | Tamanho | Onde |
|---|---|---|
| `img/hero-familia-tvblur-1200.webp` | 96 KB | fallback WebP do hero da home |
| `img/hero-familia-tvblur-1200.avif` | 78 KB | hero da home (AVIF, o que de fato carrega) |
| `img/fechamento-homeoffice-1400.webp` | 59 KB | fallback WebP do fechamento da home |
| `img/hero-mob-empresas-dez-v2-1600.webp` | 52 KB | fallback WebP do hero mobile das empresas |
