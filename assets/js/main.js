// Mobile nav
const nav = document.getElementById('primaryNav');
const toggle = document.getElementById('navToggle');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Accordion (FAQ)
document.querySelectorAll('.accordion').forEach(acc => {
  const items = acc.querySelectorAll('.accordion-item');
  const panels = acc.querySelectorAll('.accordion-panel');
  items.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      items.forEach((b, j) => { 
        b.setAttribute('aria-expanded', j===i && !expanded ? 'true' : 'false');
        panels[j].style.display = (j===i && !expanded) ? 'block' : 'none';
      });
    });
  });
});

// Fun stat counter
const counters = document.querySelectorAll('.stat-num');
if (counters.length) {
  const obs = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count || '0');
      const isFloat = !Number.isInteger(target);
      let current = 0;
      const dur = 900;
      const start = performance.now();
      const animate = (t) => {
        const p = Math.min(1, (t - start) / dur);
        current = target * p;
        el.textContent = isFloat ? current.toFixed(1) : Math.round(current);
        if (p < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
      observer.unobserve(el);
    });
  }, {threshold: 0.6});
  counters.forEach(c => obs.observe(c));
}
