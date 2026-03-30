const menuButton = document.querySelector('.menu-btn');
const nav = document.querySelector('.nav');
const counters = document.querySelectorAll('[data-counter]');

menuButton?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.nav a').forEach((link) => {
  link.addEventListener('click', () => {
    nav?.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  });
});

const animateCounter = (element) => {
  const endValue = Number(element.dataset.counter || 0);
  const startTime = performance.now();
  const duration = 1200;

  const update = (currentTime) => {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const eased = 1 - (1 - progress) ** 3;
    element.textContent = String(Math.floor(endValue * eased));

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  };

  requestAnimationFrame(update);
};

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        if (entry.target.matches('.hero')) {
          counters.forEach((counter) => {
            if (!counter.dataset.animated) {
              counter.dataset.animated = 'true';
              animateCounter(counter);
            }
          });
        }
      }
    });
  },
  {
    threshold: 0.15,
  }
);

document.querySelectorAll('.reveal, .hero').forEach((section) => observer.observe(section));

const matrixCanvas = document.querySelector('.matrix-bg');
const context = matrixCanvas?.getContext('2d');
let matrixAnimationFrame = null;

const setupMatrixRain = () => {
  if (!matrixCanvas || !context) return;

  const dpr = window.devicePixelRatio || 1;
  const width = window.innerWidth;
  const height = window.innerHeight;

  matrixCanvas.width = Math.floor(width * dpr);
  matrixCanvas.height = Math.floor(height * dpr);
  matrixCanvas.style.width = `${width}px`;
  matrixCanvas.style.height = `${height}px`;
  context.setTransform(dpr, 0, 0, dpr, 0, 0);

  const fontSize = 14;
  const columns = Math.max(1, Math.floor(width / fontSize));
  const drops = Array(columns).fill(0).map(() => Math.random() * -100);
  const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ$#*+-';

  const draw = () => {
    context.fillStyle = 'rgba(3, 10, 6, 0.12)';
    context.fillRect(0, 0, width, height);
    context.font = `${fontSize}px JetBrains Mono`;

    for (let i = 0; i < drops.length; i += 1) {
      const text = chars[Math.floor(Math.random() * chars.length)];
      const x = i * fontSize;
      const y = drops[i] * fontSize;

      context.fillStyle = 'rgba(108, 255, 159, 0.78)';
      context.fillText(text, x, y);

      if (y > height && Math.random() > 0.975) {
        drops[i] = 0;
      }

      drops[i] += 0.38;
    }

    matrixAnimationFrame = requestAnimationFrame(draw);
  };

  if (matrixAnimationFrame) {
    cancelAnimationFrame(matrixAnimationFrame);
  }

  draw();
};

if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
  setupMatrixRain();
  window.addEventListener('resize', setupMatrixRain);
}

const form = document.querySelector('.contact-form');
form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const nombre = formData.get('nombre')?.toString().trim() || '';
  const email = formData.get('email')?.toString().trim() || '';
  const mensaje = formData.get('mensaje')?.toString().trim() || '';

  const text = [
    'Hola, quiero informacion sobre un proyecto.',
    `Nombre: ${nombre}`,
    `Email: ${email}`,
    `Mensaje: ${mensaje}`,
  ].join('\n');

  const whatsappUrl = `https://wa.me/595982912585?text=${encodeURIComponent(text)}`;
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

  alert('Te redirigimos a WhatsApp para enviar tu mensaje.');
  form.reset();
});
