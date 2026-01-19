document.addEventListener('DOMContentLoaded', () => {
    const btnSave = document.getElementById('btn-save');
    const pgnModal = document.getElementById('pgn-modal');
    const pgnSubmit = document.getElementById('pgn-submit');
    const pgnCancel = document.getElementById('pgn-cancel');

    // 내보내기 버튼 클릭
    btnSave.addEventListener('click', () => {
        const moveRows = document.querySelectorAll('.move-row');
        if (moveRows.length === 0) {
            alert("저장할 기보가 없습니다.");
            return;
        }

        // 체크메이트 여부에 따른 결과값 자동 세팅
        const resultSelect = document.getElementById('pgn-result');
        if (window.gameState.isGameOver) {
            resultSelect.value = window.gameState.winner === 'W' ? "1-0" : "0-1";
        } else {
            resultSelect.value = "*";
        }

        // 오늘 날짜 세팅
        const d = new Date();
        document.getElementById('pgn-date').value = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
        
        pgnModal.style.display = 'flex';
    });

    pgnCancel.addEventListener('click', () => pgnModal.style.display = 'none');

    pgnSubmit.addEventListener('click', () => {
        const eventVal = document.getElementById('pgn-event').value || "Local Game";
        const siteVal = document.getElementById('pgn-site').value || "Chess App";
        const dateVal = document.getElementById('pgn-date').value;
        const whiteVal = document.getElementById('pgn-white').value;
        const blackVal = document.getElementById('pgn-black').value;
        const resultVal = document.getElementById('pgn-result').value;

        // PGN 텍스트 조립
        let pgnText = `[Event "${eventVal}"]\n[Site "${siteVal}"]\n[Date "${dateVal}"]\n[White "${whiteVal}"]\n[Black "${blackVal}"]\n[Result "${resultVal}"]\n\n`;

        const moveRows = document.querySelectorAll('.move-row');
        let movesArray = [];
        moveRows.forEach(row => {
            const num = row.querySelector('.move-num').textContent.trim();
            const white = row.querySelector('.white-move').textContent.trim();
            const black = row.querySelector('.black-move').textContent.trim().replace('|', '').trim();
            movesArray.push(`${num} ${white}${black ? ' ' + black : ''}`);
        });
        
        pgnText += movesArray.join(' ') + ` ${resultVal}`;

        // 파일 다운로드
        const blob = new Blob([pgnText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        const cleanEvent = eventVal.replace(/[^a-z0-9]/gi, '_');
        const cleanDate = dateVal.replace(/\./g, '');
        link.download = `${cleanEvent}_${cleanDate}.pgn`;
        
        link.href = url;
        link.click();
        pgnModal.style.display = 'none';
    });
});