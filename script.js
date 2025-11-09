document.addEventListener('DOMContentLoaded', () => {
    const guessInput = document.getElementById('guess-input');
    const guessButton = document.getElementById('guess-button');
    const resultArea = document.getElementById('result-area');
    const historyList = document.getElementById('history-list');
    const allowDuplicatesCheckbox = document.getElementById('allow-duplicates');
    const numDigitsSelect = document.getElementById('num-digits');
    const instructionText = document.getElementById('instruction-text');

    let secret;
    let gameEnded = false;
    const secretLength = 4;
    let characterPool = 10;
    let allowDuplicates = false;

    function newGame() {
        characterPool = parseInt(numDigitsSelect.value);
        allowDuplicates = allowDuplicatesCheckbox.checked;
        guessInput.maxLength = secretLength;
        guessInput.placeholder = '0'.repeat(secretLength);
        instructionText.textContent = `${secretLength}桁の数字を当ててください`;

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
        const digits = '0123456789ABCDEF'.split('');
        let availableDigits = digits.slice(0, characterPool);
        let secret = '';
        for (let i = 0; i < secretLength; i++) {
            const randomIndex = Math.floor(Math.random() * availableDigits.length);
            const digit = availableDigits[randomIndex];
            secret += digit;
            if (!allowDuplicates) {
                availableDigits.splice(randomIndex, 1);
            }
        }
        return secret;
    }

    function handleGuess() {
        const guess = guessInput.value.toUpperCase();

        if (!isValid(guess)) {
            return;
        }

        const { hits, blows } = checkGuess(guess);

        addToHistory(guess, hits, blows);

        if (hits === secretLength) {
            endGame(true);
        } else {
            resultArea.textContent = `ヒット: ${hits}, ブロー: ${blows}`;
            guessInput.value = '';
            guessInput.focus();
        }
    }

    function isValid(guess) {
        if (guess.length !== secretLength) {
            resultArea.textContent = `${secretLength}桁の数字を入力してください。`;
            return false;
        }
        const validChars = '0123456789ABCDEF'.substring(0, characterPool);
        const regex = new RegExp(`^[${validChars}]{${secretLength}}$`);
        if (!regex.test(guess)) {
            resultArea.textContent = `有効な${secretLength}桁の数字を入力してください。`;
            return false;
        }
        if (!allowDuplicates) {
            const uniqueDigits = new Set(guess.split(''));
            if (uniqueDigits.size !== secretLength) {
                resultArea.textContent = `重複しない${secretLength}桁の数字を入力してください。`;
                return false;
            }
        }
        return true;
    }

    function checkGuess(guess) {
        let hits = 0;
        let blows = 0;
        const secretChars = secret.split('');
        const guessChars = guess.split('');

        // Find hits
        for (let i = 0; i < secretLength; i++) {
            if (guessChars[i] === secretChars[i]) {
                hits++;
                secretChars[i] = null; // Mark as checked
                guessChars[i] = null;
            }
        }

        // Find blows
        for (let i = 0; i < secretLength; i++) {
            if (guessChars[i] !== null) {
                const index = secretChars.indexOf(guessChars[i]);
                if (index !== -1) {
                    blows++;
                    secretChars[index] = null; // Mark as checked
                }
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

    allowDuplicatesCheckbox.addEventListener('change', newGame);
    numDigitsSelect.addEventListener('change', newGame);

    guessInput.addEventListener('input', () => {
        if (!allowDuplicates) {
            const value = guessInput.value;
            const uniqueChars = new Set(value.split(''));
            if (uniqueChars.size < value.length) {
                guessInput.value = Array.from(uniqueChars).join('');
            }
        }
    });

    newGame();
});
