/**
 * IP 欢迎弹窗组件
 * 功能：显示访问者的地理位置和 IP 地址
 * 作者：自定义
 * 使用方法：在 HTML 中引入 <script src="ip-welcome.js"></script>
 */

(function() {
    'use strict';
    
    // ==================== 样式注入 ====================
    const style = document.createElement('style');
    style.textContent = `
        /* 主容器 */
        #ip-welcome-widget {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        /* 定位图标按钮 */
        .ip-icon-btn {
            width: 28px;
            height: 28px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .ip-icon-btn::before {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 100%);
            border-radius: 50%;
        }

        .ip-icon-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 3px 10px rgba(102, 126, 234, 0.5);
        }

        .ip-icon-btn svg {
            width: 16px;
            height: 16px;
            fill: white;
            position: relative;
            z-index: 1;
        }

        /* 信息卡片 */
        .ip-card {
            position: absolute;
            bottom: 35px;
            right: 0;
            width: 208px;
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(20px);
            border-radius: 10px;
            padding: 13px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
            opacity: 0;
            transform: translateY(10px) scale(0.95);
            pointer-events: none;
            transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            border: 1px solid rgba(255, 255, 255, 0.5);
        }

        .ip-card.show {
            opacity: 1;
            transform: translateY(0) scale(1);
            pointer-events: auto;
        }

        /* 卡片头部 */
        .card-header {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            padding-bottom: 8px;
            border-bottom: 1px solid rgba(102, 126, 234, 0.2);
        }

        .header-icon {
            margin-right: 8px;
            font-size: 20px;
        }

        .header-text {
            flex: 1;
        }

        .header-text h3 {
            margin: 0;
            font-size: 14px;
            font-weight: bold;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            line-height: 1.4;
        }

        .header-text .location-name {
            color: #764ba2;
            font-weight: 700;
        }

        /* 卡片内容 */
        .card-content {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .info-row {
            display: flex;
            align-items: center;
            padding: 7px 8px;
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
            border-radius: 7px;
            transition: all 0.3s ease;
        }

        .info-row:hover {
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
            transform: translateX(3px);
        }

        .info-icon {
            width: 21px;
            height: 21px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 8px;
            font-size: 12px;
            background: white;
            border-radius: 5px;
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
        }

        .info-text {
            flex: 1;
        }

        .info-label {
            font-size: 10px;
            color: #999;
            margin-bottom: 1px;
        }

        .info-value {
            font-size: 13px;
            font-weight: 600;
            color: #333;
        }

        .info-value.ip {
            color: #667eea;
            font-family: 'Courier New', monospace;
        }

        /* 加载动画 */
        .loading-dots {
            display: inline-flex;
            gap: 2px;
        }

        .loading-dots span {
            width: 3px;
            height: 3px;
            background: #667eea;
            border-radius: 50%;
            animation: bounce 1.4s infinite ease-in-out;
        }

        .loading-dots span:nth-child(1) { animation-delay: -0.32s; }
        .loading-dots span:nth-child(2) { animation-delay: -0.16s; }

        @keyframes bounce {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
        }

        /* 脉冲动画 - 首次访问时的呼吸效果 */
        @keyframes pulse {
            0% {
                box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
            }
            50% {
                box-shadow: 0 2px 12px rgba(102, 126, 234, 0.6);
            }
            100% {
                box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
            }
        }

        .ip-icon-btn.pulse {
            animation: pulse 2s infinite;
        }

        /* 移动端适配 */
        @media (max-width: 768px) {
            #ip-welcome-widget {
                bottom: 15px;
                right: 15px;
            }

            .ip-icon-btn {
                width: 25px;
                height: 25px;
            }

            .ip-icon-btn svg {
                width: 14px;
                height: 14px;
            }

            .ip-card {
                width: 195px;
                right: -15px;
                bottom: 32px;
                padding: 10px;
            }

            .card-header {
                margin-bottom: 8px;
            }

            .header-icon {
                font-size: 18px;
            }

            .header-text h3 {
                font-size: 12px;
            }

            .info-row {
                padding: 5px 7px;
            }

            .info-icon {
                width: 18px;
                height: 18px;
                font-size: 10px;
            }

            .info-value {
                font-size: 12px;
            }
        }

        /* 暗色模式适配 */
        @media (prefers-color-scheme: dark) {
            .ip-card {
                background: rgba(30, 30, 30, 0.98);
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .info-row {
                background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
            }

            .info-row:hover {
                background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%);
            }

            .info-icon {
                background: rgba(255, 255, 255, 0.05);
            }

            .info-label {
                color: #aaa;
            }

            .info-value {
                color: #fff;
            }

            .header-text .location-name {
                color: #a78bfa;
            }
        }
    `;
    document.head.appendChild(style);

    // ==================== 配置参数 ====================
    const CONFIG = {
        storageKey: 'ip_welcome_shown',  // localStorage 键名
        displayDuration: 10000,           // 首次显示时长（毫秒）
        apiDelay: 500                     // API 请求延迟（毫秒）
    };

    // ==================== 地区名称映射 ====================
    // 中文省份映射（拼音 -> 中文）
    const provinceMap = {
        'Anhui': '安徽',
        'Beijing': '北京',
        'Chongqing': '重庆',
        'Fujian': '福建',
        'Gansu': '甘肃',
        'Guangdong': '广东',
        'Guangxi': '广西',
        'Guizhou': '贵州',
        'Hainan': '海南',
        'Hebei': '河北',
        'Heilongjiang': '黑龙江',
        'Henan': '河南',
        'Hubei': '湖北',
        'Hunan': '湖南',
        'Jiangsu': '江苏',
        'Jiangxi': '江西',
        'Jilin': '吉林',
        'Liaoning': '辽宁',
        'Inner Mongolia': '内蒙古',
        'Ningxia': '宁夏',
        'Qinghai': '青海',
        'Shaanxi': '陕西',
        'Shandong': '山东',
        'Shanghai': '上海',
        'Shanxi': '山西',
        'Sichuan': '四川',
        'Tianjin': '天津',
        'Tibet': '西藏',
        'Xinjiang': '新疆',
        'Yunnan': '云南',
        'Zhejiang': '浙江',
        'Hong Kong': '香港',
        'Macao': '澳门',
        'Taiwan': '台湾'
    };

    // 中文城市映射（部分常见城市）
    const cityMap = {
        'Shenzhen': '深圳',
        'Guangzhou': '广州',
        'Hangzhou': '杭州',
        'Nanjing': '南京',
        'Chengdu': '成都',
        'Wuhan': '武汉',
        'Xi\'an': '西安',
        'Chongqing': '重庆',
        'Tianjin': '天津',
        'Suzhou': '苏州',
        'Zhengzhou': '郑州',
        'Changsha': '长沙',
        'Shenyang': '沈阳',
        'Qingdao': '青岛',
        'Xiamen': '厦门',
        'Dalian': '大连',
        'Ningbo': '宁波',
        'Jinan': '济南',
        'Harbin': '哈尔滨',
        'Fuzhou': '福州'
    };

    // 国家名称映射
    const countryMap = {
        'China': '中国',
        'United States': '美国',
        'Japan': '日本',
        'Korea': '韩国',
        'South Korea': '韩国',
        'United Kingdom': '英国',
        'France': '法国',
        'Germany': '德国',
        'Canada': '加拿大',
        'Australia': '澳大利亚',
        'Singapore': '新加坡',
        'Russia': '俄罗斯',
        'India': '印度',
        'Brazil': '巴西',
        'Thailand': '泰国',
        'Vietnam': '越南',
        'Malaysia': '马来西亚',
        'Indonesia': '印度尼西亚',
        'Philippines': '菲律宾'
    };

    // ==================== DOM 创建 ====================
    function createWidget() {
        const hasShown = localStorage.getItem(CONFIG.storageKey);
        
        const widget = document.createElement('div');
        widget.id = 'ip-welcome-widget';
        widget.innerHTML = `
            <div class="ip-icon-btn ${!hasShown ? 'pulse' : ''}">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
            </div>
            <div class="ip-card ${!hasShown ? 'show' : ''}">
                <div class="card-header">
                    <div class="header-icon">👋</div>
                    <div class="header-text">
                        <h3>欢迎来自 <span class="location-name"><div class="loading-dots" style="display: inline-flex;"><span></span><span></span><span></span></div></span> 的朋友</h3>
                    </div>
                </div>
                <div class="card-content">
                    <div class="info-row">
                        <div class="info-icon">🌐</div>
                        <div class="info-text">
                            <div class="info-label">你的 IP</div>
                            <div class="info-value ip">
                                <div class="loading-dots">
                                    <span></span><span></span><span></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        return widget;
    }

    // ==================== 事件绑定 ====================
    function bindEvents(widget) {
        const hasShown = localStorage.getItem(CONFIG.storageKey);
        const iconBtn = widget.querySelector('.ip-icon-btn');
        const card = widget.querySelector('.ip-card');
        let cardVisible = !hasShown;

        // 点击图标切换显示/隐藏
        iconBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            cardVisible = !cardVisible;
            if (cardVisible) {
                card.classList.add('show');
            } else {
                card.classList.remove('show');
            }
        });

        // 点击外部区域关闭卡片
        document.addEventListener('click', function(e) {
            if (!widget.contains(e.target) && cardVisible) {
                card.classList.remove('show');
                cardVisible = false;
            }
        });

        return { iconBtn, card, cardVisible };
    }

    // ==================== 地理位置转换 ====================
    function translateLocation(city, region, country) {
        // 转换国家名称
        const translatedCountry = countryMap[country] || country;
        
        // 转换省份
        const translatedRegion = provinceMap[region] || region;
        
        // 转换城市
        const translatedCity = cityMap[city] || city;
        
        let location = '';
        
        if (translatedCountry === '中国') {
            // 中国地区：显示 省份 城市
            if (translatedCity && translatedRegion && translatedCity !== translatedRegion) {
                location = `${translatedRegion} ${translatedCity}`;
            } else if (translatedRegion) {
                location = translatedRegion;
            } else if (translatedCity) {
                location = translatedCity;
            } else {
                location = translatedCountry;
            }
        } else {
            // 其他国家：显示 城市, 国家
            if (translatedCity && translatedCountry) {
                location = `${translatedCity}, ${translatedCountry}`;
            } else if (translatedCountry) {
                location = translatedCountry;
            } else if (translatedCity) {
                location = translatedCity;
            } else {
                location = '远方';
            }
        }
        
        return location;
    }

    // ==================== 更新界面 ====================
    function updateWidget(card, iconBtn, location, ip) {
        card.querySelector('.location-name').textContent = location;
        card.querySelector('.info-value.ip').textContent = ip;

        const hasShown = localStorage.getItem(CONFIG.storageKey);
        
        // 如果是首次访问，设置自动收起
        if (!hasShown) {
            setTimeout(() => {
                card.classList.remove('show');
                iconBtn.classList.remove('pulse');
                localStorage.setItem(CONFIG.storageKey, 'true');
            }, CONFIG.displayDuration);
        }
    }

    // ==================== API 请求 ====================
    function fetchIPInfo(card, iconBtn) {
        // 使用 ipapi.co API
        fetch('https://ipapi.co/json/')
            .then(response => response.json())
            .then(data => {
                console.log('IP 信息获取成功:', data);
                
                const ip = data.ip || '未知';
                const city = data.city || '';
                const region = data.region || '';
                const country = data.country_name || '';
                
                // 转换为中文
                const location = translateLocation(city, region, country);
                
                updateWidget(card, iconBtn, location, ip);
            })
            .catch(error => {
                console.error('IP 信息获取失败:', error);
                // 备用方案
                fetch('https://api.ipify.org?format=json')
                    .then(res => res.json())
                    .then(ipData => {
                        const ip = ipData.ip;
                        return fetch(`https://ipapi.co/${ip}/json/`);
                    })
                    .then(res => res.json())
                    .then(data => {
                        console.log('备用 API 成功:', data);
                        const ip = data.ip || '未知';
                        const city = data.city || '';
                        const region = data.region || '';
                        const country = data.country_name || '';
                        
                        const location = translateLocation(city, region, country);
                        updateWidget(card, iconBtn, location, ip);
                    })
                    .catch(err => {
                        console.error('所有 API 都失败:', err);
                        updateWidget(card, iconBtn, '远方', '未知');
                    });
            });
    }

    // ==================== 初始化 ====================
    function init() {
        // 等待 DOM 加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        // 创建组件
        const widget = createWidget();
        document.body.appendChild(widget);

        // 绑定事件
        const { iconBtn, card } = bindEvents(widget);

        // 延迟获取 IP 信息
        setTimeout(() => {
            fetchIPInfo(card, iconBtn);
        }, CONFIG.apiDelay);
    }

    // 启动
    init();
})();
