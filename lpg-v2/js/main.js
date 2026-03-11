/**
 * LPG GBÉLÉBAN — Catalogue Officiel
 * main.js — Interactions et animations
 */

(function () {
  'use strict';

  /* 1. BARRE DE PROGRESSION */
  const progress = document.getElementById('progress');
  if (progress) {
    window.addEventListener('scroll', () => {
      const h = document.documentElement;
      const pct = (h.scrollTop || document.body.scrollTop) / (h.scrollHeight - h.clientHeight);
      progress.style.transform = `scaleX(${pct})`;
    }, { passive: true });
  }

  /* 2. SIDEBAR TOGGLE */
  const sb = document.getElementById('sidebar');
  const sbt = document.getElementById('sbToggle');
  if (sb && sbt) {
    sbt.addEventListener('click', () => {
      sb.classList.toggle('expanded');
      sbt.textContent = sb.classList.contains('expanded') ? '✕' : '☰';
    });
  }

  /* 3. SIDEBAR LIEN ACTIF */
  const secs = [...document.querySelectorAll('section[id]')];
  const sbLinks = document.querySelectorAll('#sidebar .sb-nav a');
  window.addEventListener('scroll', () => {
    let current = '';
    secs.forEach(s => { if (window.scrollY >= s.offsetTop - 180) current = s.id; });
    sbLinks.forEach(a => a.classList.toggle('act', a.getAttribute('href') === '#' + current));
  }, { passive: true });

  /* 4. MOBILE BURGER */
  const burger = document.getElementById('mnBurger');
  const menu = document.getElementById('mnMenu');
  if (burger && menu) {
    burger.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('open');
      const spans = burger.querySelectorAll('span');
      spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px,5px)' : '';
      spans[1].style.opacity = isOpen ? '0' : '';
      spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px,-5px)' : '';
    });
    menu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        menu.classList.remove('open');
        burger.querySelectorAll('span').forEach(sp => { sp.style.transform = ''; sp.style.opacity = ''; });
      });
    });
  }

  /* 5. SCROLL REVEAL */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      setTimeout(() => e.target.classList.add('visible'), +(e.target.dataset.delay || 0));
      revealObs.unobserve(e.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('[data-sr]').forEach(el => revealObs.observe(el));

  /* 6. COMPTEURS ANIMÉS */
  function animateCounter(el) {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const isFloat = target !== Math.floor(target) || el.dataset.decimal;
    const dur = 1700, t0 = performance.now();
    const tick = now => {
      const p = Math.min((now - t0) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      el.textContent = isFloat ? (target * ease).toFixed(2) + suffix : Math.floor(target * ease) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target); counterObs.unobserve(e.target); } });
  }, { threshold: 0.4 });
  document.querySelectorAll('[data-count]').forEach(el => {
    el.textContent = el.dataset.count.includes('.') ? '0.00' : '0';
    counterObs.observe(el);
  });

  /* 7. ONGLETS VIE AU LYCÉE */
  const animStyle = document.createElement('style');
  animStyle.textContent = '@keyframes fadeInUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}';
  document.head.appendChild(animStyle);

  document.querySelectorAll('.vtab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.vtab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.vpanel').forEach(p => { p.classList.remove('active'); p.style.animation = ''; });
      tab.classList.add('active');
      const target = document.getElementById('tab-' + tab.dataset.tab);
      if (target) { target.classList.add('active'); target.style.animation = 'fadeInUp .4s ease'; }
    });
  });

  /* 8. FORMULAIRE */
  const form = document.getElementById('inscForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('.btn-sub');
      const orig = btn.textContent;
      btn.textContent = '✅ Demande envoyée !';
      btn.style.background = 'linear-gradient(135deg,#1a7a3a,#27ae60)';
      btn.disabled = true;
      setTimeout(() => { btn.textContent = orig; btn.style.background = ''; btn.disabled = false; form.reset(); }, 5000);
    });
  }

  /* 9. SMOOTH SCROLL */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.offsetTop - (window.innerWidth <= 900 ? 65 : 0), behavior: 'smooth' });
      }
    });
  });

})();
