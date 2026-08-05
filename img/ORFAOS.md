# Imagens sem uso no repositorio

Levantamento atualizado em 2026-08-05 (Fase 3.1, item 3.1.1d).

**Nada foi apagado.** Esta lista existe para o autorizador decidir a remocao.

## Metodo

Para cada imagem em `img/`, procurou-se o nome do arquivo (e a variante url-encoded,
com `%20` no lugar de espacos) em **todo** arquivo de texto do repositorio: `.html`,
`.js`, `.css`, `.md`, `.txt`, `.xml`, `.json`, `.svg` — incluindo `empresas.html` e
`empresas/telefonia.html`.

Esta versao separa dois casos que antes ficavam juntos:

- **Sem nenhuma referencia** — o nome nao aparece em lugar nenhum.
- **Referencia so em comentario** — o nome so aparece dentro de codigo comentado,
  ou seja, nenhum navegador chega a pedir o arquivo.

**21 arquivos, 47.3 MB no total.**

## Sem nenhuma referencia

| # | Arquivo | Dimensoes | Tamanho |
|---|---|---|---|
| 1 | `img/banner-desktop.png` | 1800x576 | 792 KB |
| 2 | `img/banner-empresas-desktop.png` | 1800x576 | 792 KB |
| 3 | `img/banner-empresas-mobile.png` | 750x794 | 432 KB |
| 4 | `img/banner-mobile.png` | 750x794 | 432 KB |
| 5 | `img/hero-brisanet-mob-v4.png` | 1886x2048 | 3334 KB |
| 6 | `img/hero-mob-residencial-dez-v2.png` | 1385x1384 | 2861 KB |
| 7 | `img/hero-mob-residencial-dez-v3.png` | 2048x2048 | 3984 KB |
| 8 | `img/hero-mobile-empresas-dezembro.png` | 1856x2304 | 5050 KB |
| 9 | `img/hero-mobile-residencia-dezembro.png` | 1856x2304 | 4722 KB |
| 10 | `img/hero-web-empresas-dezembro.png` | 2752x1536 | 5058 KB |
| 11 | `img/hero-web-residencia-dezembro.png` | 2752x1536 | 4498 KB |
| 12 | `img/hero-web-residencial-dez-v2.png` | 2561x1515 | 5609 KB |
| 13 | `img/hero-web-residencial-dez-v3.png` | 3584x1184 | 3848 KB |
| 14 | `img/logo-assinatura.png` | 949x243 | 27 KB |
| 15 | `img/logo-brisanet-empresas-branca.png` | 2708x764 | 50 KB |
| 16 | `img/logo-brisanet-empresas.png` | 2708x763 | 54 KB |
| 17 | `img/logo.png` | 5046x1281 | 82 KB |
| 18 | `img/modelo-empresarial.png` | 960x540 | 264 KB |
| 19 | `img/modelo-residencial.png` | 1800x576 | 232 KB |

## Referenciados apenas em codigo comentado

Nenhum navegador baixa estes arquivos; a mencao esta dentro de `/* ... */`.

| # | Arquivo | Dimensoes | Tamanho | Onde aparece |
|---|---|---|---|---|
| 1 | `img/hero-brisanet-mob-v4 (2).png` | 375x510 | 84 KB | `./fwa.html`, `./index.html` |
| 2 | `img/hero-brisanet-web-v4.png` | 3417x1184 | 3974 KB | `./fwa.html`, `./index.html` |

## Duplicatas byte-identicas

- `img/banner-desktop.png` == `img/banner-empresas-desktop.png` (792 KB cada)
- `img/banner-empresas-mobile.png` == `img/banner-mobile.png` (432 KB cada)

## Mudancas desta fase (3.1)

- `img/hero-brisanet-web-v4.png` (3417x1184, 3974 KB) **deixou de ser carregado**:
  o item 3.1.1 trocou o fundo do hero de `fwa-campanha.html` pelos derivados
  `hero-brisanet-web-v4-2200.avif` (16 KB) e `.webp` (22 KB). O PNG foi mantido
  no repositorio como fonte, conforme o pacote.
- `img/hero-brisanet-mob-v4 (2).png` (375x510, 84 KB) idem, substituido por
  `hero-brisanet-mob-v4-375.webp` (6 KB). Nesse tamanho o AVIF ficava maior que
  o WebP, entao so o WebP foi gerado.
- `img/logo.png` continua sem uso desde a Fase 3, quando as referencias passaram
  para `img/logo.webp`.

## Ainda em uso, mas pesados

Nao entram na lista acima porque **sao carregados de verdade**. Ficam registrados
porque dominam o peso das paginas de empresas:

| Arquivo | Dimensoes | Tamanho | Carregado por |
|---|---|---|---|
| `img/hero-mob-empresas-dez-v2.png` | 1856x2304 | 4021 KB | `empresas.html` (mobile, <=768px) |
| `img/hero-web-empresas-dez-v2.png` | 1883x1059 | 2561 KB | `empresas.html` e `empresas/telefonia.html` (desktop) |
