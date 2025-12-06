# 🎨 Prompts para Geração de Imagens PNG Transparentes

Este documento contém os prompts para gerar as imagens das modelos/personagens que irão compor o hero das páginas.

## 📋 Instruções Gerais

1. **Use geradores de IA como:**
   - DALL-E 3 (ChatGPT)
   - Midjourney
   - Leonardo.ai
   - Stable Diffusion

2. **Após gerar a imagem:**
   - Remova o fundo usando: [remove.bg](https://remove.bg)
   - Ou use Photoshop (Select > Subject > Delete background)
   - Salve como PNG com transparência

3. **Especificações técnicas:**
   - Formato: PNG com canal alpha (transparente)
   - Resolução: 1500px de altura (mínimo)
   - Tamanho: Manter abaixo de 300KB (use TinyPNG.com para comprimir)

---

## 🏠 Prompt 1: Modelo Residencial (index.html)

**Arquivo de destino:** `img/modelo-residencial.png`

### Prompt para IA:

```
Create a professional photograph of a happy young Brazilian woman (25-30 years old) in a dynamic pose. She should be full body or 3/4 body shot, standing confidently with one hand pointing to her left side (viewer's right) as if presenting something amazing.

Appearance:
- Wearing modern casual clothing in shades of blue and orange (Brisanet brand colors)
- Stylish blue jeans and a vibrant orange blazer or modern top
- Natural, genuine smile showing enthusiasm
- Long dark hair, styled professionally
- Contemporary Brazilian features

Technical requirements:
- Professional studio lighting with rim light effect
- Shot from slightly below to give empowering perspective
- Clean white or solid color background (for easy removal)
- High resolution, photorealistic, 8K quality
- Sharp focus, professional photography
- Full body visible, person should be looking toward the left (viewer's right)

Style: Corporate advertisement photography, modern and energetic, inspirational
```

### Prompt Alternativo (Português para Gemini/ChatGPT):

```
Fotografia profissional de uma mulher brasileira jovem e feliz (25-30 anos) em pose dinâmica. Ela deve estar em pé com confiança, com uma mão apontando para o lado esquerdo dela como se estivesse apresentando algo incrível.

Aparência:
- Roupas modernas casuais em tons de azul e laranja
- Calça jeans azul moderna e blazer laranja vibrante
- Sorriso natural e genuíno mostrando entusiasmo
- Cabelo escuro longo, bem arrumado
- Traços brasileiros contemporâneos

Requisitos técnicos:
- Iluminação profissional de estúdio
- Fundo branco sólido (para fácil remoção)
- Alta resolução, fotorrealista, qualidade 8K
- Foco nítido, fotografia profissional
- Corpo inteiro visível

Estilo: Fotografia de propaganda corporativa, moderna e energética
```

---

## 💼 Prompt 2: Modelo Empresarial (empresas.html)

**Arquivo de destino:** `img/modelo-empresarial.png`

### Prompt para IA:

```
Create a professional photograph of a confident Brazilian business professional (30-40 years old, can be male or female). The person should be in a powerful, executive pose showing success and confidence.

Appearance:
- Wearing smart business casual attire: dark navy suit or blazer with orange accent details
- Confident posture: arms crossed professionally or holding a modern tablet/smartphone
- Warm, professional smile conveying trust and competence
- Looking slightly to the left (viewer's right) as if engaging with someone
- Professional hairstyle (if male: well-groomed; if female: elegant updo or professional cut)

Technical requirements:
- Professional corporate photography lighting
- Clean white or gradient background (for easy removal)
- Shot from chest up or 3/4 body
- High resolution, photorealistic, 8K quality
- Rim lighting to separate subject from background
- Sharp focus on face and upper body

Style: Executive portrait photography, inspiring confidence and professionalism, modern corporate aesthetic
```

### Prompt Alternativo (Português):

```
Fotografia profissional de um(a) profissional de negócios brasileiro(a) confiante (30-40 anos). A pessoa deve estar em uma pose poderosa e executiva demonstrando sucesso e confiança.

Aparência:
- Vestindo traje executivo moderno: terno azul marinho com detalhes em laranja
- Postura confiante: braços cruzados profissionalmente ou segurando tablet moderno
- Sorriso profissional caloroso transmitindo confiança e competência
- Olhando levemente para o lado esquerdo
- Penteado profissional elegante

Requisitos técnicos:
- Iluminação de fotografia corporativa profissional
- Fundo branco limpo (para fácil remoção)
- Enquadramento do peito para cima ou 3/4 do corpo
- Alta resolução, fotorrealista, qualidade 8K
- Iluminação de contorno para separar do fundo

Estilo: Retrato executivo profissional, inspirando confiança, estética corporativa moderna
```

---

## 🎯 Checklist Pós-Geração

Após gerar as imagens, certifique-se de:

- [ ] Remover o fundo completamente (PNG transparente)
- [ ] Verificar se não há artefatos ou bordas irregulares
- [ ] Comprimir a imagem (meta: <300KB sem perder qualidade)
- [ ] Salvar com os nomes corretos:
  - `img/modelo-residencial.png`
  - `img/modelo-empresarial.png`
- [ ] Fazer upload para a pasta `img/` do projeto
- [ ] Testar em diferentes resoluções (desktop/mobile)

---

## 🔧 Ferramentas Recomendadas

### Geração de Imagem:
- ChatGPT (DALL-E 3)
- Leonardo.ai (gratuito)
- Midjourney (pago)

### Remoção de Fundo:
- [remove.bg](https://remove.bg) (gratuito para baixa resolução)
- Photoshop (Select > Subject)
- [PhotoRoom](https://photoroom.com)

### Compressão PNG:
- [TinyPNG](https://tinypng.com)
- [Squoosh.app](https://squoosh.app)

---

## 📝 Notas Importantes

1. **Direção do Olhar:** As imagens devem estar olhando/apontando para a **esquerda** (que é onde o texto ficará no layout)

2. **Posição:** As imagens serão alinhadas no **canto inferior direito** do hero, então:
   - Deixe espaço na parte superior
   - A base dos pés deve estar alinhada

3. **Cores da Marca:**
   - **Residencial (Brisanet):** Azul #004870 + Laranja #F37021
   - **Empresarial (Brisasoluções):** Cinza escuro + Laranja #FF5022

4. **Alternativa Rápida:** Se não conseguir gerar com IA, pode usar fotos de bancos de imagens:
   - [Unsplash](https://unsplash.com)
   - [Pexels](https://pexels.com)
   - Buscar por: "business woman pointing" ou "confident business professional"
