
        let board = ['', '', '', '', '', '', '', '', ''];
        let currentPlayer = 'X';
        let gameActive = true;
        let vsAI = false;
        let scores = { X: 0, O: 0, draw: 0 };

        const cells = document.querySelectorAll('.cell');
        const status = document.getElementById('status');
        const resetBtn = document.getElementById('resetBtn');
        const pvpBtn = document.getElementById('pvpBtn');
        const pvcBtn = document.getElementById('pvcBtn');

        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        pvpBtn.addEventListener('click', () => {
            vsAI = false;
            pvpBtn.classList.add('active');
            pvcBtn.classList.remove('active');
            resetGame();
        });

        pvcBtn.addEventListener('click', () => {
            vsAI = true;
            pvcBtn.classList.add('active');
            pvpBtn.classList.remove('active');
            resetGame();
        });

        cells.forEach(cell => {
            cell.addEventListener('click', handleCellClick);
        });

        resetBtn.addEventListener('click', resetGame);

        function handleCellClick(e) {
            const index = e.target.dataset.index;

            if (board[index] !== '' || !gameActive) return;

            makeMove(index, currentPlayer);

            if (gameActive && vsAI && currentPlayer === 'O') {
                setTimeout(aiMove, 500);
            }
        }

        function makeMove(index, player) {
            board[index] = player;
            cells[index].textContent = player;
            cells[index].classList.add(player.toLowerCase());

            if (checkWin(player)) {
                gameActive = false;
                status.textContent = `Player ${player} Wins! 🎉`;
                scores[player]++;
                updateScores();
                highlightWinningCells();
            } else if (board.every(cell => cell !== '')) {
                gameActive = false;
                status.textContent = "It's a Draw!";
                scores.draw++;
                updateScores();
            } else {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                status.textContent = vsAI && currentPlayer === 'O' 
                    ? "AI's Turn..." 
                    : `Player ${currentPlayer}'s Turn`;
            }
        }

        function checkWin(player) {
            return winPatterns.some(pattern => {
                return pattern.every(index => board[index] === player);
            });
        }

        function highlightWinningCells() {
            winPatterns.forEach(pattern => {
                if (pattern.every(index => board[index] === board[pattern[0]] && board[pattern[0]] !== '')) {
                    pattern.forEach(index => {
                        cells[index].classList.add('winner');
                    });
                }
            });
        }

        function aiMove() {
            if (!gameActive) return;

            let bestMove = findBestMove();
            makeMove(bestMove, 'O');
        }

        function findBestMove() {
            // Check if AI can win
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'O';
                    if (checkWin('O')) {
                        board[i] = '';
                        return i;
                    }
                    board[i] = '';
                }
            }

            // Block player from winning
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'X';
                    if (checkWin('X')) {
                        board[i] = '';
                        return i;
                    }
                    board[i] = '';
                }
            }

            // Take center if available
            if (board[4] === '') return 4;

            // Take corners
            const corners = [0, 2, 6, 8];
            const availableCorners = corners.filter(i => board[i] === '');
            if (availableCorners.length > 0) {
                return availableCorners[Math.floor(Math.random() * availableCorners.length)];
            }

            // Take any available space
            const available = board.map((cell, i) => cell === '' ? i : null).filter(i => i !== null);
            return available[Math.floor(Math.random() * available.length)];
        }

        function resetGame() {
            board = ['', '', '', '', '', '', '', '', ''];
            currentPlayer = 'X';
            gameActive = true;
            status.textContent = "Player X's Turn";
            
            cells.forEach(cell => {
                cell.textContent = '';
                cell.classList.remove('x', 'o', 'winner');
            });
        }

        function updateScores() {
            document.getElementById('scoreX').textContent = scores.X;
            document.getElementById('scoreO').textContent = scores.O;
            document.getElementById('scoreDraw').textContent = scores.draw;
        }
    