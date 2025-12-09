# 📊 Guia de Instalação do Google Tag Manager (Brisanet)

Este guia mostra **passo a passo** como instalar as tags corretas do Google Tag Manager da Brisanet neste site.

---

## 🎯 O Que Você Precisa Fazer

### **Passo 1: Obter as Tags Corretas da Brisanet**

Você precisa pegar as tags GTM corretas do site oficial da Brisanet. Existem duas formas:

#### **Opção A: Pegar do Painel GTM**
1. Acesse: https://tagmanager.google.com
2. Faça login com a conta da Brisanet
3. Selecione o workspace/container da Brisanet
4. Clique em **"Admin"** → **"Instalar o Google Tag Manager"**
5. Você verá dois blocos de código:
   - **Bloco 1:** Tag `<script>` para o `<head>`
   - **Bloco 2:** Tag `<noscript>` para o `<body>`

#### **Opção B: Inspecionar o Site Brisanet Oficial**
1. Acesse: https://www.brisanet.com.br (ou o site oficial)
2. Pressione **F12** (Developer Tools)
3. Vá na aba **Elements**
4. Procure no `<head>` por: `<!-- Google Tag Manager -->`
5. Copie o script completo
6. Procure logo após `<body>` por: `<!-- Google Tag Manager (noscript) -->`
7. Copie o noscript completo

**Exemplo do que você vai encontrar:**
```html
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id=GTM-XXXXXXX'+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXX');</script>
<!-- End Google Tag Manager -->
```

**IMPORTANTE:** O ID será algo como `GTM-XXXXXXX` (diferente do GTM-NKMB2CLG que era da TIM).

---

## 🛠️ Passo 2: Instalar a Tag no `<head>` (index.html)

### **2.1. Abra o arquivo:**
```bash
/home/user/brisanet-landing/index.html
```

### **2.2. Localize a linha 3:**
```html
<head>
  <meta charset="utf-8">
```

### **2.3. Adicione a tag GTM logo após `<head>`:**

**ANTES:**
```html
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
```

**DEPOIS:**
```html
<head>
  <!-- Google Tag Manager -->
  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id=GTM-XXXXXXX'+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-XXXXXXX');</script>
  <!-- End Google Tag Manager -->

  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
```

**⚠️ Substitua `GTM-XXXXXXX` pelo ID correto da Brisanet!**

---

## 🛠️ Passo 3: Instalar a Tag no `<body>` (index.html)

### **3.1. Localize a linha 1551:**
```html
<body>

  <!-- Navigation -->
```

### **3.2. Adicione a tag noscript logo após `<body>`:**

**ANTES:**
```html
<body>

  <!-- Navigation -->
  <nav class="nav" id="nav">
```

**DEPOIS:**
```html
<body>
  <!-- Google Tag Manager (noscript) -->
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
  height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
  <!-- End Google Tag Manager (noscript) -->

  <!-- Navigation -->
  <nav class="nav" id="nav">
```

**⚠️ Substitua `GTM-XXXXXXX` pelo ID correto da Brisanet!**

---

## 🛠️ Passo 4: Instalar na Página Empresas (empresas.html)

Repita os **Passos 2 e 3** para o arquivo:
```bash
/home/user/brisanet-landing/empresas.html
```

### **Localizações:**
- **Head:** Linha 3 (após `<head>`)
- **Body:** Linha 1582 (após `<body>`)

**⚠️ Use o mesmo ID GTM nas duas páginas!**

---

## ✅ Passo 5: Verificar se Está Correto

Depois de adicionar as tags, verifique:

### **Checklist de Verificação:**
- [ ] Tag `<script>` está no `<head>` de `index.html`
- [ ] Tag `<noscript>` está logo após `<body>` de `index.html`
- [ ] Tag `<script>` está no `<head>` de `empresas.html`
- [ ] Tag `<noscript>` está logo após `<body>` de `empresas.html`
- [ ] O ID GTM é o **mesmo** nas duas páginas
- [ ] O ID GTM é da **Brisanet** (não da TIM)

### **Comando para verificar:**
```bash
grep -r "GTM-" index.html empresas.html
```

Deve retornar 6 linhas (3 por arquivo), todas com o **mesmo ID**.

---

## 🚀 Passo 6: Fazer Commit e Push

Depois de instalar as tags corretas:

```bash
# 1. Adicionar os arquivos modificados
git add index.html empresas.html

# 2. Verificar o que será commitado
git status

# 3. Fazer commit
git commit -m "feat: Instalar Google Tag Manager da Brisanet

Adiciona tags GTM corretas da Brisanet:
- index.html: Tag no <head> e <noscript> no <body>
- empresas.html: Tag no <head> e <noscript> no <body>

ID do Container: GTM-XXXXXXX (Brisanet)"

# 4. Push para o repositório
git push origin claude/update-banner-layout-01CBHcLsQvH3CkFQAg2Hk9am
```

---

## 🧪 Passo 7: Testar se Está Funcionando

### **Opção 1: Google Tag Assistant (Recomendado)**
1. Instale a extensão: [Tag Assistant](https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/kejbdjndbnbjgmefkgdddjlbokphdefk)
2. Abra o site (index.html)
3. Clique no ícone da extensão
4. Deve aparecer: **Google Tag Manager (GTM-XXXXXXX)** em verde ✅

### **Opção 2: Developer Tools**
1. Abra o site
2. Pressione **F12** → Console
3. Digite: `window.dataLayer`
4. Deve retornar um array (não `undefined`) ✅

### **Opção 3: Network Tab**
1. Abra o site
2. Pressione **F12** → Network
3. Recarregue a página (Ctrl+R)
4. Filtrar por: `gtm.js`
5. Deve aparecer requisição para `googletagmanager.com/gtm.js?id=GTM-XXXXXXX` ✅

---

## 📝 Exemplo Completo de Como Ficará

### **index.html (head):**
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <!-- Google Tag Manager -->
  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id=GTM-XXXXXXX'+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-XXXXXXX');</script>
  <!-- End Google Tag Manager -->

  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  ...
</head>
```

### **index.html (body):**
```html
<body>
  <!-- Google Tag Manager (noscript) -->
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
  height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
  <!-- End Google Tag Manager (noscript) -->

  <!-- Navigation -->
  <nav class="nav" id="nav">
  ...
```

---

## ❓ Perguntas Frequentes

### **P: Preciso usar o mesmo ID GTM nas duas páginas (index.html e empresas.html)?**
**R:** Sim! Use o mesmo ID do container da Brisanet nas duas páginas. Você pode criar eventos/tags diferentes para cada página dentro do painel do GTM.

### **P: O que fazer se eu não tiver acesso ao painel do GTM?**
**R:** Pegue as tags do site oficial da Brisanet usando a **Opção B** (inspecionar elemento no site oficial).

### **P: Posso ter múltiplos GTM na mesma página?**
**R:** Tecnicamente sim, mas **não é recomendado**. Use apenas um container GTM. Se precisar integrar com outros sistemas (Facebook Pixel, Google Ads), faça via painel do GTM.

### **P: Como sei qual é o ID correto?**
**R:** Vai estar no formato `GTM-XXXXXXX` (7 caracteres após o hífen). Exemplos válidos:
- `GTM-AB12CD3`
- `GTM-1A2B3C4`

### **P: Preciso publicar algo no painel do GTM depois?**
**R:** Sim! Depois de instalar o código, acesse o painel GTM e **publique a versão** para ativar as tags.

---

## 📞 Precisa de Ajuda?

Se tiver dúvidas durante a instalação, você pode:

1. **Verificar a documentação oficial:** https://support.google.com/tagmanager/answer/6103696
2. **Testar com Tag Assistant** (extensão Chrome)
3. **Pedir ao responsável pelo GTM da Brisanet** as tags corretas

---

## ✅ Status Atual

- ❌ **Tag GTM-NKMB2CLG (TIM Fibra)** → **REMOVIDA** ✅
- ⏳ **Tag GTM da Brisanet** → **Aguardando instalação**

**Arquivos prontos para receber as tags:**
- `index.html` - Linha 3 (head) e Linha 1551 (body)
- `empresas.html` - Linha 3 (head) e Linha 1582 (body)

---

**Última atualização:** 2025-12-09
**Criado por:** Claude (Assistente de IA)
