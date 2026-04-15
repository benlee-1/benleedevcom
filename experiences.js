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
  if (!href || href.startsWith('#') || href.startsWith('http') || link.target === '_blank') return;

  e.preventDefault();
  document.body.classList.add('page-leaving');
  setTimeout(() => { window.location.href = href; }, 250);
});

const stopLinks = Array.from(document.querySelectorAll('[data-stop-link]'));
const stopPanels = Array.from(document.querySelectorAll('[data-stop-panel]'));
const siteHeader = document.querySelector('.site-header');

function setActiveStop(id) {
  stopLinks.forEach((link) => {
    const active = link.dataset.stopLink === id;
    link.classList.toggle('active', active);
  });
}

function getAnchorY() {
  const headerBottom = siteHeader ? siteHeader.getBoundingClientRect().bottom : 0;
  return headerBottom + 24;
}

function getNearestPanelId() {
  if (!stopPanels.length) {
    return null;
  }

  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  if (window.scrollY >= maxScroll - 2) {
    return stopPanels[stopPanels.length - 1].id;
  }

  const anchorY = getAnchorY();
  let nearestId = stopPanels[0].id;
  let minDistance = Number.POSITIVE_INFINITY;

  stopPanels.forEach((panel) => {
    const distance = Math.abs(panel.getBoundingClientRect().top - anchorY);
    if (distance < minDistance) {
      minDistance = distance;
      nearestId = panel.id;
    }
  });

  return nearestId;
}

function syncActiveStop() {
  const nearestId = getNearestPanelId();
  if (nearestId) {
    setActiveStop(nearestId);
  }
}

function goToStop(id) {
  const panel = document.getElementById(id);
  if (!panel) {
    return;
  }

  panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  setActiveStop(id);
}

stopLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const id = link.dataset.stopLink;
    goToStop(id);
  });
});

/* ── Panel entrance animations ── */
const panelObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.12 }
);

stopPanels.forEach((panel) => panelObserver.observe(panel));

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
let lastScrollY = window.scrollY;

function updateHeader() {
  const currentY = window.scrollY;
  if (siteHeader && currentY > lastScrollY + 5 && currentY > 80) {
    siteHeader.classList.add('header-hidden');
  } else if (siteHeader && currentY < lastScrollY - 5) {
    siteHeader.classList.remove('header-hidden');
  }
  lastScrollY = currentY;
}

/* ── Combined scroll handler ── */
let isTicking = false;
function requestActiveSync() {
  if (isTicking) {
    return;
  }

  isTicking = true;
  window.requestAnimationFrame(() => {
    isTicking = false;
    syncActiveStop();
    updateScrollProgress();
    updateHeader();
  });
}

window.addEventListener('scroll', requestActiveSync, { passive: true });
window.addEventListener('resize', requestActiveSync);

window.addEventListener('keydown', (event) => {
  if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') {
    return;
  }

  event.preventDefault();

  let activeIndex = stopLinks.findIndex((link) => link.classList.contains('active'));
  if (activeIndex === -1) {
    const nearestId = getNearestPanelId();
    activeIndex = stopLinks.findIndex((link) => link.dataset.stopLink === nearestId);
  }

  if (activeIndex === -1) {
    return;
  }

  const nextIndex =
    event.key === 'ArrowDown'
      ? Math.min(activeIndex + 1, stopLinks.length - 1)
      : Math.max(activeIndex - 1, 0);

  const nextId = stopLinks[nextIndex].dataset.stopLink;
  goToStop(nextId);
});

/* ── Cursor spotlight ── */
const root = document.documentElement;
window.addEventListener('pointermove', (event) => {
  root.style.setProperty('--mx', event.clientX + 'px');
  root.style.setProperty('--my', event.clientY + 'px');
});

syncActiveStop();
