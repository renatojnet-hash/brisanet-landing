# Imagens sem referencia no repositorio

Levantamento gerado em 2026-08-05 (Fase 3, item 3.7).

**Nada foi apagado.** Esta lista existe para o autorizador decidir a remocao.

## Metodo

Para cada imagem em `img/`, procurou-se o nome do arquivo (e a variante
url-encoded, com `%20` no lugar de espacos) em **todo** arquivo de texto do
repositorio: `.html`, `.js`, `.css`, `.md`, `.txt`, `.xml`, `.json`, `.svg`.
A varredura incluiu `empresas.html` e `empresas/telefonia.html`, que estao fora
de escopo para edicao mas dentro de escopo para leitura.

Entram nesta lista apenas os arquivos com **zero** ocorrencias — inclusive zero
ocorrencias dentro de comentarios de codigo.

**19 arquivos, 43.1 MB no total.**

| # | Arquivo | Dimensoes | Tamanho | Referencias encontradas |
|---|---|---|---|---|
| 1 | `img/banner-desktop.png` | 1800x576 | 792 KB | nenhuma |
| 2 | `img/banner-empresas-desktop.png` | 1800x576 | 792 KB | nenhuma |
| 3 | `img/banner-empresas-mobile.png` | 750x794 | 432 KB | nenhuma |
| 4 | `img/banner-mobile.png` | 750x794 | 432 KB | nenhuma |
| 5 | `img/hero-brisanet-mob-v4.png` | 1886x2048 | 3334 KB | nenhuma |
| 6 | `img/hero-mob-residencial-dez-v2.png` | 1385x1384 | 2861 KB | nenhuma |
| 7 | `img/hero-mob-residencial-dez-v3.png` | 2048x2048 | 3984 KB | nenhuma |
| 8 | `img/hero-mobile-empresas-dezembro.png` | 1856x2304 | 5050 KB | nenhuma |
| 9 | `img/hero-mobile-residencia-dezembro.png` | 1856x2304 | 4722 KB | nenhuma |
| 10 | `img/hero-web-empresas-dezembro.png` | 2752x1536 | 5058 KB | nenhuma |
| 11 | `img/hero-web-residencia-dezembro.png` | 2752x1536 | 4498 KB | nenhuma |
| 12 | `img/hero-web-residencial-dez-v2.png` | 2561x1515 | 5609 KB | nenhuma |
| 13 | `img/hero-web-residencial-dez-v3.png` | 3584x1184 | 3848 KB | nenhuma |
| 14 | `img/logo-assinatura.png` | 949x243 | 27 KB | nenhuma |
| 15 | `img/logo-brisanet-empresas-branca.png` | 2708x764 | 50 KB | nenhuma |
| 16 | `img/logo-brisanet-empresas.png` | 2708x763 | 54 KB | nenhuma |
| 17 | `img/logo.png` | 5046x1281 | 82 KB | nenhuma |
| 18 | `img/modelo-empresarial.png` | 960x540 | 264 KB | nenhuma |
| 19 | `img/modelo-residencial.png` | 1800x576 | 232 KB | nenhuma |

## Duplicatas byte-identicas

Pares com o mesmo SHA-256 — o conteudo e' o mesmo arquivo salvo com dois nomes:

- `img/banner-desktop.png` == `img/banner-empresas-desktop.png` (792 KB cada)
- `img/banner-empresas-mobile.png` == `img/banner-mobile.png` (432 KB cada)

## Observacoes

- `img/logo.png` entrou nesta lista **nesta fase**: o item 3.5 trocou todas as
  referencias para `img/logo.webp` (450x114, 20 KB). O PNG original de
  5046x1281 ficou sem uso, mas foi mantido no repositorio como fonte.
- Os demais 18 arquivos ja estavam sem referencia antes desta fase.
