document.addEventListener('DOMContentLoaded', () => {
    const guessInput = document.getElementById('guess-input');
    const guessButton = document.getElementById('guess-button');
    const resultArea = document.getElementById('result-area');
    const historyList = document.getElementById('history-list');

    let secret;
    let gameEnded = false;

    function newGame() {
        secret = generateSecret();
        resultArea.innerHTML = '';
        historyList.innerHTML = '';
        guessInput.value = '';
        guessInput.disabled = false;
        guessButton.disabled = false;
        guessButton.textContent = '推測';
        gameEnded = false;
        console.log(`正解は... ${secret}`); // デバッグ用
    }

    function generateSecret() {
        const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        let secret = '';
        for (let i = 0; i < 4; i++) {
            const randomIndex = Math.floor(Math.random() * digits.length);
            secret += digits.splice(randomIndex, 1)[0];
        }
        return secret;
    }

    function handleGuess() {
        const guess = guessInput.value;

        if (!isValid(guess)) {
            return;
        }

        const { hits, blows } = checkGuess(guess);

        addToHistory(guess, hits, blows);

        if (hits === 4) {
            endGame(true);
        } else {
            resultArea.textContent = `ヒット: ${hits}, ブロー: ${blows}`;
            guessInput.value = '';
            guessInput.focus();
        }
    }

    function isValid(guess) {
        if (guess.length !== 4 || !/^\d{4}$/.test(guess)) {
            resultArea.textContent = '4桁の数字を入力してください。';
            return false;
        }
        const uniqueDigits = new Set(guess.split(''));
        if (uniqueDigits.size !== 4) {
            resultArea.textContent = '重複しない4桁の数字を入力してください。';
            return false;
        }
        return true;
    }

    function checkGuess(guess) {
        let hits = 0;
        let blows = 0;
        for (let i = 0; i < 4; i++) {
            if (guess[i] === secret[i]) {
                hits++;
            } else if (secret.includes(guess[i])) {
                blows++;
            }
        }
        return { hits, blows };
    }

    function addToHistory(guess, hits, blows) {
        const li = document.createElement('li');
        li.innerHTML = `<span>${guess}</span><span>H: ${hits} B: ${blows}</span>`;
        historyList.prepend(li);
    }

    function endGame(isWin) {
        guessInput.disabled = true;
        guessButton.textContent = '新しいゲーム';
        if (isWin) {
            resultArea.innerHTML = '🎉 正解！おめでとう！ 🎉';
        }
        gameEnded = true;
    }

    guessButton.addEventListener('click', () => {
        if (gameEnded) {
            newGame();
        } else {
            handleGuess();
        }
    });

    guessInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            if (gameEnded) {
                newGame();
            } else {
                handleGuess();
            }
        }
    });

    newGame();
});
