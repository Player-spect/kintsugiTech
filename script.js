/**
 * Kintsugi Tech - JavaScript para animaciones y carrusel
 * Código refactorizado con mejores prácticas
 */

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar carrusel
    initCarousel();
    
    // Inicializar animaciones al hacer scroll
    initScrollAnimations();
});

/**
 * Carrusel de Imágenes
 * Funcionalidad completa con navegación manual, automática y puntos indicadores
 */
function initCarousel() {
    const track = document.getElementById('carouselTrack');
    const slides = Array.from(track.children);
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const dotsContainer = document.getElementById('carouselDots');
    
    if (!track || slides.length === 0) return;
    
    let currentIndex = 0;
    let autoPlayInterval;
    const autoPlayDelay = 5000; // 5 segundos
    
    // Crear puntos indicadores (dots)
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('carousel-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    const dots = Array.from(dotsContainer.children);
    
    /**
     * Actualiza la diapositiva activa y los indicadores
     */
    function updateCarousel() {
        // Actualizar slides
        slides.forEach((slide, index) => {
            slide.classList.toggle('current-slide', index === currentIndex);
        });
        
        // Actualizar dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    /**
     * Navega a una diapositiva específica
     */
    function goToSlide(index) {
        currentIndex = index;
        if (currentIndex < 0) {
            currentIndex = slides.length - 1;
        } else if (currentIndex >= slides.length) {
            currentIndex = 0;
        }
        updateCarousel();
        resetAutoPlay();
    }
    
    /**
     * Navega a la siguiente diapositiva
     */
    function nextSlide() {
        goToSlide(currentIndex + 1);
    }
    
    /**
     * Navega a la diapositiva anterior
     */
    function prevSlide() {
        goToSlide(currentIndex - 1);
    }
    
    /**
     * Inicia la reproducción automática
     */
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, autoPlayDelay);
    }
    
    /**
     * Detiene la reproducción automática
     */
    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
        }
    }
    
    /**
     * Reinicia la reproducción automática
     */
    function resetAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }
    
    // Event Listeners para botones
    nextBtn.addEventListener('click', () => {
        nextSlide();
    });
    
    prevBtn.addEventListener('click', () => {
        prevSlide();
    });
    
    // Pausar autoplay al pasar el mouse por encima
    const carouselContainer = document.querySelector('.carousel-container');
    carouselContainer.addEventListener('mouseenter', stopAutoPlay);
    carouselContainer.addEventListener('mouseleave', startAutoPlay);
    
    // Soporte para touch/swipe en dispositivos móviles
    let touchStartX = 0;
    let touchEndX = 0;
    
    carouselContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoPlay();
    }, { passive: true });
    
    carouselContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoPlay();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe hacia la izquierda - siguiente slide
                nextSlide();
            } else {
                // Swipe hacia la derecha - slide anterior
                prevSlide();
            }
        }
    }
    
    // Soporte para teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });
    
    // Iniciar autoplay
    startAutoPlay();
}

/**
 * Animaciones al hacer Scroll
 * Utiliza Intersection Observer API para mejor rendimiento
 */
function initScrollAnimations() {
    // Elementos que se animarán al aparecer en pantalla
    const animatedElements = document.querySelectorAll('.slide-up, .fade-in');
    
    if (animatedElements.length === 0) return;
    
    // Configuración del observer
    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // Se activa cuando el 10% del elemento es visible
    };
    
    // Callback que se ejecuta cuando un elemento entra/sale del viewport
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // El elemento entró en el viewport - agregar clase para animar
                entry.target.style.animationPlayState = 'running';
                
                // Opcional: dejar de observar después de la primera animación
                // observer.unobserve(entry.target);
            }
        });
    };
    
    // Crear el observer
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Observar cada elemento animado
    animatedElements.forEach(el => {
        // Asegurar que la animación esté pausada inicialmente
        el.style.animationPlayState = 'paused';
        observer.observe(el);
    });
}

/**
 * Validación mejorada del formulario
 */
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Obtener valores del formulario
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());
        
        // Validación básica
        if (!data.nombre || !data.empresa || !data.email || !data.volumen) {
            showNotification('Por favor complete todos los campos requeridos', 'error');
            return;
        }
        
        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showNotification('Por favor ingrese un correo electrónico válido', 'error');
            return;
        }
        
        // Simular envío exitoso
        showNotification('¡Gracias! Hemos recibido tu solicitud. Nos pondremos en contacto pronto.', 'success');
        contactForm.reset();
    });
}

/**
 * Muestra notificaciones toast
 */
function showNotification(message, type = 'info') {
    // Eliminar notificaciones anteriores
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Estilos de la notificación
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 25px',
        borderRadius: '8px',
        color: '#fff',
        fontWeight: 'bold',
        zIndex: '9999',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        animation: 'slideInRight 0.3s ease-out',
        maxWidth: '400px'
    });
    
    // Colores según el tipo
    const colors = {
        success: '#38a169',
        error: '#e53e3e',
        info: '#3182ce'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    
    // Agregar al DOM
    document.body.appendChild(notification);
    
    // Remover después de 5 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

/**
 * Smooth scroll para enlaces internos
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Agregar estilos para las animaciones de notificación
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
`;
document.head.appendChild(style);
