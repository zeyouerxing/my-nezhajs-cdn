/**
 * 音乐播放器组件（修复版）
 */

(function () {
    'use strict';

    /* ==================== 配置 ==================== */
    const CONFIG = {
        cdnBase: 'https://cdn.jsdelivr.net/gh/zeyouerxing/my-nezhajs-cdn@main/',
        playlist: [
            '我们都一样.mp3', // 补齐了逗号
            '关不上的窗.mp3'
        ],
        defaultVolume: 0.7,
        autoplay: false, // 建议默认设为 false，防止浏览器安全拦截导致不显示
        loop: true,
        storageKey: 'music_player_state'
    };

    /* ==================== 样式注入 ==================== */
    const style = document.createElement('style');
    style.textContent = `
#music-player-widget {
    position: fixed;
    bottom: 20px; /* 对齐 IP 脚本高度 */
    left: 20px;
    z-index: 10001; /* 确保层级最高 */
    font-family: system-ui, -apple-system, BlinkMacSystemFont;
    transition: opacity 0.3s ease;
}

.music-control-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border-radius: 28px;
    background: rgba(255,255,255,0.98);
    backdrop-filter: blur(20px);
    box-shadow: 0 4px 16px rgba(0,0,0,.15);
    border: 1px solid rgba(0,0,0,0.05);
}

.music-btn {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    background: rgba(102,126,234,.12);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: .25s;
    padding: 0;
}

.music-btn:hover { transform: scale(1.1); }

.music-btn svg {
    width: 16px;
    height: 16px;
    fill: #667eea;
}

.music-btn.play-pause {
    width: 36px;
    height: 36px;
    background: linear-gradient(135deg,#667eea,#764ba2);
}

.music-btn.play-pause svg { fill:#fff; }

.music-btn.playing {
    animation: music-pulse 2s infinite;
}

@keyframes music-pulse {
    0%,100% { box-shadow:0 0 0 0 rgba(118,75,162,.4); }
    50% { box-shadow:0 0 0 6px rgba(118,75,162,0); }
}

.music-progress {
    -webkit-appearance: none;
    width: 80px;
    height: 4px;
    border-radius: 999px;
    background: #eee;
    cursor: pointer;
    background-image: linear-gradient(#667eea, #764ba2);
    background-size: var(--progress, 0%) 100%;
    background-repeat: no-repeat;
}

.music-progress::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #764ba2;
}

.now-playing {
    max-width: 80px;
    font-size: 11px;
    color: #667eea;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 600;
}

/* 暗色模式支持 */
@media (prefers-color-scheme: dark) {
    .music-control-bar {
        background: rgba(30, 30, 30, 0.98);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .now-playing { color: #a78bfa; }
}

@media (max-width:768px) {
    #music-player-widget { bottom:15px; left:15px; scale: 0.9; }
    .music-progress { width: 50px; }
}
`;
    document.head.appendChild(style);

    /* ==================== 初始化函数 ==================== */
    function initPlayer() {
        const widget = document.createElement('div');
        widget.id = 'music-player-widget';
        widget.innerHTML = `
            <div class="music-control-bar">
                <button class="music-btn prev-btn"><svg viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg></button>
                <button class="music-btn play-pause">
                    <svg class="play-icon" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    <svg class="pause-icon" viewBox="0 0 24 24" style="display:none"><path d="M6 4h4v16H6zm8 0h4v16h-4z"/></svg>
                </button>
                <button class="music-btn next-btn"><svg viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg></button>
                <div class="now-playing">准备中</div>
                <input class="music-progress" type="range" min="0" max="100" value="0">
                <audio preload="metadata"></audio>
            </div>
        `;

        document.body.appendChild(widget);

        const audio = widget.querySelector('audio');
        const playBtn = widget.querySelector('.play-pause');
        const playIcon = widget.querySelector('.play-icon');
        const pauseIcon = widget.querySelector('.pause-icon');
        const progress = widget.querySelector('.music-progress');
        const title = widget.querySelector('.now-playing');

        let currentIndex = 0;

        const loadSong = (i) => {
            currentIndex = (i + CONFIG.playlist.length) % CONFIG.playlist.length;
            const fileName = CONFIG.playlist[currentIndex];
            audio.src = CONFIG.cdnBase + encodeURIComponent(fileName);
            title.textContent = fileName.replace(/\.[^/.]+$/, '');
        };

        playBtn.onclick = () => {
            if (audio.paused) {
                audio.play().catch(e => console.log("播放被拦截:", e));
            } else {
                audio.pause();
            }
        };

        widget.querySelector('.prev-btn').onclick = () => { loadSong(currentIndex - 1); audio.play(); };
        widget.querySelector('.next-btn').onclick = () => { loadSong(currentIndex + 1); audio.play(); };

        audio.onplay = () => {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
            playBtn.classList.add('playing');
        };

        audio.onpause = () => {
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
            playBtn.classList.remove('playing');
        };

        audio.ontimeupdate = () => {
            if (!audio.duration) return;
            const p = (audio.currentTime / audio.duration) * 100;
            progress.value = p;
            progress.style.setProperty('--progress', p + '%');
        };

        progress.oninput = () => {
            if (audio.duration) audio.currentTime = (progress.value / 100) * audio.duration;
        };

        audio.onended = () => loadSong(currentIndex + 1) || audio.play();

        // 首次加载
        audio.volume = CONFIG.defaultVolume;
        loadSong(0);
    }

    // 确保 DOM 准备好后再挂载，模仿 ip-welcome.js 的稳健做法
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPlayer);
    } else {
        initPlayer();
    }

})();
