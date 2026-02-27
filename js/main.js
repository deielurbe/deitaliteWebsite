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

// 3. Track CTA clicks (for analytics)
function trackCTAClick(buttonText, section) {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'cta_click', {
      'event_category': 'CTA',
      'event_label': buttonText,
      'section': section
    });
  }

  if (typeof plausible !== 'undefined') {
    plausible('CTA Click', {
      props: {
        button: buttonText,
        section: section
      }
    });
  }
}

document.querySelectorAll('.btn-primary').forEach(btn => {
  btn.addEventListener('click', () => {
    const section = btn.closest('section')?.id || 'header';
    trackCTAClick(btn.textContent.trim(), section);
  });
});

// 4. Scroll depth tracking
function updateScrollProgress() {
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight - windowHeight;
  const scrolled = window.scrollY;
  const progress = (scrolled / documentHeight) * 100;

  if (progress > 25 && !window.scrolled25) {
    window.scrolled25 = true;
    trackScrollDepth('25%');
  }
  if (progress > 50 && !window.scrolled50) {
    window.scrolled50 = true;
    trackScrollDepth('50%');
  }
  if (progress > 75 && !window.scrolled75) {
    window.scrolled75 = true;
    trackScrollDepth('75%');
  }
  if (progress > 90 && !window.scrolled90) {
    window.scrolled90 = true;
    trackScrollDepth('90%');
  }
}

function trackScrollDepth(depth) {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'scroll_depth', {
      'event_category': 'Engagement',
      'event_label': depth
    });
  }

  if (typeof plausible !== 'undefined') {
    plausible('Scroll Depth', {
      props: { depth: depth }
    });
  }
}

let scrollTimeout;
window.addEventListener('scroll', () => {
  if (scrollTimeout) {
    window.cancelAnimationFrame(scrollTimeout);
  }
  scrollTimeout = window.requestAnimationFrame(() => {
    updateScrollProgress();
  });
});

// 5. Email validation helper
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// 6. Lazy load images (fallback for browsers without native lazy loading)
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

// 7. Demo form inline submission
const demoForm = document.getElementById('demo-form');
if (demoForm) {
  demoForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(demoForm);
    const submitBtn = demoForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = '...';

    fetch('https://formspree.io/f/mdanvlpg', {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    })
    .then(function(response) {
      if (response.ok) {
        demoForm.style.display = 'none';
        document.getElementById('demo-form-success').style.display = 'block';
      } else {
        document.getElementById('demo-form-error').style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.textContent = demoForm.querySelector('button[type="submit"]')?.dataset?.originalText || 'Send me a sample';
      }
    })
    .catch(function() {
      document.getElementById('demo-form-error').style.display = 'block';
      submitBtn.disabled = false;
    });
  });
}

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
