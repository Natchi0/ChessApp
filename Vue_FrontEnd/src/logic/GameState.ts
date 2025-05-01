import { PieceColor } from "./PieceLogic"

enum EState {
  Menu,
  White,
  Black,
}

//singleton para el estado del juego
/**
 * @description Clase que representa el estado del juego, es un singleton
 * @property {EState} _state - Estado del juego, puede ser Menu, White o Black
 * @property {number} _turn - Turno del juego
 * @property {string} _actualFen - Representacion en FEN del estado actual del juego
 * @property {number | null} _enPessant - Casilla de en passant en caso de que exista
 * @property {number} _halfMoves - Numero de medio movimientos, usado para manejar la regla de los 50 movimientos
 * @property {boolean} _castleWK - Si el rey blanco puede enrocarse king side
 * @property {boolean} _castleWQ - Si el rey blanco puede enrocarse queen side
 * @property {boolean} _castleBK - Si el rey negro puede enrocarse king side
 * @property {boolean} _castleBQ - Si el rey negro puede enrocarse queen side
 */
export class GameState {
  private static _instance: GameState
  private _state: EState
  private _turn: number
  private _actualFen: string
  private _enPessant: number | null
  private _enPessantTargetColor: number | null
  private _halfMoves: number
  private _castleWK: boolean
  private _castleWQ: boolean
  private _castleBK: boolean
  private _castleBQ: boolean
  private _whiteInCheck: boolean
  private _blackInCheck: boolean

  private constructor() {
    this._state = EState.White
    this._turn = 0
    this._actualFen = ''
    this._enPessant = null
    this._enPessantTargetColor = null
    this._halfMoves = 0
    this._castleWK = true
    this._castleWQ = true
    this._castleBK = true
    this._castleBQ = true
    this._whiteInCheck = false
    this._blackInCheck = false
  }

  //retorno la instancia del GameState
  public static GetInstance(): GameState {
    if (!GameState._instance) {
      GameState._instance = new GameState()
    }
    return GameState._instance
  }

  /**
   * @description Cambia el turno del juego, alternando entre blanco y negro,
   * tambien actualiza el estado actual del fen
   */
  public ChangeTurn(): void {
    this._turn++
    this._state = this._state === EState.White ? EState.Black : EState.White
    //instance.actualFern = getActualFern()
  }

  //getters y setters
  public get state(): number {
    //retorno el estado convertido a color
    if (this._state === EState.White) {
      return PieceColor.White
    }
    else if (this._state === EState.Black) {
      return PieceColor.Black
    }
    else {
      return -1
    }
  }

  public set state(value: EState) {
    this._state = value
  }

  public get turn(): number {
    return this._turn
  }

  public set turn(value: number) {
    this._turn = value
  }

  public get actualFen(): string {
    return this._actualFen
  }

  public set actualFen(value: string) {
    this._actualFen = value
  }

  public get enPessant(): number | null {
    return this._enPessant
  }

  public set enPessant(value: number | null) {
    this._enPessant = value
  }

  public get enPessantTargetColor(): number | null {
    return this._enPessantTargetColor
  }

  public set enPessantTargetColor(value: number | null) {
    this._enPessantTargetColor = value
  }

  public get halfMoves(): number {
    return this._halfMoves
  }

  public set halfMoves(value: number) {
    this._halfMoves = value
  }

  public get castleWK(): boolean {
    return this._castleWK
  }

  public set castleWK(value: boolean) {
    this._castleWK = value
  }

  public get castleWQ(): boolean {
    return this._castleWQ
  }

  public set castleWQ(value: boolean) {
    this._castleWQ = value
  }

  public get castleBK(): boolean {
    return this._castleBK
  }

  public set castleBK(value: boolean) {
    this._castleBK = value
  }

  public get castleBQ(): boolean {
    return this._castleBQ
  }

  public set castleBQ(value: boolean) {
    this._castleBQ = value
  }

  public get whiteInCheck(): boolean {
    return this._whiteInCheck
  }

  public set whiteInCheck(value: boolean) {
    this._whiteInCheck = value
  }

  public get blackInCheck(): boolean {
    return this._blackInCheck
  }

  public set blackInCheck(value: boolean) {
    this._blackInCheck = value
  }
}
