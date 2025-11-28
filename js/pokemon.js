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

    // Mostrar descripción
    document.getElementById("detalle-descripcion").textContent = p.descripcion;

    // Ocultar botón "Editar" por defecto y mostrarlo solo si autenticado (ahora no es necesario)
    document.getElementById("btn-editar-pokemon").style.display = "inline-block";
    document.getElementById("btn-guardar-pokemon").style.display = "none";
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

    // Eliminar elementos de edición del DOM
    const detalleContenedor = document.getElementById('detalle-pokemon');
    detalleContenedor.querySelector('#edit-nombre')?.remove();
    detalleContenedor.querySelector('#edit-tipo')?.remove();
    detalleContenedor.querySelector('#edit-descripcion')?.remove();
    detalleContenedor.querySelector('#edit-desbloqueado')?.remove();

    // Mostrar botón "Editar" y ocultar botón "Guardar"
    document.getElementById("btn-editar-pokemon").style.display = "inline-block";
    document.getElementById("btn-guardar-pokemon").style.display = "none";
}

/**
 * Establece el Pokémon actual (útil para pruebas o inicialización externa).
 * 
 * @param {Object} p - Objeto del Pokémon.
 */
export function setPokemonActual(p) {
    pokemonActual = p;
}