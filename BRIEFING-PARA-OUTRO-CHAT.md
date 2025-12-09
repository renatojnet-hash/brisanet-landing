# 📋 Briefing para Implementar Hero Moderno (Texto HTML + Imagem Flutuante)

**Cole este briefing no outro chat do Claude:**

---

## 🎯 Objetivo

Substituir o banner hero atual (imagem estática) por uma estrutura moderna com:
- **Texto HTML real** (bom para SEO)
- **Imagem PNG flutuante** posicionada no canto direito
- **Layout responsivo** que se adapta automaticamente

---

## 📊 O Que Precisa Ser Feito

### **1. Substituir a Estrutura HTML do Hero**

**REMOVER a estrutura antiga** (algo parecido com):
```html
<section class="hero">
  <div class="hero-banner">
    <img src="banner-desktop.png">
    <img src="banner-mobile.png">
  </div>
</section>
```

**IMPLEMENTAR a nova estrutura:**
```html
<section class="hero-section" id="top">
  <div class="container hero-container">

    <!-- Lado Esquerdo: Texto HTML -->
    <div class="hero-content">
      <span class="hero-badge">Oferta Exclusiva</span>
      <h1 class="hero-title">Internet Fibra<br>Ultra-Rápida até<br><span class="highlight">1 Giga</span></h1>
      <p class="hero-description">Descrição do serviço...</p>

      <div class="hero-price-box">
        <div class="hero-speed">
          <span class="speed-value">700</span>
          <span class="speed-unit">MEGA</span>
        </div>
        <div class="hero-price">
          <div class="price-label">A partir de</div>
          <div class="price-value">
            <span class="currency">R$</span>
            <span class="amount">99</span>
            <span class="cents">,99</span>
            <span class="period">/mês</span>
          </div>
        </div>
      </div>

      <div class="hero-cta-group">
        <a href="#planos" class="hero-btn hero-btn-primary">
          <span>Ver Planos</span>
        </a>
        <a href="https://wa.me/NUMERO" class="hero-btn hero-btn-secondary">
          <span>WhatsApp</span>
        </a>
      </div>
    </div>

    <!-- Lado Direito: Imagem Flutuante -->
    <div class="hero-image-wrapper">
      <img src="img/modelo-residencial.png" alt="Cliente feliz" class="hero-model">
    </div>

  </div>
</section>
```

---

### **2. Substituir o CSS do Hero**

**REMOVER o CSS antigo do hero** (procure por `.hero`, `.hero-banner`, etc.)

**IMPLEMENTAR o novo CSS moderno:**

```css
/* ========================================
   HERO SECTION - Modern Layout (Text + Floating Image)
======================================== */

.hero-section {
  position: relative;
  background: radial-gradient(circle at 70% 50%, [COR_PRIMARIA] 0%, [COR_SECUNDARIA] 50%, var(--bg) 100%);
  overflow: hidden;
  padding-top: 120px;
  min-height: 650px;
  display: flex;
  align-items: center;
}

.hero-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  position: relative;
  z-index: 2;
}

/* Left Side: Text Content */
.hero-content {
  width: 55%;
  padding-right: 2rem;
  z-index: 10;
}

.hero-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: rgba([COR_ACCENT_RGB], 0.15);
  border: 1px solid rgba([COR_ACCENT_RGB], 0.3);
  border-radius: 50px;
  color: var(--accent);
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 1.5rem;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.1;
  color: var(--text);
  margin-bottom: 1.5rem;
  text-transform: uppercase;
}

.hero-title .highlight {
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-description {
  font-size: 1.15rem;
  line-height: 1.7;
  color: var(--text2);
  margin-bottom: 2rem;
  max-width: 500px;
}

/* Price Box */
.hero-price-box {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border);
  border-radius: 16px;
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
}

.hero-speed {
  display: flex;
  flex-direction: column;
  padding-right: 2rem;
  border-right: 1px solid var(--border);
}

.speed-value {
  font-size: 3rem;
  font-weight: 800;
  line-height: 1;
  color: var(--accent);
}

.speed-unit {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.hero-price {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.price-label {
  font-size: 0.85rem;
  color: var(--text-muted);
  text-transform: uppercase;
}

.price-value {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
}

.price-value .currency {
  font-size: 1.2rem;
  font-weight: 600;
}

.price-value .amount {
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1;
  color: var(--text);
}

.price-value .cents {
  font-size: 1.5rem;
  font-weight: 700;
}

.price-value .period {
  font-size: 1rem;
  color: var(--text-muted);
}

/* CTA Buttons */
.hero-cta-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.hero-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s var(--ease-out);
}

.hero-btn-primary {
  background: var(--accent-gradient);
  color: white;
  box-shadow: 0 4px 20px rgba([COR_ACCENT_RGB], 0.3);
}

.hero-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba([COR_ACCENT_RGB], 0.4);
}

.hero-btn-secondary {
  background: rgba(255, 255, 255, 0.08);
  color: var(--text);
  border: 1px solid var(--border);
}

.hero-btn-secondary:hover {
  background: rgba(255, 255, 255, 0.12);
}

/* Right Side: Floating Image (A MÁGICA ESTÁ AQUI!) */
.hero-image-wrapper {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 45%;
  height: 90%;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  pointer-events: none;
  z-index: 1;
}

.hero-model {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;  /* ← ISTO MANTÉM A PROPORÇÃO! */
  object-position: bottom right;  /* ← COLA NO CHÃO À DIREITA! */
  filter: drop-shadow(0 20px 60px rgba(0, 0, 0, 0.5));
}

/* Mobile Responsive */
@media (max-width: 991px) {
  .hero-section {
    background: linear-gradient(to bottom, [COR_ESCURA] 0%, var(--bg) 100%);
    padding-top: 100px;
    min-height: auto;
    padding-bottom: 3rem;
  }

  .hero-container {
    flex-direction: column;
    text-align: center;
  }

  .hero-content {
    width: 100%;
    padding-right: 0;
    margin-bottom: 2rem;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-description {
    max-width: 100%;
  }

  .hero-price-box {
    justify-content: center;
  }

  .hero-cta-group {
    justify-content: center;
  }

  .hero-image-wrapper {
    position: relative;
    width: 100%;
    height: 350px;
    opacity: 0.7;
    margin-top: -1rem;
  }

  .hero-model {
    object-position: bottom center;
  }
}

@media (max-width: 640px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-price-box {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .hero-speed {
    border-right: none;
    border-bottom: 1px solid var(--border);
    padding-right: 0;
    padding-bottom: 1rem;
  }

  .hero-cta-group {
    flex-direction: column;
    width: 100%;
  }

  .hero-btn {
    width: 100%;
    justify-content: center;
  }

  .hero-image-wrapper {
    height: 280px;
  }
}
```

---

## 🎨 Ajustes de Cores

**Substitua os placeholders pelas cores do projeto:**

- `[COR_PRIMARIA]` → Cor principal do degradê (ex: `#004870` para azul)
- `[COR_SECUNDARIA]` → Cor intermediária (ex: `#002a45`)
- `[COR_ACCENT_RGB]` → Cor de destaque em RGB (ex: `243, 112, 33` para laranja)
- `[COR_ESCURA]` → Cor escura para mobile (ex: `#002a45`)

**Use as variáveis CSS já existentes:**
- `var(--accent)` → Cor de destaque
- `var(--accent-gradient)` → Gradiente de destaque
- `var(--bg)` → Cor de fundo
- `var(--text)` → Cor do texto
- `var(--text2)` → Texto secundário
- `var(--text-muted)` → Texto esmaecido
- `var(--border)` → Borda

---

## 📝 Instruções para o Claude

"Claude, preciso modernizar o hero da página.

Substitua a estrutura atual de banner (imagem estática) pela estrutura acima:
1. Localize e remova o HTML antigo do hero (deve ter algo como `.hero`, `.hero-banner`)
2. Implemente a nova estrutura HTML
3. Localize e remova o CSS antigo do hero
4. Implemente o novo CSS responsivo
5. Ajuste as cores conforme as variáveis CSS já existentes no projeto

**IMPORTANTE:**
- Use as cores/variáveis que já existem no projeto
- Mantenha a identidade visual atual
- O conteúdo (textos, preços, CTAs) deve ser ajustado para o contexto da página
- A imagem `img/modelo-residencial.png` será adicionada depois (por enquanto pode ficar com o caminho)"

---

## ✅ Benefícios desta Mudança

- **SEO:** Google indexa todo o conteúdo (H1, preços, descrição)
- **Performance:** ~87% mais leve que banner em imagem
- **Manutenção:** Alterar texto = 10 segundos (vs 30min no Photoshop)
- **Responsivo:** Adaptação automática desktop/mobile
- **Acessibilidade:** Leitores de tela funcionam perfeitamente

---

## 🎯 Resultado Visual Esperado

**Desktop:**
```
┌──────────────────────────────────────────┐
│  [TEXTO HTML]          [MODELO PNG]     │
│   Badge                    👤           │
│   TÍTULO GRANDE            │            │
│   Descrição                │            │
│   [700 MEGA | R$ 99,99]    │            │
│   [Botões CTA]            base          │
└──────────────────────────────────────────┘
```

**Mobile:**
```
┌──────────────┐
│   [TEXTO]    │
│   Badge      │
│   TÍTULO     │
│   Descrição  │
│   Preço      │
│   [Botões]   │
├──────────────┤
│     👤       │  ← Imagem
│  (fundo)     │     transparente
└──────────────┘
```

---

**Pronto para copiar e colar no outro chat!** 🚀
