import { defineStore } from "pinia";
import { ref } from "vue";

/**
 *
 * @description Store para manejar el estado de los cuadrados, cada casilla del arreglo representa un cuadro
 * en el tablero de ajedrez. 0 representa un cadro vacio, un numero mayor representa toda la informacion de la pieza
 *
 */
export const useSquaresStore = defineStore("squares", () => {
  const squares = ref<number[]>([64]);
  const gameId = ref<number | null>(null);

  //Inicializar el array de squares en 0
  for (let i = 0; i < 64; i++) {
    squares.value[i] = 0;
  }

  /**
   * @description Setea el array de squares
   * @param squaresArray Array de numeros que representa los cuadrados
   */
  function setSquares(squaresArray: number[]) {
    squares.value = squaresArray;
  }

  /**
   * @description Retorna el array de squares
   * @returns Array de numeros que representa los cuadrados
   */
  function getSquares() {
    return squares.value;
  }

  /**
   * @description Retorna el valor de un cuadrado
   * @param index Indice del cuadrado
   * @returns Valor del cuadrado
   */
  function getSquare(index: number) {
    return squares.value[index];
  }

  /**
   * @description Setea el valor de un cuadrado
   * @param index Indice del cuadrado
   * @param value Valor del cuadrado
   */
  function setSquare(index: number, value: number) {
    squares.value[index] = value;
  }

  function setGameId(id: number) {
    gameId.value = id;
  }
  function getGameId() {
    return gameId.value;
  }


  return { squares, setSquares, getSquares, getSquare, setSquare, setGameId, getGameId };
});
