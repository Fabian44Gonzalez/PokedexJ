import { initFirebase } from "./firebase.js";
import { initTemaYNavegacion } from "./tema.js"; // Importamos la función
import { pokemon, renderizarPokemones, mostrarDetalle, editarPokemon, volverAMostrarDetalle, pokemonActual, setPokemonActual, convertirImagenABase64 } from "./pokemon.js";

document.addEventListener("DOMContentLoaded", async () => {
    // Inicializar Firebase
    const database = initFirebase();

    // 🔑 Inicializar tema y navegación
    const { mostrarMenu } = initTemaYNavegacion(); // ✅ Ahora sí se usa mostrarMenu

    // === 🔑 NUEVO: Lógica del filtro de Pokémon ===
    const selectFiltro = document.getElementById("filtro-pokemon");
    const listaPokemon = document.getElementById("lista-pokemon");
    const cargandoPokemon = document.getElementById("cargando-pokemon");

    // Aplicar filtro al cambiar la selección
    selectFiltro.addEventListener("change", () => {
        renderizarPokemones(listaPokemon, selectFiltro.value);
    });

    // === 🔑 NUEVO: Función para cargar y renderizar Pokémon con caché ===
    async function cargarYRenderizarPokemon() {
        try {
            // 1. Intentar mostrar caché inmediatamente
            const cache = localStorage.getItem("pokemon_cache");
            if (cache) {
                pokemon.length = 0;
                JSON.parse(cache).forEach(p => pokemon.push(p));
                renderizarConFiltro();
            }

            // 2. Cargar datos frescos de Firebase
            const snapshot = await database.ref("pokemon").once("value");
            pokemon.length = 0;
            snapshot.forEach(child => {
                const p = child.val();
                pokemon.push(p);
            });

            // 3. Si no hay datos en Firebase, usar pokemons.json
            if (pokemon.length === 0) {
                try {
                    const response = await fetch('pokemons.json');
                    const data = await response.json();
                    pokemon.push(...data);
                } catch (err) {
                    console.error("No se pudo cargar pokemons.json");
                }
            }

            // 4. Guardar en caché
            localStorage.setItem("pokemon_cache", JSON.stringify(pokemon));
            renderizarConFiltro();
        } catch (error) {
            console.error("Error al cargar los Pokémon:", error);
            // Si falla, usar pokemons.json
            pokemon.length = 0;
            try {
                const response = await fetch('pokemons.json');
                const data = await response.json();
                pokemon.push(...data);
                localStorage.setItem("pokemon_cache", JSON.stringify(pokemon));
                renderizarConFiltro();
            } catch (err) {
                console.error("No se pudo cargar pokemons.json");
            }
        }
    }

    // === 🔑 NUEVO: Función para mostrar el menú con estado de carga ===
    function mostrarMenuLocal() {
        // Ocultar otras pantallas
        document.getElementById("pantalla-inicial").style.display = "none";
        if (document.getElementById("detalle-pokemon")) {
            document.getElementById("detalle-pokemon").style.display = "none";
        }
        if (document.getElementById("nuevo-pokemon")) {
            document.getElementById("nuevo-pokemon").style.display = "none";
        }

        // Mostrar estado de carga y ocultar listas
        cargandoPokemon.style.display = "block";
        listaPokemon.innerHTML = ""; // Limpiar lista

        // Mostrar el menú
        document.getElementById("menu-pokemon").style.display = "block";

        // Cargar Pokémon en segundo plano
        cargarYRenderizarPokemon();
    }

    // Función para renderizar Pokémon Y aplicar el filtro actual
    const renderizarConFiltro = () => {
        renderizarPokemones(listaPokemon, selectFiltro.value);
        // Ocultar mensaje de carga
        cargandoPokemon.style.display = "none";
    };

    // === Referencias a elementos del DOM ===
    const pantallaInicial = document.getElementById("pantalla-inicial");
    const menuPokemon = document.getElementById("menu-pokemon");
    const detallePokemon = document.getElementById("detalle-pokemon");
    const pokemonDesbloqueados = document.getElementById("pokemon-desbloqueados");
    const pokemonBloqueados = document.getElementById("pokemon-bloqueados");
    const inputEntrenador1 = document.getElementById("entrenador1");
    const btnIniciar = document.getElementById("btn-iniciar");
    const btnVolverMenuDetalle = document.getElementById("btn-volver-menu");
    const btnVolverInicio = document.getElementById("btn-volver-inicio");
    const nuevoPokemon = document.getElementById("nuevo-pokemon");
    const btnVolverNuevo = document.getElementById("btn-volver-nuevo");
    const btnGuardarNuevo = document.getElementById("btn-guardar-nuevo");
    const inputNuevoNombre = document.getElementById("nuevo-nombre");
    const inputNuevoTipo = document.getElementById("nuevo-tipo");
    const inputNuevoHp = document.getElementById("nuevo-hp");
    const inputNuevoTipoCarta = document.getElementById("nuevo-tipo-carta");
    const inputNuevoDebilidad = document.getElementById("nuevo-debilidad");
    const inputNuevoResistencia = document.getElementById("nuevo-resistencia");
    const inputNuevoCostoRetiro = document.getElementById("nuevo-costo-retiro");
    const inputNuevoAtaque = document.getElementById("nuevo-ataque");
    const inputNuevoNumeroCarta = document.getElementById("nuevo-numero-carta");
    const inputNuevoDesbloqueado = document.getElementById("nuevo-desbloqueado");
    const inputNuevoImagen = document.getElementById("nuevo-imagen");

    // === Evento del botón "Ver Pokédex" ===
    if (btnIniciar) {
        btnIniciar.addEventListener("click", () => {
            // ✅ Usar la función mostrarMenu del tema
            mostrarMenu();
            // ✅ Cargar y renderizar Pokémon
            cargarYRenderizarPokemon();
        });
    } else {
        console.error("❌ Botón 'btn-iniciar' no encontrado en el DOM.");
    }

    // === Eventos de navegación ===
    btnVolverMenuDetalle.addEventListener("click", () => {
        detallePokemon.style.display = "none";
        menuPokemon.style.display = "block";
    });
    btnVolverInicio.addEventListener("click", () => {
        menuPokemon.style.display = "none";
        pantallaInicial.style.display = "block";
    });

    const btnAgregarPokemon = document.getElementById("btn-agregar-pokemon");
    btnAgregarPokemon.addEventListener("click", () => {
        menuPokemon.style.display = "none";
        nuevoPokemon.style.display = "block";
    });

    const btnEditarPokemon = document.getElementById("btn-editar-pokemon");
    btnEditarPokemon.addEventListener("click", () => {
        if (!pokemonActual) return;
        editarPokemon(pokemonActual);
    });

    btnVolverNuevo.addEventListener("click", () => {
        nuevoPokemon.style.display = "none";
        menuPokemon.style.display = "block";
    });

    // 🔑 Botón de guardar nuevo Pokémon (sin autenticación)
    btnGuardarNuevo.addEventListener("click", async () => {
        const nombre = inputNuevoNombre.value.trim();
        const tipo = inputNuevoTipo.value.trim();
        const hp = parseInt(inputNuevoHp.value) || 60; // Valor por defecto
        const tipoCarta = inputNuevoTipoCarta.value.trim() || "Pokémon Básico"; // Valor por defecto
        const debilidad = inputNuevoDebilidad.value.trim();
        const resistencia = inputNuevoResistencia.value.trim();
        const costoRetiro = inputNuevoCostoRetiro.value.trim() || "1 energía"; // Valor por defecto
        const ataque = inputNuevoAtaque.value.trim();
        const numeroCarta = inputNuevoNumeroCarta.value.trim() || "???/???"; // Valor por defecto
        const desbloqueado = inputNuevoDesbloqueado.checked;

        if (!nombre) { alert("El nombre del Pokémon es obligatorio."); return; }
        if (!tipo) { alert("El tipo del Pokémon es obligatorio."); return; }
        if (nombre.length > 50) { alert("El nombre no puede superar 50 caracteres."); return; }
        if (ataque.length > 100) { alert("El ataque no puede superar 100 caracteres."); return; }

        const prevText = btnGuardarNuevo.textContent;
        btnGuardarNuevo.textContent = "Guardando...";
        btnGuardarNuevo.disabled = true;
        btnGuardarNuevo.setAttribute("aria-busy", "true");

        try {
            const maxId = pokemon.length > 0 ? Math.max(...pokemon.map(p => Number(p.id) || 0)) : 0;
            const nuevoId = maxId + 1;
            let nuevoPokemonObj = {
                id: nuevoId,
                nombre,
                tipo,
                hp,
                tipoCarta,
                debilidad,
                resistencia,
                costoRetiro,
                ataque,
                numeroCarta,
                desbloqueado: !!desbloqueado,
                imagen: ""
            };

            const archivo = inputNuevoImagen.files[0];
            if (archivo) {
                const base64 = await convertirImagenABase64(archivo);
                nuevoPokemonObj.imagen = base64;
            }

            await database.ref("pokemon/" + nuevoId).set(nuevoPokemonObj);
            pokemon.push(nuevoPokemonObj);

            nuevoPokemon.style.display = "none";
            mostrarDetalle(nuevoId);
            limpiarCampos();
            // Actualizar caché y renderizar
            localStorage.setItem("pokemon_cache", JSON.stringify(pokemon));
            renderizarConFiltro(); // ✅ Solo renderizar, sin recargar desde Firebase
        } catch (error) {
            console.error("Error al guardar el nuevo Pokémon:", error);
            alert("Ocurrió un error al guardar el Pokémon. Inténtalo de nuevo.");
        } finally {
            btnGuardarNuevo.textContent = prevText;
            btnGuardarNuevo.disabled = false;
            btnGuardarNuevo.removeAttribute("aria-busy");
        }
    });

    // 🔑 Botón de guardar edición (sin autenticación)
    const btnGuardar = document.getElementById("btn-guardar-pokemon");
    btnGuardar.addEventListener("click", async () => {
        if (!pokemonActual) return;

        const nuevoNombre = document.getElementById("edit-nombre").value.trim();
        const nuevoTipo = document.getElementById("edit-tipo").value.trim();
        const nuevoHp = parseInt(document.getElementById("edit-hp").value);
        const nuevoTipoCarta = document.getElementById("edit-tipo-carta").value.trim();
        const nuevaDebilidad = document.getElementById("edit-debilidad").value.trim();
        const nuevaResistencia = document.getElementById("edit-resistencia").value.trim();
        const nuevoCostoRetiro = document.getElementById("edit-costo-retiro").value.trim();
        const nuevoAtaque = document.getElementById("edit-ataque").value.trim();
        const nuevoNumeroCarta = document.getElementById("edit-numero-carta").value.trim();

        if (!nuevoNombre) { alert("El nombre del Pokémon es obligatorio."); return; }
        if (!nuevoTipo) { alert("El tipo del Pokémon es obligatorio."); return; }
        if (isNaN(nuevoHp) || nuevoHp <= 0) { alert("El HP debe ser un número válido."); return; }
        if (nuevoNombre.length > 50) { alert("El nombre no puede superar 50 caracteres."); return; }
        if (nuevoAtaque.length > 100) { alert("El ataque no puede superar 100 caracteres."); return; }

        const prevText = btnGuardar.textContent;
        btnGuardar.textContent = "Guardando...";
        btnGuardar.disabled = true;
        btnGuardar.setAttribute("aria-busy", "true");

        try {
            pokemonActual.nombre = nuevoNombre;
            pokemonActual.tipo = nuevoTipo;
            pokemonActual.hp = nuevoHp;
            pokemonActual.tipoCarta = nuevoTipoCarta;
            pokemonActual.debilidad = nuevaDebilidad;
            pokemonActual.resistencia = nuevaResistencia;
            pokemonActual.costoRetiro = nuevoCostoRetiro;
            pokemonActual.ataque = nuevoAtaque;
            pokemonActual.numeroCarta = nuevoNumeroCarta;

            const inputEditImagen = document.getElementById("edit-imagen");
            const archivo = inputEditImagen.files[0];
            if (archivo) {
                const base64 = await convertirImagenABase64(archivo);
                pokemonActual.imagen = base64;
            }

            // ✅ Guardar en Firebase
            await database.ref("pokemon/" + pokemonActual.id).set(pokemonActual);

            // ✅ Actualizar caché local
            const indice = pokemon.findIndex(p => p.id === pokemonActual.id);
            if (indice !== -1) {
                pokemon[indice] = pokemonActual;
            }

            volverAMostrarDetalle(pokemonActual.id);
            // ✅ Actualizar caché y renderizar
            localStorage.setItem("pokemon_cache", JSON.stringify(pokemon));
            renderizarConFiltro(); // ✅ Solo renderizar, sin recargar desde Firebase
        } catch (error) {
            console.error("Error al guardar los cambios:", error);
            alert("Ocurrió un error al guardar los cambios. Inténtalo de nuevo.");
        } finally {
            btnGuardar.textContent = prevText;
            btnGuardar.disabled = false;
            btnGuardar.removeAttribute("aria-busy");
        }
    });

    // 🔑 Botón de eliminar Pokémon (sin autenticación)
    const btnEliminar = document.getElementById("btn-eliminar-pokemon");
    btnEliminar.addEventListener("click", async () => {
        if (!pokemonActual) return;

        if (confirm(`¿Estás seguro de que quieres eliminar a "${pokemonActual.nombre}"? Esta acción no se puede deshacer.`)) {
            const indice = pokemon.findIndex(p => p.id === pokemonActual.id);
            if (indice !== -1) {
                pokemon.splice(indice, 1); // ✅ Eliminar de la lista local
            }

            // ✅ Ahora 'await' es válido
            await database.ref("pokemon/" + pokemonActual.id).remove();

            // ✅ Actualizar caché y renderizar
            localStorage.setItem("pokemon_cache", JSON.stringify(pokemon));
            renderizarConFiltro(); // ✅ Volver a renderizar la lista

            // Volver al menú principal
            document.getElementById("detalle-pokemon").style.display = "none";
            document.getElementById("menu-pokemon").style.display = "block";
        }
    });

    const limpiarCampos = () => {
        inputNuevoNombre.value = "";
        inputNuevoTipo.value = "";
        inputNuevoHp.value = "60";
        inputNuevoTipoCarta.value = "Pokémon Básico";
        inputNuevoDebilidad.value = "";
        inputNuevoResistencia.value = "";
        inputNuevoCostoRetiro.value = "1 energía";
        inputNuevoAtaque.value = "";
        inputNuevoNumeroCarta.value = "";
        inputNuevoDesbloqueado.checked = false;
        inputNuevoImagen.value = "";
    };

    // Cargar Pokémon al inicio (con caché)
    cargarYRenderizarPokemon();
});