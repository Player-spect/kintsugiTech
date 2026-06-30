/**
 * Kintsugi Tech - JavaScript para animaciones y carrusel
 * Código refactorizado con mejores prácticas
 */

// Usuarios simulados (sin base de datos)
const USERS = {
    admin: {
        email: 'admin@kintsugitech.cl',
        password: 'admin123',
        role: 'admin',
        name: 'Administrador'
    },
    client: {
        email: 'cliente@empresa.cl',
        password: 'cliente123',
        role: 'client',
        name: 'Cliente Empresa'
    }
};

// Estado de sesión
let currentUser = null;

// Datos simulados para el dashboard
const DASHBOARD_DATA = {
    admin: {
        stats: [
            { number: '47', label: 'Empresas Atendidas' },
            { number: '1,250', label: 'Equipos Reciclados' },
            { number: '18', label: 'Solicitudes Pendientes' },
            { number: '98%', label: 'Tasa de Satisfacción' }
        ],
        requests: [
            { company: 'Minera Los Pelambres', contact: 'Carlos Ruiz', volume: '50+ equipos', status: 'pending', date: '2026-01-15' },
            { company: 'Hospital La Serena', contact: 'María González', volume: '21-50 equipos', status: 'pending', date: '2026-01-14' },
            { company: 'Universidad Católica Norte', contact: 'Pedro Sánchez', volume: '1-20 equipos', status: 'completed', date: '2026-01-10' },
            { company: 'Municipalidad de Coquimbo', contact: 'Ana López', volume: '21-50 equipos', status: 'completed', date: '2026-01-08' }
        ]
    },
    client: {
        stats: [
            { number: '3', label: 'Solicitudes Realizadas' },
            { number: '85', label: 'Equipos Reciclados' },
            { number: '2', label: 'Certificados Emitidos' },
            { number: '1', label: 'Solicitudes Pendientes' }
        ],
        requests: [
            { service: 'Evaluación de Activos TI', volume: '21-50 equipos', status: 'pending', date: '2026-01-15' },
            { service: 'Retiro y Destrucción de Datos', volume: '15 equipos', status: 'completed', date: '2025-12-20' },
            { service: 'Donación de Equipos', volume: '20 equipos', status: 'completed', date: '2025-11-15' }
        ]
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar carrusel
    initCarousel();
    
    // Inicializar animaciones al hacer scroll
    initScrollAnimations();
    
    // Inicializar sistema de login
    initLoginSystem();
    
    // Verificar si hay sesión activa
    checkSession();
});

/**
 * Scroll suave hasta la sección de contacto
 */
function scrollToContact() {
    const contactSection = document.getElementById('contacto');
    if (contactSection) {
        contactSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

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
 * Smooth scroll para enlaces internos (excepto el botón de contacto que usa scrollToContact)
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement && targetId !== '#contacto') {
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

/**
 * SISTEMA DE LOGIN SIN BASE DE DATOS
 */

/**
 * Inicializa el sistema de login
 */
function initLoginSystem() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Cerrar modal al hacer click fuera del contenido (solo en index.html)
    window.addEventListener('click', (e) => {
        const loginModal = document.getElementById('loginModal');
        
        if (e.target === loginModal) {
            closeLoginModal();
        }
    });
}

/**
 * Abre el modal de login
 */
function openLoginModal() {
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        loginModal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevenir scroll
    }
}

/**
 * Cierra el modal de login
 */
function closeLoginModal() {
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        loginModal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

/**
 * Maneja el envío del formulario de login
 */
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    
    // Buscar usuario en el objeto USERS
    let foundUser = null;
    for (const key in USERS) {
        if (USERS[key].email === email && USERS[key].password === password) {
            foundUser = USERS[key];
            break;
        }
    }
    
    if (foundUser) {
        // Login exitoso - guardar sesión en localStorage
        currentUser = foundUser;
        localStorage.setItem('kintsugi_user', JSON.stringify(foundUser));
        
        showNotification(`¡Bienvenido ${foundUser.name}!`, 'success');
        closeLoginModal();
        
        // Abrir dashboard después de un breve delay
        setTimeout(() => {
            openDashboard();
        }, 500);
        
        // Limpiar formulario
        document.getElementById('loginForm').reset();
    } else {
        // Login fallido
        showNotification('Correo o contraseña incorrectos', 'error');
    }
}

/**
 * Verifica si hay una sesión activa
 */
function checkSession() {
    const savedUser = localStorage.getItem('kintsugi_user');
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
            updateLoginButton();
        } catch (e) {
            localStorage.removeItem('kintsugi_user');
        }
    }
}

/**
 * Actualiza el botón de login según el estado de sesión
 */
function updateLoginButton() {
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn && currentUser) {
        loginBtn.textContent = `Hola, ${currentUser.name.split(' ')[0]}`;
        loginBtn.onclick = openDashboard;
        loginBtn.style.backgroundColor = 'var(--color-accent)';
    }
}

/**
 * Abre el dashboard del usuario
 */
function openDashboard() {
    if (!currentUser) {
        openLoginModal();
        return;
    }
    
    // Redirigir a dashboard.html
    window.location.href = 'dashboard.html';
}

/**
 * Genera el HTML del dashboard de administrador
 */
function generateAdminDashboard(data) {
    let statsHTML = '<div class="dashboard-stats">';
    data.stats.forEach(stat => {
        statsHTML += `
            <div class="stat-card">
                <span class="stat-number">${stat.number}</span>
                <span class="stat-label">${stat.label}</span>
            </div>
        `;
    });
    statsHTML += '</div>';
    
    let requestsHTML = '<ul class="request-list">';
    data.requests.forEach(req => {
        const statusText = req.status === 'pending' ? 'Pendiente' : 'Completado';
        requestsHTML += `
            <li class="request-item ${req.status}">
                <h4>${req.company}</h4>
                <p><strong>Contacto:</strong> ${req.contact}</p>
                <p><strong>Volumen:</strong> ${req.volume}</p>
                <p><strong>Fecha:</strong> ${req.date}</p>
                <span class="status-badge ${req.status}">${statusText}</span>
            </li>
        `;
    });
    requestsHTML += '</ul>';
    
    return `
        ${statsHTML}
        <div class="dashboard-section">
            <h3>Solicitudes Recientes</h3>
            ${requestsHTML}
        </div>
    `;
}

/**
 * Genera el HTML del dashboard de cliente
 */
function generateClientDashboard(data) {
    let statsHTML = '<div class="dashboard-stats">';
    data.stats.forEach(stat => {
        statsHTML += `
            <div class="stat-card client">
                <span class="stat-number">${stat.number}</span>
                <span class="stat-label">${stat.label}</span>
            </div>
        `;
    });
    statsHTML += '</div>';
    
    let requestsHTML = '<ul class="request-list">';
    data.requests.forEach(req => {
        const statusText = req.status === 'pending' ? 'En Proceso' : 'Completado';
        requestsHTML += `
            <li class="request-item ${req.status}">
                <h4>${req.service}</h4>
                <p><strong>Volumen:</strong> ${req.volume}</p>
                <p><strong>Fecha:</strong> ${req.date}</p>
                <span class="status-badge ${req.status}">${statusText}</span>
            </li>
        `;
    });
    requestsHTML += '</ul>';
    
    return `
        ${statsHTML}
        <div class="dashboard-section">
            <h3>Mis Solicitudes</h3>
            ${requestsHTML}
        </div>
    `;
}

/**
 * Cierra el dashboard
 */
function closeDashboard() {
    const dashboardModal = document.getElementById('dashboardModal');
    if (dashboardModal) {
        dashboardModal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

/**
 * Cierra la sesión del usuario y redirige al index
 */
function logout() {
    currentUser = null;
    localStorage.removeItem('kintsugi_user');
    
    // Si estamos en dashboard.html, mostrar notificación y redirigir
    if (window.location.pathname.includes('dashboard.html')) {
        showNotification('Sesión cerrada correctamente', 'info');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 500);
    } else {
        // Si estamos en index.html, actualizar botón y mostrar notificación
        updateLoginButton();
        showNotification('Sesión cerrada correctamente', 'info');
    }
}

// Exportar funciones y datos para que sean accesibles desde dashboard.html
if (typeof window !== 'undefined') {
    window.logout = logout;
    window.checkSession = checkSession;
    window.showNotification = showNotification;
    window.DASHBOARD_DATA = DASHBOARD_DATA;
    window.USERS = USERS;
}
