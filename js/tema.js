// js/tema.js

/**
 * Inicializa la funcionalidad de cambio de tema y navegación entre pantallas.
 * 
 * - Gestiona 4 botones de cambio de tema (uno por pantalla).
 * - Alterna entre 4 temas diferentes (blanco/verde, negro/verde, negro/azul, blanco/azul).
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

  // Referencias a las secciones/pantallas
  const pantallaInicial = document.getElementById("pantalla-inicial");
  const menuPokemon = document.getElementById("menu-pokemon");
  const detallePokemon = document.getElementById("detalle-pokemon");
  const nuevoPokemon = document.getElementById("nuevo-pokemon");

  // Array con los nombres de las clases de tema
  const temas = ['', 'tema-verde-oscuro', 'tema-azul-oscuro', 'tema-azul-claro'];
  let indiceTemaActual = 0; // Índice del tema actual

  // Función para cambiar al siguiente tema
  const cambiarTema = () => {
    // Remover la clase del tema actual
    document.body.classList.remove(...temas);
    // Avanzar al siguiente tema
    indiceTemaActual = (indiceTemaActual + 1) % temas.length;
    // Añadir la nueva clase de tema
    if (temas[indiceTemaActual]) {
      document.body.classList.add(temas[indiceTemaActual]);
    }
  };

  // Añadir evento de cambio de tema a cada botón (si existe)
  if (btnTemaInicio) btnTemaInicio.addEventListener("click", cambiarTema);
  if (btnTemaMenu) btnTemaMenu.addEventListener("click", cambiarTema);
  if (btnTemaDetalle) btnTemaDetalle.addEventListener("click", cambiarTema);
  if (btnTemaNuevo) btnTemaNuevo.addEventListener("click", cambiarTema);

  /**
   * Muestra la pantalla del menú de Pokémon y oculta todas las demás.
   */
  function mostrarMenu() {
    // Ocultar todas las pantallas excepto el menú
    pantallaInicial.style.display = "none";
    if (detallePokemon) detallePokemon.style.display = "none";
    if (nuevoPokemon) nuevoPokemon.style.display = "none";
    menuPokemon.style.display = "block";
  }

  return { mostrarMenu };
}