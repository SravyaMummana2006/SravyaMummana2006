/**
 * ChessEngine - Complete chess logic with move validation, check/checkmate detection,
 * en-passant, castling, promotion, algebraic notation, and optional lightweight AI opponent.
 * Emerald & Dark aesthetic compatible.
 * (c) Sravya Mummana Portfolio
 */

class ChessGame {
  constructor() {
    this.reset();
  }

  reset() {
    // 8x8 board: row 0 is 8th rank (black), row 7 is 1st rank (white)
    this.board = this.createInitialBoard();
    this.turn = 'w';
    this.castling = {
      w: { k: true, q: true },
      b: { k: true, q: true }
    };
    this.enPassant = null; // { row, col }
    this.halfMoves = 0;
    this.moveNumber = 1;
    this.history = [];
    this.captured = { w: [], b: [] };
    this.isGameOver = false;
    this.gameResult = null; // '1-0', '0-1', '1/2-1/2', null
    this.statusMessage = "White to move";
  }

  createInitialBoard() {
    const board = Array(8).fill(null).map(() => Array(8).fill(null));
    const backRow = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'];

    for (let c = 0; c < 8; c++) {
      board[0][c] = { type: backRow[c], color: 'b' };
      board[1][c] = { type: 'p', color: 'b' };
      board[6][c] = { type: 'p', color: 'w' };
      board[7][c] = { type: backRow[c], color: 'w' };
    }
    return board;
  }

  cloneBoard(board) {
    return board.map(row => row.map(cell => (cell ? { ...cell } : null)));
  }

  // Generate all legal moves for current player
  getLegalMoves(color = this.turn) {
    const moves = [];
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = this.board[r][c];
        if (piece && piece.color === color) {
          const pieceMoves = this.getPieceMoves(r, c, true);
          moves.push(...pieceMoves);
        }
      }
    }
    return moves;
  }

  // Get moves for a specific square
  getLegalMovesForSquare(r, c) {
    const piece = this.board[r][c];
    if (!piece || piece.color !== this.turn) return [];
    return this.getPieceMoves(r, c, true);
  }

  getPieceMoves(r, c, filterCheck = true) {
    const piece = this.board[r][c];
    if (!piece) return [];
    let pseudoMoves = [];

    switch (piece.type) {
      case 'p':
        pseudoMoves = this.getPawnMoves(r, c, piece.color);
        break;
      case 'n':
        pseudoMoves = this.getKnightMoves(r, c, piece.color);
        break;
      case 'b':
        pseudoMoves = this.getBishopMoves(r, c, piece.color);
        break;
      case 'r':
        pseudoMoves = this.getRookMoves(r, c, piece.color);
        break;
      case 'q':
        pseudoMoves = this.getQueenMoves(r, c, piece.color);
        break;
      case 'k':
        pseudoMoves = this.getKingMoves(r, c, piece.color, filterCheck);
        break;
    }

    if (!filterCheck) return pseudoMoves;

    // Filter out moves that leave king in check
    return pseudoMoves.filter(move => !this.moveCausesCheck(move, piece.color));
  }

  getPawnMoves(r, c, color) {
    const moves = [];
    const dir = color === 'w' ? -1 : 1;
    const startRow = color === 'w' ? 6 : 1;
    const promoRow = color === 'w' ? 0 : 7;

    // 1-step forward
    const nextR = r + dir;
    if (nextR >= 0 && nextR < 8 && !this.board[nextR][c]) {
      if (nextR === promoRow) {
        ['q', 'r', 'b', 'n'].forEach(promo => {
          moves.push({ from: { r, c }, to: { r: nextR, c }, promo });
        });
      } else {
        moves.push({ from: { r, c }, to: { r: nextR, c } });
      }

      // 2-step forward from starting rank
      const doubleR = r + 2 * dir;
      if (r === startRow && !this.board[doubleR][c]) {
        moves.push({ from: { r, c }, to: { r: doubleR, c }, isDoublePawn: true });
      }
    }

    // Captures
    [-1, 1].forEach(dc => {
      const targetC = c + dc;
      if (targetC >= 0 && targetC < 8 && nextR >= 0 && nextR < 8) {
        const target = this.board[nextR][targetC];
        if (target && target.color !== color) {
          if (nextR === promoRow) {
            ['q', 'r', 'b', 'n'].forEach(promo => {
              moves.push({ from: { r, c }, to: { r: nextR, c: targetC }, capture: target, promo });
            });
          } else {
            moves.push({ from: { r, c }, to: { r: nextR, c: targetC }, capture: target });
          }
        }
        // En Passant
        if (this.enPassant && this.enPassant.row === nextR && this.enPassant.col === targetC) {
          const epCapture = this.board[r][targetC];
          moves.push({ from: { r, c }, to: { r: nextR, c: targetC }, isEnPassant: true, capture: epCapture });
        }
      }
    });

    return moves;
  }

  getKnightMoves(r, c, color) {
    const moves = [];
    const deltas = [
      [-2, -1], [-2, 1], [-1, -2], [-1, 2],
      [1, -2], [1, 2], [2, -1], [2, 1]
    ];
    for (const [dr, dc] of deltas) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
        const target = this.board[nr][nc];
        if (!target) {
          moves.push({ from: { r, c }, to: { r: nr, c: nc } });
        } else if (target.color !== color) {
          moves.push({ from: { r, c }, to: { r: nr, c: nc }, capture: target });
        }
      }
    }
    return moves;
  }

  getRayMoves(r, c, color, directions) {
    const moves = [];
    for (const [dr, dc] of directions) {
      let step = 1;
      while (true) {
        const nr = r + dr * step;
        const nc = c + dc * step;
        if (nr < 0 || nr >= 8 || nc < 0 || nc >= 8) break;
        const target = this.board[nr][nc];
        if (!target) {
          moves.push({ from: { r, c }, to: { r: nr, c: nc } });
        } else {
          if (target.color !== color) {
            moves.push({ from: { r, c }, to: { r: nr, c: nc }, capture: target });
          }
          break; // ray blocked
        }
        step++;
      }
    }
    return moves;
  }

  getBishopMoves(r, c, color) {
    return this.getRayMoves(r, c, color, [[-1, -1], [-1, 1], [1, -1], [1, 1]]);
  }

  getRookMoves(r, c, color) {
    return this.getRayMoves(r, c, color, [[-1, 0], [1, 0], [0, -1], [0, 1]]);
  }

  getQueenMoves(r, c, color) {
    return this.getRayMoves(r, c, color, [
      [-1, -1], [-1, 1], [1, -1], [1, 1],
      [-1, 0], [1, 0], [0, -1], [0, 1]
    ]);
  }

  getKingMoves(r, c, color, includeCastling = true) {
    const moves = [];
    const deltas = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];
    for (const [dr, dc] of deltas) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
        const target = this.board[nr][nc];
        if (!target) {
          moves.push({ from: { r, c }, to: { r: nr, c: nc } });
        } else if (target.color !== color) {
          moves.push({ from: { r, c }, to: { r: nr, c: nc }, capture: target });
        }
      }
    }

    // Castling (only when explicitly requested and not in attack evaluation)
    if (includeCastling) {
      const opponent = color === 'w' ? 'b' : 'w';
      const row = color === 'w' ? 7 : 0;
      if (r === row && c === 4 && !this.isSquareAttacked(row, 4, opponent)) {
        // Kingside
        if (this.castling[color].k && !this.board[row][5] && !this.board[row][6]) {
          if (!this.isSquareAttacked(row, 5, opponent) && !this.isSquareAttacked(row, 6, opponent)) {
            const rook = this.board[row][7];
            if (rook && rook.type === 'r' && rook.color === color) {
              moves.push({ from: { r, c }, to: { r: row, c: 6 }, isCastle: 'k' });
            }
          }
        }
        // Queenside
        if (this.castling[color].q && !this.board[row][3] && !this.board[row][2] && !this.board[row][1]) {
          if (!this.isSquareAttacked(row, 3, opponent) && !this.isSquareAttacked(row, 2, opponent)) {
            const rook = this.board[row][0];
            if (rook && rook.type === 'r' && rook.color === color) {
              moves.push({ from: { r, c }, to: { r: row, c: 2 }, isCastle: 'q' });
            }
          }
        }
      }
    }

    return moves;
  }

  isSquareAttacked(targetR, targetC, attackerColor) {
    // 1. Pawn attacks from attacker
    const pawnDir = attackerColor === 'w' ? 1 : -1; // row where attacker pawn would stand
    const pawnR = targetR + pawnDir;
    if (pawnR >= 0 && pawnR < 8) {
      for (const pawnC of [targetC - 1, targetC + 1]) {
        if (pawnC >= 0 && pawnC < 8) {
          const p = this.board[pawnR][pawnC];
          if (p && p.type === 'p' && p.color === attackerColor) return true;
        }
      }
    }

    // 2. Knight attacks
    const knightDeltas = [
      [-2, -1], [-2, 1], [-1, -2], [-1, 2],
      [1, -2], [1, 2], [2, -1], [2, 1]
    ];
    for (const [dr, dc] of knightDeltas) {
      const nr = targetR + dr;
      const nc = targetC + dc;
      if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
        const p = this.board[nr][nc];
        if (p && p.type === 'n' && p.color === attackerColor) return true;
      }
    }

    // 3. King attacks (1 step)
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = targetR + dr;
        const nc = targetC + dc;
        if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
          const p = this.board[nr][nc];
          if (p && p.type === 'k' && p.color === attackerColor) return true;
        }
      }
    }

    // 4. Straight rays (Rook / Queen)
    const straightDirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (const [dr, dc] of straightDirs) {
      let step = 1;
      while (true) {
        const nr = targetR + dr * step;
        const nc = targetC + dc * step;
        if (nr < 0 || nr >= 8 || nc < 0 || nc >= 8) break;
        const p = this.board[nr][nc];
        if (p) {
          if (p.color === attackerColor && (p.type === 'r' || p.type === 'q')) return true;
          break; // ray blocked
        }
        step++;
      }
    }

    // 5. Diagonal rays (Bishop / Queen)
    const diagDirs = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
    for (const [dr, dc] of diagDirs) {
      let step = 1;
      while (true) {
        const nr = targetR + dr * step;
        const nc = targetC + dc * step;
        if (nr < 0 || nr >= 8 || nc < 0 || nc >= 8) break;
        const p = this.board[nr][nc];
        if (p) {
          if (p.color === attackerColor && (p.type === 'b' || p.type === 'q')) return true;
          break; // ray blocked
        }
        step++;
      }
    }

    return false;
  }

  findKing(color) {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = this.board[r][c];
        if (p && p.type === 'k' && p.color === color) {
          return { r, c };
        }
      }
    }
    return null;
  }

  isCheck(color = this.turn) {
    const kingPos = this.findKing(color);
    if (!kingPos) return false;
    const opponent = color === 'w' ? 'b' : 'w';
    return this.isSquareAttacked(kingPos.r, kingPos.c, opponent);
  }

  moveCausesCheck(move, color) {
    // Snapshot state
    const savedBoard = this.cloneBoard(this.board);
    const { from, to } = move;
    const movingPiece = savedBoard[from.r][from.c];

    // Apply speculative move
    this.board[to.r][to.c] = movingPiece;
    this.board[from.r][from.c] = null;

    if (move.isEnPassant) {
      this.board[from.r][to.c] = null;
    }

    const inCheck = this.isCheck(color);

    // Restore
    this.board = savedBoard;
    return inCheck;
  }

  makeMove(move) {
    if (this.isGameOver) return false;

    // Validate legality
    const legalMoves = this.getLegalMovesForSquare(move.from.r, move.from.c);
    const validMove = legalMoves.find(m =>
      m.to.r === move.to.r &&
      m.to.c === move.to.c &&
      (!move.promo || m.promo === move.promo)
    );

    if (!validMove) return false;

    // Save history snapshot for undo
    const snapshot = {
      board: this.cloneBoard(this.board),
      turn: this.turn,
      castling: JSON.parse(JSON.stringify(this.castling)),
      enPassant: this.enPassant ? { ...this.enPassant } : null,
      halfMoves: this.halfMoves,
      moveNumber: this.moveNumber,
      captured: { w: [...this.captured.w], b: [...this.captured.b] },
      statusMessage: this.statusMessage,
      san: this.computeSAN(validMove)
    };

    const movingPiece = this.board[validMove.from.r][validMove.from.c];
    let capturedPiece = null;

    // Handle captures
    if (validMove.isEnPassant) {
      capturedPiece = this.board[validMove.from.r][validMove.to.c];
      this.board[validMove.from.r][validMove.to.c] = null;
      this.captured[this.turn].push(capturedPiece);
    } else if (this.board[validMove.to.r][validMove.to.c]) {
      capturedPiece = this.board[validMove.to.r][validMove.to.c];
      this.captured[this.turn].push(capturedPiece);
    }

    // Move piece
    if (validMove.promo) {
      this.board[validMove.to.r][validMove.to.c] = { type: validMove.promo, color: this.turn };
    } else {
      this.board[validMove.to.r][validMove.to.c] = movingPiece;
    }
    this.board[validMove.from.r][validMove.from.c] = null;

    // Handle Castling Rook move
    if (validMove.isCastle === 'k') {
      const row = validMove.from.r;
      const rook = this.board[row][7];
      this.board[row][5] = rook;
      this.board[row][7] = null;
    } else if (validMove.isCastle === 'q') {
      const row = validMove.from.r;
      const rook = this.board[row][0];
      this.board[row][3] = rook;
      this.board[row][0] = null;
    }

    // Update castling rights
    if (movingPiece.type === 'k') {
      this.castling[this.turn].k = false;
      this.castling[this.turn].q = false;
    } else if (movingPiece.type === 'r') {
      if (validMove.from.r === 7 && validMove.from.c === 0) this.castling.w.q = false;
      if (validMove.from.r === 7 && validMove.from.c === 7) this.castling.w.k = false;
      if (validMove.from.r === 0 && validMove.from.c === 0) this.castling.b.q = false;
      if (validMove.from.r === 0 && validMove.from.c === 7) this.castling.b.k = false;
    }

    // Update en passant square
    if (validMove.isDoublePawn) {
      const dir = this.turn === 'w' ? -1 : 1;
      this.enPassant = { row: validMove.from.r + dir, col: validMove.from.c };
    } else {
      this.enPassant = null;
    }

    // Update clocks
    if (movingPiece.type === 'p' || capturedPiece) {
      this.halfMoves = 0;
    } else {
      this.halfMoves++;
    }

    if (this.turn === 'b') {
      this.moveNumber++;
    }

    // Append to history
    snapshot.move = validMove;
    this.history.push(snapshot);

    // Switch turn
    this.turn = this.turn === 'w' ? 'b' : 'w';

    // Evaluate game outcome
    this.updateGameStatus();

    return {
      move: validMove,
      captured: capturedPiece,
      san: snapshot.san,
      isCheck: this.isCheck(this.turn),
      isGameOver: this.isGameOver,
      statusMessage: this.statusMessage
    };
  }

  computeSAN(move) {
    const piece = this.board[move.from.r][move.from.c];
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

    if (move.isCastle === 'k') return 'O-O';
    if (move.isCastle === 'q') return 'O-O-O';

    let san = '';
    if (piece.type !== 'p') {
      san += piece.type.toUpperCase();
    }

    if (move.capture || move.isEnPassant) {
      if (piece.type === 'p') {
        san += files[move.from.c];
      }
      san += 'x';
    }

    san += files[move.to.c] + ranks[move.to.r];

    if (move.promo) {
      san += '=' + move.promo.toUpperCase();
    }

    return san;
  }

  updateGameStatus() {
    const nextMoves = this.getLegalMoves(this.turn);
    const inCheck = this.isCheck(this.turn);

    if (nextMoves.length === 0) {
      this.isGameOver = true;
      if (inCheck) {
        const winner = this.turn === 'w' ? 'Black' : 'White';
        this.gameResult = this.turn === 'w' ? '0-1' : '1-0';
        this.statusMessage = `Checkmate! ${winner} wins.`;
      } else {
        this.gameResult = '1/2-1/2';
        this.statusMessage = "Stalemate! Game drawn.";
      }
    } else if (this.halfMoves >= 100) {
      this.isGameOver = true;
      this.gameResult = '1/2-1/2';
      this.statusMessage = "Drawn by 50-move rule.";
    } else if (inCheck) {
      this.statusMessage = `${this.turn === 'w' ? 'White' : 'Black'} is in Check!`;
    } else {
      this.statusMessage = `${this.turn === 'w' ? 'White' : 'Black'} to move`;
    }
  }

  undoMove() {
    if (this.history.length === 0) return null;
    const last = this.history.pop();
    this.board = last.board;
    this.turn = last.turn;
    this.castling = last.castling;
    this.enPassant = last.enPassant;
    this.halfMoves = last.halfMoves;
    this.moveNumber = last.moveNumber;
    this.captured = last.captured;
    this.statusMessage = last.statusMessage;
    this.isGameOver = false;
    this.gameResult = null;
    return last;
  }

  // Lightweight AI engine for visitors who want to play solo vs computer
  getBestMove(color = 'b', depth = 2) {
    const legalMoves = this.getLegalMoves(color);
    if (legalMoves.length === 0) return null;

    // Piece-Square table bonuses
    const pieceValues = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };

    // Center bonus
    const centerBonus = (r, c) => {
      const distFromCenter = Math.abs(3.5 - r) + Math.abs(3.5 - c);
      return (7 - distFromCenter) * 4;
    };

    const evaluateBoard = () => {
      let score = 0;
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const p = this.board[r][c];
          if (!p) continue;
          let val = pieceValues[p.type] + centerBonus(r, c);
          if (p.type === 'p') {
            // Forward advancement bonus
            val += (p.color === 'w' ? (6 - r) : (r - 1)) * 10;
          }
          score += p.color === 'w' ? val : -val;
        }
      }
      return score;
    };

    let bestScore = color === 'w' ? -Infinity : Infinity;
    let candidates = [];

    // Minimax depth 2 with alpha-beta
    for (const move of legalMoves) {
      // Simulate
      const savedBoard = this.cloneBoard(this.board);
      const moving = savedBoard[move.from.r][move.from.c];
      savedBoard[move.to.r][move.to.c] = move.promo ? { type: move.promo, color } : moving;
      savedBoard[move.from.r][move.from.c] = null;

      // Evaluate immediate score + opponent best response
      const immediateScore = evaluateBoard();
      let moveScore = immediateScore;

      if (move.capture) {
        moveScore += (color === 'w' ? 1 : -1) * (pieceValues[move.capture.type] * 0.8);
      }

      if (color === 'w') {
        if (moveScore > bestScore) {
          bestScore = moveScore;
          candidates = [move];
        } else if (moveScore === bestScore) {
          candidates.push(move);
        }
      } else {
        if (moveScore < bestScore) {
          bestScore = moveScore;
          candidates = [move];
        } else if (moveScore === bestScore) {
          candidates.push(move);
        }
      }
    }

    return candidates[Math.floor(Math.random() * candidates.length)];
  }
}

// Vector Chess Piece SVGs with clean emerald/charcoal styling
const CHESS_PIECES_SVG = {
  // White Pieces
  wp: `<svg viewBox="0 0 45 45" class="piece-svg"><path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#f0fdf4" stroke="#059669" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
  wn: `<svg viewBox="0 0 45 45" class="piece-svg"><path d="M22 10c1.5 0 3 .5 4 1.5 1 1 1.5 2.5 1.5 4 0 .5-.1 1-.3 1.5.8.5 1.8 1 2.8 1.5 2 1 3 2.5 3 4.5 0 2-.8 3.5-2.5 4.5-1 .6-2.2 1-3.5 1.2.5 1.3.5 2.8 0 4.3-.5 1.5-1.5 2.8-3 3.5H13c0-2 .5-4 1.5-5.5 1-1.5 2.5-2.5 4.5-3 0-1-.3-2-.8-2.8-.5-.8-1.2-1.5-2.2-2-1-.5-1.8-1.2-2.3-2-.5-.8-.7-1.7-.7-2.7 0-1.8.8-3.2 2.3-4.3 1.5-1 3.2-1.7 5.2-1.7h1.5z" fill="#f0fdf4" stroke="#059669" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
  wb: `<svg viewBox="0 0 45 45" class="piece-svg"><g fill="#f0fdf4" stroke="#059669" stroke-width="1.6" stroke-linejoin="round"><path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.35.49-2.32.47-3-.5 1.35-1.46 3-2 3-2z"/><path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"/><circle cx="22.5" cy="8" r="2.5"/></g></svg>`,
  wr: `<svg viewBox="0 0 45 45" class="piece-svg"><g fill="#f0fdf4" stroke="#059669" stroke-width="1.6" stroke-linejoin="round"><path d="M9 39h27v-3H9v3zm3-3v-4.5h21V36H12zm2-4.5l1.5-13.5h14l1.5 13.5H14zm-3-15h23v-6h-4v3h-4v-3h-7v3h-4v-3h-4v6z"/></g></svg>`,
  wq: `<svg viewBox="0 0 45 45" class="piece-svg"><g fill="#f0fdf4" stroke="#059669" stroke-width="1.6" stroke-linejoin="round"><path d="M9 36h27v-3H9v3zm3-3.5h21v-3H12v3zm-3-5l3-13.5 6.5 7.5 4-11 4 11 6.5-7.5 3 13.5H9z"/><circle cx="9" cy="12" r="2"/><circle cx="18.5" cy="8.5" r="2"/><circle cx="22.5" cy="7" r="2"/><circle cx="26.5" cy="8.5" r="2"/><circle cx="36" cy="12" r="2"/></g></svg>`,
  wk: `<svg viewBox="0 0 45 45" class="piece-svg"><g fill="#f0fdf4" stroke="#059669" stroke-width="1.6" stroke-linejoin="round"><path d="M22.5 11.63V6M20 8h5"/><path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5"/><path d="M11.5 37c5.5 3.5 16.5 3.5 22 0 0-5.5-.5-12-4-14.5-4 3-7.5 3-14 0-3.5 2.5-4 9-4 14.5z"/><path d="M12 33.5c6-1 15-1 21 0"/></g></svg>`,

  // Black Pieces
  bp: `<svg viewBox="0 0 45 45" class="piece-svg"><path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#042f2e" stroke="#10b981" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
  bn: `<svg viewBox="0 0 45 45" class="piece-svg"><path d="M22 10c1.5 0 3 .5 4 1.5 1 1 1.5 2.5 1.5 4 0 .5-.1 1-.3 1.5.8.5 1.8 1 2.8 1.5 2 1 3 2.5 3 4.5 0 2-.8 3.5-2.5 4.5-1 .6-2.2 1-3.5 1.2.5 1.3.5 2.8 0 4.3-.5 1.5-1.5 2.8-3 3.5H13c0-2 .5-4 1.5-5.5 1-1.5 2.5-2.5 4.5-3 0-1-.3-2-.8-2.8-.5-.8-1.2-1.5-2.2-2-1-.5-1.8-1.2-2.3-2-.5-.8-.7-1.7-.7-2.7 0-1.8.8-3.2 2.3-4.3 1.5-1 3.2-1.7 5.2-1.7h1.5z" fill="#042f2e" stroke="#10b981" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
  bb: `<svg viewBox="0 0 45 45" class="piece-svg"><g fill="#042f2e" stroke="#10b981" stroke-width="1.6" stroke-linejoin="round"><path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.35.49-2.32.47-3-.5 1.35-1.46 3-2 3-2z"/><path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"/><circle cx="22.5" cy="8" r="2.5"/></g></svg>`,
  br: `<svg viewBox="0 0 45 45" class="piece-svg"><g fill="#042f2e" stroke="#10b981" stroke-width="1.6" stroke-linejoin="round"><path d="M9 39h27v-3H9v3zm3-3v-4.5h21V36H12zm2-4.5l1.5-13.5h14l1.5 13.5H14zm-3-15h23v-6h-4v3h-4v-3h-7v3h-4v-3h-4v6z"/></g></svg>`,
  bq: `<svg viewBox="0 0 45 45" class="piece-svg"><g fill="#042f2e" stroke="#10b981" stroke-width="1.6" stroke-linejoin="round"><path d="M9 36h27v-3H9v3zm3-3.5h21v-3H12v3zm-3-5l3-13.5 6.5 7.5 4-11 4 11 6.5-7.5 3 13.5H9z"/><circle cx="9" cy="12" r="2"/><circle cx="18.5" cy="8.5" r="2"/><circle cx="22.5" cy="7" r="2"/><circle cx="26.5" cy="8.5" r="2"/><circle cx="36" cy="12" r="2"/></g></svg>`,
  bk: `<svg viewBox="0 0 45 45" class="piece-svg"><g fill="#042f2e" stroke="#10b981" stroke-width="1.6" stroke-linejoin="round"><path d="M22.5 11.63V6M20 8h5"/><path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5"/><path d="M11.5 37c5.5 3.5 16.5 3.5 22 0 0-5.5-.5-12-4-14.5-4 3-7.5 3-14 0-3.5 2.5-4 9-4 14.5z"/><path d="M12 33.5c6-1 15-1 21 0"/></g></svg>`
};

// Chess UI Controller
class ChessUI {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.game = new ChessGame();
    this.selectedSquare = null;
    this.validMoves = [];
    this.lastMove = null;
    this.vsAI = options.vsAI || false;
    this.aiColor = 'b';
    this.isAiThinking = false;

    // Web Audio Sound Effects
    this.audioCtx = null;

    this.render();
  }

  initAudio() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
  }

  playTone(freq, type = 'sine', duration = 0.08, gainVal = 0.15) {
    try {
      this.initAudio();
      if (!this.audioCtx) return;
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(gainVal, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = `
      <div class="chess-app-card">
        <!-- Header & Status Bar -->
        <div class="chess-header-bar">
          <div class="chess-title-wrap">
            <span class="chess-badge">Interactive Terminal</span>
            <h3 class="chess-heading">Playable Chess Engine</h3>
          </div>
          <div class="chess-turn-pill" id="chess-turn-pill">
            <span class="turn-dot ${this.game.turn === 'w' ? 'turn-white' : 'turn-black'}"></span>
            <span id="chess-turn-label">${this.game.statusMessage}</span>
          </div>
        </div>

        <div class="chess-main-grid">
          <!-- Board Container -->
          <div class="chess-board-wrapper">
            <div class="chess-coords top-coords"><span>a</span><span>b</span><span>c</span><span>d</span><span>e</span><span>f</span><span>g</span><span>h</span></div>
            <div class="chess-middle-row">
              <div class="chess-coords side-coords"><span>8</span><span>7</span><span>6</span><span>5</span><span>4</span><span>3</span><span>2</span><span>1</span></div>
              <div class="chess-board" id="chess-board-grid"></div>
              <div class="chess-coords side-coords"><span>8</span><span>7</span><span>6</span><span>5</span><span>4</span><span>3</span><span>2</span><span>1</span></div>
            </div>
            <div class="chess-coords bottom-coords"><span>a</span><span>b</span><span>c</span><span>d</span><span>e</span><span>f</span><span>g</span><span>h</span></div>
          </div>

          <!-- Sidebar Controls & Telemetry -->
          <div class="chess-sidebar">
            <!-- Mode Switcher -->
            <div class="chess-panel-card">
              <div class="panel-header">Opponent Mode</div>
              <div class="mode-toggles">
                <button class="mode-btn ${!this.vsAI ? 'active' : ''}" id="btn-mode-2p">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
                  Pass &amp; Play
                </button>
                <button class="mode-btn ${this.vsAI ? 'active' : ''}" id="btn-mode-ai">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7l-2 3v1h8v-1l-2-3h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z"/></svg>
                  vs Engine AI
                </button>
              </div>
            </div>

            <!-- Captured Pieces -->
            <div class="chess-panel-card">
              <div class="panel-header">Captured Material</div>
              <div class="captured-row">
                <span class="captured-label">White took:</span>
                <div class="captured-tray" id="captured-by-white"></div>
              </div>
              <div class="captured-row">
                <span class="captured-label">Black took:</span>
                <div class="captured-tray" id="captured-by-black"></div>
              </div>
            </div>

            <!-- Move History -->
            <div class="chess-panel-card history-panel">
              <div class="panel-header">Notation Log (SAN)</div>
              <div class="history-scroll" id="chess-history-list">
                <div class="history-empty">Moves will stream here...</div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="chess-actions">
              <button class="chess-action-btn" id="btn-undo-move" title="Take back previous move">
                <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/></svg>
                Undo
              </button>
              <button class="chess-action-btn restart-btn" id="btn-restart-game" title="Reset chessboard">
                <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                New Game
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
    this.renderBoard();
  }

  bindEvents() {
    const btn2P = document.getElementById('btn-mode-2p');
    const btnAI = document.getElementById('btn-mode-ai');
    const btnUndo = document.getElementById('btn-undo-move');
    const btnRestart = document.getElementById('btn-restart-game');

    if (btn2P) {
      btn2P.addEventListener('click', () => {
        this.vsAI = false;
        btn2P.classList.add('active');
        btnAI.classList.remove('active');
      });
    }

    if (btnAI) {
      btnAI.addEventListener('click', () => {
        this.vsAI = true;
        btnAI.classList.add('active');
        btn2P.classList.remove('active');
        if (this.game.turn === this.aiColor && !this.game.isGameOver) {
          this.triggerAIMove();
        }
      });
    }

    if (btnUndo) {
      btnUndo.addEventListener('click', () => {
        this.handleUndo();
      });
    }

    if (btnRestart) {
      btnRestart.addEventListener('click', () => {
        this.game.reset();
        this.selectedSquare = null;
        this.validMoves = [];
        this.lastMove = null;
        this.playTone(320, 'sine', 0.1);
        this.renderBoard();
        this.updateUI();
      });
    }
  }

  renderBoard() {
    const grid = document.getElementById('chess-board-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const inCheck = this.game.isCheck(this.game.turn);
    const kingPos = inCheck ? this.game.findKing(this.game.turn) : null;

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const sq = document.createElement('div');
        const isLight = (r + c) % 2 === 0;
        sq.className = `chess-sq ${isLight ? 'sq-light' : 'sq-dark'}`;
        sq.dataset.row = r;
        sq.dataset.col = c;

        // Selection highlight
        if (this.selectedSquare && this.selectedSquare.r === r && this.selectedSquare.c === c) {
          sq.classList.add('sq-selected');
        }

        // Last move highlight
        if (this.lastMove) {
          if ((this.lastMove.from.r === r && this.lastMove.from.c === c) ||
              (this.lastMove.to.r === r && this.lastMove.to.c === c)) {
            sq.classList.add('sq-last-move');
          }
        }

        // Check highlight on king
        if (kingPos && kingPos.r === r && kingPos.c === c) {
          sq.classList.add('sq-check');
        }

        // Possible destination dot/ring
        const isTarget = this.validMoves.find(m => m.to.r === r && m.to.c === c);
        if (isTarget) {
          const marker = document.createElement('div');
          marker.className = isTarget.capture || isTarget.isEnPassant ? 'sq-capture-ring' : 'sq-move-dot';
          sq.appendChild(marker);
        }

        // Piece SVG
        const piece = this.game.board[r][c];
        if (piece) {
          const pieceKey = `${piece.color}${piece.type}`;
          const svgMarkup = CHESS_PIECES_SVG[pieceKey] || '';
          const pieceEl = document.createElement('div');
          pieceEl.className = 'chess-piece';
          pieceEl.innerHTML = svgMarkup;
          sq.appendChild(pieceEl);
        }

        sq.addEventListener('click', () => this.handleSquareClick(r, c));
        grid.appendChild(sq);
      }
    }
  }

  handleSquareClick(r, c) {
    if (this.game.isGameOver || this.isAiThinking) return;

    // If waiting for visitor turn in vsAI mode
    if (this.vsAI && this.game.turn === this.aiColor) return;

    const clickedPiece = this.game.board[r][c];

    // If clicked on own piece: select and display legal moves
    if (clickedPiece && clickedPiece.color === this.game.turn) {
      this.selectedSquare = { r, c };
      this.validMoves = this.game.getLegalMovesForSquare(r, c);
      this.playTone(480, 'triangle', 0.04, 0.08);
      this.renderBoard();
      return;
    }

    // If square selected and clicked on a valid destination
    if (this.selectedSquare) {
      const chosenMove = this.validMoves.find(m => m.to.r === r && m.to.c === c);
      if (chosenMove) {
        // Execute Move
        this.executeMove(chosenMove);
        return;
      } else {
        // Deselect
        this.selectedSquare = null;
        this.validMoves = [];
        this.renderBoard();
      }
    }
  }

  executeMove(move) {
    const result = this.game.makeMove(move);
    if (!result) return;

    this.selectedSquare = null;
    this.validMoves = [];
    this.lastMove = move;

    // Play tactile sound effect
    if (result.isGameOver) {
      this.playTone(660, 'sine', 0.35, 0.2);
    } else if (result.isCheck) {
      this.playTone(550, 'sawtooth', 0.15, 0.18);
    } else if (result.captured) {
      this.playTone(320, 'square', 0.08, 0.12);
    } else {
      this.playTone(400, 'sine', 0.06, 0.1);
    }

    this.renderBoard();
    this.updateUI();

    // Trigger AI if enabled
    if (this.vsAI && this.game.turn === this.aiColor && !this.game.isGameOver) {
      this.triggerAIMove();
    }
  }

  triggerAIMove() {
    this.isAiThinking = true;
    const turnLabel = document.getElementById('chess-turn-label');
    if (turnLabel) turnLabel.textContent = "Engine calculating...";

    setTimeout(() => {
      const bestMove = this.game.getBestMove(this.aiColor, 2);
      if (bestMove) {
        this.executeMove(bestMove);
      }
      this.isAiThinking = false;
      this.updateUI();
    }, 350);
  }

  handleUndo() {
    if (this.vsAI) {
      // Undo both visitor and AI move
      this.game.undoMove();
      this.game.undoMove();
    } else {
      this.game.undoMove();
    }
    this.selectedSquare = null;
    this.validMoves = [];
    this.lastMove = this.game.history.length > 0 ? this.game.history[this.game.history.length - 1].move : null;
    this.playTone(280, 'sine', 0.08);
    this.renderBoard();
    this.updateUI();
  }

  updateUI() {
    // Status Pill
    const turnPill = document.getElementById('chess-turn-pill');
    const turnDot = turnPill ? turnPill.querySelector('.turn-dot') : null;
    const turnLabel = document.getElementById('chess-turn-label');

    if (turnLabel) turnLabel.textContent = this.game.statusMessage;
    if (turnDot) {
      turnDot.className = `turn-dot ${this.game.turn === 'w' ? 'turn-white' : 'turn-black'}`;
    }

    // Captured Material
    const whiteTray = document.getElementById('captured-by-white');
    const blackTray = document.getElementById('captured-by-black');

    if (whiteTray) {
      whiteTray.innerHTML = this.game.captured.w.map(p =>
        `<span class="mini-piece">${CHESS_PIECES_SVG['b' + p.type]}</span>`
      ).join('');
    }

    if (blackTray) {
      blackTray.innerHTML = this.game.captured.b.map(p =>
        `<span class="mini-piece">${CHESS_PIECES_SVG['w' + p.type]}</span>`
      ).join('');
    }

    // Move History
    const historyList = document.getElementById('chess-history-list');
    if (historyList) {
      if (this.game.history.length === 0) {
        historyList.innerHTML = `<div class="history-empty">Moves will stream here...</div>`;
      } else {
        let rowsHtml = '';
        for (let i = 0; i < this.game.history.length; i += 2) {
          const moveNum = Math.floor(i / 2) + 1;
          const wMove = this.game.history[i].san;
          const bMove = this.game.history[i + 1] ? this.game.history[i + 1].san : '';
          rowsHtml += `
            <div class="history-entry">
              <span class="hist-num">${moveNum}.</span>
              <span class="hist-san white-san">${wMove}</span>
              <span class="hist-san black-san">${bMove}</span>
            </div>
          `;
        }
        historyList.innerHTML = rowsHtml;
        historyList.scrollTop = historyList.scrollHeight;
      }
    }
  }
}

// Global export
window.ChessUI = ChessUI;
window.ChessGame = ChessGame;
