// js/pokemon.js

// === Estado global ===
// Lista de Pokémon cargados desde Firebase
export const pokemon = [];
// Referencia al Pokémon actualmente en vista (detalle)
export let pokemonActual = null;

/**
 * Convierte un archivo de imagen a una cadena Base64.
 * 
 * @param {File} file - Archivo de imagen seleccionado por el usuario.
 * @returns {Promise<string>} Cadena Base64 de la imagen.
 */
export function convertirImagenABase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}

/**
 * Renderiza las listas de Pokémon desbloqueados y bloqueados en el menú.
 * 
 * @param {HTMLElement} pokemonDesbloqueados - Contenedor <ul> para Pokémon desbloqueados.
 * @param {HTMLElement} pokemonBloqueados - Contenedor <ul> para Pokémon bloqueados.
 */
export function renderizarPokemones(pokemonDesbloqueados, pokemonBloqueados) {
    // Limpiar listas actuales
    pokemonDesbloqueados.innerHTML = "";
    pokemonBloqueados.innerHTML = "";

    // 🔑 Verificar si el usuario está autenticado
    const autenticado = firebase.auth().currentUser;

    // Crear un elemento <li> con botón para cada Pokémon
    pokemon.forEach(p => {
        const li = document.createElement("li");
        const btn = document.createElement("button");
        btn.textContent = p.desbloqueado
            ? `${p.nombre} ✅`
            : `${p.nombre} 🔒`;
        // Al hacer clic, muestra el detalle del Pokémon (siempre permitido)
        btn.addEventListener("click", () => mostrarDetalle(p.id));
        li.appendChild(btn);
        // Añadir a la lista correspondiente
        if (p.desbloqueado) pokemonDesbloqueados.appendChild(li);
        else pokemonBloqueados.appendChild(li);
    });
}

/**
 * Muestra la pantalla de detalle de un Pokémon específico.
 * 
 * @param {string|number} id - ID del Pokémon a mostrar.
 */
export function mostrarDetalle(id) {
    // Buscar Pokémon por ID (comparación flexible de tipo)
    const p = pokemon.find(p => String(p.id) === String(id));
    if (!p) return;
    pokemonActual = p;

    // Cambiar visibilidad de pantallas
    document.getElementById("menu-pokemon").style.display = "none";
    document.getElementById("detalle-pokemon").style.display = "block";

    // Actualizar título
    document.getElementById("detalle-titulo").textContent = `Pokémon: ${p.nombre}`;

    // Renderizar imagen
    const contenedorImagen = document.getElementById("detalle-imagen");
    contenedorImagen.innerHTML = "";
    if (p.imagen) {
        const img = document.createElement("img");
        img.src = p.imagen;
        img.alt = `Imagen del Pokémon "${p.nombre}"`;
        contenedorImagen.appendChild(img);
    } else {
        contenedorImagen.textContent = "(espacio para imagen)";
    }

    // Ocultar control de cambio de imagen (solo visible en edición)
    document.getElementById("label-cambiar-imagen").style.display = "none";

    // Mostrar tipo
    document.getElementById("detalle-tipo").textContent = p.tipo;

    // Renderizar nivel como estrellas no editables
    renderEstrellasDetalle(p.nivel || 0);

    // Mostrar descripción
    document.getElementById("detalle-descripcion").textContent = p.descripcion;

    // 🔑 NUEVO: Ocultar botón "Editar" por defecto y mostrarlo solo si autenticado
    document.getElementById("btn-editar-pokemon").style.display = "none";
    document.getElementById("btn-guardar-pokemon").style.display = "none";

    // Verificar autenticación de forma segura
    if (typeof firebase !== 'undefined') {
        const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
            document.getElementById("btn-editar-pokemon").style.display = user ? "inline-block" : "none";
            // Cancelar el listener después de usarlo (evita fugas de memoria)
            unsubscribe();
        });
    }
}

/**
 * Renderiza las estrellas de nivel en modo visualización (no editable).
 * 
 * @param {number} valor - Número de estrellas activas (0 a 5).
 */
function renderEstrellasDetalle(valor) {
    const cont = document.getElementById("detalle-nivel");
    cont.innerHTML = "";
    for (let i = 1; i <= 5; i++) {
        const span = document.createElement("span");
        span.className = `estrella ${i <= valor ? 'activa' : ''}`;
        span.textContent = "★";
        cont.appendChild(span);
    }
}

/**
 * Renderiza las estrellas de nivel en modo edición (interactivo).
 * 
 * @param {number} valorInicial - Número inicial de estrellas activas.
 */
function renderEstrellasEditable(valorInicial = 0) {
    const cont = document.getElementById("detalle-nivel");
    cont.innerHTML = "";
    cont.classList.add('editable');
    for (let i = 1; i <= 5; i++) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = `estrella ${i <= valorInicial ? 'activa' : ''}`;
        btn.textContent = "★";
        btn.style.cursor = 'pointer';
        btn.setAttribute('aria-label', `${i} de 5`);
        // Al hacer clic, activa todas las estrellas hasta la seleccionada
        btn.addEventListener('click', () => {
            const estrellas = cont.querySelectorAll('.estrella');
            estrellas.forEach((el, idx) => {
                if (idx < i) el.classList.add('activa');
                else el.classList.remove('activa');
            });
            // Guardar valor seleccionado en dataset
            cont.dataset.valor = String(i);
        });
        cont.appendChild(btn);
    }
    // Inicializar dataset con valor por defecto
    cont.dataset.valor = String(valorInicial || 0);
}

/**
 * Convierte la vista de detalle en un formulario editable.
 * 
 * @param {Object} p - Objeto del Pokémon a editar.
 */
export function editarPokemon(p) {
    if (!p) return;

    // Reemplazar contenido de título, tipo y descripción con inputs
    const titulo = document.getElementById("detalle-titulo");
    const tipo = document.getElementById("detalle-tipo");
    const descripcion = document.getElementById("detalle-descripcion");

    titulo.innerHTML = `Pokémon: <input type="text" id="edit-nombre" class="form-input" value="${p.nombre}" maxlength="50">`;
    tipo.innerHTML = `Tipo: <input type="text" id="edit-tipo" class="form-input" value="${p.tipo}" maxlength="50">`;
    descripcion.innerHTML = `
        <textarea id="edit-descripcion" class="form-input" maxlength="200">${p.descripcion}</textarea>
        <label>Desbloqueado: <input type="checkbox" id="edit-desbloqueado" ${p.desbloqueado ? "checked" : ""}></label>
    `;

    // Renderizar estrellas editables
    renderEstrellasEditable(Number(p.nivel) || 0);

    // Mostrar control de imagen y botón de guardar
    document.getElementById("label-cambiar-imagen").style.display = "block";
    document.getElementById("btn-editar-pokemon").style.display = "none";
    document.getElementById("btn-guardar-pokemon").style.display = "inline-block";
}

/**
 * Vuelve a mostrar el detalle del Pokémon en modo visualización (después de guardar o cancelar).
 * 
 * @param {string|number} id - ID del Pokémon a mostrar.
 */
export function volverAMostrarDetalle(id) {
    const p = pokemon.find(p => String(p.id) === String(id));
    if (!p) return;
    pokemonActual = p;

    // Restaurar contenido de texto
    document.getElementById("detalle-titulo").textContent = `Pokémon: ${p.nombre}`;
    document.getElementById("detalle-tipo").textContent = p.tipo;
    document.getElementById("detalle-descripcion").textContent = p.descripcion;

    // Renderizar estrellas no editables
    renderEstrellasDetalle(Number(p.nivel) || 0);
    
    // Eliminar elementos de edición del DOM
    const detalleContenedor = document.getElementById('detalle-pokemon');
    detalleContenedor.querySelector('#edit-nombre')?.remove();
    detalleContenedor.querySelector('#edit-tipo')?.remove();
    detalleContenedor.querySelector('#edit-descripcion')?.remove();
    detalleContenedor.querySelector('#edit-desbloqueado')?.remove();

    // 🔑 NUEVO: Ocultar botón "Editar" por defecto y mostrarlo solo si autenticado
    document.getElementById("btn-editar-pokemon").style.display = "none";
    document.getElementById("btn-guardar-pokemon").style.display = "none";

    if (typeof firebase !== 'undefined') {
        const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
            document.getElementById("btn-editar-pokemon").style.display = user ? "inline-block" : "none";
            unsubscribe();
        });
    }
}

/**
 * Establece el Pokémon actual (útil para pruebas o inicialización externa).
 * 
 * @param {Object} p - Objeto del Pokémon.
 */
export function setPokemonActual(p) {
    pokemonActual = p;
}