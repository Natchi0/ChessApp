/*
  const whiteKnight = PieceColor.White | PieceType.Knight; -> 2 | 8 = 10
*/

//enumeracion del tipo de pieza
export enum PieceType{
  None = 0,
  Pawn = 1,
  Knight = 2,
  Bishop = 3,
  Rook = 4,
  Queen = 5,
  King = 6
}

//mascara para extraer tipo y color
export const PieceMask = 7;
export const ColorMask = 8;

//colores
export enum PieceColor {
  Black = 0<<3, //0
  White = 1<<3  //8
}

export enum Piece {
  None = 0,
  PawnB = PieceColor.Black | PieceType.Pawn,
  KnightB = PieceColor.Black | PieceType.Knight,
  BishopB = PieceColor.Black | PieceType.Bishop,
  RookB = PieceColor.Black | PieceType.Rook,
  QueenB = PieceColor.Black | PieceType.Queen,
  KingB = PieceColor.Black | PieceType.King,

  PawnW = PieceColor.White | PieceType.Pawn,
  KnightW = PieceColor.White | PieceType.Knight,
  BishopW = PieceColor.White | PieceType.Bishop,
  RookW = PieceColor.White | PieceType.Rook,
  QueenW = PieceColor.White | PieceType.Queen,
  KingW = PieceColor.White | PieceType.King
}
