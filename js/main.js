// Signal JS is active so CSS can enable scroll-reveal hiding (else content always shows)
document.documentElement.classList.add('js');

// Safe localStorage — throws in private mode / blocked storage on some mobile browsers
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch {} }
};

// ── Theme toggle ──
const themeToggle = document.getElementById('themeToggle');
const saved = store.get('theme') || 'dark';
applyTheme(saved);

themeToggle?.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
  applyTheme(next);
  store.set('theme', next);
});

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  if (themeToggle) themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
}

// ── Navbar scroll effect ──
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar?.classList.toggle('scrolled', window.scrollY > 40);
});

// ── Hamburger ──
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger?.addEventListener('click', () => navLinks?.classList.toggle('open'));
document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => navLinks?.classList.remove('open')));

// ── Active nav link ──
const page = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  if (a.getAttribute('href') === page || (!page && a.getAttribute('href') === 'index.html')) a.classList.add('active');
});

// ── Scroll reveal ──
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-scale');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
  }, { threshold: 0.12 });
  revealEls.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 80}ms`;
    observer.observe(el);
  });
} else {
  // No IntersectionObserver support — show everything immediately
  revealEls.forEach(el => el.classList.add('visible'));
}

// ── Product filter ──
const chips = document.querySelectorAll('.filter-chip');
const cards = document.querySelectorAll('.product-card[data-category]');
chips.forEach(chip => {
  chip.addEventListener('click', () => {
    chips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    const cat = chip.dataset.filter;
    cards.forEach(card => card.classList.toggle('hidden', cat !== 'all' && card.dataset.category !== cat));
  });
});

// ── Contact form ──
const form = document.getElementById('inquiryForm');
form?.addEventListener('submit', e => {
  e.preventDefault();
  showToast('✓ Enquiry sent! We\'ll reach out shortly.');
  form.reset();
});

function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) { t = Object.assign(document.createElement('div'), { id: 'toast', className: 'toast' }); document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3500);
}

// ── Category card filter link (from homepage) ──
const urlParams = new URLSearchParams(window.location.search);
const catParam = urlParams.get('cat');
if (catParam) {
  const target = document.querySelector(`.filter-chip[data-filter="${catParam}"]`);
  target?.click();
}
