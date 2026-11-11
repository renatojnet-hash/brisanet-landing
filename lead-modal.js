/**
 * Contact Channel Modal — Brisanet Landing Pages
 * Opens a contact channel modal from residential offer CTAs
 * that offers WhatsApp or the registration form for residential plans.
 *
 * IDs for GTM tracking:
 *   - btn-novo-plano → WhatsApp (wa.me/5584981194435)
 *   - btn-formulario → Formulário com o plano selecionado
 *   - lead-modal-overlay → Modal backdrop
 *   - lead-modal-close → Close button
 */
(function () {
  'use strict';

  /* ================================================
     1. INJECT CSS
  ================================================ */
  var css = `
    /* ========== LEAD MODAL ========== */
    .lead-modal-overlay {
      position: fixed;
      inset: 0;
      z-index: 9999;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.35s ease, visibility 0.35s ease;
    }

    .lead-modal-overlay.active {
      opacity: 1;
      visibility: visible;
    }

    .lead-modal-card {
      background: #ffffff;
      border-radius: 24px;
      padding: 2.5rem 2rem 2rem;
      max-width: 440px;
      max-height: calc(100dvh - 3rem);
      overflow-y: auto;
      overscroll-behavior: contain;
      width: 100%;
      position: relative;
      box-shadow: 0 24px 80px rgba(0, 0, 0, 0.3);
      transform: scale(0.92) translateY(20px);
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .lead-modal-overlay.active .lead-modal-card {
      transform: scale(1) translateY(0);
    }

    .lead-modal-close {
      position: absolute;
      top: 16px;
      right: 16px;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: none;
      background: rgba(0, 0, 0, 0.06);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s ease;
      padding: 0;
    }

    .lead-modal-close:hover {
      background: rgba(0, 0, 0, 0.12);
    }

    .lead-modal-close svg {
      width: 18px;
      height: 18px;
      stroke: #666;
      stroke-width: 2.5;
      fill: none;
    }

    .lead-modal-title {
      font-family: 'Space Grotesk', 'Figtree', 'Outfit', 'Inter', sans-serif;
      font-size: 1.5rem;
      font-weight: 700;
      color: #1a1a1a;
      text-align: center;
      margin-bottom: 0.5rem;
      line-height: 1.25;
    }

    .lead-modal-subtitle {
      font-size: 0.95rem;
      color: #6b7280;
      text-align: center;
      margin-bottom: 2rem;
      line-height: 1.5;
    }

    .lead-modal-actions {
      display: flex;
      flex-direction: column;
      gap: 0.875rem;
    }

    /* ===== PRIMARY BUTTON (Vendas) ===== */
    .lead-modal-btn-primary {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      padding: 1.125rem 1.5rem;
      background: #FF5722;
      color: #ffffff;
      font-size: 1.1rem;
      font-weight: 700;
      border: none;
      border-radius: 14px;
      cursor: pointer;
      text-decoration: none;
      transition: transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease;
      box-shadow: 0 8px 28px rgba(255, 87, 34, 0.4);
      line-height: 1.2;
    }

    .lead-modal-btn-primary:hover {
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 12px 40px rgba(255, 87, 34, 0.5);
      background: #ff6b3d;
    }

    .lead-modal-btn-primary svg {
      width: 24px;
      height: 24px;
      flex-shrink: 0;
      fill: #ffffff;
    }

    /* ===== SECONDARY BUTTON (Formulário) ===== */
    .lead-modal-btn-secondary {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.75rem 1.25rem;
      background: transparent;
      color: #FF5722;
      font-size: 0.9rem;
      font-weight: 600;
      border: 1.5px solid #FF5722;
      border-radius: 14px;
      cursor: pointer;
      text-decoration: none;
      transition: transform 0.25s ease, background-color 0.25s ease;
      line-height: 1.3;
      width: 100%;
      box-sizing: border-box;
    }

    .lead-modal-btn-secondary:hover {
      background: rgba(255, 87, 34, 0.08);
      border-color: #ff6b3d;
      color: #e64a19;
      transform: translateY(-1px);
    }

    .lead-modal-btn-secondary span {
      text-decoration: none;
    }

    .lead-modal-card a:focus-visible, .lead-modal-close:focus-visible { outline: 3px solid #07683A; outline-offset: 4px; }

    /* ===== MOBILE ===== */
    @media (max-width: 480px) {
      .lead-modal-card {
        padding: 2rem 1.5rem 1.5rem;
        border-radius: 20px;
      }

      .lead-modal-title {
        font-size: 1.3rem;
      }

      .lead-modal-btn-primary {
        font-size: 1rem;
        padding: 1rem 1.25rem;
      }
    }

    /* Reduced motion */
    @media (prefers-reduced-motion: reduce) {
      .lead-modal-overlay,
      .lead-modal-card,
      .lead-modal-btn-primary,
      .lead-modal-btn-secondary {
        transition-duration: 0.01ms !important;
      }
    }
  `;

  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ================================================
     2. INJECT HTML
  ================================================ */
  var whatsappSvg = '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/></svg>';

  var modalHTML = `
    <div class="lead-modal-overlay" id="lead-modal-overlay">
      <div class="lead-modal-card" role="dialog" aria-modal="true" aria-labelledby="lead-modal-heading">
        <button class="lead-modal-close" id="lead-modal-close" aria-label="Fechar">
          <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
        <h2 class="lead-modal-title" id="lead-modal-heading">Como você prefere contratar?</h2>
        <p class="lead-modal-subtitle">Fale com um consultor pelo WhatsApp ou preencha o formulário online.</p>
        <div class="lead-modal-actions">
          <a href="https://wa.me/5584981194435" target="_blank" rel="noopener" id="btn-novo-plano" class="lead-modal-btn-primary" onclick="leadModalTrack('whatsapp')">
            ${whatsappSvg}
            Contratar pelo WhatsApp
          </a>
          <a href="/form-contratacao" id="btn-formulario" class="lead-modal-btn-secondary" onclick="leadModalTrack('formulario')">
            <span>Contratar pelo formulário</span>
          </a>
        </div>
      </div>
    </div>
  `;

  var container = document.createElement('div');
  container.innerHTML = modalHTML.trim();
  document.body.appendChild(container.firstChild);

  /* ================================================
     3. MODAL LOGIC
  ================================================ */
  var overlay = document.getElementById('lead-modal-overlay');
  var closeBtn = document.getElementById('lead-modal-close');
  var btnNovoPlano = document.getElementById('btn-novo-plano');

  var btnFormulario = document.getElementById('btn-formulario');
  var previousFocus = null;
  var previousOverflow = '';

  var VENDAS_PHONE = '5584981194435';

  // Contexto do CTA que abriu o modal (preenchido em openModal)
  var leadContext = { origem: '', plano: '' };

  function buildVendasUrl(plano) {
    var msg = plano
      ? 'Olá! Tenho interesse no plano: ' + plano
      : 'Olá! Quero contratar internet Brisanet.';
    return 'https://wa.me/' + VENDAS_PHONE + '?text=' + encodeURIComponent(msg);
  }

  function openModal(e) {
    var trigger = null;

    if (e) {
      e.preventDefault();
      e.stopPropagation();
      trigger = e.currentTarget;
    }

    leadContext.origem = (trigger && trigger.dataset.leadOrigem) || '';
    leadContext.plano = (trigger && trigger.dataset.leadPlano) || '';

    previousFocus = trigger || document.activeElement;
    previousOverflow = document.body.style.overflow;
    var formUrl = trigger && trigger.dataset.leadForm;
    btnFormulario.setAttribute('href', formUrl || '/form-contratacao');

    // Preserve the selected offer in both contact channels.
    if (btnNovoPlano) {
      btnNovoPlano.setAttribute('href', buildVendasUrl(leadContext.plano));
    }

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(function () {
      if (overlay.classList.contains('active')) closeBtn.focus({ preventScroll: true });
    }, 50);
  }

  function closeModal() {
    overlay.classList.remove('active');
    document.body.style.overflow = previousOverflow;
    if (previousFocus) previousFocus.focus();
  }

  // Close via X button
  closeBtn.addEventListener('click', closeModal);

  // Close via backdrop
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeModal();
  });

  // Close via Escape
  document.addEventListener('keydown', function (e) {
    if (!overlay.classList.contains('active')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'Tab') {
      var last = btnFormulario;
      if (e.shiftKey && document.activeElement === closeBtn) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); closeBtn.focus(); }
    }
  });

  /* ================================================
     4. GTM TRACKING
  ================================================ */
  window.leadModalTrack = function (tipo) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'lead_qualification',
      lead_tipo: tipo,
      lead_pagina: window.location.pathname,
      lead_origem: leadContext.origem,
      lead_plano: leadContext.plano
    });
  };

  /* ================================================
     5. CTA INTERCEPTION
  ================================================ */
  // Only residential form CTAs open the channel chooser. Explicit WhatsApp
  // contacts (including the floating button), FWA and business stay direct.
  function interceptCTAs() {
    document.querySelectorAll('a[href*="form-contratacao"]').forEach(function (el) {
      if (overlay.contains(el) || el.dataset.leadBound) return;
      var url = new URL(el.href, location.href);
      if (url.origin !== location.origin || !/^\/form-contratacao(?:\.html)?$/.test(url.pathname)) return;
      el.dataset.leadBound = 'true';
      el.dataset.leadForm = url.pathname + url.search;
      el.dataset.leadOrigem = el.closest('.plan-card') ? 'planos' : 'hero';
      var card = el.closest('.plan-card');
      el.dataset.leadPlano = card
        ? [card.querySelector('.plan-speed-value')?.textContent, card.querySelector('.plan-speed-unit')?.textContent, card.querySelector('.plan-speed-label')?.textContent].filter(Boolean).join(' ')
        : (url.searchParams.get('plano') || 'Brisanet');
      el.setAttribute('aria-haspopup', 'dialog');
      el.setAttribute('aria-controls', 'lead-modal-overlay');
      el.addEventListener('click', function (e) {
        if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
        openModal(e);
      });
    });
  }

  // Run on DOM ready and also after a short delay for dynamically rendered content
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', interceptCTAs);
  } else {
    interceptCTAs();
  }

  // Also expose openModal globally for any remaining inline handlers
  window.openLeadModal = openModal;

})();
