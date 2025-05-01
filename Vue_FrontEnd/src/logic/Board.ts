import { GameState as GameStateClass } from "./GameState";
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
  private _squares = useSquaresStore()

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
  public LoadBoard(fen?: string): void {
    this._squares.setSquares(new Array(64).fill(0))
    if (fen != undefined) {
      this.LoadPsitionFromFen(fen)
    } else {
      const startFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -0 1'
      this.LoadPsitionFromFen(startFen)
    }
  }

  /**
   * @description Carga la posicion del tablero desde una cadena FEN
   * @param {string} fen - Cadena FEN que representa la posicion del tablero
   * @returns {void}
   */
  private LoadPsitionFromFen(fen: string): void {
    const boardString = fen.split(' ')[0]
    let file = 0,
      rank = 0

    for (let i = 0; i < boardString.length; i++) {
      const char = boardString[i]

      if (char == '/') {
        file = 0
        rank++
        continue
      } else if (char >= '0' && char <= '9') {
        //es digito
        file += parseInt(char)
        continue
      } else {
        const pos = rank * 8 + file
        this._squares.setSquare(pos, PiecesFromFen[char])
        file++
      }
    }
  }

  public HandlePieceMovement(actualIndex: number, newIndex: number): void {
    console.log("HandlePieceMovement", actualIndex, newIndex)
    const GameState = GameStateClass.GetInstance()
    const squares: number[] = this._squares.getSquares()

    //chequeo que la pieza seleccionada sea del color correspondiente
    const pieceCode: number = squares[actualIndex]
    const pieceColor: number = pieceCode & ColorMask
    const pieceType: number = pieceCode & PieceMask
    const ColorEnemigo: number = pieceColor == PieceColor.White ? PieceColor.Black : PieceColor.White
    let possibleEnPassant: number | null = null
    let isOnLastRank: boolean | null = null

    // if(pieceColor != GameState.turn){
    //   throw new Error("No es el turno de la pieza seleccionada")
    // }

    //chequear que la nueva posicion sea válida
    console.log("validMove ", this.ValidMoveCheck(actualIndex, newIndex))
    if (!this.ValidMoveCheck(actualIndex, newIndex)) {
      console.log("Movimiento invalido")
      return;
    }

    //verifico no haber llegado a los 50 movimientos
    if (GameState.halfMoves >= 50) {
      throw new Error("Se ha llegado a los 50 movimientos sin capturas ni movimientos de peones")
    }

    //verifico que el movimiento no deje al rey en jaque
    if (this.CheckChecker(pieceColor, actualIndex, newIndex, pieceType)) {
      throw new Error("El movimiento deja al rey en jaque")
    }

    /**
     * A PARTIR DE ESTE PUNTO EL MOVIMIENTO ES VALIDO
     */

    //la posicion es valida, primero verifico en caso de que sea un peon para validar los movimientos en passant
    if (pieceType == PieceType.Pawn){
      //verifico que se esté intentando capturar en passant
      if(newIndex == GameState.enPessant){
        //captura en passant
        squares[newIndex + (pieceColor == PieceColor.White ? 8 : -8)] = 0
      }

      //verifico si está moviendo dos casillas
      if (Math.abs(actualIndex - newIndex) == 16) {
        possibleEnPassant = newIndex + (pieceColor == PieceColor.White ? 8 : -8)
      }

      //el peon llega a la ultima fila
      isOnLastRank = (pieceColor == PieceColor.White && newIndex >= 0 && newIndex <= 7) ||
                      (pieceColor == PieceColor.Black && newIndex >= 56 && newIndex <= 63);
    }
    //setear el en passant
    GameState.enPessant = possibleEnPassant

    //manejo los enroques en funcion aparte
    this.CastlingManager(pieceType, pieceColor, actualIndex, newIndex)

    //MUEVO LA PIEZA
    squares[newIndex] = squares[actualIndex]
    squares[actualIndex] = 0

    //en caso de capturar una pieza o mover un peon, actualizo los movimientos
    if(squares[newIndex] != 0 || pieceType == PieceType.Pawn){
      GameState.halfMoves = 0
    }
    else{
      GameState.halfMoves++
    }

    if (isOnLastRank) {
      //promocion de peon
      //TODO: hacer un popup para elegir la pieza
      squares[newIndex] = pieceColor | PieceType.Queen
    }

    //verifico el jaque
    //color es el color del rey que puede estar en jaque, si blanco acaba de mover entonces color negro
    if(this.CheckChecker(ColorEnemigo)){
      //chequeo si es jaque mate
      if(this.MateChecker(ColorEnemigo)){
        //TODO: hacer un popup para mostrar el jaque mate
        console.log("JAQUE MATE")
      }

      //si no es jaque mate, aviso que hay jaque
      if(ColorEnemigo == PieceColor.White){
        if(!GameState.whiteInCheck){
          console.log("JAQUE BLANCO")
        }
        GameState.whiteInCheck = true
      }
      else{
        if(!GameState.blackInCheck){
          console.log("JAQUE NEGRO")
        }
        GameState.blackInCheck = true
      }
    }
    else{
      if(pieceColor == PieceColor.White){
        GameState.whiteInCheck = false
      }
      else{
        GameState.blackInCheck = false
      }
    }

    console.log("squares", squares)
    //actualizo el store de squares
    console.log("store squares", this._squares.getSquares())
    this._squares.setSquares(squares)
    console.log("store squares2", this._squares.getSquares())

    //cambio el turno
    GameState.ChangeTurn();
  }

  //se le puede pasar un array de squares para chequear o en su defecto se chequea el array de squares original
  public GetPossiblePieceMovements(
    square: number,
    squaresSource: number[] | null = null,
    withCastle: boolean = false,
  ): number[] {
    //si squaresSource es null, se usa el array de squares original
    squaresSource ??= this._squares.getSquares()

    const pieceCode: number = squaresSource[square]
    const pieceType: number = pieceCode & PieceMask
    const pieceColor: number = pieceCode & ColorMask

    if (pieceType == PieceType.Pawn) {
      //los movimientos del peon son muy particular, lo muevo a otra funcion para que quede mas limpio
      return this.GetPossiblePawnMovements(square, pieceColor, squaresSource)
    }

    const possibleMovements: number[] = []
    const moves: number[] = offset[pieceType - 1] //resto uno ya que las piezas empiezan en 1

    const valPos64 = mailbox64[square]

    for (const move of moves) {
      let aux: number = valPos64 + move
      let targetPosition: number = mailbox[aux]

      if (targetPosition == -1)
        //posicion fuera del tablero
        continue

      if (slide[pieceType - 1]) {
        while (
          targetPosition != -1 &&
          (squaresSource[targetPosition] == 0 ||
            (squaresSource[targetPosition] & ColorMask) != pieceColor)
        ) {
          possibleMovements.push(targetPosition)

          if (squaresSource[targetPosition] != 0)
            //si hay una pieza en la posición destino me voy despues de agregarla
            break

          aux += move
          targetPosition = mailbox[aux]
        }
      } else {
        if (
          squaresSource[targetPosition] == 0 ||
          (squaresSource[targetPosition] & ColorMask) != pieceColor
        ) {
          possibleMovements.push(targetPosition)
        }
      }
    }

    if (pieceType == PieceType.King && withCastle) {
      const castlingMoves: number[] = this.GetCastlingMoves(pieceColor)

      possibleMovements.push(...castlingMoves)
    }

    return possibleMovements
  }

  private GetPossiblePawnMovements(
    square: number,
    pieceColor: number,
    squaresSource: number[],
  ): number[] {
    const GameState = GameStateClass.GetInstance()

    const possibleMovements: number[] = []
    const colorMultiplier: number = pieceColor == PieceColor.White ? -1 : 1 //asigno todos los valores y multiplico segun el color de la pieza

    const oneStep: number = 10 * colorMultiplier
    const leftCapture: number = 9 * colorMultiplier
    const rightCapture: number = 11 * colorMultiplier

    const valPos64: number = mailbox64[square]

    const oneStepIndex: number = valPos64 + oneStep
    const oneStepTarget: number = mailbox[oneStepIndex]
    const canAdvanceOne: boolean = oneStepTarget != -1 && squaresSource[oneStepTarget] == 0

    if (canAdvanceOne) {
      possibleMovements.push(oneStepTarget)

      //movimiento de 2 casillas si está en la fila inicial
      const isOnStartRank: boolean =
        (pieceColor == PieceColor.White && square >= 48 && square <= 55) ||
        (pieceColor == PieceColor.Black && square >= 8 && square <= 15)

      if (isOnStartRank) {
        const twoStep: number = 20 * colorMultiplier
        const twoStepIndex: number = valPos64 + twoStep
        const twoStepTarget: number = mailbox[twoStepIndex]

        if (twoStepTarget != -1 && squaresSource[twoStepTarget] == 0) {
          possibleMovements.push(twoStepTarget)
        }
      }
    }

    //chequeo las capturas
    [leftCapture, rightCapture].forEach((capture) => {
      const captureIndex: number = valPos64 + capture
      const captureTarget: number = mailbox[captureIndex]

      if (
        captureTarget != -1 &&
        ((squaresSource[captureTarget] != 0 &&
          (squaresSource[captureTarget] & ColorMask) != pieceColor) ||
          captureTarget == GameState.enPessant)
      ) {
        possibleMovements.push(captureTarget)
      }
    })
    console.log("possibleMovements", possibleMovements)
    return possibleMovements
  }

  private GetAttackedSquares(pieceColor: number, squaresSource?: number[] | null): number[] {
    squaresSource ??= this._squares.getSquares()
    const attackedSquares: number[] = []

    for (let i = 0; i < 64; i++) {
      if (squaresSource[i] != 0 && (squaresSource[i] & ColorMask) == pieceColor) {
        const moves = this.GetPossiblePieceMovements(i, squaresSource)
        for (const move of moves) {
          attackedSquares.push(move)
        }
      }
    }

    return attackedSquares
  }

  private GetCastlingMoves(pieceColor: number): number[] {
    const GameState = GameStateClass.GetInstance()
    const squares = this._squares.getSquares()

    const castlingMoves: number[] = []
    const colorEnemigo: number =
      pieceColor == PieceColor.White ? PieceColor.Black : PieceColor.White

    //preocuputar los ataques enemigos
    const enemyAttackedSquares: number[] = this.GetAttackedSquares(colorEnemigo)

    if (pieceColor == PieceColor.White && !GameState.whiteInCheck) {
      //la pieza es blanca
      if (GameState.castleWK) {
        //verifico el enroque corto
        const isValid =
          squares[64] == (PieceColor.White | PieceType.Rook) &&
          squares[61] == 0 &&
          squares[62] == 0 &&
          !enemyAttackedSquares.includes(61) &&
          !enemyAttackedSquares.includes(62)

        if (isValid) castlingMoves.push(62)
      }
      if (GameState.castleWQ) {
        //verifico el enroque largo
        const isValid =
          squares[56] == (PieceColor.White | PieceType.Rook) &&
          squares[57] == 0 &&
          squares[58] == 0 &&
          squares[59] == 0 &&
          !enemyAttackedSquares.includes(57) &&
          !enemyAttackedSquares.includes(58) &&
          !enemyAttackedSquares.includes(59)

        if (isValid) castlingMoves.push(58)
      }
    } else if (pieceColor == PieceColor.Black && !GameState.blackInCheck) {
      //la pieza es negra
      if (GameState.castleBK) {
        //verifico el enroque corto
        const isValid =
          squares[7] == (PieceColor.Black | PieceType.Rook) &&
          squares[5] == 0 &&
          squares[6] == 0 &&
          !enemyAttackedSquares.includes(5) &&
          !enemyAttackedSquares.includes(6)

        if (isValid) castlingMoves.push(6)
      }
      if (GameState.castleBQ) {
        //verifico el enroque largo
        const isValid =
          squares[0] == (PieceColor.Black | PieceType.Rook) &&
          squares[1] == 0 &&
          squares[2] == 0 &&
          squares[3] == 0 &&
          !enemyAttackedSquares.includes(1) &&
          !enemyAttackedSquares.includes(2) &&
          !enemyAttackedSquares.includes(3)

        if (isValid) castlingMoves.push(2)
      }
    }
    return castlingMoves
  }

  private ValidMoveCheck(actualIndex: number, newIndex: number): boolean {
    const moves: number[] = this.GetPossiblePieceMovements(actualIndex);
    for (const move of moves) {
      if (move == newIndex) {
        console.log("valid move")
        return true;
      }
    }
    return false;
  }

  private CastlingManager(pieceType: number, pieceColor: number, actualIndex: number, newIndex: number): void {
    const GameState = GameStateClass.GetInstance()
    const squares: number[] = this._squares.getSquares()

    //Desactivo los enrroques segun corresponda
    if (pieceType == PieceType.King || pieceType == PieceType.Rook) {
      //verifico si se movió el rey o la torre
      if (pieceType == PieceType.King) {
        if (pieceColor == PieceColor.White) {
          if (GameState.castleWK && newIndex == 62) {
            //enrroque KingSide, muevo la torre
            squares[63] = 0
            squares[61] = PieceColor.White | PieceType.Rook
          } else if (GameState.castleWQ && newIndex == 58) {
            squares[56] = 0
            squares[59] = PieceColor.White | PieceType.Rook
          }

          GameState.castleWK = false
          GameState.castleWQ = false
        } else {
          if (GameState.castleBK && newIndex == 6) {
            squares[7] = 0
            squares[5] = PieceColor.Black | PieceType.Rook
          } else if (GameState.castleBQ && newIndex == 2) {
            squares[0] = 0
            squares[3] = PieceColor.Black | PieceType.Rook
          }

          GameState.castleBK = false
          GameState.castleBQ = false
        }
      } else {
        if (pieceColor == PieceColor.White) {
          if (actualIndex == 56) {
            GameState.castleWQ = false
          } else if (actualIndex == 63) {
            GameState.castleWK = false
          }
        } else {
          if (actualIndex == 0) {
            GameState.castleBQ = false
          } else if (actualIndex == 7) {
            GameState.castleBK = false
          }
        }
      }
    }
  }

  //color es el color del rey a chequear
  private CheckChecker(color: number, actualIndex: number | null = null, newIndex: number | null = null, pieceType: number | null = null): boolean {
    const squares: number[] = this._squares.getSquares()
    const GameState = GameStateClass.GetInstance()

    let squaresAux: number[]
    const colorEnemigo: number = color == PieceColor.White ? PieceColor.Black : PieceColor.White

    //en caso de que el movimiento no haya sido hecho lo imito en un aux
    if (actualIndex != null && newIndex != null) {
      squaresAux = [...squares]

      //imito el movimiento
      squaresAux[newIndex] = squaresAux[actualIndex]
      squaresAux[actualIndex] = 0

      if (pieceType == PieceType.Pawn) {
        //verifico que se esté intentando campturar en passant
        if (newIndex == GameState.enPessant) {
          //captura en passant
          squaresAux[newIndex + (color == PieceColor.White ? 8 : -8)] = 0
        }
      }
    } else {
      squaresAux = squares
    }

    //recorrer todos los cuadros
    for (let i = 0; i < 64; i++) {
      //si no esta vacio
      if (squaresAux[i] != 0 && (squaresAux[i] & ColorMask) == colorEnemigo) {
        //obtener los posibles movimientos de la pieza
        const moves: number[] = this.GetPossiblePieceMovements(i, squaresAux)

        //recorrer todos los posibles movimientos
        for (const move of moves) {
          //si alguno de los movimientos corresponde al rey del color buscado
          if (squaresAux[move] == (color | PieceType.King)) {
            return true
          }
        }
      }
    }
    return false
  }

  private MateChecker(color: number): boolean {
    const squares: number[] = this._squares.getSquares()
    //recorrer todos los cuadros
    for (let i = 0; i < 64; i++) {
      //si no esta vacio
      if (squares[i] != 0 && (squares[i] & ColorMask) == color) {
        //obtener los posibles movimientos de la pieza
        const moves: number[] = this.GetPossiblePieceMovements(i)
        //recorrer todos los posibles movimientos
        for (const move of moves) {
          if (!this.CheckChecker(color, i, move)) {
            return false
          }
        }
      }
    }
    return true
  }
}
