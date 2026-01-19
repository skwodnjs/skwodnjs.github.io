document.addEventListener('DOMContentLoaded', () => {
    // 버튼 요소 참조
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const btnReset = document.getElementById('btn-reset');
    const btnSave = document.getElementById('btn-save');

    // PGN 모달 요소 참조
    const pgnModal = document.getElementById('pgn-modal');
    const pgnSubmit = document.getElementById('pgn-submit');
    const pgnCancel = document.getElementById('pgn-cancel');

    // 1. 이전 버튼 (Undo)
    btnPrev.addEventListener('click', () => {
        if (window.undoMove) {
            window.undoMove();
        }
    });

    // 2. 다음 버튼 (Redo)
    btnNext.addEventListener('click', () => {
        if (window.redoMove) {
            window.redoMove();
        }
    });

    // 3. 초기화 버튼 (Reset)
    btnReset.addEventListener('click', () => {
        if (confirm("모든 기보와 게임 상태를 초기화하시겠습니까?")) {
            // 페이지 자체를 새로고침하여 모든 변수와 UI 초기화
            location.reload();
            
            /* 만약 새로고침 없이 코드 내부에서 초기화하려면 
               create-board.js에 resetGame() 함수를 만들고 여기서 호출해야 합니다.
               가장 확실한 방법은 location.reload()입니다.
            */
        }
    });

    // 4. 내보내기 버튼 (PGN Export 모달 열기)
    btnSave.addEventListener('click', () => {
        const moveRows = document.querySelectorAll('.move-row');
        if (moveRows.length === 0) {
            alert("저장할 기보가 없습니다.");
            return;
        }

        // 체크메이트 여부에 따른 결과값 자동 세팅
        const resultSelect = document.getElementById('pgn-result');
        if (window.gameState && window.gameState.isGameOver) {
            resultSelect.value = window.gameState.winner === 'W' ? "1-0" : "0-1";
        } else {
            resultSelect.value = "*";
        }

        // 오늘 날짜 세팅
        const d = new Date();
        const dateInput = document.getElementById('pgn-date');
        if (dateInput) {
            dateInput.value = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
        }
        
        pgnModal.style.display = 'flex';
    });

    // 5. 모달 취소
    pgnCancel.addEventListener('click', () => {
        pgnModal.style.display = 'none';
    });

    // 6. 모달 제출 (실제 파일 다운로드)
    pgnSubmit.addEventListener('click', () => {
        const eventVal = document.getElementById('pgn-event').value || "Local Game";
        const siteVal = document.getElementById('pgn-site').value || "Chess App";
        const dateVal = document.getElementById('pgn-date').value || "????.??.??";
        const whiteVal = document.getElementById('pgn-white').value || "White Player";
        const blackVal = document.getElementById('pgn-black').value || "Black Player";
        const resultVal = document.getElementById('pgn-result').value || "*";

        // PGN 텍스트 조립 (표준 규격)
        let pgnText = `[Event "${eventVal}"]\n`;
        pgnText += `[Site "${siteVal}"]\n`;
        pgnText += `[Date "${dateVal}"]\n`;
        pgnText += `[White "${whiteVal}"]\n`;
        pgnText += `[Black "${blackVal}"]\n`;
        pgnText += `[Result "${resultVal}"]\n\n`;

        // 기보 데이터 수집
        const moveRows = document.querySelectorAll('.move-row');
        let movesArray = [];
        moveRows.forEach(row => {
            const num = row.querySelector('.move-num').textContent.trim();
            const white = row.querySelector('.white-move').textContent.trim();
            const black = row.querySelector('.black-move').textContent.trim().replace('|', '').trim();
            
            // 1. e4 e5 형식
            let moveEntry = `${num} ${white}`;
            if (black) moveEntry += ` ${black}`;
            movesArray.push(moveEntry);
        });
        
        // 기보 본문과 결과 기호 합치기
        pgnText += movesArray.join(' ') + ` ${resultVal}`;

        // 파일 다운로드 로직
        const blob = new Blob([pgnText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        // 파일명: Event_날짜.pgn
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