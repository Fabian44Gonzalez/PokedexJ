// js/tema.js

/**
 * Inicializa la funcionalidad de cambio de tema y navegación entre pantallas.
 * 
 * - Gestiona 4 botones de cambio de tema (uno por pantalla).
 * - Alterna el tema oscuro mediante la clase "op2" en el <body>.
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

  /**
   * Alterna entre el tema claro (por defecto) y el tema oscuro (clase "op2").
   * 
   * El tema claro se define en :root (CSS), y el oscuro en body.op2.
   * Solo se necesita gestionar la presencia/ausencia de "op2".
   */
  const toggleTema = () => {
    document.body.classList.toggle("op2");
  };

  // Añadir evento de cambio de tema a cada botón (si existe)
  if (btnTemaInicio) btnTemaInicio.addEventListener("click", toggleTema);
  if (btnTemaMenu) btnTemaMenu.addEventListener("click", toggleTema);
  if (btnTemaDetalle) btnTemaDetalle.addEventListener("click", toggleTema);
  if (btnTemaNuevo) btnTemaNuevo.addEventListener("click", toggleTema);

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