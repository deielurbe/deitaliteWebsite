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

// 2. Fade-in on scroll animation (optional)
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

// Apply to sections with .animate class
document.querySelectorAll('.animate').forEach(el => {
  observer.observe(el);
});

// 3. Track CTA clicks (for analytics)
// This function works with both Google Analytics and Plausible Analytics
function trackCTAClick(buttonText, section) {
  // Google Analytics 4 (gtag)
  if (typeof gtag !== 'undefined') {
    gtag('event', 'cta_click', {
      'event_category': 'CTA',
      'event_label': buttonText,
      'section': section
    });
  }

  // Plausible Analytics
  if (typeof plausible !== 'undefined') {
    plausible('CTA Click', {
      props: {
        button: buttonText,
        section: section
      }
    });
  }

}

// Attach tracking to all CTA buttons
document.querySelectorAll('.btn-primary').forEach(btn => {
  btn.addEventListener('click', () => {
    const section = btn.closest('section')?.id || 'header';
    trackCTAClick(btn.textContent.trim(), section);
  });
});

// 4. Scroll progress indicator (optional enhancement)
// Shows how far user has scrolled down the page
function updateScrollProgress() {
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight - windowHeight;
  const scrolled = window.scrollY;
  const progress = (scrolled / documentHeight) * 100;

  // You can use this progress value to show a progress bar
  // For now, we'll just track it for analytics
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
  // Google Analytics 4
  if (typeof gtag !== 'undefined') {
    gtag('event', 'scroll_depth', {
      'event_category': 'Engagement',
      'event_label': depth
    });
  }

  // Plausible Analytics
  if (typeof plausible !== 'undefined') {
    plausible('Scroll Depth', {
      props: { depth: depth }
    });
  }
}

// Throttle scroll events for performance
let scrollTimeout;
window.addEventListener('scroll', () => {
  if (scrollTimeout) {
    window.cancelAnimationFrame(scrollTimeout);
  }
  scrollTimeout = window.requestAnimationFrame(() => {
    updateScrollProgress();
  });
});

// 5. Mobile menu toggle (if you add a hamburger menu later)
// Currently not used, but ready for future implementation
const mobileMenuButton = document.querySelector('.mobile-menu-button');
const mobileMenu = document.querySelector('.mobile-menu');

if (mobileMenuButton && mobileMenu) {
  mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    mobileMenuButton.classList.toggle('open');
  });
}

// 6. Form validation (if you add contact form)
// Example: validate email format before submission
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// 7. Lazy load images (optional performance optimization)
// Already using loading="lazy" attribute in HTML, but this provides fallback
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

// 8. FAQ Accordion Toggle
document.querySelectorAll('.faq-question').forEach(button => {
  button.addEventListener('click', () => {
    const faqItem = button.parentElement;
    const isActive = faqItem.classList.contains('active');

    // Close all other FAQ items (optional: remove these 3 lines for multi-open behavior)
    document.querySelectorAll('.faq-item').forEach(item => {
      item.classList.remove('active');
    });

    // Toggle current item
    if (!isActive) {
      faqItem.classList.add('active');
    }
  });
});

// 9. Keyboard accessibility for FAQ accordion
document.querySelectorAll('.faq-question').forEach(button => {
  button.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      button.click();
    }
  });
});
