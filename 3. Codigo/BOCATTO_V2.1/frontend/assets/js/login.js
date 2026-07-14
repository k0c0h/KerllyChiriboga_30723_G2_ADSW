import AuthService from "../../services/authService.js";
import Storage from "../../utils/storage.js";

const form = document.getElementById("loginForm");
const alertBox = document.getElementById("loginAlert");
const btnSubmit = document.getElementById("btnIngresar");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

// === NUEVOS ELEMENTOS DEL DOM ===
const attemptsIndicator = document.getElementById("attemptsIndicator");
const attemptsText = document.getElementById("attemptsText");
const clientAccessContainer = document.getElementById("clientAccessContainer");

let countdownInterval = null;

function mostrarMensajeError(mensaje, esAdvertencia = false) {
    alertBox.textContent = mensaje;
    alertBox.className = esAdvertencia ? "alert alert-warning-custom" : "alert alert-custom";
    alertBox.classList.remove("d-none");
}

// === FUNCIÓN PARA ACTUALIZAR LOS CÍRCULOS (DOTS) ===
function actualizarPuntosIntentos(restantes) {
    attemptsIndicator.classList.remove("d-none");
    attemptsText.textContent = `${restantes} ${restantes === 1 ? 'intento restante' : 'intentos restantes'}`;

    // Si quedan 2 intentos -> El primer punto se pone rojo (active)
    // Si queda 1 intento  -> El primer y segundo punto se ponen rojos
    document.getElementById("dot1").className = `dot ${restantes <= 2 ? 'active' : ''}`;
    document.getElementById("dot2").className = `dot ${restantes <= 1 ? 'active' : ''}`;
    document.getElementById("dot3").className = "dot"; // El tercero nunca se activa porque al 3er fallo se bloquea
}

// === FUNCIÓN REDISEÑADA PARA EL BLOQUEO TEMPORAL ===
function iniciarContadorBloqueo(segundos) {
    if (countdownInterval) clearInterval(countdownInterval);

    // Ocultar formulario e indicadores de intentos
    form.classList.add("d-none");
    attemptsIndicator.classList.add("d-none");

    // Mostrar botón de acceso cliente sin login si aplica
    if (clientAccessContainer) clientAccessContainer.classList.remove("d-none");
    alertBox.classList.remove("d-none");

    const tiempoMaximo = 300; // 5 minutos en segundos para la barra de progreso

    function actualizarTimer() {
        if (segundos <= 0) {
            clearInterval(countdownInterval);
            countdownInterval = null;

            // Restablecer la vista original del login
            alertBox.classList.add("d-none");
            if (clientAccessContainer) clientAccessContainer.classList.add("d-none");
            form.classList.remove("d-none");

            // Limpiar campos por seguridad
            passwordInput.value = "";
            return;
        }

        // Calcular porcentaje restante para la barra naranja
        const porcentaje = (segundos / tiempoMaximo) * 100;

        // Inyectar la estructura exacta de la tarjeta de bloqueo y barra de carga
        alertBox.className = "w-100"; // Quitamos las clases de alerta clásica de bootstrap
        alertBox.innerHTML = `
            <div class="block-card">
                <i class="bi bi-shield-slash block-icon"></i>
                <div class="block-title">Acceso bloqueado temporalmente</div>
                <div class="text-muted small">Se detectaron 3 intentos fallidos consecutivos.</div>
                <div class="block-timer-badge">
                    <i class="bi bi-clock-history me-2"></i> Puede reintentar en <strong class="ms-1">${segundos}s</strong>
                </div>
            </div>
            <div class="progress-container">
                <div class="progress-bar-custom" style="width: ${porcentaje}%"></div>
            </div>
        `;

        segundos--;
    }

    actualizarTimer();
    countdownInterval = setInterval(actualizarTimer, 1000);
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (countdownInterval) return;

    const username = usernameInput.value;
    const password = passwordInput.value;

    alertBox.classList.add("d-none");

    try {
        const respuesta = await AuthService.login(username, password);

        if (respuesta.success) {
            Storage.guardarToken(respuesta.data.token);
            Storage.guardarUsuario(respuesta.data.usuario);
            window.location.href = "index.html";
        } else {
            const msg = respuesta.message || "";

            if (msg.startsWith("INTENTOS:")) {
                const restantes = parseInt(msg.split(":")[1], 10);

                // 1. Mostrar la alerta de advertencia clásica
                mostrarMensajeError(`Credenciales incorrectas. ${restantes} ${restantes === 1 ? 'intento restante' : 'intentos restantes'} antes del bloqueo.`, false);
                // 2. Pintar los círculos indicadores
                actualizarPuntosIntentos(restantes);

            } else if (msg.startsWith("BLOQUEADO:")) {
                const segundos = parseInt(msg.split(":")[1], 10);
                iniciarContadorBloqueo(segundos);
            } else {
                mostrarMensajeError(msg);
            }
        }
    } catch (error) {
        mostrarMensajeError("Error de conexión con el servidor.");
    }
});