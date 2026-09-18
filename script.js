// Main JavaScript for portfolio

document.addEventListener('DOMContentLoaded', function() {
  // ===== Initialize variables =====
  const body = document.body;
  const themeToggle = document.getElementById('themeToggle');
  const langToggle = document.getElementById('langToggle');
  const langDropdown = document.getElementById('langDropdown');
  const langOptions = document.querySelectorAll('.language-option');
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const mobileMenuClose = document.getElementById('mobileMenuClose');
  const mobileMenu = document.getElementById('mobileMenu');
  const backToTop = document.getElementById('backToTop');
  const htmlEl = document.documentElement;
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const skillItems = document.querySelectorAll('.skill-item');
  const currentLangSpan = document.querySelector('.current-lang');
  
  // ===== Theme Switcher =====
  // Update theme function
  const updateTheme = (theme) => {
    // Añadir clase de transición al body para garantizar transiciones suaves
    body.classList.add('theme-transitioning');
    
    if (theme === 'dark') {
      body.classList.add('dark');
      body.classList.remove('light');
      
      // Arreglar secciones con fondo problemático en modo oscuro
      document.querySelectorAll('section.bg-gray-50, #about, #languages, #soft-skills, #experience, #contact').forEach(section => {
        section.classList.remove('bg-white');
        section.classList.add('bg-gray-900');
        section.classList.add('text-light');
        section.classList.remove('text-dark');
      });
    } else {
      body.classList.add('light');
      body.classList.remove('dark');
      
      // Arreglar secciones con fondo problemático en modo claro
      document.querySelectorAll('section.bg-gray-50, #about, #languages, #soft-skills, #experience, #contact').forEach(section => {
        section.classList.add('bg-white');
        section.classList.remove('bg-gray-900');
        section.classList.add('text-dark');
        section.classList.remove('text-light');
        section.classList.remove('dark:bg-gray-900');
        section.classList.remove('bg-gray-50');
      });
    }
    
    // Guardar la preferencia de tema
    localStorage.setItem('theme', theme);
    
    // Quitar la clase de transición después de que la transición termine
    setTimeout(() => {
      body.classList.remove('theme-transitioning');
    }, 500); // Tiempo de transición = 500ms
  };

  // Check for saved theme
  const savedTheme = localStorage.getItem('theme') || 'dark';
  updateTheme(savedTheme);
  
  // Inicialización inmediata de las secciones problemáticas
  const currentTheme = body.classList.contains('dark') ? 'dark' : 'light';
  if (currentTheme === 'light') {
    // Aplicar fondo blanco y texto oscuro a secciones alternantes en modo claro
    document.querySelectorAll('section.bg-gray-50, #about, #languages, #soft-skills, #experience, #contact').forEach(section => {
      section.classList.add('bg-white');
      section.classList.remove('bg-gray-900');
      section.classList.remove('bg-gray-50'); 
      section.classList.add('text-dark');
      section.classList.remove('text-light');
    });
  }

  // Theme toggle click handler
  themeToggle.addEventListener('click', () => {
    const currentTheme = body.classList.contains('dark') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    updateTheme(newTheme);
  });

  // ===== Language Switcher =====
  // Function to switch language
  const switchLanguage = (lang) => {
    htmlEl.setAttribute('lang', lang);
    
    // Update all text elements with data-lang attributes
    document.querySelectorAll('[data-lang-' + lang + ']').forEach(el => {
      el.textContent = el.getAttribute('data-lang-' + lang);
    });
    
    // Update placeholders for form elements
    document.querySelectorAll('[data-lang-placeholder-' + lang + ']').forEach(el => {
      el.setAttribute('placeholder', el.getAttribute('data-lang-placeholder-' + lang));
    });
    
    // Handle glitch effect for changing language
    const glitchElements = document.querySelectorAll('.glitch');
    glitchElements.forEach(el => {
      el.setAttribute('data-glitch-text', el.getAttribute('data-lang-' + lang));
    });
    
    // Save language preference
    localStorage.setItem('language', lang);
    
    // Update language toggle button text
    currentLangSpan.textContent = lang.toUpperCase();
    
    // Update active state in dropdown
    langOptions.forEach(option => {
      if (option.getAttribute('data-lang') === lang) {
        option.classList.add('active');
      } else {
        option.classList.remove('active');
      }
    });
  };

  // Toggle dropdown visibility when clicking on langToggle button
  langToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    langDropdown.classList.toggle('show');
    langToggle.setAttribute('aria-expanded', langDropdown.classList.contains('show'));
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', () => {
    if (langDropdown.classList.contains('show')) {
      langDropdown.classList.remove('show');
      langToggle.setAttribute('aria-expanded', 'false');
    }
  });
  
  // Language option click handler
  langOptions.forEach(option => {
    option.addEventListener('click', (e) => {
      e.stopPropagation();
      const lang = option.getAttribute('data-lang');
      switchLanguage(lang);
      langDropdown.classList.remove('show');
      langToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Load saved language preference
  const savedLanguage = localStorage.getItem('language') || 'en';
  switchLanguage(savedLanguage);

  // ===== Mobile Menu =====
  const toggleMobileMenu = () => {
    mobileMenu.classList.toggle('translate-x-full');
    document.body.classList.toggle('overflow-hidden');
  };
  
  mobileMenuToggle.addEventListener('click', toggleMobileMenu);
  mobileMenuClose.addEventListener('click', toggleMobileMenu);
  
  // Close mobile menu when clicking on a link
  document.querySelectorAll('#mobileMenu a').forEach(link => {
    link.addEventListener('click', toggleMobileMenu);
  });

  // ===== Smooth Scrolling =====
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      
      if (targetId.startsWith('#')) {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          const headerOffset = 80;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // ===== Active Navigation Link =====
  const sections = document.querySelectorAll('section[id]');
  
  function highlightNavOnScroll() {
    const scrollY = window.scrollY;
    
    sections.forEach(section => {
      const sectionId = section.getAttribute('id');
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
      
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document.querySelectorAll(`.nav-link[href="#${sectionId}"], .mobile-nav-link[href="#${sectionId}"]`)
          .forEach(link => link.classList.add('text-primary'));
      } else {
        document.querySelectorAll(`.nav-link[href="#${sectionId}"], .mobile-nav-link[href="#${sectionId}"]`)
          .forEach(link => link.classList.remove('text-primary'));
      }
    });
  }
  
  window.addEventListener('scroll', highlightNavOnScroll);

  // ===== Back to Top Button =====
  function toggleBackToTopButton() {
    if (window.scrollY > 500) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }
  }
  
  // Ejecutar una vez al inicio para establecer el estado inicial
  toggleBackToTopButton();
  
  window.addEventListener('scroll', toggleBackToTopButton);
  
  backToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // ===== Skill Bars Animation =====
  function animateSkillBars() {
    skillItems.forEach(item => {
      const progress = item.querySelector('.skill-progress');
      const level = item.getAttribute('data-level') || 0;
      
      // Set initial width to 0
      progress.style.width = '0%';
      
      // Use Intersection Observer to trigger animation when in viewport
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              progress.style.width = level + '%';
            }, 200);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      
      observer.observe(item);
    });
  }
  
  animateSkillBars();

  // ===== Stats Counter Animation =====
  const statCards = document.querySelectorAll('.stat-card');
  
  function animateCounters() {
    statCards.forEach(card => {
      const countElement = card.querySelector('.stat-number');
      const targetCount = parseInt(card.getAttribute('data-counter'));
      if (card.getAttribute('data-static') === 'true' || Number.isNaN(targetCount)) {
        return;
      }
      let currentCount = 0;
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const interval = setInterval(() => {
              currentCount++;
              countElement.innerHTML = currentCount + '<span class="text-primary">+</span>';
              
              if (currentCount >= targetCount) {
                clearInterval(interval);
                countElement.innerHTML = targetCount + '<span class="text-primary">+</span>';
              }
            }, 60);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      
      observer.observe(card);
    });
  }
  
  animateCounters();

  // ===== Custom Cursor (Desktop Only) =====
  if (window.innerWidth > 1024) {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    window.addEventListener('mousemove', (e) => {
      const posX = e.clientX;
      const posY = e.clientY;
      
      cursorDot.style.left = `${posX}px`;
      cursorDot.style.top = `${posY}px`;
      
      // Delay the outline cursor slightly for a trailing effect
      setTimeout(() => {
        cursorOutline.style.left = `${posX}px`;
        cursorOutline.style.top = `${posY}px`;
      }, 80);
    });
    
    // Add hover effect on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, .project-card, .stat-card, .language-card, .skill-category');
    
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
        cursorOutline.style.width = '30px';
        cursorOutline.style.height = '30px';
        cursorOutline.style.borderColor = 'var(--primary)';
      });
      
      el.addEventListener('mouseleave', () => {
        cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorOutline.style.width = '40px';
        cursorOutline.style.height = '40px';
        cursorOutline.style.borderColor = 'rgba(14, 165, 233, 0.5)';
      });
    });
  } else {
    // Hide custom cursor on mobile
    document.querySelector('.cursor-dot')?.classList.add('hidden');
    document.querySelector('.cursor-outline')?.classList.add('hidden');
  }
});