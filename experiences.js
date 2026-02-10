const stopLinks = Array.from(document.querySelectorAll('[data-stop-link]'));
const stopPanels = Array.from(document.querySelectorAll('[data-stop-panel]'));

function setActiveStop(id) {
  stopLinks.forEach((link) => {
    const active = link.dataset.stopLink === id;
    link.classList.toggle('active', active);
  });
}

const stopObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setActiveStop(entry.target.id);
      }
    });
  },
  {
    threshold: 0.5,
    rootMargin: '-15% 0px -25% 0px'
  }
);

stopPanels.forEach((panel) => stopObserver.observe(panel));

stopLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const id = link.dataset.stopLink;
    const panel = document.getElementById(id);
    if (!panel) {
      return;
    }

    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveStop(id);
  });
});

window.addEventListener('keydown', (event) => {
  if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') {
    return;
  }

  const activeIndex = stopLinks.findIndex((link) => link.classList.contains('active'));
  if (activeIndex === -1) {
    return;
  }

  const nextIndex =
    event.key === 'ArrowDown'
      ? Math.min(activeIndex + 1, stopLinks.length - 1)
      : Math.max(activeIndex - 1, 0);

  const nextId = stopLinks[nextIndex].dataset.stopLink;
  const nextPanel = document.getElementById(nextId);

  if (nextPanel) {
    nextPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveStop(nextId);
  }
});
