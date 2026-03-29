const revealItems = document.querySelectorAll('.reveal');
const yearNode = document.querySelector('#year');
const cursorGlow = document.querySelector('.cursor-glow');
const parallaxItems = document.querySelectorAll('.parallax');
const lightboxButtons = document.querySelectorAll('[data-lightbox]');
const lightbox = document.querySelector('#lightbox');
const lightboxImage = document.querySelector('#lightboxImage');
const lightboxClose = document.querySelector('.lightbox-close');

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.18,
    rootMargin: '0px 0px -10% 0px',
  }
);

revealItems.forEach((item) => revealObserver.observe(item));

let mouseX = window.innerWidth * 0.5;
let mouseY = window.innerHeight * 0.35;
let glowX = mouseX;
let glowY = mouseY;

window.addEventListener('pointermove', (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;
});

function animateGlow() {
  glowX += (mouseX - glowX) * 0.08;
  glowY += (mouseY - glowY) * 0.08;

  if (cursorGlow) {
    cursorGlow.style.left = `${glowX}px`;
    cursorGlow.style.top = `${glowY}px`;
  }

  requestAnimationFrame(animateGlow);
}

animateGlow();

function onScrollParallax() {
  const viewportHeight = window.innerHeight;

  parallaxItems.forEach((item) => {
    const rect = item.getBoundingClientRect();
    const center = rect.top + rect.height / 2;
    const progress = (center - viewportHeight / 2) / viewportHeight;
    const shift = progress * -16;
    item.style.transform = `translateY(${shift}px)`;
  });
}

function openLightbox(src, alt) {
  if (!lightbox || !lightboxImage) return;
  lightboxImage.src = src;
  lightboxImage.alt = alt || '';
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (!lightbox || !lightboxImage) return;
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  lightboxImage.src = '';
  document.body.style.overflow = '';
}

lightboxButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const src = button.dataset.lightbox;
    const alt = button.dataset.alt;
    if (src) openLightbox(src, alt);
  });
});

if (lightboxClose) {
  lightboxClose.addEventListener('click', closeLightbox);
}

if (lightbox) {
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });
}

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeLightbox();
});

window.addEventListener('scroll', onScrollParallax, { passive: true });
onScrollParallax();
