// js/tema.js

/**
 * Inicializa la funcionalidad de cambio de tema y navegación entre pantallas.
 * 
 * - Gestiona 4 botones de cambio de tema (uno por pantalla).
 * - Alterna entre 4 temas diferentes (blanco/verde, gris/verde, negro/azul, blanco/azul).
 * - Proporciona una función para mostrar el menú principal de Pokémon.
 * 
 * @returns {{ mostrarMenu: Function }} Objeto con la función de navegación.
 */
export function initTemaYNavegacion() {
  // Referencias a los botones de cambio de tema en cada pantalla
  const btnTemaInicio = document.getElementById("btn-cambiar-tema");
  const btnTemaMenu = document.getElementById("btn-cambiar-tema-menu");
  const btnTemaDetalle = document.getElementById("btn-cambiar-tema-detalle");
  const btnTemaNuevo = document.getElementById("btn-cambiar-tema-nuevo");

  // Validar que los botones existan
  if (!btnTemaInicio) console.error("❌ Botón 'btn-cambiar-tema' no encontrado en pantalla inicial.");
  if (!btnTemaMenu) console.error("❌ Botón 'btn-cambiar-tema-menu' no encontrado en menú.");
  if (!btnTemaDetalle) console.error("❌ Botón 'btn-cambiar-tema-detalle' no encontrado en detalle.");
  if (!btnTemaNuevo) console.error("❌ Botón 'btn-cambiar-tema-nuevo' no encontrado en nueva carta.");

  // Array con los nombres de las clases de tema (ahora incluye el tema por defecto como clase vacía)
  const temas = ['', 'tema-verde-oscuro', 'tema-azul-oscuro', 'tema-azul-claro'];
  let indiceTemaActual = 0; // Índice del tema actual

  // Función para cambiar al siguiente tema
  const cambiarTema = () => {
    console.log("Cambiando tema...");
    console.log("Clases actuales:", document.body.classList);

    // Remover la clase del tema actual
    document.body.classList.remove(...temas.filter(t => t)); // ⬅️ Filtrar cadenas vacías

    // Avanzar al siguiente tema
    indiceTemaActual = (indiceTemaActual + 1) % temas.length;

    // Añadir la nueva clase de tema (si no es vacía)
    if (temas[indiceTemaActual]) {
      document.body.classList.add(temas[indiceTemaActual]);
      console.log("✅ Tema activado:", temas[indiceTemaActual]);
    } else {
      console.log("➡️ No se añadió ninguna clase (tema por defecto).");
    }
  };

  // Añadir evento de cambio de tema a cada botón (si existe)
  if (btnTemaInicio) {
    btnTemaInicio.addEventListener("click", cambiarTema);
    console.log("✅ Botón de tema en pantalla inicial añadido.");
  }
  if (btnTemaMenu) {
    btnTemaMenu.addEventListener("click", cambiarTema);
    console.log("✅ Botón de tema en menú añadido.");
  }
  if (btnTemaDetalle) {
    btnTemaDetalle.addEventListener("click", cambiarTema);
    console.log("✅ Botón de tema en detalle añadido.");
  }
  if (btnTemaNuevo) {
    btnTemaNuevo.addEventListener("click", cambiarTema);
    console.log("✅ Botón de tema en nueva carta añadido.");
  }

  /**
   * Muestra la pantalla del menú de Pokémon y oculta todas las demás.
   */
  function mostrarMenu() {
    // Ocultar todas las pantallas excepto el menú
    document.getElementById("pantalla-inicial").style.display = "none";
    if (document.getElementById("detalle-pokemon")) {
        document.getElementById("detalle-pokemon").style.display = "none";
    }
    if (document.getElementById("nuevo-pokemon")) {
        document.getElementById("nuevo-pokemon").style.display = "none";
    }
    document.getElementById("menu-pokemon").style.display = "block";
  }

  return { mostrarMenu };
}