window.gameState = {
    isGameOver: false,
    winner: null,
    currentBoard: null // button.js에서 참조용
};

document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('chessBoard');
    const turnDisplay = document.querySelector('.sidebar h2'); // 기보 제목 옆에 턴 표시
    const moveContent = document.querySelector('.move-content'); // 기보가 들어갈 곳
    const promotionModal = document.getElementById('promotion-modal');
    const promotionOptions = document.getElementById('promotion-options');
    
    let selectedSquare = null; 
    let movableSquares = [];   
    let currentTurn = 'W'; 
    let enPassantTarget = null; 
    let pendingPromotion = null;
    let moveCount = 1;

    // 캐슬링 상태
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

    // 좌표 변환 (0,0 -> a8)
    function getNotation(row, col) {
        const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
        return files[col] + ranks[row];
    }

    // 기보 추가 함수
    function updateMoveList(piece, fromR, fromC, toR, toC, isCapture, castling) {
        // 기보 영역 초기화 (첫 수일 때)
        if (moveCount === 1 && currentTurn === 'W') {
            moveContent.innerHTML = '';
        }

        let notation = '';
        const type = piece.toLowerCase();
        const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

        if (castling) {
            notation = castling === 'king' ? 'O-O' : 'O-O-O';
        } else if (type === 'p') {
            // 폰 기보: 잡을 때는 출발 열 표시, 일반 이동은 도착 칸만
            notation = isCapture ? `${files[fromC]}x${getNotation(toR, toC)}` : getNotation(toR, toC);
        } else {
            const pieceLetter = piece.toUpperCase();
            const targetPos = getNotation(toR, toC);
            
            // --- 모호성 판정 로직 (Disambiguation) ---
            let disambiguation = '';
            const competitors = [];

            // 보드 전체에서 동일한 종류와 색상의 기물을 찾음
            for (let r = 0; r < 8; r++) {
                for (let c = 0; c < 8; c++) {
                    if (currentBoard[r][c] === piece && (r !== fromR || c !== fromC)) {
                        // 해당 기물이 목적지로 이동 가능한지 확인 (체크 여부 포함 필터링된 movableSquares 활용이 이상적이나 로직상 getRawMoves 사용)
                        const rawMoves = getRawMoves(r, c, currentBoard);
                        if (rawMoves.some(m => m.row === toR && m.col === toC)) {
                            competitors.push({ r, c });
                        }
                    }
                }
            }

            if (competitors.length > 0) {
                const sameFile = competitors.some(p => p.c === fromC);
                const sameRank = competitors.some(p => p.r === fromR);

                if (!sameFile) {
                    // 1. 열이 다르면 열 문자 추가 (예: Ngf3)
                    disambiguation = files[fromC];
                } else if (!sameRank) {
                    // 2. 열이 같고 행이 다르면 행 숫자 추가 (예: N2f3)
                    disambiguation = ranks[fromR];
                } else {
                    // 3. 드물게 열과 행이 모두 겹치면 둘 다 추가
                    disambiguation = files[fromC] + ranks[fromR];
                }
            }

            notation = pieceLetter + disambiguation + (isCapture ? 'x' : '') + targetPos;
        }

        // 턴 종료 전 '체크' 여부 확인하여 '+' 기호 추가 (선택 사항)
        // if (isCheck(currentTurn === 'W' ? 'B' : 'W', currentBoard)) notation += '+';

        // --- 화면 출력 로직 ---
        if (currentTurn === 'W') {
        const row = document.createElement('div');
        row.className = 'move-row';
        
        // 구조를 미리 짜둠으로써 흑의 수가 입력되기 전에도 | 위치가 고정됩니다.
        row.innerHTML = `
            <span class="move-num">${moveCount}.</span>
            <span class="white-move">${notation}</span>
            <span class="black-move"></span>
        `;
        moveContent.appendChild(row);
    } else {
        const rows = moveContent.querySelectorAll('.move-row');
        const lastRow = rows[rows.length - 1];
        // 흑색 수 칸에 텍스트만 쏙 넣습니다.
        lastRow.querySelector('.black-move').textContent = notation;
        moveCount++;
    }
    }

    // --- 로직: 위협 체크 및 이동 계산 ---
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

    // --- 실행 제어 ---
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
        const piece = promoted || currentBoard[fR][fC];
        const isCapture = currentBoard[tR][tC] !== '' || move.isEnPassant;

        updateMoveList(currentBoard[fR][fC], fR, fC, tR, tC, isCapture, move.isCastling);

        if (move.isEnPassant) currentBoard[fR][tC] = '';
        if (move.isCastling === 'king') { currentBoard[fR][5] = currentBoard[fR][7]; currentBoard[fR][7] = ''; }
        if (move.isCastling === 'queen') { currentBoard[fR][3] = currentBoard[fR][0]; currentBoard[fR][0] = ''; }

        currentBoard[tR][tC] = piece;
        currentBoard[fR][fC] = '';

        // 상태 업데이트 (캐슬링 제한용)
        if (piece === 'K') hasMoved.K_W = true; if (piece === 'k') hasMoved.k_B = true;
        if (fR === 7 && fC === 0) hasMoved.R_W_left = true; if (fR === 7 && fC === 7) hasMoved.R_W_right = true;
        if (fR === 0 && fC === 0) hasMoved.r_B_left = true; if (fR === 0 && fC === 7) hasMoved.r_B_right = true;

        enPassantTarget = (piece.toLowerCase()==='p' && Math.abs(tR-fR)===2) ? {row: (fR+tR)/2, col: fC} : null;

        currentBoard[tR][tC] = piece;
        currentBoard[fR][fC] = '';

        // [추가] 상태 업데이트 후 체크메이트 판정
        const nextTurn = currentTurn === 'W' ? 'B' : 'W';
        if (isCheckmate(nextTurn)) {
            window.gameState.isGameOver = true;
            window.gameState.winner = currentTurn; // 현재 둔 사람이 승리
            alert(currentTurn === 'W' ? "백색 승리! (체크메이트)" : "흑색 승리! (체크메이트)");
        } else {
            window.gameState.isGameOver = false;
            window.gameState.winner = null;
        }

        // 전역 보드 상태 업데이트 (내보내기용)
        window.gameState.currentBoard = currentBoard;
        window.gameState.isCheckmate = isCheckmate; // 함수도 노출

        currentTurn = nextTurn;
        selectedSquare = null; movableSquares = [];
        renderBoard();
    }

    // 체크메이트 여부를 확인하는 함수
    function isCheckmate(color) {
        // 1. 현재 왕이 체크 상태가 아니면 체크메이트가 아님
        if (!isCheck(color, currentBoard)) return false;

        // 2. 현재 색상의 모든 기물을 뒤져서 탈출 가능한 수(movableSquares)가 하나라도 있는지 확인
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const piece = currentBoard[r][c];
                if (piece && getPieceColor(piece) === color) {
                    // 임시로 해당 기물을 선택했을 때 갈 수 있는 곳 계산
                    calculatePossibleMoves(r, c);
                    if (movableSquares.length > 0) {
                        return false; // 탈출 방법이 있으므로 체크메이트 아님
                    }
                }
            }
        }
        return true; // 갈 곳이 없으므로 체크메이트!
    }

    function renderBoard() {
        board.innerHTML = '';
        
        // 턴 표시 텍스트 생성 로직
        turnDisplay.innerHTML = `기보 (Move List)`;
        
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