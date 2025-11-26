import { initFirebase } from "./firebase.js";
import { initTemaYNavegacion } from "./tema.js"; // Importamos la función
import { pokemon, renderizarPokemones, mostrarDetalle, editarPokemon, volverAMostrarDetalle, pokemonActual, setPokemonActual, convertirImagenABase64 } from "./pokemon.js";

document.addEventListener("DOMContentLoaded", async () => {
    // Inicializar Firebase
    const database = initFirebase();

    // 🔑 Inicializar tema y navegación
    const { mostrarMenu } = initTemaYNavegacion(); // Guardamos la función mostrarMenu

    // 🔑 Referencias para login secreto (ahora no se usan)
    const loginSecreto = document.getElementById("login-secreto");
    const btnLogin = document.getElementById("btn-login");
    const btnLogout = document.getElementById("btn-logout");
    const emailInput = document.getElementById("login-email");
    const passwordInput = document.getElementById("login-password");

    // 🔑 Ocultar login secreto permanentemente
    loginSecreto.style.display = "none";

    // 🔑 Mostrar login al presionar 'L' (solo escritorio)
    document.addEventListener("keydown", (e) => {
        if (e.key === "l" || e.key === "L") {
            alert("Sistema de login desactivado.");
        }
    });

    // 🔑 Login secreto por toque (móvil): 5 toques en el título
    let toques = 0;
    let ultimoToque = 0;
    const titulo = document.querySelector("header h1");
    if (titulo) {
        titulo.addEventListener("click", () => {
            const ahora = Date.now();
            if (ahora - ultimoToque < 500) {
                toques++;
            } else {
                toques = 1;
            }
            ultimoToque = ahora;

            if (toques >= 5) {
                alert("Sistema de login desactivado.");
                toques = 0;
            }
        });
    }

    // === 🔑 NUEVO: Lógica del filtro de Pokémon ===
    const selectFiltro = document.getElementById("filtro-pokemon");
    const seccionDesbloqueados = document.getElementById("seccion-desbloqueados");
    const seccionBloqueados = document.getElementById("seccion-bloqueados");
    const cargandoPokemon = document.getElementById("cargando-pokemon");

    // Aplicar filtro al cambiar la selección
    selectFiltro.addEventListener("change", () => {
        const valor = selectFiltro.value;
        if (valor === "todos") {
            seccionDesbloqueados.style.display = "block";
            seccionBloqueados.style.display = "block";
        } else if (valor === "desbloqueados") {
            seccionDesbloqueados.style.display = "block";
            seccionBloqueados.style.display = "none";
        } else if (valor === "bloqueados") {
            seccionDesbloqueados.style.display = "none";
            seccionBloqueados.style.display = "block";
        }
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
            
            // 3. Guardar en caché
            localStorage.setItem("pokemon_cache", JSON.stringify(pokemon));
            renderizarConFiltro();
        } catch (error) {
            console.error("Error al cargar los Pokémon:", error);
            cargandoPokemon.textContent = "Error al cargar. ¿Estás conectado a internet?";
            cargandoPokemon.style.display = "block";
            // Ocultar listas en caso de error
            seccionDesbloqueados.style.display = "none";
            seccionBloqueados.style.display = "none";
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
        seccionDesbloqueados.style.display = "none";
        seccionBloqueados.style.display = "none";

        // Mostrar el menú
        document.getElementById("menu-pokemon").style.display = "block";

        // Cargar Pokémon en segundo plano
        cargarYRenderizarPokemon();
    }

    // Función para renderizar Pokémon Y aplicar el filtro actual
    const renderizarConFiltro = () => {
        renderizarPokemones(pokemonDesbloqueados, pokemonBloqueados);
        const valor = selectFiltro.value;
        if (valor === "todos") {
            seccionDesbloqueados.style.display = "block";
            seccionBloqueados.style.display = "block";
        } else if (valor === "desbloqueados") {
            seccionDesbloqueados.style.display = "block";
            seccionBloqueados.style.display = "none";
        } else if (valor === "bloqueados") {
            seccionDesbloqueados.style.display = "none";
            seccionBloqueados.style.display = "block";
        }
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
    const inputNuevaDescripcion = document.getElementById("nueva-descripcion");
    const inputNuevoDesbloqueado = document.getElementById("nuevo-desbloqueado");
    const inputNuevoImagen = document.getElementById("nuevo-imagen");

    // 🔑 Botón de guardar nuevo Pokémon (sin autenticación)
    btnGuardarNuevo.addEventListener("click", async () => {
        const nombre = inputNuevoNombre.value.trim();
        const tipo = inputNuevoTipo.value.trim();
        const descripcion = inputNuevaDescripcion.value.trim();
        const desbloqueado = inputNuevoDesbloqueado.checked;

        if (!nombre) { alert("El nombre del Pokémon es obligatorio."); return; }
        if (!tipo) { alert("El tipo del Pokémon es obligatorio."); return; }
        if (nombre.length > 50) { alert("El nombre no puede superar 50 caracteres."); return; }
        if (descripcion.length > 200) { alert("La descripción no puede superar 200 caracteres."); return; }

        const prevText = btnGuardarNuevo.textContent;
        btnGuardarNuevo.textContent = "Guardando...";
        btnGuardarNuevo.disabled = true;
        btnGuardarNuevo.setAttribute("aria-busy", "true");

        try {
            const maxId = pokemon.length > 0 ? Math.max(...pokemon.map(p => Number(p.id) || 0)) : 0;
            const nuevoId = maxId + 1;
            let nuevoPokemonObj = { id: nuevoId, nombre, tipo, descripcion: descripcion || "Sin descripción", desbloqueado: !!desbloqueado, nivel: 0 };

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
            cargarYRenderizarPokemon(); // Recargar para reflejar cambios
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
        const nuevaDescripcion = document.getElementById("edit-descripcion").value.trim();
        const desbloqueado = document.getElementById("edit-desbloqueado").checked;
        const contNivel = document.getElementById("detalle-nivel");
        const nuevoNivel = Number(contNivel?.dataset?.valor || 0);

        if (!nuevoNombre) { alert("El nombre del Pokémon es obligatorio."); return; }
        if (!nuevoTipo) { alert("El tipo del Pokémon es obligatorio."); return; }
        if (nuevoNombre.length > 50) { alert("El nombre no puede superar 50 caracteres."); return; }
        if (nuevaDescripcion.length > 200) { alert("La descripción no puede superar 200 caracteres."); return; }

        const prevText = btnGuardar.textContent;
        btnGuardar.textContent = "Guardando...";
        btnGuardar.disabled = true;
        btnGuardar.setAttribute("aria-busy", "true");

        try {
            pokemonActual.nombre = nuevoNombre;
            pokemonActual.tipo = nuevoTipo;
            pokemonActual.descripcion = nuevaDescripcion || "Sin descripción";
            pokemonActual.desbloqueado = desbloqueado;
            pokemonActual.nivel = nuevoNivel;

            const inputEditImagen = document.getElementById("edit-imagen");
            const archivo = inputEditImagen.files[0];
            if (archivo) {
                const base64 = await convertirImagenABase64(archivo);
                pokemonActual.imagen = base64;
            }

            await database.ref("pokemon/" + pokemonActual.id).set(pokemonActual);
            volverAMostrarDetalle(pokemonActual.id);
            // Actualizar caché y renderizar
            localStorage.setItem("pokemon_cache", JSON.stringify(pokemon));
            cargarYRenderizarPokemon(); // Recargar para reflejar cambios
        } catch (error) {
            console.error("Error al guardar los cambios:", error);
            alert("Ocurrió un error al guardar los cambios. Inténtalo de nuevo.");
        } finally {
            btnGuardar.textContent = prevText;
            btnGuardar.disabled = false;
            btnGuardar.removeAttribute("aria-busy");
        }
    });

    // Resto de event listeners (usando mostrarMenuLocal)
    btnIniciar.addEventListener("click", () => {
        mostrarMenuLocal(); // ✅ Usa la nueva función
    });

    btnVolverMenuDetalle.addEventListener("click", () => {
        mostrarMenuLocal(); // ✅ Usa la nueva función
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
        mostrarMenuLocal(); // ✅ Usa la nueva función
    });

    const limpiarCampos = () => {
        inputNuevoNombre.value = "";
        inputNuevoTipo.value = "";
        inputNuevaDescripcion.value = "";
        inputNuevoDesbloqueado.checked = false;
        inputNuevoImagen.value = "";
    };

    // Cargar Pokémon al inicio (con caché)
    cargarYRenderizarPokemon();
});