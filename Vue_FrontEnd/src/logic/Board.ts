import { Piece, PieceColor, PieceMask, ColorMask, PieceType } from "./PieceLogic";
import { useSquaresStore } from "@/stores/squares";

const PiecesFromFen: { [key: string]: number } = {
  "p": Piece.PawnB,
  "n": Piece.KnightB,
  "b": Piece.BishopB,
  "r": Piece.RookB,
  "q": Piece.QueenB,
  "k": Piece.KingB,

  "P": Piece.PawnW,
  "N": Piece.KnightW,
  "B": Piece.BishopW,
  "R": Piece.RookW,
  "Q": Piece.QueenW,
  "K": Piece.KingW
}

const mailbox: number[] = [
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1,  0,  1,  2,  3,  4,  5,  6,  7, -1,
  -1,  8,  9, 10, 11, 12, 13, 14, 15, -1,
  -1, 16, 17, 18, 19, 20, 21, 22, 23, -1,
  -1, 24, 25, 26, 27, 28, 29, 30, 31, -1,
  -1, 32, 33, 34, 35, 36, 37, 38, 39, -1,
  -1, 40, 41, 42, 43, 44, 45, 46, 47, -1,
  -1, 48, 49, 50, 51, 52, 53, 54, 55, -1,
  -1, 56, 57, 58, 59, 60, 61, 62, 63, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1
];

const mailbox64: number[] = [
  21, 22, 23, 24, 25, 26, 27, 28,
  31, 32, 33, 34, 35, 36, 37, 38,
  41, 42, 43, 44, 45, 46, 47, 48,
  51, 52, 53, 54, 55, 56, 57, 58,
  61, 62, 63, 64, 65, 66, 67, 68,
  71, 72, 73, 74, 75, 76, 77, 78,
  81, 82, 83, 84, 85, 86, 87, 88,
  91, 92, 93, 94, 95, 96, 97, 98
];

//                               caballo alfil torre reina rey
const slide: boolean[] = [ false, false, true, true, true, false ];

const offset: number[][] = [
    [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ -21, -19, -12, -8, 8, 12, 19, 21 ], //caballo
    [ -11, -9, 9, 11, 0, 0, 0, 0 ], //alfil
    [ -10, -1, 1, 10, 0, 0, 0, 0 ], //torre
    [ -11, -10, -9, -1, 1, 9, 10, 11 ], //reina
    [ -11, -10, -9, -1, 1, 9, 10, 11 ] //rey
];

/**
 * @description Clase que representa la logica del tablero de ajedrez ademas de almacenar los cuadros, es un singleton
 * @property {number[]} _squares - Array de numeros que representa los cuadrados, 0 representa un cadro vacio, un numero mayor representa toda la informacion de la pieza
 */
export class BoardLogic {
  private static _instance: BoardLogic
  // private _squares: number[]
  private _squares = useSquaresStore();

  private constructor() {
    return BoardLogic._instance
  }

  /**
   * @description Retorna la instancia del BoardLogic, si no existe la crea
   * @returns {BoardLogic} Retorna la instancia del BoardLogic
   */
  public static GetInstance(): BoardLogic {
    if (!BoardLogic._instance) {
      BoardLogic._instance = new BoardLogic()
    }
    return BoardLogic._instance
  }

  /**
   *
   * @description Carga la posicion del tablero desde una cadena FEN o en caso de no recibirla, carga la posicion inicial
   * @param {string?} fen - Cadena FEN que representa la posicion del tablero
   * @returns {void}
   */
  public LoadBoard( fen?: string): void {
    if (fen != undefined){
      this.LoadPsitionFromFen(fen)
    }
    else{
      const startFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -0 1";
      this.LoadPsitionFromFen(startFen)
    }
  }

  /**
   * @description Carga la posicion del tablero desde una cadena FEN
   * @param {string} fen - Cadena FEN que representa la posicion del tablero
   * @returns {void}
   */
  private LoadPsitionFromFen(fen: string): void {
    const boardString = fen.split(" ")[0]
    let file = 0, rank = 0;

    for (let i = 0; i<boardString.length; i++){
      const char = boardString[i]

      if (char == '/'){
        file = 0;
        rank++;
        continue;
      }
      else if (char >= '0' && char <= '9'){//es digito
        file += parseInt(char)
        continue;
      }
      else{
        const pos = rank * 8 + file;
        this._squares.setSquare(pos, PiecesFromFen[char])
        file++;
      }
    }
  }

}
