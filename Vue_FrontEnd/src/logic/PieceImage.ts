import pawnB from "@/assets/pawn-b.svg";
import knightB from "@/assets/knight-b.svg";
import bishopB from "@/assets/bishop-b.svg";
import rookB from "@/assets/rook-b.svg";
import queenB from "@/assets/queen-b.svg";
import kingB from "@/assets/king-b.svg";

import pawnW from "@/assets/pawn-w.svg";
import knightW from "@/assets/knight-w.svg";
import bishopW from "@/assets/bishop-w.svg";
import rookW from "@/assets/rook-w.svg";
import queenW from "@/assets/queen-w.svg";
import kingW from "@/assets/king-w.svg";

const Sources: { [key: number]: string } = {
  1: pawnB,
  2: knightB,
  3: bishopB,
  4: rookB,
  5: queenB,
  6: kingB,

  9: pawnW,
  10: knightW,
  11: bishopW,
  12: rookW,
  13: queenW,
  14: kingW,
};

export class PieceImage {
  private static _instance: PieceImage;
  private _sources: string[];

  private constructor() {
    this._sources = new Array(15).fill("");
    for (let i = 1; i < 15; i++) {
      this._sources[i] = Sources[i];
    }
  }

  public static GetInstance(): PieceImage {
    if (!PieceImage._instance) {
      PieceImage._instance = new PieceImage();
    }
    return PieceImage._instance;
  }

  public getSource(piece: number): string {
    return this._sources[piece];
  }
}
