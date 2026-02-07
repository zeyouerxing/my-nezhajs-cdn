/**
 * 音乐播放器组件（最终增强版）
 * 左下角固定播放器，与 IP 欢迎组件对称平齐
 */

(function () {
    'use strict';

    /* ==================== 配置 ==================== */
    const CONFIG = {
        cdnBase: 'https://cdn.jsdelivr.net/gh/zeyouerxing/my-nezhajs-cdn/',
        playlist: [
            '我们都一样.mp3'
            '关不上的窗.mp3'
        ],
        defaultVolume: 0.7,
        autoplay: true,
        loop: true,
        storageKey: 'music_player_state'
    };

    /* ==================== 样式 ==================== */
    const style = document.createElement('style');
    style.textContent = `
#music-player-widget {
    position: fixed;
    bottom: 14px;
    left: 20px;
    z-index: 9998;
    font-family: system-ui, -apple-system, BlinkMacSystemFont;
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
}

.music-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    background: rgba(102,126,234,.12);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: .25s;
}

.music-btn:hover { transform: scale(1.1); }

.music-btn svg {
    width: 18px;
    height: 18px;
    fill: #667eea;
}

.music-btn.play-pause {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg,#667eea,#764ba2);
}

.music-btn.play-pause svg { fill:#fff; }

.music-btn.playing {
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0%,100% { box-shadow:0 0 0 0 rgba(118,75,162,.4); }
    50% { box-shadow:0 0 0 6px rgba(118,75,162,0); }
}

/* ===== 进度条（渐变 + 发光） ===== */
.music-progress {
    -webkit-appearance: none;
    width: 120px;
    height: 4px;
    border-radius: 999px;
    background: linear-gradient(
        90deg,
        #667eea 0%,
        #764ba2 var(--progress,0%),
        rgba(102,126,234,.15) var(--progress,0%),
        rgba(102,126,234,.15) 100%
    );
    cursor: pointer;
}

.music-progress::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: linear-gradient(135deg,#667eea,#764ba2);
    box-shadow:0 0 6px rgba(118,75,162,.6);
}

/* ===== 音量 ===== */
.music-volume {
    -webkit-appearance:none;
    width:70px;
    height:4px;
    border-radius:999px;
    background:linear-gradient(90deg,#667eea,#764ba2);
}

.music-volume::-webkit-slider-thumb {
    -webkit-appearance:none;
    width:10px;
    height:10px;
    border-radius:50%;
    background:#fff;
}

.now-playing {
    max-width:120px;
    font-size:12px;
    color:#667eea;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
}

@media (max-width:768px) {
    #music-player-widget { bottom:9px; left:15px; }
}
`;
    document.head.appendChild(style);

    /* ==================== 工具 ==================== */
    const songName = f => f.replace(/\.[^/.]+$/, '');
    const songUrl = f => CONFIG.cdnBase + encodeURIComponent(f);

    /* ==================== DOM ==================== */
    const widget = document.createElement('div');
    widget.id = 'music-player-widget';
    widget.innerHTML = `
<div class="music-control-bar">
    <button class="music-btn prev-btn">
        <svg viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
    </button>

    <button class="music-btn play-pause">
        <svg class="play-icon" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
        <svg class="pause-icon" viewBox="0 0 24 24" style="display:none"><path d="M6 4h4v16H6zm8 0h4v16h-4z"/></svg>
    </button>

    <button class="music-btn next-btn">
        <svg viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
    </button>

    <div class="now-playing">加载中</div>

    <input class="music-progress" type="range" min="0" max="100" value="0">

    <button class="music-btn mute-btn">🔊</button>
    <input class="music-volume" type="range" min="0" max="100">

    <audio preload="metadata"></audio>
</div>
`;

    document.body.appendChild(widget);

    /* ==================== 播放器逻辑 ==================== */
    const audio = widget.querySelector('audio');
    const playBtn = widget.querySelector('.play-pause');
    const playIcon = widget.querySelector('.play-icon');
    const pauseIcon = widget.querySelector('.pause-icon');
    const progress = widget.querySelector('.music-progress');
    const volume = widget.querySelector('.music-volume');
    const muteBtn = widget.querySelector('.mute-btn');
    const title = widget.querySelector('.now-playing');

    let index = 0;
    let lastVolume = CONFIG.defaultVolume;

    function save() {
        localStorage.setItem(CONFIG.storageKey, JSON.stringify({
            index,
            time: audio.currentTime,
            volume: audio.volume,
            muted: audio.muted
        }));
    }

    function load() {
        const s = localStorage.getItem(CONFIG.storageKey);
        if (!s) return;
        try {
            const d = JSON.parse(s);
            index = d.index || 0;
            audio.currentTime = d.time || 0;
            audio.volume = d.volume ?? CONFIG.defaultVolume;
            audio.muted = d.muted || false;
            volume.value = audio.volume * 100;
            muteBtn.textContent = audio.muted ? '🔇' : '🔊';
        } catch {}
    }

    function loadSong(i) {
        index = (i + CONFIG.playlist.length) % CONFIG.playlist.length;
        audio.src = songUrl(CONFIG.playlist[index]);
        title.textContent = songName(CONFIG.playlist[index]);
        save();
    }

    function play() {
        const p = audio.play();
        if (p) p.catch(() => {});
    }

    playBtn.onclick = () => audio.paused ? play() : audio.pause();
    widget.querySelector('.prev-btn').onclick = () => loadSong(index - 1);
    widget.querySelector('.next-btn').onclick = () => loadSong(index + 1);

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
        const p = audio.currentTime / audio.duration * 100;
        progress.value = p;
        progress.style.setProperty('--progress', p + '%');
        save();
    };

    progress.oninput = () => {
        audio.currentTime = audio.duration * progress.value / 100;
    };

    volume.oninput = () => {
        audio.volume = volume.value / 100;
        lastVolume = audio.volume;
        audio.muted = false;
        muteBtn.textContent = '🔊';
        save();
    };

    muteBtn.onclick = () => {
        audio.muted = !audio.muted;
        muteBtn.textContent = audio.muted ? '🔇' : '🔊';
        save();
    };

    audio.onended = () => CONFIG.loop && loadSong(index + 1);

    /* ==================== 启动 ==================== */
    audio.volume = CONFIG.defaultVolume;
    volume.value = CONFIG.defaultVolume * 100;
    load();
    loadSong(index);
    if (CONFIG.autoplay) setTimeout(play, 500);

})();
