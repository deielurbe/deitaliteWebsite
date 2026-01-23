// ===================================
// i18n (Internationalization) for deitalite
// ===================================

const i18n = {
  // Current language
  currentLang: 'en',

  // Supported languages
  supportedLangs: ['en', 'nl', 'es'],

  // Language names for display
  langNames: {
    en: 'English',
    nl: 'Nederlands',
    es: 'Español'
  },

  // Initialize the i18n system
  init() {
    // Get language from localStorage or browser (with fallback for private mode)
    const savedLang = this.getSavedLanguage();
    const browserLang = this.detectBrowserLanguage();

    // Priority: savedLang > browserLang > default (en)
    const initialLang = savedLang || browserLang || 'en';

    // Set the language
    this.setLanguage(initialLang);

    // Setup language selector listeners
    this.setupLanguageSelector();
  },

  // Get saved language from localStorage (handles private browsing mode)
  getSavedLanguage() {
    try {
      return localStorage.getItem('deitalite_lang');
    } catch (e) {
      // localStorage not available (private mode or disabled)
      return null;
    }
  },

  // Detect browser language
  detectBrowserLanguage() {
    const browserLang = navigator.language || navigator.userLanguage;

    // Extract the main language code (e.g., 'en' from 'en-US')
    const langCode = browserLang.toLowerCase().split('-')[0];

    // Check if we support this language
    if (this.supportedLangs.includes(langCode)) {
      return langCode;
    }

    // Default to English if not supported
    return 'en';
  },

  // Set the current language
  setLanguage(lang) {
    // Validate language
    if (!this.supportedLangs.includes(lang)) {
      console.warn(`Language ${lang} not supported, falling back to English`);
      lang = 'en';
    }

    // Update current language
    this.currentLang = lang;

    // Save to localStorage (with fallback for private mode)
    try {
      localStorage.setItem('deitalite_lang', lang);
    } catch (e) {
      // localStorage not available - language will reset on page reload
    }

    // Update HTML lang attribute
    document.documentElement.lang = lang;

    // Update all text content
    this.updateContent();

    // Update language selector UI
    this.updateLanguageSelectorUI();

    // Dispatch event for other scripts (e.g., Tally form switching)
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
  },

  // Update all content on the page
  updateContent() {
    const lang = this.currentLang;
    const trans = translations[lang];

    if (!trans) {
      console.error(`Translations not found for language: ${lang}`);
      return;
    }

    // Find all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = trans[key];

      if (translation) {
        // Check if this is an input or textarea
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
          element.placeholder = translation;
        } else {
          // Use innerHTML to preserve HTML tags in translations (e.g., <em>, <br>)
          element.innerHTML = translation;
        }
      }
    });

    // Update HTML content (for elements with HTML inside)
    document.querySelectorAll('[data-i18n-html]').forEach(element => {
      const key = element.getAttribute('data-i18n-html');
      const translation = trans[key];

      if (translation) {
        element.innerHTML = translation;
      }
    });
  },

  // Setup language selector event listeners
  setupLanguageSelector() {
    const selector = document.getElementById('language-selector');

    if (selector) {
      selector.addEventListener('click', (e) => {
        // Toggle dropdown
        selector.classList.toggle('open');
      });

      // Add click handlers for each language option
      document.querySelectorAll('.lang-option').forEach(option => {
        option.addEventListener('click', (e) => {
          e.stopPropagation();
          const lang = option.getAttribute('data-lang');
          this.setLanguage(lang);
          selector.classList.remove('open');
        });
      });

      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
        if (!selector.contains(e.target)) {
          selector.classList.remove('open');
        }
      });
    }
  },

  // Update the language selector UI to show current language
  updateLanguageSelectorUI() {
    const currentLangElement = document.getElementById('current-lang');

    if (currentLangElement) {
      currentLangElement.textContent = this.langNames[this.currentLang];
    }

    // Update active state on options
    document.querySelectorAll('.lang-option').forEach(option => {
      const lang = option.getAttribute('data-lang');
      if (lang === this.currentLang) {
        option.classList.add('active');
      } else {
        option.classList.remove('active');
      }
    });
  }
};

// Initialize i18n when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => i18n.init());
} else {
  i18n.init();
}
