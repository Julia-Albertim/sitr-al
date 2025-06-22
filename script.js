// Inicializar AOS
AOS.init({
  duration: 800,
  easing: 'ease-in-out',
  once: true,
  offset: 100
});

// Navegação responsiva
class Navigation {
  constructor() {
    this.navToggle = document.querySelector('.nav-toggle');
    this.navMenu = document.querySelector('.nav-menu');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.navbar = document.querySelector('.navbar');
    
    this.init();
  }

  init() {
    this.setupMobileMenu();
    this.setupSmoothScroll();
    this.setupActiveLink();
    this.setupScrollEffect();
  }

  setupMobileMenu() {
    this.navToggle?.addEventListener('click', () => {
      this.navMenu.classList.toggle('active');
      this.navToggle.classList.toggle('active');
      this.navToggle.setAttribute('aria-expanded', 
        this.navMenu.classList.contains('active'));
    });

    // Fechar menu ao clicar em link
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.navMenu.classList.remove('active');
        this.navToggle.classList.remove('active');
        this.navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Fechar menu ao clicar fora
    document.addEventListener('click', (e) => {
      if (!this.navbar.contains(e.target)) {
        this.navMenu.classList.remove('active');
        this.navToggle.classList.remove('active');
        this.navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  setupSmoothScroll() {
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
          const offsetTop = targetSection.offsetTop - 70;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  setupActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY + 100;
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
          this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
            }
          });
        }
      });
    });
  }

setupScrollEffect() {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      this.navbar.classList.add('scrolled');
    } else {
      this.navbar.classList.remove('scrolled');
    }
  });
}
}

// Toggle de tema
class ThemeToggle {
  constructor() {
    this.themeToggle = document.getElementById('themeToggle');
    this.themeIcon = document.getElementById('themeIcon');
    this.body = document.body;
    
    this.init();
  }

  init() {
    // Verificar tema salvo
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.body.setAttribute('data-theme', savedTheme);
    this.updateThemeIcon(savedTheme);

    this.themeToggle?.addEventListener('click', () => {
      const currentTheme = this.body.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      
      this.body.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      this.updateThemeIcon(newTheme);
    });
  }
updateThemeIcon(theme) {
  this.themeIcon.className = 'fas fa-circle-half-stroke';
  if (theme === 'dark') {
    this.themeIcon.style.transform = 'scaleX(-1)'; // inverte o lado
  } else {
    this.themeIcon.style.transform = 'scaleX(1)';
  }
}}

// Sistema de notificações bonito
class NotificationSystem {
  constructor() {
    this.container = this.createContainer();
  }

  createContainer() {
    const container = document.createElement('div');
    container.id = 'notification-container';
    container.style.cssText = `
      position: fixed;
      top: 90px;
      right: 20px;
      z-index: 1001;
      pointer-events: none;
    `;
    document.body.appendChild(container);
    return container;
  }

  show(message, type = 'success', duration = 5000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.pointerEvents = 'auto';
    
    const colors = {
      success: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      error: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      info: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
    };
    
    const icons = {
      success: 'fas fa-check-circle',
      error: 'fas fa-exclamation-circle',
      info: 'fas fa-info-circle'
    };
    
    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <i class="${icons[type]}" style="font-size: 1.2rem;"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.parentElement.remove()" 
                style="background: none; border: none; color: white; cursor: pointer; margin-left: auto; font-size: 1.2rem;">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;
    
    notification.style.cssText = `
      background: ${colors[type]};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 0.75rem;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
      max-width: 400px;
      animation: slideInRight 0.3s ease-out;
      margin-bottom: 1rem;
    `;
    
    this.container.appendChild(notification);
    
    // Auto remover
    setTimeout(() => {
      if (notification.parentElement) {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
      }
    }, duration);
  }
}

// Formulário de contato melhorado
class ContactForm {
  constructor() {
    this.form = document.getElementById('contatoForm');
    this.notification = new NotificationSystem();
    this.init();
  }

  init() {
    if (!this.form) return;
    
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    this.setupValidation();
  }

  setupValidation() {
    const inputs = this.form.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearErrors(input));
    });
  }

  validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let message = '';

    this.clearErrors(field);

    if (field.hasAttribute('required') && !value) {
      isValid = false;
      message = 'Este campo é obrigatório';
    } else if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        message = 'Email inválido';
      }
    } else if (field.type === 'tel' && value) {
      const phoneRegex = /^[\d\s\-\(\)\+]+$/;
      if (!phoneRegex.test(value)) {
        isValid = false;
        message = 'Telefone inválido';
      }
    }

    if (!isValid) {
      this.showFieldError(field, message);
    }

    return isValid;
  }

  showFieldError(field, message) {
    field.style.borderColor = '#ef4444';
    field.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
    
    let errorElement = field.parentElement.querySelector('.field-error');
    if (!errorElement) {
      errorElement = document.createElement('span');
      errorElement.className = 'field-error';
      errorElement.style.cssText = 'color: #ef4444; font-size: 0.875rem; margin-top: 0.25rem; display: block; font-weight: 500;';
      field.parentElement.appendChild(errorElement);
    }
    
    errorElement.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
  }

  clearErrors(field) {
    field.style.borderColor = '';
    field.style.boxShadow = '';
    const errorElement = field.parentElement.querySelector('.field-error');
    if (errorElement) {
      errorElement.remove();
    }
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    const inputs = this.form.querySelectorAll('input, textarea');
    let isFormValid = true;
    
    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isFormValid = false;
      }
    });

    if (!isFormValid) {
      this.notification.show('Por favor, corrija os erros no formulário', 'error');
      return;
    }

    const submitButton = this.form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    submitButton.innerHTML = '<span>Enviando...</span> <i class="fas fa-spinner fa-spin" style="margin-left: 0.5rem;"></i>';
    submitButton.disabled = true;
    
    try {
      await this.simulateSubmission();
      
      submitButton.innerHTML = '<span>Enviado!</span> <i class="fas fa-check" style="margin-left: 0.5rem;"></i>';
      submitButton.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
      
      this.notification.show('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
      
      this.form.reset();
      
      setTimeout(() => {
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        submitButton.style.background = '';
      }, 3000);
      
    } catch (error) {
      submitButton.innerHTML = '<span>Erro ao enviar</span> <i class="fas fa-exclamation-triangle" style="margin-left: 0.5rem;"></i>';
      submitButton.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
      
      this.notification.show('Erro ao enviar mensagem. Tente novamente ou entre em contato pelo WhatsApp.', 'error');
      
      setTimeout(() => {
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        submitButton.style.background = '';
      }, 3000);
    }
  }

  async simulateSubmission() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.1) {
          resolve();
        } else {
          reject(new Error('Erro simulado'));
        }
      }, 2000);
    });
  }
}

// Efeitos visuais bonitos
class VisualEffects {
  constructor() {
    this.init();
  }

  init() {
    this.setupParallax();
    this.setupHoverEffects();
    this.setupScrollAnimations();
  }

  setupParallax() {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const header = document.querySelector('.hero');
      if (header) {
        header.style.transform = `translateY(${scrolled * 0.3}px)`;
      }
    });
  }

  setupHoverEffects() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
      });
    });
  }

  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    document.querySelectorAll('.card').forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      card.style.transition = 'all 0.6s ease';
      observer.observe(card);
    });
  }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  new Navigation();
  new ThemeToggle();
  new ContactForm();
  new VisualEffects();
});

// Adicionar estilos CSS para animações
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
  
  .notification button:hover {
    background: rgba(255, 255, 255, 0.2) !important;
    border-radius: 4px;
  }
`;
document.head.appendChild(style);

