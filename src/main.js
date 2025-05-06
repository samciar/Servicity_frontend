import '../public/css/styles.css';
import { templates } from './templates.js';
import $ from 'jquery';
window.$ = $;
window.jQuery = $;

// Manejar navegación inicial
function initRouter() {
    const path = window.location.pathname;
    if (path.includes('login-register')) {
        loadLoginRegister();
    } else {
        loadHome();
    }
}

function loadHome() {
    // Cargar contenido de la página principal
    $('#app').load('/index.html #app > *');
}

function loadLoginRegister() {
    // Cargar contenido de login/registro
    $('#app').load('/src/login-register.html #app > *', templates);
}

// Manejar navegación
$(document).on('click', '[data-navigate]', function(e) {
    e.preventDefault();
    const page = $(this).data('navigate');
    history.pushState({}, '', page === 'home' ? '/' : `/${page}`);
    
    if (page === 'login-register') {
        loadLoginRegister();
    } else {
        loadHome();
    }
});

// Manejar navegación con el botón atrás/adelante
window.addEventListener('popstate', initRouter);

// Iniciar
initRouter();