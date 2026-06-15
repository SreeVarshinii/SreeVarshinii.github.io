// script.js

document.addEventListener('DOMContentLoaded', () => {
  /* -------------------------------------------
     1. Navigation Toggle (Mobile)
  ------------------------------------------- */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navLinksItems = document.querySelectorAll('.nav-link');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navToggle.classList.toggle('open');
      navLinks.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    navLinksItems.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.classList.remove('open');
        navLinks.classList.remove('active');
      });
    });
  }

  /* -------------------------------------------
     2. Theme Toggle (Dark/Light Mode)
  ------------------------------------------- */
  const themeToggle = document.getElementById('theme-toggle');
  const rootElement = document.documentElement;

  // Retrieve preference from localStorage or system preference
  const getPreferredTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    // Fallback to system preference
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  };

  const setTheme = (theme) => {
    // Set data attribute on html element
    rootElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    // Update SVG Icon inside the toggle button
    if (themeToggle) {
      themeToggle.innerHTML = theme === 'light' 
        ? `<svg viewBox="0 0 24 24"><path d="M12 21.99c-5.51 0-10-4.49-10-10s4.49-10 10-10c1.07 0 2.1.17 3.08.48A9.97 9.97 0 0 0 10 7.99c0 5.43 4.31 9.85 9.7 9.99-.03.01-.07.01-.1.01-1.4 0-2.73-.28-3.95-.78A9.98 9.98 0 0 1 12 21.99z"/></svg>` // Moon icon for switching TO dark
        : `<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><path d="M12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12z"/></svg>`; // Sun icon for switching TO light
      
      themeToggle.setAttribute('aria-label', `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`);
    }
  };

  // Initialize theme
  setTheme(getPreferredTheme());

  // Toggle on click
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = rootElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
    });
  }


  /* -------------------------------------------
     3. Header Scrolled State
  ------------------------------------------- */
  const header = document.querySelector('.site-header');

  const onScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // initial check


  /* -------------------------------------------
     4. Dynamic Footer Year
  ------------------------------------------- */
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }


  /* -------------------------------------------
     5. Scroll Animations (Intersection Observer)
  ------------------------------------------- */
  const animateElements = document.querySelectorAll('.animate-on-scroll');

  // Skip animations completely if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -10% 0px', // trigger slightly before it comes into view
      threshold: 0.1
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Once animated, stop observing
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animateElements.forEach(el => {
      scrollObserver.observe(el);
    });
  } else {
    // Fallback: make everything visible immediately
    animateElements.forEach(el => el.classList.add('is-visible'));
  }


  /* -------------------------------------------
     6. Dynamic Section Switching (Single Page Router)
  ------------------------------------------- */
  const sections = document.querySelectorAll('main > section');
  const navLinksList = document.querySelectorAll('.nav-link');

  const updateActiveSection = (targetId) => {
    // Default to hero if no hash or invalid target
    if (!targetId || targetId === '#' || targetId === '#hero') {
      targetId = '#hero';
    }
    
    const targetSection = document.querySelector(targetId);
    if (!targetSection) return;

    // Hide all sections, remove active class
    sections.forEach(sec => {
      sec.classList.add('hidden-section');
      sec.classList.remove('section-fade');
    });

    // Display active section and trigger entrance animation
    targetSection.classList.remove('hidden-section');
    targetSection.classList.add('section-fade');

    // Trigger inner scroll animations immediately for all elements
    targetSection.querySelectorAll('.animate-on-scroll').forEach(el => {
      el.classList.add('is-visible');
    });

    // Special Case: Display Education section directly underneath About section
    const educationSec = document.getElementById('education');
    if (targetId === '#about' && educationSec) {
      educationSec.classList.remove('hidden-section');
      educationSec.classList.add('section-fade');
      educationSec.querySelectorAll('.animate-on-scroll').forEach(el => {
        el.classList.add('is-visible');
      });
    }

    // Update nav links active class
    navLinksList.forEach(link => {
      if (link.getAttribute('href') === targetId) {
        link.classList.add('active-route');
      } else {
        link.classList.remove('active-route');
      }
    });

    // Reset scroll viewport position to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Attach router handlers to all hash link anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        
        // Push hash state to history
        history.pushState(null, '', targetId);
        
        // Update visibility
        updateActiveSection(targetId);
      }
    });
  });

  // Handle browser back and forward button routing
  window.addEventListener('popstate', () => {
    updateActiveSection(window.location.hash || '#hero');
  });

  // Run initial router state on page load (handles deep links /#about etc.)
  const initialHash = window.location.hash || '#hero';
  updateActiveSection(initialHash);
});
