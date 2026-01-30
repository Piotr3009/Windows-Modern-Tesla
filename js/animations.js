// ============================================
// SASH STUDIO - Animations Controller
// Micro-interactions and scroll effects
// ============================================

const Animations = {
  // Initialize all animations
  init() {
    this.initScrollReveal();
    this.initRippleEffect();
    this.initHoverEffects();
    this.initMobileMenu();
  },

  // Scroll reveal animation
  initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');

    if (reveals.length === 0) return;

    const revealOnScroll = () => {
      reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const revealTop = element.getBoundingClientRect().top;
        const revealPoint = 150;

        if (revealTop < windowHeight - revealPoint) {
          element.classList.add('active');
        }
      });
    };

    window.addEventListener('scroll', revealOnScroll, { passive: true });
    revealOnScroll(); // Initial check
  },

  // Ripple effect for buttons
  initRippleEffect() {
    document.querySelectorAll('.ripple').forEach(button => {
      button.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement('span');
        ripple.className = 'ripple-effect';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';

        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
      });
    });

    // Add required CSS dynamically
    if (!document.getElementById('ripple-styles')) {
      const style = document.createElement('style');
      style.id = 'ripple-styles';
      style.textContent = `
        .ripple-effect {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.4);
          transform: scale(0);
          animation: ripple-animation 0.6s linear;
          pointer-events: none;
          width: 100px;
          height: 100px;
          margin-left: -50px;
          margin-top: -50px;
        }
        @keyframes ripple-animation {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  },

  // Hover effects enhancement
  initHoverEffects() {
    // Add subtle scale on hover for interactive elements
    document.querySelectorAll('.option-group, .feature-card, .gallery-item').forEach(el => {
      el.addEventListener('mouseenter', () => {
        el.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
      });
    });
  },

  // Mobile menu toggle
  initMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const menu = document.querySelector('.navbar-menu');

    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      menu.classList.toggle('mobile-open');

      // Animate hamburger to X
      const spans = toggle.querySelectorAll('span');
      if (toggle.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });

    // Add mobile menu styles
    if (!document.getElementById('mobile-menu-styles')) {
      const style = document.createElement('style');
      style.id = 'mobile-menu-styles';
      style.textContent = `
        @media (max-width: 768px) {
          .navbar-menu.mobile-open {
            display: flex !important;
            position: fixed;
            top: 72px;
            left: 0;
            right: 0;
            bottom: 0;
            background: white;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 32px;
            z-index: 999;
            animation: fadeIn 0.3s ease;
          }
          .navbar-menu.mobile-open a {
            font-size: 24px;
          }
        }
      `;
      document.head.appendChild(style);
    }
  },

  // Counter animation for price
  animateCounter(element, start, end, duration = 500) {
    if (!element) return;

    const startTime = performance.now();
    const startValue = parseFloat(start) || 0;
    const endValue = parseFloat(end) || 0;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const eased = 1 - Math.pow(1 - progress, 3);

      const current = startValue + (endValue - startValue) * eased;
      element.textContent = '£' + Math.round(current).toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  },

  // Stagger animation for lists
  staggerElements(elements, className, delay = 100) {
    elements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add(className);
      }, index * delay);
    });
  },

  // Smooth scroll to element
  scrollTo(target, offset = 0) {
    const element = typeof target === 'string' ? document.querySelector(target) : target;

    if (element) {
      const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({
        top: top,
        behavior: 'smooth'
      });
    }
  },

  // Intersection Observer for lazy animations
  observeElements(selector, callback, options = {}) {
    const elements = document.querySelectorAll(selector);

    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          callback(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      ...options
    });

    elements.forEach(el => observer.observe(el));
  }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  Animations.init();
});

// Export
window.Animations = Animations;
