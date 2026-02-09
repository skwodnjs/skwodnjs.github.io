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

    // 히스토리 저장
    function saveStateToHistory() {
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

    // 기보 하이라이트
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
            if (target && target.textContent.trim() !== "") {
                target.style.backgroundColor = '#000000';
                target.style.color = '#ffffff';
                target.scrollIntoView({ block: 'nearest' });
            }
        }
    }

    // 이전/다음
    window.undoMove = function() {
        if (currentHistoryIndex <= -1) return;
        currentHistoryIndex--;
        if (currentHistoryIndex === -1) {
            currentBoard = JSON.parse(JSON.stringify(initialLayout));
            currentTurn = 'W';
            moveCount = 1;
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

    // PGN 불러오기 엔진 (핵심)
    window.loadPgnToUI = function(pgnString) {
        moveContent.innerHTML = '';
        history = [];
        currentHistoryIndex = -1;
        moveCount = 1;
        currentTurn = 'W';
        currentBoard = JSON.parse(JSON.stringify(initialLayout));
        hasMoved = { 'K_W': false, 'R_W_left': false, 'R_W_right': false, 'k_B': false, 'r_B_left': false, 'r_B_right': false };
        enPassantTarget = null;

        const moveData = pgnString.replace(/\[.*?\]/g, '').trim();
        const moveTokens = moveData.split(/\s+/).filter(t => t && !t.includes('.') && t !== '*' && !t.includes('-'));

        // 각 기보를 시뮬레이션하여 히스토리 스택 구축
        moveTokens.forEach((token, index) => {
            const foundMove = findMoveByNotation(token, currentTurn);
            if (foundMove) {
                // UI 기록
                updateMoveListForLoading(token, index);
                // 가상 이동 실행
                executeMoveSilent(foundMove.fR, foundMove.fC, foundMove.tR, foundMove.tC, foundMove.moveData, foundMove.promoted);
                // 각 수의 보드 상태 저장
                saveStateToHistory();
            }
        });

        // 결과: 보드는 초기 상태로, 히스토리는 꽉 찬 상태로 설정
        currentBoard = JSON.parse(JSON.stringify(initialLayout));
        currentTurn = 'W';
        moveCount = 1;
        currentHistoryIndex = -1;
        renderBoard();
        highlightMove(-1);
    };

    function updateMoveListForLoading(notation, index) {
        if (index % 2 === 0) {
            const row = document.createElement('div');
            row.className = 'move-row';
            row.innerHTML = `<span class="move-num">${Math.floor(index/2)+1}.</span><span class="white-move">${notation}</span><span class="black-move"></span>`;
            moveContent.appendChild(row);
        } else {
            const rows = moveContent.querySelectorAll('.move-row');
            rows[rows.length-1].querySelector('.black-move').textContent = notation;
        }
    }

    // 기보(SAN)를 좌표로 해석하는 엔진
    function findMoveByNotation(notation, color) {
        if (notation === 'O-O' || notation === 'O-O-O') {
            const r = color === 'W' ? 7 : 0;
            const isKingSide = notation === 'O-O';
            return { fR: r, fC: 4, tR: r, tC: isKingSide ? 6 : 2, moveData: { isCastling: isKingSide ? 'king' : 'queen' } };
        }

        let cleanNotation = notation.replace(/[+#x]/g, '');
        let targetPos = cleanNotation.slice(-2);
        let tC = targetPos.charCodeAt(0) - 'a'.charCodeAt(0);
        let tR = 8 - parseInt(targetPos[1]);
        let pieceSymbol = cleanNotation.length > 2 && cleanNotation[0] === cleanNotation[0].toUpperCase() ? cleanNotation[0] : (color === 'W' ? 'P' : 'p');
        if (color === 'B') pieceSymbol = pieceSymbol.toLowerCase();

        // 보드에서 해당 기물을 찾아 이동 가능한지 체크
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                if (currentBoard[r][c] === pieceSymbol) {
                    calculatePossibleMoves(r, c);
                    let move = movableSquares.find(m => m.row === tR && m.col === tC);
                    if (move) return { fR: r, fC: c, tR, tC, moveData: move };
                }
            }
        }
        return null;
    }

    function executeMoveSilent(fR, fC, tR, tC, move, promoted = null) {
        const piece = promoted || currentBoard[fR][fC];
        if (move.isEnPassant) currentBoard[fR][tC] = '';
        if (move.isCastling === 'king') { currentBoard[fR][5] = currentBoard[fR][7]; currentBoard[fR][7] = ''; }
        if (move.isCastling === 'queen') { currentBoard[fR][3] = currentBoard[fR][0]; currentBoard[fR][0] = ''; }
        currentBoard[tR][tC] = piece;
        currentBoard[fR][fC] = '';
        currentTurn = currentTurn === 'W' ? 'B' : 'W';
        if (currentTurn === 'W') moveCount++;
    }

    // --- 이하 기존 규칙 로직 (isSquareAttacked, calculatePossibleMoves 등 동일) ---
    // ... (이전 코드의 규칙 부분 유지) ...
    function updateMoveList(piece, fromR, fromC, toR, toC, isCapture, castling) {
        if (currentHistoryIndex < history.length - 1) {
            const rows = moveContent.querySelectorAll('.move-row');
            const expected = Math.ceil((currentHistoryIndex + 1) / 2);
            for (let i = rows.length - 1; i >= expected; i--) rows[i].remove();
            if (currentRows = moveContent.querySelectorAll('.move-row'), currentRows.length > 0 && (currentHistoryIndex + 1) % 2 === 1) {
                currentRows[currentRows.length - 1].querySelector('.black-move').textContent = '';
            }
        }
        if (moveCount === 1 && currentTurn === 'W') moveContent.innerHTML = '';
        let notation = castling ? (castling === 'king' ? 'O-O' : 'O-O-O') : (piece.toLowerCase() === 'p' ? (isCapture ? `${['a','b','c','d','e','f','g','h'][fromC]}x${getNotation(toR, toC)}` : getNotation(toR, toC)) : piece.toUpperCase() + (isCapture ? 'x' : '') + getNotation(toR, toC));
        if (currentTurn === 'W') {
            const row = document.createElement('div'); row.className = 'move-row';
            row.innerHTML = `<span class="move-num">${moveCount}.</span><span class="white-move">${notation}</span><span class="black-move"></span>`;
            moveContent.appendChild(row);
        } else {
            const rows = moveContent.querySelectorAll('.move-row');
            rows[rows.length - 1].querySelector('.black-move').textContent = notation;
            moveCount++;
        }
    }

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
            if (row + dir >= 0 && row + dir < 8 && !boardState[row+dir][col]) {
                moves.push({row: row + dir, col: col});
                if (((color === 'W' && row === 6) || (color === 'B' && row === 1)) && !boardState[row + 2*dir][col]) moves.push({row: row + 2*dir, col: col});
            }
        } else if (type === 'n') {
            [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].forEach(([dr, dc]) => {
                const nr = row+dr, nc = col+dc;
                if (nr>=0 && nr<8 && nc>=0 && nc<8 && (!boardState[nr][nc] || getPieceColor(boardState[nr][nc]) !== color)) moves.push({row: nr, col: nc});
            });
        } else if (type === 'k') {
            for(let dr=-1; dr<=1; dr++) {
                for(let dc=-1; dc<=1; dc++) {
                    if (dr===0 && dc===0) continue;
                    const nr=row+dr, nc=col+dc;
                    if (nr>=0 && nr<8 && nc>=0 && nc<8 && (!boardState[nr][nc] || getPieceColor(boardState[nr][nc]) !== color)) moves.push({row: nr, col: nc});
                }
            }
        } else {
            let dirs = [];
            if (type === 'b' || type === 'q') dirs.push([1,1],[1,-1],[-1,1],[-1,-1]);
            if (type === 'r' || type === 'q') dirs.push([1,0],[-1,0],[0,1],[0,-1]);
            dirs.forEach(([dr, dc]) => {
                let nr=row+dr, nc=col+dc;
                while(nr>=0 && nr<8 && nc>=0 && nc<8) {
                    if (!boardState[nr][nc]) moves.push({row: nr, col: nc});
                    else {
                        if (getPieceColor(boardState[nr][nc]) !== color) moves.push({row: nr, col: nc});
                        break;
                    }
                    nr+=dr; nc+=dc;
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
        currentTurn = currentTurn === 'W' ? 'B' : 'W';
        selectedSquare = null; movableSquares = [];
        renderBoard();
        highlightMove(currentHistoryIndex);
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

                // [수정 핵심] selectedSquare가 있을 때만 힌트를 보여줍니다.
                if (selectedSquare) {
                    const move = movableSquares.find(m => m.row === r && m.col === c);
                    if (move) {
                        if (piece || move.isEnPassant) {
                            // 아군 기물을 공격 대상으로 표시하지 않도록 색상 판별 추가
                            if (piece && getPieceColor(piece) !== currentTurn) {
                                sq.classList.add('attackable');
                            } else if (move.isEnPassant) {
                                sq.classList.add('attackable');
                            }
                        } else {
                            const hint = document.createElement('div');
                            hint.className = 'hint';
                            sq.appendChild(hint);
                        }
                    }
                }
                sq.onclick = () => handleSquareClick(r, c);
                board.appendChild(sq);
            }
        }
    }

    renderBoard();
});