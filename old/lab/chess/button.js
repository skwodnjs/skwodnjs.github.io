document.addEventListener('DOMContentLoaded', () => {
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const btnLoad = document.getElementById('btn-load');
    const btnSave = document.getElementById('btn-save');
    const fileInput = document.getElementById('file-input');

    const pgnModal = document.getElementById('pgn-modal');
    const pgnSubmit = document.getElementById('pgn-submit');
    const pgnCancel = document.getElementById('pgn-cancel');
    const btnFlip = document.getElementById('btn-flip');

    if (btnFlip) {
        btnFlip.addEventListener('click', () => {
            // 상태 반전
            window.gameState.isFlipped = !window.gameState.isFlipped;
            // 보드 다시 그리기
            if (typeof window.renderBoard === 'function') {
                window.renderBoard();
            }
        });
    }

    // 이전/다음 버튼 연결
    btnPrev.addEventListener('click', () => {
        if (window.undoMove) window.undoMove();
    });

    btnNext.addEventListener('click', () => {
        if (window.redoMove) window.redoMove();
    });

    // 불러오기 기능
    btnLoad.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target.result;
            if (window.loadPgnToUI) {
                window.loadPgnToUI(content);
            }
        };
        reader.readAsText(file);
        e.target.value = ''; // 파일 리셋
    });

    // 내보내기 모달 제어
    btnSave.addEventListener('click', () => {
        const moveRows = document.querySelectorAll('.move-row');
        if (moveRows.length === 0) {
            alert("저장할 기보가 없습니다.");
            return;
        }

        const resultSelect = document.getElementById('pgn-result');
        if (window.gameState && window.gameState.isGameOver) {
            resultSelect.value = window.gameState.winner === 'W' ? "1-0" : "0-1";
        } else {
            resultSelect.value = "*";
        }

        const d = new Date();
        document.getElementById('pgn-date').value = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
        pgnModal.style.display = 'flex';
    });

    pgnCancel.addEventListener('click', () => pgnModal.style.display = 'none');

    pgnSubmit.addEventListener('click', () => {
        const eventVal = document.getElementById('pgn-event').value || "Local Game";
        const siteVal = document.getElementById('pgn-site').value || "Chess App";
        const dateVal = document.getElementById('pgn-date').value || "????.??.??";
        const whiteVal = document.getElementById('pgn-white').value || "White Player";
        const blackVal = document.getElementById('pgn-black').value || "Black Player";
        const resultVal = document.getElementById('pgn-result').value || "*";

        let pgnText = `[Event "${eventVal}"]\n[Site "${siteVal}"]\n[Date "${dateVal}"]\n[White "${whiteVal}"]\n[Black "${blackVal}"]\n[Result "${resultVal}"]\n\n`;

        const moveRows = document.querySelectorAll('.move-row');
        let movesArray = [];
        moveRows.forEach(row => {
            const num = row.querySelector('.move-num').textContent.trim();
            const white = row.querySelector('.white-move').textContent.trim();
            const black = row.querySelector('.black-move').textContent.trim();
            let entry = `${num} ${white}`;
            if (black) entry += ` ${black}`;
            movesArray.push(entry);
        });
        
        pgnText += movesArray.join(' ') + ` ${resultVal}`;

        const blob = new Blob([pgnText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const cleanEvent = eventVal.replace(/[^a-z0-9ㄱ-ㅎ가-힣]/gi, '_');
        const cleanDate = dateVal.replace(/\./g, '');
        link.download = `${cleanEvent}_${cleanDate}.pgn`;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        pgnModal.style.display = 'none';
    });
});