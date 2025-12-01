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
 * Renderiza las listas de Pokémon según el filtro seleccionado.
 * 
 * @param {HTMLElement} listaPokemon - Contenedor <ul> para Pokémon.
 * @param {string} filtro - Categoría por la que filtrar (tipo, numero, hp, etc.).
 */
export function renderizarPokemones(listaPokemon, filtro) {
    // Limpiar lista actual
    listaPokemon.innerHTML = "";

    // Agrupar Pokémon por categoría si es necesario
    if (filtro === 'tipo') {
        const agrupados = {};
        pokemon.forEach(p => {
            const tipo = p.tipo || 'Sin Tipo';
            if (!agrupados[tipo]) agrupados[tipo] = [];
            agrupados[tipo].push(p);
        });
        for (const tipo in agrupados) {
            const grupo = document.createElement("li");
            grupo.innerHTML = `<h4>${tipo}</h4><ul></ul>`;
            const subLista = grupo.querySelector("ul");
            agrupados[tipo].forEach(p => {
                const item = document.createElement("li");
                const btn = document.createElement("button");
                btn.textContent = p.nombre;
                btn.addEventListener("click", () => mostrarDetalle(p.id));
                item.appendChild(btn);
                subLista.appendChild(item);
            });
            listaPokemon.appendChild(grupo);
        }
    } else if (filtro === 'numero') {
        // Ordenar por número de carta
        const ordenados = [...pokemon].sort((a, b) => {
            const numA = parseInt(a.numeroCarta.split('/')[0]) || 0;
            const numB = parseInt(b.numeroCarta.split('/')[0]) || 0;
            return numA - numB;
        });
        ordenados.forEach(p => {
            const item = document.createElement("li");
            const btn = document.createElement("button");
            btn.textContent = `${p.nombre} (${p.numeroCarta})`;
            btn.addEventListener("click", () => mostrarDetalle(p.id));
            item.appendChild(btn);
            listaPokemon.appendChild(item);
        });
    } else if (filtro === 'hp') {
        // Ordenar por HP
        const ordenados = [...pokemon].sort((a, b) => (a.hp || 0) - (b.hp || 0));
        ordenados.forEach(p => {
            const item = document.createElement("li");
            const btn = document.createElement("button");
            btn.textContent = `${p.nombre} (HP: ${p.hp})`;
            btn.addEventListener("click", () => mostrarDetalle(p.id));
            item.appendChild(btn);
            listaPokemon.appendChild(item);
        });
    } else if (filtro === 'tipoCarta') {
        const agrupados = {};
        pokemon.forEach(p => {
            const tipoCarta = p.tipoCarta || 'Sin Tipo';
            if (!agrupados[tipoCarta]) agrupados[tipoCarta] = [];
            agrupados[tipoCarta].push(p);
        });
        for (const tipo in agrupados) {
            const grupo = document.createElement("li");
            grupo.innerHTML = `<h4>${tipo}</h4><ul></ul>`;
            const subLista = grupo.querySelector("ul");
            agrupados[tipo].forEach(p => {
                const item = document.createElement("li");
                const btn = document.createElement("button");
                btn.textContent = p.nombre;
                btn.addEventListener("click", () => mostrarDetalle(p.id));
                item.appendChild(btn);
                subLista.appendChild(item);
            });
            listaPokemon.appendChild(grupo);
        }
    } else if (filtro === 'debilidad') {
        const agrupados = {};
        pokemon.forEach(p => {
            const debilidad = p.debilidad || 'Sin Debilidad';
            if (!agrupados[debilidad]) agrupados[debilidad] = [];
            agrupados[debilidad].push(p);
        });
        for (const tipo in agrupados) {
            const grupo = document.createElement("li");
            grupo.innerHTML = `<h4>${tipo}</h4><ul></ul>`;
            const subLista = grupo.querySelector("ul");
            agrupados[tipo].forEach(p => {
                const item = document.createElement("li");
                const btn = document.createElement("button");
                btn.textContent = p.nombre;
                btn.addEventListener("click", () => mostrarDetalle(p.id));
                item.appendChild(btn);
                subLista.appendChild(item);
            });
            listaPokemon.appendChild(grupo);
        }
    } else if (filtro === 'resistencia') {
        const agrupados = {};
        pokemon.forEach(p => {
            const resistencia = p.resistencia || 'Sin Resistencia';
            if (!agrupados[resistencia]) agrupados[resistencia] = [];
            agrupados[resistencia].push(p);
        });
        for (const tipo in agrupados) {
            const grupo = document.createElement("li");
            grupo.innerHTML = `<h4>${tipo}</h4><ul></ul>`;
            const subLista = grupo.querySelector("ul");
            agrupados[tipo].forEach(p => {
                const item = document.createElement("li");
                const btn = document.createElement("button");
                btn.textContent = p.nombre;
                btn.addEventListener("click", () => mostrarDetalle(p.id));
                item.appendChild(btn);
                subLista.appendChild(item);
            });
            listaPokemon.appendChild(grupo);
        }
    } else if (filtro === 'costoRetiro') {
        const agrupados = {};
        pokemon.forEach(p => {
            const costo = p.costoRetiro || 'Sin Costo';
            if (!agrupados[costo]) agrupados[costo] = [];
            agrupados[costo].push(p);
        });
        for (const tipo in agrupados) {
            const grupo = document.createElement("li");
            grupo.innerHTML = `<h4>${tipo}</h4><ul></ul>`;
            const subLista = grupo.querySelector("ul");
            agrupados[tipo].forEach(p => {
                const item = document.createElement("li");
                const btn = document.createElement("button");
                btn.textContent = p.nombre;
                btn.addEventListener("click", () => mostrarDetalle(p.id));
                item.appendChild(btn);
                subLista.appendChild(item);
            });
            listaPokemon.appendChild(grupo);
        }
    } else if (filtro === 'ataque') {
        const agrupados = {};
        pokemon.forEach(p => {
            const ataque = p.ataque || 'Sin Ataque';
            if (!agrupados[ataque]) agrupados[ataque] = [];
            agrupados[ataque].push(p);
        });
        for (const tipo in agrupados) {
            const grupo = document.createElement("li");
            grupo.innerHTML = `<h4>${tipo}</h4><ul></ul>`;
            const subLista = grupo.querySelector("ul");
            agrupados[tipo].forEach(p => {
                const item = document.createElement("li");
                const btn = document.createElement("button");
                btn.textContent = p.nombre;
                btn.addEventListener("click", () => mostrarDetalle(p.id));
                item.appendChild(btn);
                subLista.appendChild(item);
            });
            listaPokemon.appendChild(grupo);
        }
    } else {
        // Mostrar todos
        pokemon.forEach(p => {
            const item = document.createElement("li");
            const btn = document.createElement("button");
            btn.textContent = p.nombre;
            btn.addEventListener("click", () => mostrarDetalle(p.id));
            item.appendChild(btn);
            listaPokemon.appendChild(item);
        });
    }
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

  // Mostrar todos los campos
  document.getElementById("detalle-nombre").textContent = p.nombre;
  document.getElementById("detalle-tipo").textContent = p.tipo;
  document.getElementById("detalle-hp").textContent = p.hp;
  document.getElementById("detalle-tipo-carta").textContent = p.tipoCarta;
  document.getElementById("detalle-debilidad").textContent = p.debilidad;
  document.getElementById("detalle-resistencia").textContent = p.resistencia;
  document.getElementById("detalle-costo-retiro").textContent = p.costoRetiro;
  document.getElementById("detalle-ataque").textContent = p.ataque;
  document.getElementById("detalle-numero-carta").textContent = p.numeroCarta;

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

  // Reemplazar todos los campos con inputs
  document.getElementById("detalle-titulo").innerHTML = `Pokémon: <input type="text" id="edit-nombre" class="form-input" value="${p.nombre}" maxlength="50">`;
  document.getElementById("detalle-nombre").innerHTML = `<input type="text" id="edit-nombre" class="form-input" value="${p.nombre}" maxlength="50">`;
  document.getElementById("detalle-tipo").innerHTML = `<input type="text" id="edit-tipo" class="form-input" value="${p.tipo}" maxlength="50">`;
  document.getElementById("detalle-hp").innerHTML = `<input type="number" id="edit-hp" class="form-input" value="${p.hp}" min="1" max="300">`;
  document.getElementById("detalle-tipo-carta").innerHTML = `<input type="text" id="edit-tipo-carta" class="form-input" value="${p.tipoCarta}" maxlength="50">`;
  document.getElementById("detalle-debilidad").innerHTML = `<input type="text" id="edit-debilidad" class="form-input" value="${p.debilidad}" maxlength="50">`;
  document.getElementById("detalle-resistencia").innerHTML = `<input type="text" id="edit-resistencia" class="form-input" value="${p.resistencia}" maxlength="50">`;
  document.getElementById("detalle-costo-retiro").innerHTML = `<input type="text" id="edit-costo-retiro" class="form-input" value="${p.costoRetiro}" maxlength="20">`;
  document.getElementById("detalle-ataque").innerHTML = `<input type="text" id="edit-ataque" class="form-input" value="${p.ataque}" maxlength="100">`;
  document.getElementById("detalle-numero-carta").innerHTML = `<input type="text" id="edit-numero-carta" class="form-input" value="${p.numeroCarta}" maxlength="10">`;

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

  // Restaurar todos los campos
  document.getElementById("detalle-titulo").textContent = `Pokémon: ${p.nombre}`;
  document.getElementById("detalle-nombre").textContent = p.nombre;
  document.getElementById("detalle-tipo").textContent = p.tipo;
  document.getElementById("detalle-hp").textContent = p.hp;
  document.getElementById("detalle-tipo-carta").textContent = p.tipoCarta;
  document.getElementById("detalle-debilidad").textContent = p.debilidad;
  document.getElementById("detalle-resistencia").textContent = p.resistencia;
  document.getElementById("detalle-costo-retiro").textContent = p.costoRetiro;
  document.getElementById("detalle-ataque").textContent = p.ataque;
  document.getElementById("detalle-numero-carta").textContent = p.numeroCarta;

  // Eliminar elementos de edición del DOM
  const detalleContenedor = document.getElementById('detalle-pokemon');
  detalleContenedor.querySelector('#edit-nombre')?.remove();
  detalleContenedor.querySelector('#edit-tipo')?.remove();
  detalleContenedor.querySelector('#edit-hp')?.remove();
  detalleContenedor.querySelector('#edit-tipo-carta')?.remove();
  detalleContenedor.querySelector('#edit-debilidad')?.remove();
  detalleContenedor.querySelector('#edit-resistencia')?.remove();
  detalleContenedor.querySelector('#edit-costo-retiro')?.remove();
  detalleContenedor.querySelector('#edit-ataque')?.remove();
  detalleContenedor.querySelector('#edit-numero-carta')?.remove();

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