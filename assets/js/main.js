// ===== Mobile menu toggle =====
const menuButton = document.getElementById('mobile-menu-button');
const menuPanel = document.getElementById('mobile-menu');
const iconOpen = document.getElementById('icon-menu-open');
const iconClose = document.getElementById('icon-menu-close');

if (menuButton && menuPanel) {
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuPanel.classList.toggle('hidden');
    iconOpen.classList.toggle('hidden');
    iconClose.classList.toggle('hidden');
    menuButton.setAttribute('aria-label', isOpen ? 'Hauptmenü öffnen' : 'Hauptmenü schließen');
  });
}

// ===== Language dropdown =====
const langButton = document.getElementById('lang-button');
const langMenu = document.getElementById('lang-menu');

if (langButton && langMenu) {
  langButton.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = langButton.getAttribute('aria-expanded') === 'true';
    langButton.setAttribute('aria-expanded', String(!isOpen));
    langMenu.classList.toggle('hidden');
  });
  document.addEventListener('click', () => {
    if (langButton.getAttribute('aria-expanded') === 'true') {
      langButton.setAttribute('aria-expanded', 'false');
      langMenu.classList.add('hidden');
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && langButton.getAttribute('aria-expanded') === 'true') {
      langButton.setAttribute('aria-expanded', 'false');
      langMenu.classList.add('hidden');
      langButton.focus();
    }
  });
}

// ===== Scroll-reveal for [data-animate] =====
const revealTargets = document.querySelectorAll('[data-animate]');

if (revealTargets.length) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );
    revealTargets.forEach((el) => observer.observe(el));
  }
}

// ===== Review slider controls =====
const reviewTrack = document.getElementById('review-track');
const reviewPrev = document.getElementById('review-prev');
const reviewNext = document.getElementById('review-next');

if (reviewTrack && reviewPrev && reviewNext) {
  const scrollByCard = (direction) => {
    const card = reviewTrack.querySelector('.review-card');
    if (!card) return;
    const gap = 24; // matches gap-6
    reviewTrack.scrollBy({
      left: direction * (card.offsetWidth + gap),
      behavior: 'smooth',
    });
  };
  reviewPrev.addEventListener('click', () => scrollByCard(-1));
  reviewNext.addEventListener('click', () => scrollByCard(1));
}

// ===== Header elevation on scroll =====
const siteHeader = document.getElementById('site-header');
if (siteHeader) {
  const onScroll = () => siteHeader.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
