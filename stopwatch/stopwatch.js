
        let startTime = 0;
        let elapsedTime = 0;
        let timerInterval = null;
        let isRunning = false;
        let lapCounter = 0;

        function formatTime(ms) {
            const totalSeconds = Math.floor(ms / 1000);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
            const milliseconds = Math.floor((ms % 1000) / 10);

            return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')}`;
        }

        function updateDisplay() {
            const currentTime = Date.now();
            elapsedTime = currentTime - startTime;
            document.getElementById('display').textContent = formatTime(elapsedTime);
        }

        function start() {
            if (!isRunning) {
                startTime = Date.now() - elapsedTime;
                timerInterval = setInterval(updateDisplay, 10);
                isRunning = true;
                
                document.getElementById('startBtn').style.display = 'none';
                document.getElementById('pauseBtn').style.display = 'inline-block';
                document.getElementById('lapBtn').disabled = false;
            }
        }

        function pause() {
            if (isRunning) {
                clearInterval(timerInterval);
                isRunning = false;
                
                document.getElementById('startBtn').style.display = 'inline-block';
                document.getElementById('pauseBtn').style.display = 'none';
            }
        }

        function reset() {
            clearInterval(timerInterval);
            isRunning = false;
            elapsedTime = 0;
            lapCounter = 0;
            
            document.getElementById('display').textContent = '00:00:00.00';
            document.getElementById('startBtn').style.display = 'inline-block';
            document.getElementById('pauseBtn').style.display = 'none';
            document.getElementById('lapBtn').disabled = true;
            document.getElementById('lapList').innerHTML = '<div class="no-laps">No laps recorded yet</div>';
        }

        function recordLap() {
            if (isRunning) {
                lapCounter++;
                const lapList = document.getElementById('lapList');
                
                if (lapCounter === 1) {
                    lapList.innerHTML = '';
                }
                
                const lapItem = document.createElement('div');
                lapItem.className = 'lap-item';
                lapItem.innerHTML = `
                    <span class="lap-number">Lap ${lapCounter}</span>
                    <span class="lap-time">${formatTime(elapsedTime)}</span>
                `;
                
                lapList.insertBefore(lapItem, lapList.firstChild);
            }
        }
    