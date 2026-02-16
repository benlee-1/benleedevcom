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

let isTicking = false;
function requestActiveSync() {
  if (isTicking) {
    return;
  }

  isTicking = true;
  window.requestAnimationFrame(() => {
    isTicking = false;
    syncActiveStop();
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

syncActiveStop();
