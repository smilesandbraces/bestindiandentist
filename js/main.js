/*=============== PREMIUM DENTAL CLINIC JAVASCRIPT ===============*/

// ===== GLOBAL VARIABLES =====
let isScrolling = false;
let ticking = false;
let lastScrollTop = 0;
const scrollThreshold = 100;

// ===== UTILITY FUNCTIONS =====
const debounce = (func, wait, immediate) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
};

const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

const isElementInViewport = (el, threshold = 0.1) => {
  const rect = el.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;
  
  return (
    rect.top <= windowHeight * (1 - threshold) &&
    rect.bottom >= windowHeight * threshold &&
    rect.left <= windowWidth * (1 - threshold) &&
    rect.right >= windowWidth * threshold
  );
};

const smoothScrollTo = (target, duration = 1000) => {
  const targetElement = typeof target === 'string' ? document.querySelector(target) : target;
  if (!targetElement) return;
  
  const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - 80;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime = null;
  
  const animation = (currentTime) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = easeInOutQuart(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animation);
  };
  
  requestAnimationFrame(animation);
};

const easeInOutQuart = (t, b, c, d) => {
  t /= d / 2;
  if (t < 1) return c / 2 * t * t * t * t + b;
  t -= 2;
  return -c / 2 * (t * t * t * t - 2) + b;
};

// ===== HEADER FUNCTIONALITY =====
class HeaderManager {
  constructor() {
    this.header = document.querySelector('.header');
    this.mobileToggle = document.querySelector('.nav__mobile-toggle');
    this.mobileMenu = document.querySelector('.nav__menu');
    this.dropdownToggles = document.querySelectorAll('.nav__dropdown-toggle');
    this.init();
  }
  
  init() {
    this.handleScroll();
    this.handleMobileMenu();
    this.handleDropdowns();
    this.handleSmoothScrolling();
  }
  
  handleScroll() {
    const updateHeader = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollTop > scrollThreshold) {
        this.header.classList.add('header--scrolled');
      } else {
        this.header.classList.remove('header--scrolled');
      }
      
      // Hide header on scroll down, show on scroll up
      if (scrollTop > lastScrollTop && scrollTop > scrollThreshold) {
        this.header.style.transform = 'translateY(-100%)';
      } else {
        this.header.style.transform = 'translateY(0)';
      }
      
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    };
    
    window.addEventListener('scroll', throttle(updateHeader, 10));
  }
  
  handleMobileMenu() {
    if (!this.mobileToggle) return;
    
    this.mobileToggle.addEventListener('click', () => {
      const isExpanded = this.mobileToggle.getAttribute('aria-expanded') === 'true';
      this.mobileToggle.setAttribute('aria-expanded', !isExpanded);
      
      if (this.mobileMenu) {
        this.mobileMenu.classList.toggle('nav__menu--open');
        document.body.classList.toggle('nav-open');
      }
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.header.contains(e.target)) {
        this.mobileToggle.setAttribute('aria-expanded', 'false');
        if (this.mobileMenu) {
          this.mobileMenu.classList.remove('nav__menu--open');
          document.body.classList.remove('nav-open');
        }
      }
    });
  }
  
  handleDropdowns() {
    this.dropdownToggles.forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        
        // Close all other dropdowns
        this.dropdownToggles.forEach(otherToggle => {
          if (otherToggle !== toggle) {
            otherToggle.setAttribute('aria-expanded', 'false');
          }
        });
        
        toggle.setAttribute('aria-expanded', !isExpanded);
      });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav__item--dropdown')) {
        this.dropdownToggles.forEach(toggle => {
          toggle.setAttribute('aria-expanded', 'false');
        });
      }
    });
  }
  
  handleSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          smoothScrollTo(target);
        }
      });
    });
  }
}

// ===== SCROLL ANIMATIONS =====
class ScrollAnimations {
  constructor() {
    this.elements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in, .stagger-item');
    this.init();
  }
  
  init() {
    this.observeElements();
    this.handleStaggeredAnimations();
  }
  
  observeElements() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    this.elements.forEach(el => observer.observe(el));
  }
  
  handleStaggeredAnimations() {
    const staggerContainers = document.querySelectorAll('.stagger-container');
    
    const staggerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const items = entry.target.querySelectorAll('.stagger-item');
          items.forEach((item, index) => {
            setTimeout(() => {
              item.classList.add('visible');
            }, index * 100);
          });
          staggerObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });
    
    staggerContainers.forEach(container => staggerObserver.observe(container));
  }
}

// ===== FORM HANDLING =====
class FormManager {
  constructor() {
    this.forms = document.querySelectorAll('form');
    this.init();
  }
  
  init() {
    this.forms.forEach(form => {
      this.setupFormValidation(form);
      this.setupFormSubmission(form);
    });
  }
  
  setupFormValidation(form) {
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearFieldError(input));
    });
  }
  
  validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const required = field.hasAttribute('required');
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (required && !value) {
      isValid = false;
      errorMessage = 'This field is required';
    }
    
    // Email validation
    if (type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
      }
    }
    
    // Phone validation
    if (type === 'tel' && value) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(value.replace(/\s/g, ''))) {
        isValid = false;
        errorMessage = 'Please enter a valid phone number';
      }
    }
    
    this.showFieldValidation(field, isValid, errorMessage);
    return isValid;
  }
  
  showFieldValidation(field, isValid, errorMessage) {
    const fieldContainer = field.closest('.form-field') || field.parentElement;
    let errorElement = fieldContainer.querySelector('.field-error');
    
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'field-error';
      fieldContainer.appendChild(errorElement);
    }
    
    if (isValid) {
      field.classList.remove('field--error');
      field.classList.add('field--valid');
      errorElement.textContent = '';
      errorElement.style.display = 'none';
    } else {
      field.classList.remove('field--valid');
      field.classList.add('field--error');
      errorElement.textContent = errorMessage;
      errorElement.style.display = 'block';
    }
  }
  
  clearFieldError(field) {
    field.classList.remove('field--error');
    const fieldContainer = field.closest('.form-field') || field.parentElement;
    const errorElement = fieldContainer.querySelector('.field-error');
    if (errorElement) {
      errorElement.style.display = 'none';
    }
  }
  
  setupFormSubmission(form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const inputs = form.querySelectorAll('input, textarea, select');
      let isFormValid = true;
      
      inputs.forEach(input => {
        if (!this.validateField(input)) {
          isFormValid = false;
        }
      });
      
      if (isFormValid) {
        this.submitForm(form);
      } else {
        this.showFormError(form, 'Please correct the errors above');
      }
    });
  }
  
  async submitForm(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="loading-spinner"></span> Sending...';
    
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      this.showFormSuccess(form, 'Thank you! Your message has been sent successfully.');
      form.reset();
    } catch (error) {
      this.showFormError(form, 'Sorry, there was an error sending your message. Please try again.');
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  }
  
  showFormSuccess(form, message) {
    this.showFormMessage(form, message, 'success');
  }
  
  showFormError(form, message) {
    this.showFormMessage(form, message, 'error');
  }
  
  showFormMessage(form, message, type) {
    let messageElement = form.querySelector('.form-message');
    
    if (!messageElement) {
      messageElement = document.createElement('div');
      messageElement.className = 'form-message';
      form.insertBefore(messageElement, form.firstChild);
    }
    
    messageElement.className = `form-message form-message--${type}`;
    messageElement.textContent = message;
    messageElement.style.display = 'block';
    
    // Auto-hide success messages
    if (type === 'success') {
      setTimeout(() => {
        messageElement.style.display = 'none';
      }, 5000);
    }
  }
}

// ===== MODAL FUNCTIONALITY =====
class ModalManager {
  constructor() {
    this.modals = document.querySelectorAll('.modal');
    this.triggers = document.querySelectorAll('[data-modal-target]');
    this.init();
  }
  
  init() {
    this.triggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const modalId = trigger.getAttribute('data-modal-target');
        this.openModal(modalId);
      });
    });
    
    this.modals.forEach(modal => {
      const closeButtons = modal.querySelectorAll('.modal__close, [data-modal-close]');
      closeButtons.forEach(button => {
        button.addEventListener('click', () => this.closeModal(modal));
      });
      
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeModal(modal);
        }
      });
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAllModals();
      }
    });
  }
  
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    modal.classList.add('modal--open');
    document.body.classList.add('modal-open');
    
    // Focus management
    const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  }
  
  closeModal(modal) {
    modal.classList.remove('modal--open');
    document.body.classList.remove('modal-open');
  }
  
  closeAllModals() {
    this.modals.forEach(modal => this.closeModal(modal));
  }
}

// ===== LAZY LOADING =====
class LazyLoader {
  constructor() {
    this.images = document.querySelectorAll('img[data-src]');
    this.init();
  }
  
  init() {
    if ('IntersectionObserver' in window) {
      this.observeImages();
    } else {
      this.loadAllImages();
    }
  }
  
  observeImages() {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage(entry.target);
          imageObserver.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '50px'
    });
    
    this.images.forEach(img => imageObserver.observe(img));
  }
  
  loadImage(img) {
    img.src = img.dataset.src;
    img.classList.add('loaded');
    img.removeAttribute('data-src');
  }
  
  loadAllImages() {
    this.images.forEach(img => this.loadImage(img));
  }
}

// ===== PERFORMANCE MONITORING =====
class PerformanceMonitor {
  constructor() {
    this.init();
  }
  
  init() {
    this.monitorPageLoad();
    this.monitorScrollPerformance();
  }
  
  monitorPageLoad() {
    window.addEventListener('load', () => {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      console.log(`Page load time: ${loadTime}ms`);
      
      // Report to analytics if needed
      if (window.gtag) {
        gtag('event', 'page_load_time', {
          value: loadTime,
          event_category: 'Performance'
        });
      }
    });
  }
  
  monitorScrollPerformance() {
    let scrollCount = 0;
    const scrollHandler = throttle(() => {
      scrollCount++;
    }, 100);
    
    window.addEventListener('scroll', scrollHandler);
    
    // Report scroll engagement
    setTimeout(() => {
      if (window.gtag && scrollCount > 0) {
        gtag('event', 'scroll_engagement', {
          value: scrollCount,
          event_category: 'Engagement'
        });
      }
    }, 30000); // Report after 30 seconds
  }
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
class AccessibilityManager {
  constructor() {
    this.init();
  }
  
  init() {
    this.handleKeyboardNavigation();
    this.announcePageChanges();
    this.manageFocus();
  }
  
  handleKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // Skip to main content
      if (e.key === 'Tab' && !e.shiftKey && document.activeElement === document.body) {
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
          skipLink.focus();
        }
      }
      
      // Close dropdowns with Escape
      if (e.key === 'Escape') {
        const openDropdowns = document.querySelectorAll('[aria-expanded="true"]');
        openDropdowns.forEach(dropdown => {
          dropdown.setAttribute('aria-expanded', 'false');
        });
      }
    });
  }
  
  announcePageChanges() {
    // Create live region for announcements
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = 'live-region';
    document.body.appendChild(liveRegion);
  }
  
  announce(message) {
    const liveRegion = document.getElementById('live-region');
    if (liveRegion) {
      liveRegion.textContent = message;
    }
  }
  
  manageFocus() {
    // Ensure focus is visible
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });
    
    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });
  }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all components
  new HeaderManager();
  new ScrollAnimations();
  new FormManager();
  new ModalManager();
  new LazyLoader();
  new PerformanceMonitor();
  new AccessibilityManager();
  
  // Add loaded class to body
  document.body.classList.add('loaded');
  
  console.log('🦷 Smile & Braces Dental Clinic website loaded successfully!');
});

// ===== SERVICE WORKER REGISTRATION =====
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

