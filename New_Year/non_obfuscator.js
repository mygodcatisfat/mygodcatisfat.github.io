<script>
    document.addEventListener('touchstart', function(event) {
        if (event.touches.length > 1) event.preventDefault(); 
    }, { passive: false });

    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) event.preventDefault();
        lastTouchEnd = now;
    }, { passive: false });

    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx4_K6xu2-KK3rEXaIy4qCLYWbLAqQkXA7SmMROErLi5txdcmZeSTfjZrzk-X068vuDRw/exec'; 
 const SECRET_KEY = "HorseYear2026_PinQiao_Secret888";
 
    let score = 0;
    let timeLeft = 30;
    let gameInterval, spawnInterval;
    let isPlaying = false;
    let isMusicOn = false; 

    const bgm = document.getElementById('bgm');
    const musicBtn = document.getElementById('music-btn');

    const items = [
        { symbol: '🧧', val: 10, prob: 0.55 },
        { symbol: '🥕', val: 20, prob: 0.30 },
        { symbol: '🐴', val: 50, prob: 0.05 },
        { symbol: '🧨', val: -20, prob: 0.10 }
    ];

    const horseBlessings = [
        { min: 0, text: "馬年平安！健康就是最大的財富！" },
        { min: 250, text: "一馬當先！今年運勢跑第一！" },
        { min: 500, text: "龍馬精神！活力滿滿賺大錢！" },
        { min: 750, text: "馬到成功！心想事成萬事順！" },
        { min: 1000, text: "萬馬奔騰！氣勢如虹，無人能擋！" }
    ];
 
 function simpleHash(str) {
        let hash = 0;
        if (str.length == 0) return hash;
        for (let i = 0; i < str.length; i++) {
            let char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; 
        }
        return Math.abs(hash).toString(16);
    }

    function toggleMusic() {
        if (bgm.paused) { playBgm(); } else { pauseBgm(); }
    }

    function playBgm() {
        bgm.play().then(() => {
            isMusicOn = true;
            musicBtn.innerText = "🔊"; musicBtn.style.borderColor = "#00ff00";
        }).catch(err => { console.log("Autoplay blocked:", err); });
    }

    function pauseBgm() {
        bgm.pause();
        isMusicOn = false;
        musicBtn.innerText = "🔇"; musicBtn.style.borderColor = "#FFD700";
    }

    function startGame() {
        if (!isMusicOn && bgm.paused) playBgm();
        score = 0; timeLeft = 30; isPlaying = true;
        
        document.body.classList.add('game-running');
        document.getElementById('score-display').innerText = `💰 分數: ${score}`;
        document.getElementById('time-display').innerText = `⏳ ${timeLeft}s`;
        
        hideAllScreens();
        document.querySelectorAll('.item, .pop').forEach(e => e.remove());

        gameInterval = setInterval(() => {
            timeLeft--;
            document.getElementById('time-display').innerText = `⏳ ${timeLeft}s`;
            if (timeLeft <= 0) endGame();
        }, 1000);

        spawnInterval = setInterval(spawnItem, 200);
    }

    function spawnItem() {
        if (!isPlaying) return;
        
        const r = Math.random();
        let currentProb = 0;
        let selectedItem = items[0];
        for (let item of items) {
            currentProb += item.prob;
            if (r < currentProb) { selectedItem = item; break; }
        }

        const el = document.createElement('div');
        el.classList.add('item');
        el.innerText = selectedItem.symbol;
        el.style.left = (Math.random() * 80 + 10) + '%';
        
        // 修改需求：速度有快有慢，原本是 2~3.5s，改為 1.2s~4.0s
        const speed = (Math.random() * 2.8 + 1.2).toFixed(2);
        el.style.animationDuration = speed + 's';
        
        el.onpointerdown = (e) => {
            e.preventDefault();
            if (el.classList.contains('clicked')) return;
            el.classList.add('clicked');
            score += selectedItem.val;
            document.getElementById('score-display').innerText = `💰 分數: ${score}`;
            if (navigator.vibrate) navigator.vibrate(selectedItem.val > 0 ? 50 : 200);
            showEffect(e.clientX, e.clientY, selectedItem.val);
            el.style.opacity = '0';
            setTimeout(() => el.remove(), 100);
        };

        if (selectedItem.symbol === '🧨') {
            const originalHandler = el.onpointerdown;
            el.onpointerdown = (e) => {
                originalHandler(e);
                document.body.style.backgroundColor = '#500';
                setTimeout(()=> { if(isPlaying) document.body.style.backgroundColor = '#111'; }, 100);
            }
        }

        document.getElementById('game-container').appendChild(el);
        el.addEventListener('animationend', () => el.remove());
    }

    function showEffect(x, y, val) {
        const div = document.createElement('div');
        div.classList.add('pop');
        div.innerText = (val > 0 ? '+' : '') + val;
        div.style.color = val > 0 ? '#FFD700' : '#ff4d4d';
        div.style.left = x + 'px'; div.style.top = y + 'px';
        document.getElementById('game-container').appendChild(div);
        setTimeout(() => div.remove(), 600);
    }

    function endGame() {
        isPlaying = false;
        clearInterval(gameInterval);
        clearInterval(spawnInterval);
        document.body.classList.remove('game-running');
        document.getElementById('final-score').innerText = score;
        let msg = horseBlessings[0].text;
        for(let i = horseBlessings.length - 1; i >= 0; i--) {
            if(score >= horseBlessings[i].min) { msg = horseBlessings[i].text; break; }
        }
        document.getElementById('blessing-content').innerText = msg;
        showScreen('input-screen');
    }

    function submitScore() {
        const name = document.getElementById('username').value.trim();
        if (!name) { alert("請輸入暱稱！"); return; }
        if (/[<>]/.test(name)) { alert("暱稱不能包含特殊符號"); return; }
        const statusBtn = document.getElementById('submit-status');
        const submitBtn = document.querySelector('#input-screen .btn');
        statusBtn.innerText = "資料上傳中...";
        submitBtn.disabled = true;
  
  const token = simpleHash(name + score + SECRET_KEY);
        const url = `${SCRIPT_URL}?action=save&name=${encodeURIComponent(name)}&score=${score}&token=${token}`;
        fetch(url)
            .then(res => res.json())
            .then(data => {
                if(data.result === 'success') {
                    showLeaderboard();
                } else {
                    alert("上傳失敗：" + (data.error || "未知錯誤"));
                }
            })
            .catch(err => alert("連線錯誤"))
            .finally(() => { statusBtn.innerText = ""; submitBtn.disabled = false; });
    }

    function showLeaderboard() {
        showScreen('leaderboard-screen');
        const contentDiv = document.getElementById('rank-content');
        contentDiv.innerHTML = '<div style="padding:20px; text-align:center; color: white;">正在抓取最新排名...</div>';
        fetch(`${SCRIPT_URL}?action=read`)
            .then(res => res.json())
            .then(data => {
                contentDiv.innerHTML = '';
                if (data.length === 0) {
                    contentDiv.innerHTML = '<div style="padding:10px; color: white;">目前還沒有人挑戰！</div>';
                    return;
                }
                data.forEach((user, index) => {
                    const div = document.createElement('div');
                    div.className = 'rank-item';
                    let rankDisplay = index + 1;
                    if(index === 0) rankDisplay = '🥇';
                    else if(index === 1) rankDisplay = '🥈';
                    else if(index === 2) rankDisplay = '🥉';
                    div.innerHTML = `
                        <div class="rank-num">${rankDisplay}</div>
                        <div class="rank-name">${user.name}</div>
                        <div class="rank-score">${user.score}</div>
                    `;
                    contentDiv.appendChild(div);
                });
            })
            .catch(err => { contentDiv.innerHTML = '<div style="color:white;">無法載入排行榜</div>'; });
    }

    function returnToStart() {
        document.body.classList.remove('game-running');
        document.querySelectorAll('.item, .pop').forEach(e => e.remove());
        showScreen('start-screen');
    }

    function showScreen(id) {
        hideAllScreens();
        const el = document.getElementById(id);
        el.classList.remove('hidden');
        setTimeout(() => el.style.opacity = '1', 10);
    }

    function hideAllScreens() {
        document.querySelectorAll('.overlay').forEach(el => {
            el.classList.add('hidden');
            el.style.opacity = '0';
        });
    }

    window.addEventListener('load', function() {
        playBgm();
    });

    function unlockAudio() {
        if (!isMusicOn) {
            playBgm();
        }
        document.removeEventListener('click', unlockAudio);
        document.removeEventListener('touchstart', unlockAudio);
        document.removeEventListener('keydown', unlockAudio);
    }

    document.addEventListener('click', unlockAudio);
    document.addEventListener('touchstart', unlockAudio);
    document.addEventListener('keydown', unlockAudio);
</script>
