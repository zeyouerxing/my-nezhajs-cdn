/**
 * 音乐播放器组件
 * 功能：在页面左下角显示一个精美的音乐播放器
 * 作者：自定义
 * 使用方法：在 HTML 中引入 <script src="music-player.js"></script>
 */

(function() {
    'use strict';
    
    // ==================== 配置参数 ====================
    const CONFIG = {
        // CDN 基础路径（硬编码）
        cdnBase: 'https://cdn.jsdelivr.net/gh/zeyouerxing/my-nezhajs-cdn/',
        
        // 音乐列表（只需要填写音乐名，会自动拼接 CDN 路径）
        playlist: [
            '我们都一样.mp3',
            '关不上的窗.mp3',
            // '第三首歌.mp3',
            // 在这里添加更多音乐...
        ],
        
        // 默认音量（0-1）
        defaultVolume: 0.7,
        
        // 是否自动播放
        autoplay: false,
        
        // 是否循环播放列表
        loop: true
    };

    // ==================== 样式注入 ====================
    const style = document.createElement('style');
    style.textContent = `
        /* 播放器主容器 */
        #music-player-widget {
            position: fixed;
            bottom: 20px;
            left: 20px;
            z-index: 9998;
            transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        /* 播放器面板 */
        .music-player-panel {
            width: 300px;
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(20px);
            border-radius: 16px;
            padding: 16px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
            border: 1px solid rgba(255, 255, 255, 0.5);
            opacity: 0;
            transform: translateY(20px) scale(0.95);
            pointer-events: none;
            transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .music-player-panel.show {
            opacity: 1;
            transform: translateY(0) scale(1);
            pointer-events: auto;
        }

        /* 音乐图标按钮 */
        .music-icon-btn {
            width: 56px;
            height: 56px;
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(245, 87, 108, 0.4);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .music-icon-btn::before {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 100%);
            border-radius: 50%;
        }

        .music-icon-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(245, 87, 108, 0.5);
        }

        .music-icon-btn svg {
            width: 28px;
            height: 28px;
            fill: white;
            position: relative;
            z-index: 1;
        }

        /* 播放中的脉冲动画 */
        @keyframes music-pulse {
            0% {
                box-shadow: 0 4px 15px rgba(245, 87, 108, 0.4);
            }
            50% {
                box-shadow: 0 4px 25px rgba(245, 87, 108, 0.6);
            }
            100% {
                box-shadow: 0 4px 15px rgba(245, 87, 108, 0.4);
            }
        }

        .music-icon-btn.playing {
            animation: music-pulse 2s infinite;
        }

        /* 标题区域 */
        .music-header {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            padding-bottom: 10px;
            border-bottom: 2px solid rgba(245, 87, 108, 0.2);
        }

        .music-header-icon {
            width: 36px;
            height: 36px;
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 10px;
            font-size: 18px;
        }

        .music-header-text h3 {
            margin: 0;
            font-size: 16px;
            font-weight: bold;
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .music-header-text p {
            margin: 2px 0 0 0;
            font-size: 11px;
            color: #999;
        }

        /* 当前播放信息 */
        .music-info {
            margin-bottom: 12px;
        }

        .music-title {
            font-size: 14px;
            font-weight: 600;
            color: #333;
            margin-bottom: 4px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .music-artist {
            font-size: 12px;
            color: #999;
        }

        /* 进度条 */
        .music-progress-container {
            margin-bottom: 12px;
        }

        .music-progress-bar {
            width: 100%;
            height: 6px;
            background: rgba(245, 87, 108, 0.1);
            border-radius: 3px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }

        .music-progress-bar-fill {
            height: 100%;
            background: linear-gradient(90deg, #f093fb 0%, #f5576c 100%);
            border-radius: 3px;
            width: 0%;
            transition: width 0.1s linear;
            position: relative;
        }

        .music-progress-bar-fill::after {
            content: '';
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 12px;
            height: 12px;
            background: white;
            border-radius: 50%;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .music-time {
            display: flex;
            justify-content: space-between;
            margin-top: 4px;
            font-size: 11px;
            color: #999;
        }

        /* 控制按钮 */
        .music-controls {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            margin-bottom: 12px;
        }

        .music-control-btn {
            width: 36px;
            height: 36px;
            background: rgba(245, 87, 108, 0.1);
            border: none;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .music-control-btn:hover {
            background: rgba(245, 87, 108, 0.2);
            transform: scale(1.1);
        }

        .music-control-btn svg {
            width: 18px;
            height: 18px;
            fill: #f5576c;
        }

        .music-control-btn.play-pause {
            width: 48px;
            height: 48px;
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }

        .music-control-btn.play-pause svg {
            width: 24px;
            height: 24px;
            fill: white;
        }

        .music-control-btn.play-pause:hover {
            transform: scale(1.15);
        }

        /* 音量控制 */
        .music-volume-container {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .music-volume-icon {
            width: 20px;
            height: 20px;
            fill: #f5576c;
            flex-shrink: 0;
        }

        .music-volume-slider {
            flex: 1;
            height: 4px;
            background: rgba(245, 87, 108, 0.1);
            border-radius: 2px;
            position: relative;
            cursor: pointer;
        }

        .music-volume-slider-fill {
            height: 100%;
            background: linear-gradient(90deg, #f093fb 0%, #f5576c 100%);
            border-radius: 2px;
            width: 70%;
        }

        /* 播放列表（可选） */
        .music-playlist {
            max-height: 150px;
            overflow-y: auto;
            margin-top: 12px;
            padding-top: 12px;
            border-top: 1px solid rgba(245, 87, 108, 0.1);
        }

        .music-playlist-item {
            padding: 8px 10px;
            margin-bottom: 4px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 13px;
            color: #666;
            transition: all 0.3s ease;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .music-playlist-item:hover {
            background: rgba(245, 87, 108, 0.05);
            color: #f5576c;
        }

        .music-playlist-item.active {
            background: linear-gradient(135deg, rgba(240, 147, 251, 0.1) 0%, rgba(245, 87, 108, 0.1) 100%);
            color: #f5576c;
            font-weight: 600;
        }

        /* 滚动条样式 */
        .music-playlist::-webkit-scrollbar {
            width: 4px;
        }

        .music-playlist::-webkit-scrollbar-track {
            background: rgba(245, 87, 108, 0.05);
            border-radius: 2px;
        }

        .music-playlist::-webkit-scrollbar-thumb {
            background: rgba(245, 87, 108, 0.3);
            border-radius: 2px;
        }

        .music-playlist::-webkit-scrollbar-thumb:hover {
            background: rgba(245, 87, 108, 0.5);
        }

        /* 移动端适配 */
        @media (max-width: 768px) {
            #music-player-widget {
                bottom: 15px;
                left: 15px;
            }

            .music-icon-btn {
                width: 50px;
                height: 50px;
            }

            .music-icon-btn svg {
                width: 24px;
                height: 24px;
            }

            .music-player-panel {
                width: calc(100vw - 30px);
                max-width: 280px;
            }

            .music-header-text h3 {
                font-size: 14px;
            }

            .music-title {
                font-size: 13px;
            }
        }

        /* 暗色模式适配 */
        @media (prefers-color-scheme: dark) {
            .music-player-panel {
                background: rgba(30, 30, 30, 0.98);
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .music-title {
                color: #fff;
            }

            .music-artist,
            .music-time {
                color: #aaa;
            }

            .music-playlist-item {
                color: #ccc;
            }

            .music-playlist-item:hover {
                background: rgba(245, 87, 108, 0.1);
                color: #f5576c;
            }
        }
    `;
    document.head.appendChild(style);

    // ==================== 工具函数 ====================
    
    // 格式化时间（秒转为 mm:ss）
    function formatTime(seconds) {
        if (isNaN(seconds) || seconds === Infinity) return '00:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    // 从文件名提取歌曲名（去掉扩展名）
    function getSongName(filename) {
        return filename.replace(/\.[^/.]+$/, '');
    }

    // 构建完整的音乐 URL
    function getMusicUrl(filename) {
        return CONFIG.cdnBase + encodeURIComponent(filename);
    }

    // ==================== DOM 创建 ====================
    function createPlayer() {
        const widget = document.createElement('div');
        widget.id = 'music-player-widget';
        
        // 生成播放列表 HTML
        const playlistHtml = CONFIG.playlist.map((song, index) => {
            const songName = getSongName(song);
            return `<div class="music-playlist-item" data-index="${index}">${songName}</div>`;
        }).join('');
        
        widget.innerHTML = `
            <div class="music-icon-btn">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                </svg>
            </div>
            
            <div class="music-player-panel">
                <div class="music-header">
                    <div class="music-header-icon">🎵</div>
                    <div class="music-header-text">
                        <h3>音乐播放器</h3>
                        <p>Music Player</p>
                    </div>
                </div>
                
                <div class="music-info">
                    <div class="music-title">暂无播放</div>
                    <div class="music-artist">选择一首歌曲开始播放</div>
                </div>
                
                <div class="music-progress-container">
                    <div class="music-progress-bar">
                        <div class="music-progress-bar-fill"></div>
                    </div>
                    <div class="music-time">
                        <span class="current-time">00:00</span>
                        <span class="total-time">00:00</span>
                    </div>
                </div>
                
                <div class="music-controls">
                    <button class="music-control-btn prev-btn" title="上一曲">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                        </svg>
                    </button>
                    
                    <button class="music-control-btn play-pause" title="播放/暂停">
                        <svg class="play-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                        <svg class="pause-icon" style="display: none;" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                        </svg>
                    </button>
                    
                    <button class="music-control-btn next-btn" title="下一曲">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
                        </svg>
                    </button>
                </div>
                
                <div class="music-volume-container">
                    <svg class="music-volume-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                    </svg>
                    <div class="music-volume-slider">
                        <div class="music-volume-slider-fill"></div>
                    </div>
                </div>
                
                <div class="music-playlist">
                    ${playlistHtml}
                </div>
            </div>
            
            <audio id="music-audio" preload="metadata"></audio>
        `;
        
        return widget;
    }

    // ==================== 播放器逻辑 ====================
    class MusicPlayer {
        constructor(widget) {
            this.widget = widget;
            this.audio = widget.querySelector('#music-audio');
            this.panel = widget.querySelector('.music-player-panel');
            this.iconBtn = widget.querySelector('.music-icon-btn');
            
            // 控制元素
            this.playPauseBtn = widget.querySelector('.play-pause');
            this.playIcon = widget.querySelector('.play-icon');
            this.pauseIcon = widget.querySelector('.pause-icon');
            this.prevBtn = widget.querySelector('.prev-btn');
            this.nextBtn = widget.querySelector('.next-btn');
            
            // 进度条
            this.progressBar = widget.querySelector('.music-progress-bar');
            this.progressFill = widget.querySelector('.music-progress-bar-fill');
            this.currentTimeEl = widget.querySelector('.current-time');
            this.totalTimeEl = widget.querySelector('.total-time');
            
            // 音量控制
            this.volumeSlider = widget.querySelector('.music-volume-slider');
            this.volumeFill = widget.querySelector('.music-volume-slider-fill');
            
            // 信息显示
            this.titleEl = widget.querySelector('.music-title');
            this.artistEl = widget.querySelector('.music-artist');
            
            // 播放列表
            this.playlistItems = widget.querySelectorAll('.music-playlist-item');
            
            // 状态
            this.currentIndex = 0;
            this.isPlaying = false;
            this.panelVisible = false;
            
            // 初始化
            this.init();
        }

        init() {
            // 设置默认音量
            this.audio.volume = CONFIG.defaultVolume;
            this.updateVolumeDisplay();
            
            // 绑定事件
            this.bindEvents();
            
            // 加载第一首歌（但不播放）
            if (CONFIG.playlist.length > 0) {
                this.loadSong(0);
            }
        }

        bindEvents() {
            // 面板显示/隐藏
            this.iconBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.togglePanel();
            });
            
            document.addEventListener('click', (e) => {
                if (!this.widget.contains(e.target) && this.panelVisible) {
                    this.hidePanel();
                }
            });
            
            // 播放/暂停
            this.playPauseBtn.addEventListener('click', () => this.togglePlay());
            
            // 上一曲/下一曲
            this.prevBtn.addEventListener('click', () => this.prevSong());
            this.nextBtn.addEventListener('click', () => this.nextSong());
            
            // 进度条点击
            this.progressBar.addEventListener('click', (e) => {
                const rect = this.progressBar.getBoundingClientRect();
                const percent = (e.clientX - rect.left) / rect.width;
                this.audio.currentTime = percent * this.audio.duration;
            });
            
            // 音量控制
            this.volumeSlider.addEventListener('click', (e) => {
                const rect = this.volumeSlider.getBoundingClientRect();
                const percent = (e.clientX - rect.left) / rect.width;
                this.audio.volume = Math.max(0, Math.min(1, percent));
                this.updateVolumeDisplay();
            });
            
            // 播放列表点击
            this.playlistItems.forEach(item => {
                item.addEventListener('click', () => {
                    const index = parseInt(item.dataset.index);
                    this.loadSong(index);
                    this.play();
                });
            });
            
            // 音频事件
            this.audio.addEventListener('timeupdate', () => this.updateProgress());
            this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
            this.audio.addEventListener('ended', () => this.onSongEnd());
            this.audio.addEventListener('play', () => this.onPlay());
            this.audio.addEventListener('pause', () => this.onPause());
        }

        // 显示/隐藏面板
        togglePanel() {
            this.panelVisible = !this.panelVisible;
            if (this.panelVisible) {
                this.panel.classList.add('show');
            } else {
                this.panel.classList.remove('show');
            }
        }

        hidePanel() {
            this.panelVisible = false;
            this.panel.classList.remove('show');
        }

        // 加载歌曲
        loadSong(index) {
            if (index < 0 || index >= CONFIG.playlist.length) return;
            
            this.currentIndex = index;
            const songFile = CONFIG.playlist[index];
            const songName = getSongName(songFile);
            const songUrl = getMusicUrl(songFile);
            
            this.audio.src = songUrl;
            this.titleEl.textContent = songName;
            this.artistEl.textContent = '未知艺术家';
            
            // 更新播放列表高亮
            this.playlistItems.forEach((item, i) => {
                if (i === index) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        }

        // 播放/暂停
        togglePlay() {
            if (this.isPlaying) {
                this.pause();
            } else {
                this.play();
            }
        }

        play() {
            this.audio.play();
        }

        pause() {
            this.audio.pause();
        }

        // 上一曲
        prevSong() {
            let newIndex = this.currentIndex - 1;
            if (newIndex < 0) {
                newIndex = CONFIG.playlist.length - 1;
            }
            this.loadSong(newIndex);
            if (this.isPlaying) {
                this.play();
            }
        }

        // 下一曲
        nextSong() {
            let newIndex = this.currentIndex + 1;
            if (newIndex >= CONFIG.playlist.length) {
                newIndex = 0;
            }
            this.loadSong(newIndex);
            if (this.isPlaying) {
                this.play();
            }
        }

        // 更新进度条
        updateProgress() {
            const percent = (this.audio.currentTime / this.audio.duration) * 100;
            this.progressFill.style.width = percent + '%';
            this.currentTimeEl.textContent = formatTime(this.audio.currentTime);
        }

        // 更新总时长
        updateDuration() {
            this.totalTimeEl.textContent = formatTime(this.audio.duration);
        }

        // 更新音量显示
        updateVolumeDisplay() {
            this.volumeFill.style.width = (this.audio.volume * 100) + '%';
        }

        // 歌曲播放结束
        onSongEnd() {
            if (CONFIG.loop) {
                this.nextSong();
            } else {
                this.pause();
            }
        }

        // 播放状态改变
        onPlay() {
            this.isPlaying = true;
            this.playIcon.style.display = 'none';
            this.pauseIcon.style.display = 'block';
            this.iconBtn.classList.add('playing');
        }

        onPause() {
            this.isPlaying = false;
            this.playIcon.style.display = 'block';
            this.pauseIcon.style.display = 'none';
            this.iconBtn.classList.remove('playing');
        }
    }

    // ==================== 初始化 ====================
    function init() {
        // 等待 DOM 加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        // 创建播放器
        const widget = createPlayer();
        document.body.appendChild(widget);

        // 初始化播放器逻辑
        const player = new MusicPlayer(widget);

        // 如果设置了自动播放
        if (CONFIG.autoplay && CONFIG.playlist.length > 0) {
            setTimeout(() => {
                player.play();
            }, 1000);
        }
    }

    // 启动
    init();
})();
