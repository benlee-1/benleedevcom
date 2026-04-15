/* ── Page transition ── */
// Use pageshow instead of DOMContentLoaded so back/forward cache restores
// also un-blank the page (bfcache skips DOMContentLoaded entirely).
window.addEventListener('pageshow', () => {
  document.body.classList.remove('page-leaving');
  document.body.classList.add('page-loaded');
});

document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href]');
  if (!link) return;
  const href = link.getAttribute('href');
  // Only intercept internal page navigations (not anchors or external)
  if (!href || href.startsWith('#') || href.startsWith('http') || link.target === '_blank') return;

  e.preventDefault();
  document.body.classList.add('page-leaving');
  setTimeout(() => { window.location.href = href; }, 250);
});

/* ── Scroll reveal ── */
const revealItems = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.18 }
);

revealItems.forEach((item) => revealObserver.observe(item));

/* ── Ambient parallax + cursor spotlight ── */
const ambient = document.querySelector('.ambient-bg');
const root = document.documentElement;

window.addEventListener('pointermove', (event) => {
  const nx = event.clientX / window.innerWidth;
  const ny = event.clientY / window.innerHeight;

  // Ambient parallax
  if (ambient) {
    const x = (nx - 0.5) * 16;
    const y = (ny - 0.5) * 16;
    ambient.style.transform = `translate(${x}px, ${y}px)`;
  }

  // Cursor spotlight
  root.style.setProperty('--mx', event.clientX + 'px');
  root.style.setProperty('--my', event.clientY + 'px');
});

/* ── Scroll progress bar ── */
const scrollBar = document.querySelector('.scroll-progress');

function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = docHeight > 0 ? scrollTop / docHeight : 0;
  if (scrollBar) {
    scrollBar.style.transform = `scaleX(${ratio})`;
  }
}

/* ── Header hide on scroll down / show on scroll up ── */
const siteHeader = document.querySelector('.site-header');
let lastScrollY = window.scrollY;

function updateHeader() {
  const currentY = window.scrollY;
  if (currentY > lastScrollY + 5 && currentY > 80) {
    siteHeader.classList.add('header-hidden');
  } else if (currentY < lastScrollY - 5) {
    siteHeader.classList.remove('header-hidden');
  }
  lastScrollY = currentY;
}

/* ── Card hover glow ── */
document.querySelectorAll('.proof-card').forEach((card) => {
  card.addEventListener('pointermove', (e) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--glow-x', (e.clientX - rect.left) + 'px');
    card.style.setProperty('--glow-y', (e.clientY - rect.top) + 'px');
  });
});

/* ── Combined scroll handler ── */
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      updateScrollProgress();
      updateHeader();
    });
  }
}, { passive: true });
