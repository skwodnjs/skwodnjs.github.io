window.gameState = {
    isGameOver: false,
    winner: null,
    currentBoard: null
};

document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('chessBoard');
    const turnDisplay = document.querySelector('.sidebar h2');
    const moveContent = document.querySelector('.move-content');
    const promotionModal = document.getElementById('promotion-modal');
    const promotionOptions = document.getElementById('promotion-options');
    
    let selectedSquare = null; 
    let movableSquares = [];   
    let currentTurn = 'W'; 
    let enPassantTarget = null; 
    let pendingPromotion = null;
    let moveCount = 1;

    // 히스토리 관리 변수
    let history = []; 
    let currentHistoryIndex = -1;

    let hasMoved = {
        'K_W': false, 'R_W_left': false, 'R_W_right': false,
        'k_B': false, 'r_B_left': false, 'r_B_right': false
    };

    const initialLayout = [
        ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
        ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
    ];

    let currentBoard = JSON.parse(JSON.stringify(initialLayout));

    const pieceImages = {
        'r': 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Chess_rdt45.svg',
        'n': 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Chess_ndt45.svg',
        'b': 'https://upload.wikimedia.org/wikipedia/commons/9/98/Chess_bdt45.svg',
        'q': 'https://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg',
        'k': 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg',
        'p': 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Chess_pdt45.svg',
        'R': 'https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg',
        'N': 'https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg',
        'B': 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg',
        'Q': 'https://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg',
        'K': 'https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg',
        'P': 'https://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg'
    };

    function getPieceColor(piece) {
        if (!piece) return null;
        return piece === piece.toUpperCase() ? 'W' : 'B';
    }

    function getNotation(row, col) {
        const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
        return files[col] + ranks[row];
    }

    // 히스토리 저장 함수
    function saveStateToHistory() {
        // [중요] 탐색 중에 새로운 수를 두면 이후 데이터 히스토리를 먼저 삭제
        if (currentHistoryIndex < history.length - 1) {
            history = history.slice(0, currentHistoryIndex + 1);
        }

        history.push({
            board: JSON.parse(JSON.stringify(currentBoard)),
            turn: currentTurn,
            hasMoved: JSON.parse(JSON.stringify(hasMoved)),
            enPassant: enPassantTarget,
            moveCount: moveCount
        });
        currentHistoryIndex++;
    }

    // 기보 하이라이트 함수
    function highlightMove(index) {
        document.querySelectorAll('.white-move, .black-move').forEach(el => {
            el.style.backgroundColor = 'transparent';
            el.style.color = 'inherit';
        });
        if (index === -1) return;
        const rows = moveContent.querySelectorAll('.move-row');
        const rowIndex = Math.floor(index / 2);
        const isBlack = index % 2 === 1;
        if (rows[rowIndex]) {
            const target = isBlack ? rows[rowIndex].querySelector('.black-move') : rows[rowIndex].querySelector('.white-move');
            if (target) {
                target.style.backgroundColor = '#000000'; // 요청하신 검정 배경
                target.style.color = '#ffffff'; // 검정 배경일 때 글자색 흰색
            }
        }
    }

    // 이전/다음 복구 함수
    window.undoMove = function() {
        if (currentHistoryIndex <= -1) return;
        
        currentHistoryIndex--;
        if (currentHistoryIndex === -1) {
            currentBoard = JSON.parse(JSON.stringify(initialLayout));
            currentTurn = 'W';
            moveCount = 1;
            hasMoved = { 'K_W': false, 'R_W_left': false, 'R_W_right': false, 'k_B': false, 'r_B_left': false, 'r_B_right': false };
            enPassantTarget = null;
            renderBoard();
            highlightMove(-1);
        } else {
            applyState(history[currentHistoryIndex]);
        }
    };

    window.redoMove = function() {
        if (currentHistoryIndex >= history.length - 1) return;
        currentHistoryIndex++;
        applyState(history[currentHistoryIndex]);
    };

    function applyState(state) {
        currentBoard = JSON.parse(JSON.stringify(state.board));
        currentTurn = state.turn === 'W' ? 'B' : 'W';
        hasMoved = JSON.parse(JSON.stringify(state.hasMoved));
        enPassantTarget = state.enPassant;
        moveCount = state.moveCount;
        renderBoard();
        highlightMove(currentHistoryIndex);
    }

    // [중요] UI 기보 동기화 함수: 과거 시점에서 수를 두었을 때 UI를 잘라냄
    function syncNotationUI() {
        const rows = moveContent.querySelectorAll('.move-row');
        const expectedRowCount = Math.ceil((currentHistoryIndex + 1) / 2);
        
        // 1. 현재 인덱스 이후의 행들을 삭제
        for (let i = rows.length - 1; i >= expectedRowCount; i--) {
            rows[i].remove();
        }

        // 2. 만약 현재 인덱스가 백색 수에서 끝났다면, 해당 행의 흑색 수 칸을 비움
        const currentRows = moveContent.querySelectorAll('.move-row');
        if (currentRows.length > 0 && (currentHistoryIndex + 1) % 2 === 1) {
            const lastRow = currentRows[currentRows.length - 1];
            lastRow.querySelector('.black-move').textContent = '';
        }
    }

    function updateMoveList(piece, fromR, fromC, toR, toC, isCapture, castling) {
        // 과거 시점이면 UI부터 정리
        syncNotationUI();

        if (moveCount === 1 && currentTurn === 'W') moveContent.innerHTML = '';
        
        let notation = '';
        const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

        if (castling) notation = castling === 'king' ? 'O-O' : 'O-O-O';
        else if (piece.toLowerCase() === 'p') notation = isCapture ? `${files[fromC]}x${getNotation(toR, toC)}` : getNotation(toR, toC);
        else {
            const pieceLetter = piece.toUpperCase();
            let disambiguation = '';
            const competitors = [];
            for (let r = 0; r < 8; r++) {
                for (let c = 0; c < 8; c++) {
                    if (currentBoard[r][c] === piece && (r !== fromR || c !== fromC)) {
                        if (getRawMoves(r, c, currentBoard).some(m => m.row === toR && m.col === toC)) competitors.push({ r, c });
                    }
                }
            }
            if (competitors.length > 0) {
                const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
                if (!competitors.some(p => p.c === fromC)) disambiguation = files[fromC];
                else if (!competitors.some(p => p.r === fromR)) disambiguation = ranks[fromR];
                else disambiguation = files[fromC] + ranks[fromR];
            }
            notation = pieceLetter + disambiguation + (isCapture ? 'x' : '') + getNotation(toR, toC);
        }

        if (currentTurn === 'W') {
            const row = document.createElement('div');
            row.className = 'move-row';
            row.innerHTML = `<span class="move-num">${moveCount}.</span><span class="white-move">${notation}</span><span class="black-move"></span>`;
            moveContent.appendChild(row);
        } else {
            const rows = moveContent.querySelectorAll('.move-row');
            rows[rows.length - 1].querySelector('.black-move').textContent = notation;
            moveCount++;
        }
    }

    // --- 기물 이동 로직 (기존과 동일) ---

    function isSquareAttacked(row, col, attackerColor, boardState) {
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const piece = boardState[r][c];
                if (piece && getPieceColor(piece) === attackerColor) {
                    if (getRawMoves(r, c, boardState).some(m => m.row === row && m.col === col)) return true;
                }
            }
        }
        return false;
    }

    function isCheck(color, boardState) {
        const king = color === 'W' ? 'K' : 'k';
        let pos = null;
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) { if (boardState[r][c] === king) pos = {r, c}; }
        }
        return pos ? isSquareAttacked(pos.r, pos.c, color === 'W' ? 'B' : 'W', boardState) : false;
    }

    function getRawMoves(row, col, boardState) {
        let moves = [];
        const piece = boardState[row][col];
        if (!piece) return moves;
        const color = getPieceColor(piece);
        const type = piece.toLowerCase();

        if (type === 'p') {
            const dir = color === 'W' ? -1 : 1;
            [1, -1].forEach(dc => {
                const nr = row + dir, nc = col + dc;
                if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
                    if (boardState[nr][nc] && getPieceColor(boardState[nr][nc]) !== color) moves.push({row: nr, col: nc});
                    if (!boardState[nr][nc] && enPassantTarget?.row === nr && enPassantTarget?.col === nc) moves.push({row: nr, col: nc, isEnPassant: true});
                }
            });
            if (row + dir >= 0 && row + dir < 8 && !boardState[row + dir][col]) {
                moves.push({row: row + dir, col: col});
                const startRow = (color === 'W' ? 6 : 1);
                if (row === startRow && !boardState[row + 2 * dir][col]) moves.push({row: row + 2 * dir, col: col});
            }
        } else if (type === 'n') {
            [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].forEach(([dr, dc]) => {
                const nr = row + dr, nc = col + dc;
                if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8 && (!boardState[nr][nc] || getPieceColor(boardState[nr][nc]) !== color)) moves.push({row: nr, col: nc});
            });
        } else if (type === 'k') {
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    if (dr === 0 && dc === 0) continue;
                    const nr = row + dr, nc = col + dc;
                    if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8 && (!boardState[nr][nc] || getPieceColor(boardState[nr][nc]) !== color)) moves.push({row: nr, col: nc});
                }
            }
        } else {
            let dirs = [];
            if (type === 'b' || type === 'q') dirs.push([1,1],[1,-1],[-1,1],[-1,-1]);
            if (type === 'r' || type === 'q') dirs.push([1,0],[-1,0],[0,1],[0,-1]);
            dirs.forEach(([dr, dc]) => {
                let nr = row + dr, nc = col + dc;
                while (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
                    if (!boardState[nr][nc]) moves.push({row: nr, col: nc});
                    else {
                        if (getPieceColor(boardState[nr][nc]) !== color) moves.push({row: nr, col: nc});
                        break;
                    }
                    nr += dr; nc += dc;
                }
            });
        }
        return moves;
    }

    function calculatePossibleMoves(row, col) {
        const piece = currentBoard[row][col];
        const color = getPieceColor(piece);
        let rawMoves = getRawMoves(row, col, currentBoard);

        if (piece.toLowerCase() === 'k' && !isCheck(color, currentBoard)) {
            const r = color === 'W' ? 7 : 0;
            if (!(color === 'W' ? hasMoved.K_W : hasMoved.k_B)) {
                if (!(color === 'W' ? hasMoved.R_W_right : hasMoved.r_B_right) && !currentBoard[r][5] && !currentBoard[r][6]) {
                    if (!isSquareAttacked(r, 5, color==='W'?'B':'W', currentBoard) && !isSquareAttacked(r, 6, color==='W'?'B':'W', currentBoard))
                        rawMoves.push({row: r, col: 6, isCastling: 'king'});
                }
                if (!(color === 'W' ? hasMoved.R_W_left : hasMoved.r_B_left) && !currentBoard[r][1] && !currentBoard[r][2] && !currentBoard[r][3]) {
                    if (!isSquareAttacked(r, 3, color==='W'?'B':'W', currentBoard) && !isSquareAttacked(r, 2, color==='W'?'B':'W', currentBoard))
                        rawMoves.push({row: r, col: 2, isCastling: 'queen'});
                }
            }
        }

        movableSquares = rawMoves.filter(move => {
            const temp = JSON.parse(JSON.stringify(currentBoard));
            if (move.isEnPassant) temp[row][move.col] = '';
            temp[move.row][move.col] = temp[row][col];
            temp[row][col] = '';
            return !isCheck(color, temp);
        });
    }

    function handleSquareClick(row, col) {
        const move = movableSquares.find(m => m.row === row && m.col === col);
        if (move && selectedSquare) {
            const piece = currentBoard[selectedSquare.row][selectedSquare.col];
            if (piece.toLowerCase() === 'p' && (row === 0 || row === 7)) {
                pendingPromotion = {fromR: selectedSquare.row, fromC: selectedSquare.col, toR: row, toC: col, move};
                showPromotionModal(getPieceColor(piece));
                return;
            }
            executeMove(selectedSquare.row, selectedSquare.col, row, col, move);
            return;
        }
        const piece = currentBoard[row][col];
        if (selectedSquare?.row === row && selectedSquare?.col === col) {
            selectedSquare = null; movableSquares = [];
        } else if (piece && getPieceColor(piece) === currentTurn) {
            selectedSquare = {row, col};
            calculatePossibleMoves(row, col);
        } else {
            selectedSquare = null; movableSquares = [];
        }
        renderBoard();
    }

    function showPromotionModal(color) {
        promotionOptions.innerHTML = '';
        const list = color === 'W' ? ['Q', 'R', 'B', 'N'] : ['q', 'r', 'b', 'n'];
        list.forEach(p => {
            const img = document.createElement('img');
            img.src = pieceImages[p];
            img.style.width = '60px'; img.style.cursor = 'pointer';
            img.onclick = () => {
                promotionModal.style.display = 'none';
                executeMove(pendingPromotion.fromR, pendingPromotion.fromC, pendingPromotion.toR, pendingPromotion.toC, pendingPromotion.move, p);
            };
            promotionOptions.appendChild(img);
        });
        promotionModal.style.display = 'flex';
    }

    function executeMove(fR, fC, tR, tC, move, promoted = null) {
        const movingPiece = promoted || currentBoard[fR][fC];
        const isCapture = currentBoard[tR][tC] !== '' || move.isEnPassant;

        // [추가] UI 동기화 및 기보 업데이트
        updateMoveList(currentBoard[fR][fC], fR, fC, tR, tC, isCapture, move.isCastling);

        if (move.isEnPassant) currentBoard[fR][tC] = '';
        if (move.isCastling === 'king') { currentBoard[fR][5] = currentBoard[fR][7]; currentBoard[fR][7] = ''; }
        if (move.isCastling === 'queen') { currentBoard[fR][3] = currentBoard[fR][0]; currentBoard[fR][0] = ''; }

        currentBoard[tR][tC] = movingPiece;
        currentBoard[fR][fC] = '';

        if (movingPiece === 'K') hasMoved.K_W = true; if (movingPiece === 'k') hasMoved.k_B = true;
        if (fR === 7 && fC === 0) hasMoved.R_W_left = true; if (fR === 7 && fC === 7) hasMoved.R_W_right = true;
        if (fR === 0 && fC === 0) hasMoved.r_B_left = true; if (fR === 0 && fC === 7) hasMoved.r_B_right = true;

        enPassantTarget = (movingPiece.toLowerCase()==='p' && Math.abs(tR-fR)===2) ? {row: (fR+tR)/2, col: fC} : null;

        saveStateToHistory();

        const nextTurn = currentTurn === 'W' ? 'B' : 'W';
        if (isCheckmate(nextTurn)) {
            window.gameState.isGameOver = true;
            window.gameState.winner = currentTurn;
            alert(currentTurn === 'W' ? "백색 승리! (체크메이트)" : "흑색 승리! (체크메이트)");
        } else {
            window.gameState.isGameOver = false;
        }

        window.gameState.currentBoard = currentBoard;
        currentTurn = nextTurn;
        selectedSquare = null; movableSquares = [];
        renderBoard();
        highlightMove(currentHistoryIndex);
    }

    function isCheckmate(color) {
        if (!isCheck(color, currentBoard)) return false;
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const p = currentBoard[r][c];
                if (p && getPieceColor(p) === color) {
                    calculatePossibleMoves(r, c);
                    if (movableSquares.length > 0) return false;
                }
            }
        }
        return true;
    }

    function renderBoard() {
        board.innerHTML = '';
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const sq = document.createElement('div');
                sq.className = `square ${(r + c) % 2 === 0 ? 'light' : 'dark'}`;
                if (selectedSquare?.row === r && selectedSquare?.col === c) sq.classList.add('selected');
                const piece = currentBoard[r][c];
                if (piece) {
                    const img = document.createElement('img');
                    img.src = pieceImages[piece];
                    img.className = 'piece';
                    sq.appendChild(img);
                }
                const move = movableSquares.find(m => m.row === r && m.col === c);
                if (move) {
                    if (piece || move.isEnPassant) sq.classList.add('attackable');
                    else {
                        const hint = document.createElement('div');
                        hint.className = 'hint';
                        sq.appendChild(hint);
                    }
                }
                sq.onclick = () => handleSquareClick(r, c);
                board.appendChild(sq);
            }
        }
    }

    renderBoard();
});