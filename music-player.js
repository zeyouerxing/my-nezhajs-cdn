/**
 * 音乐播放器组件
 * 功能：在页面左下角显示一个简洁的音乐播放器控制条
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
            // '第二首歌.mp3',
            // '第三首歌.mp3',
            // 在这里添加更多音乐...
        ],
        
        // 默认音量（0-1）
        defaultVolume: 0.7,
        
        // 是否自动播放（加载完成后自动播放）
        autoplay: true,
        
        // 是否循环播放列表
        loop: true
    };

    // ==================== 样式注入 ====================
    const style = document.createElement('style');
    style.textContent = `
        /* 播放器主容器 - 左下角 */
        #music-player-widget {
            position: fixed;
            bottom: 20px;
            left: 20px;
            z-index: 9998;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        /* 播放控制条 */
        .music-control-bar {
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(20px);
            border-radius: 28px;
            padding: 8px 12px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
            border: 1px solid rgba(255, 255, 255, 0.5);
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s ease;
        }

        .music-control-bar:hover {
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        }

        /* 控制按钮通用样式 */
        .music-btn {
            width: 36px;
            height: 36px;
            background: rgba(102, 126, 234, 0.1);
            border: none;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            flex-shrink: 0;
        }

        .music-btn:hover {
            background: rgba(102, 126, 234, 0.2);
            transform: scale(1.1);
        }

        .music-btn svg {
            width: 18px;
            height: 18px;
            fill: #667eea;
        }

        /* 播放/暂停按钮 - 稍大 */
        .music-btn.play-pause {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .music-btn.play-pause svg {
            width: 20px;
            height: 20px;
            fill: white;
        }

        .music-btn.play-pause:hover {
            transform: scale(1.15);
        }

        /* 列表按钮 */
        .music-btn.list-btn {
            position: relative;
        }

        /* 播放中的脉冲动画 */
        @keyframes music-pulse {
            0%, 100% {
                box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.4);
            }
            50% {
                box-shadow: 0 0 0 6px rgba(102, 126, 234, 0);
            }
        }

        .music-btn.play-pause.playing {
            animation: music-pulse 2s infinite;
        }

        /* 音乐列表面板 */
        .music-playlist-panel {
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(20px);
            border-radius: 12px;
            padding: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            border: 1px solid rgba(255, 255, 255, 0.5);
            max-height: 280px;
            width: 260px;
            opacity: 0;
            transform: translateY(10px) scale(0.95);
            pointer-events: none;
            transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            overflow: hidden;
        }

        .music-playlist-panel.show {
            opacity: 1;
            transform: translateY(0) scale(1);
            pointer-events: auto;
        }

        /* 列表头部 */
        .playlist-header {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            padding-bottom: 8px;
            border-bottom: 2px solid rgba(102, 126, 234, 0.2);
        }

        .playlist-header-icon {
            width: 28px;
            height: 28px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 8px;
            font-size: 14px;
        }

        .playlist-header-text h3 {
            margin: 0;
            font-size: 14px;
            font-weight: bold;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .playlist-header-text p {
            margin: 2px 0 0 0;
            font-size: 10px;
            color: #999;
        }

        /* 播放列表容器 */
        .playlist-items {
            max-height: 200px;
            overflow-y: auto;
        }

        /* 播放列表项 */
        .playlist-item {
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
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .playlist-item:hover {
            background: rgba(102, 126, 234, 0.05);
            color: #667eea;
        }

        .playlist-item.active {
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
            color: #667eea;
            font-weight: 600;
        }

        .playlist-item-icon {
            font-size: 14px;
            flex-shrink: 0;
        }

        .playlist-item.active .playlist-item-icon {
            animation: spin 2s linear infinite;
        }

        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        /* 滚动条样式 */
        .playlist-items::-webkit-scrollbar {
            width: 4px;
        }

        .playlist-items::-webkit-scrollbar-track {
            background: rgba(102, 126, 234, 0.05);
            border-radius: 2px;
        }

        .playlist-items::-webkit-scrollbar-thumb {
            background: rgba(102, 126, 234, 0.3);
            border-radius: 2px;
        }

        .playlist-items::-webkit-scrollbar-thumb:hover {
            background: rgba(102, 126, 234, 0.5);
        }

        /* 当前播放信息 */
        .now-playing {
            font-size: 12px;
            color: #667eea;
            font-weight: 500;
            max-width: 150px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            flex-shrink: 1;
        }

        /* 移动端适配 */
        @media (max-width: 768px) {
            #music-player-widget {
                bottom: 15px;
                left: 15px;
            }

            .music-control-bar {
                padding: 6px 10px;
                gap: 6px;
            }

            .music-btn {
                width: 32px;
                height: 32px;
            }

            .music-btn svg {
                width: 16px;
                height: 16px;
            }

            .music-btn.play-pause {
                width: 36px;
                height: 36px;
            }

            .music-btn.play-pause svg {
                width: 18px;
                height: 18px;
            }

            .music-playlist-panel {
                width: calc(100vw - 30px);
                max-width: 240px;
            }

            .now-playing {
                max-width: 100px;
                font-size: 11px;
            }
        }

        /* 暗色模式适配 */
        @media (prefers-color-scheme: dark) {
            .music-control-bar,
            .music-playlist-panel {
                background: rgba(30, 30, 30, 0.98);
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .now-playing {
                color: #a78bfa;
            }

            .playlist-item {
                color: #ccc;
            }

            .playlist-item:hover {
                background: rgba(102, 126, 234, 0.1);
                color: #a78bfa;
            }

            .playlist-item.active {
                background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%);
                color: #a78bfa;
            }

            .playlist-header-text p {
                color: #888;
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
            return `<div class="playlist-item" data-index="${index}">
                <span class="playlist-item-icon">🎵</span>
                <span>${songName}</span>
            </div>`;
        }).join('');
        
        widget.innerHTML = `
            <!-- 音乐列表面板 -->
            <div class="music-playlist-panel">
                <div class="playlist-header">
                    <div class="playlist-header-icon">🎵</div>
                    <div class="playlist-header-text">
                        <h3>播放列表</h3>
                        <p>Playlist (${CONFIG.playlist.length} 首)</p>
                    </div>
                </div>
                <div class="playlist-items">
                    ${playlistHtml}
                </div>
            </div>

            <!-- 控制条 -->
            <div class="music-control-bar">
                <!-- 上一曲 -->
                <button class="music-btn prev-btn" title="上一曲">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                    </svg>
                </button>
                
                <!-- 播放/暂停 -->
                <button class="music-btn play-pause" title="播放/暂停">
                    <svg class="play-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 5v14l11-7z"/>
                    </svg>
                    <svg class="pause-icon" style="display: none;" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                    </svg>
                </button>
                
                <!-- 下一曲 -->
                <button class="music-btn next-btn" title="下一曲">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
                    </svg>
                </button>

                <!-- 当前播放 -->
                <div class="now-playing">加载中...</div>
                
                <!-- 列表按钮 -->
                <button class="music-btn list-btn" title="播放列表">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
                    </svg>
                </button>
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
            this.playlistPanel = widget.querySelector('.music-playlist-panel');
            this.controlBar = widget.querySelector('.music-control-bar');
            
            // 控制元素
            this.playPauseBtn = widget.querySelector('.play-pause');
            this.playIcon = widget.querySelector('.play-icon');
            this.pauseIcon = widget.querySelector('.pause-icon');
            this.prevBtn = widget.querySelector('.prev-btn');
            this.nextBtn = widget.querySelector('.next-btn');
            this.listBtn = widget.querySelector('.list-btn');
            
            // 显示元素
            this.nowPlayingEl = widget.querySelector('.now-playing');
            
            // 播放列表
            this.playlistItems = widget.querySelectorAll('.playlist-item');
            
            // 状态
            this.currentIndex = 0;
            this.isPlaying = false;
            this.listVisible = false;
            
            // 初始化
            this.init();
        }

        init() {
            // 设置默认音量
            this.audio.volume = CONFIG.defaultVolume;
            
            // 绑定事件
            this.bindEvents();
            
            // 加载第一首歌
            if (CONFIG.playlist.length > 0) {
                this.loadSong(0);
                
                // 如果设置了自动播放
                if (CONFIG.autoplay) {
                    // 延迟播放，等待用户交互
                    setTimeout(() => {
                        this.play();
                    }, 500);
                }
            }
        }

        bindEvents() {
            // 播放/暂停
            this.playPauseBtn.addEventListener('click', () => this.togglePlay());
            
            // 上一曲/下一曲
            this.prevBtn.addEventListener('click', () => this.prevSong());
            this.nextBtn.addEventListener('click', () => this.nextSong());
            
            // 列表按钮
            this.listBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleList();
            });
            
            // 点击外部关闭列表
            document.addEventListener('click', (e) => {
                if (!this.widget.contains(e.target) && this.listVisible) {
                    this.hideList();
                }
            });
            
            // 播放列表点击
            this.playlistItems.forEach(item => {
                item.addEventListener('click', () => {
                    const index = parseInt(item.dataset.index);
                    this.loadSong(index);
                    this.play();
                    this.hideList();
                });
            });
            
            // 音频事件
            this.audio.addEventListener('ended', () => this.onSongEnd());
            this.audio.addEventListener('play', () => this.onPlay());
            this.audio.addEventListener('pause', () => this.onPause());
            this.audio.addEventListener('error', (e) => this.onError(e));
        }

        // 显示/隐藏列表
        toggleList() {
            this.listVisible = !this.listVisible;
            if (this.listVisible) {
                this.playlistPanel.classList.add('show');
            } else {
                this.playlistPanel.classList.remove('show');
            }
        }

        hideList() {
            this.listVisible = false;
            this.playlistPanel.classList.remove('show');
        }

        // 加载歌曲
        loadSong(index) {
            if (index < 0 || index >= CONFIG.playlist.length) return;
            
            this.currentIndex = index;
            const songFile = CONFIG.playlist[index];
            const songName = getSongName(songFile);
            const songUrl = getMusicUrl(songFile);
            
            this.audio.src = songUrl;
            this.nowPlayingEl.textContent = songName;
            
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
            const playPromise = this.audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log('播放失败:', error);
                });
            }
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
            this.playPauseBtn.classList.add('playing');
        }

        onPause() {
            this.isPlaying = false;
            this.playIcon.style.display = 'block';
            this.pauseIcon.style.display = 'none';
            this.playPauseBtn.classList.remove('playing');
        }

        // 加载错误
        onError(e) {
            console.error('音乐加载失败:', e);
            this.nowPlayingEl.textContent = '加载失败';
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

        // 初始化播放器逻辑（会自动处理自动播放）
        const player = new MusicPlayer(widget);
    }

    // 启动
    init();
})();
