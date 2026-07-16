// ===================================
// Deitalite Landing Page JavaScript
// ===================================

// 1. Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    // Skip empty anchors (href="#" or href="")
    if (href === '#' || href === '') return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// 2. Fade-in on scroll animation
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.animate').forEach(el => {
  observer.observe(el);
});

// 3. Track CTA clicks as GoatCounter events
// Path is keyed by section id (stable across EN/NL/ES); the translated
// button text goes in the title so clicks aggregate per placement.
function trackCTAClick(buttonText, section) {
  if (window.goatcounter && window.goatcounter.count) {
    window.goatcounter.count({
      path: 'cta/' + section,
      title: buttonText,
      event: true
    });
  }
}

document.querySelectorAll('.btn-primary').forEach(btn => {
  btn.addEventListener('click', () => {
    const section = btn.closest('section')?.id || 'header';
    trackCTAClick(btn.textContent.trim(), section);
  });
});

// 4. Email validation helper
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// 5. Lazy load images (fallback for browsers without native lazy loading)
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// 6. Demo Tally form embed (language-aware)
const demoTallyForms = {
  en: 'https://tally.so/embed/zxKQV8?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1',
  nl: 'https://tally.so/embed/NpABGb?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1',
  es: 'https://tally.so/embed/aQBr7y?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1'
};

function updateDemoTallyForm(lang) {
  const iframe = document.getElementById('demo-tally-form');
  if (!iframe) return;
  const formUrl = demoTallyForms[lang] || demoTallyForms.en;
  iframe.setAttribute('data-tally-src', formUrl);
  iframe.src = formUrl;
}

// Set initial form based on current language
updateDemoTallyForm(document.documentElement.lang || 'en');

// Update when language changes
window.addEventListener('languageChanged', function(e) {
  updateDemoTallyForm(e.detail.lang);
});

// 7. WhatsApp button: hidden until user scrolls (avoids covering hero text on mobile)
(function() {
  const wa = document.querySelector('.whatsapp-float');
  if (!wa) return;
  wa.classList.add('hidden-until-scroll');
  function showWhatsApp() {
    wa.classList.add('visible');
    window.removeEventListener('scroll', showWhatsApp);
  }
  window.addEventListener('scroll', showWhatsApp, { passive: true });
})();

// 8. FAQ Accordion with ARIA support
document.querySelectorAll('.faq-question').forEach(button => {
  button.addEventListener('click', () => {
    const faqItem = button.parentElement;
    const isActive = faqItem.classList.contains('active');

    // Close all other FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
      item.classList.remove('active');
      const btn = item.querySelector('.faq-question');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });

    // Toggle current item
    if (!isActive) {
      faqItem.classList.add('active');
      button.setAttribute('aria-expanded', 'true');
    }
  });
});
