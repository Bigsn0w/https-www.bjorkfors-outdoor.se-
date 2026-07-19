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

// ===== Interactive slideshow: autoplay + arrows + dots + swipe =====
// Opt-in via [data-slideshow-root] on the wrapping section/container, which must
// also hold the .fade-slide images plus [data-slide-prev], [data-slide-next] and
// [data-slide-dots] controls somewhere inside it.
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll('[data-slideshow-root]').forEach((root) => {
  const slides = Array.from(root.querySelectorAll('.fade-slide'));
  if (slides.length < 2) return;

  let i = Math.max(0, slides.findIndex((s) => s.classList.contains('is-active')));

  const prevBtn = root.querySelector('[data-slide-prev]');
  const nextBtn = root.querySelector('[data-slide-next]');
  const dotsWrap = root.querySelector('[data-slide-dots]');
  const dots = [];

  const dotLabel = root.getAttribute('data-dot-label') || 'Bild {n} von {total} anzeigen';

  if (dotsWrap) {
    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', dotLabel.replace('{n}', idx + 1).replace('{total}', slides.length));
      dot.className = 'h-1.5 w-1.5 rounded-full bg-cream/50 transition-all duration-200 hover:bg-cream focus:outline-none focus-visible:ring-2 focus-visible:ring-cream';
      dot.addEventListener('click', () => goTo(idx));
      dotsWrap.appendChild(dot);
      dots.push(dot);
    });
  }

  const render = () => {
    slides.forEach((s, idx) => s.classList.toggle('is-active', idx === i));
    dots.forEach((d, idx) => {
      const active = idx === i;
      d.classList.toggle('bg-cream', active);
      d.classList.toggle('w-4', active);
      d.classList.toggle('bg-cream/50', !active);
      d.setAttribute('aria-current', active ? 'true' : 'false');
    });
  };

  let timer;
  const restartAutoplay = () => {
    if (prefersReducedMotion) return;
    clearInterval(timer);
    timer = setInterval(() => goTo(i + 1), 3000);
  };

  function goTo(idx) {
    i = (idx + slides.length) % slides.length;
    render();
    restartAutoplay();
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goTo(i - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(i + 1));

  let touchStartX = null;
  root.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
  root.addEventListener('touchend', (e) => {
    if (touchStartX === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 40) goTo(delta < 0 ? i + 1 : i - 1);
    touchStartX = null;
  }, { passive: true });

  render();
  restartAutoplay();
});
