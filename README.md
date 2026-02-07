# Nezha 页面增强组件完整使用说明

## 组件介绍

本文档包含两个精美的页面增强组件，为你的 Nezha 监控页面增添更好的用户体验：

1. **IP 欢迎弹窗** - 显示访问者的地理位置和 IP 地址
2. **音乐播放器** - 在页面播放背景音乐

两个组件采用统一的紫色渐变设计风格，完美融合，互不冲突。

---

## 📍 组件一：IP 欢迎弹窗

### 功能特性
✅ 自动获取访问者的地理位置（支持中文显示）  
✅ 显示访问者的 IP 地址  
✅ 首次访问时自动弹出，10秒后自动收起  
✅ 收起后变成小图标，点击可重新展开  
✅ 完美适配移动端  
✅ 支持暗色模式  
✅ 优雅的动画效果  

### 显示效果
- **位置**：右下角
- **首次访问**：自动弹出欢迎信息，显示"欢迎来自 [地理位置] 的朋友"和 IP 地址
- **再次访问**：只显示一个小定位图标，点击可查看信息

### 使用方法

#### 1. 上传文件
将 `ip-welcome.js` 上传到你的 GitHub 仓库（与其他 JS 文件同目录）

#### 2. 引入代码
在 Nezha 自定义代码区域添加：

```html
<script src="https://cdn.jsdelivr.net/gh/你的用户名/你的仓库名@main/ip-welcome.js"></script>
```

#### 示例：
```html
<script src="https://cdn.jsdelivr.net/gh/zeyouerxing/my-nezhajs-cdn/ip-welcome.js"></script>
```

### 清除访问记录
如果想重新测试弹窗效果，在浏览器控制台（F12）输入：

```javascript
localStorage.removeItem('ip_welcome_shown');
```

然后刷新页面即可。

---

## 🎵 组件二：音乐播放器

### 功能特性
✅ 简洁的控制条设计（紫色渐变主题）  
✅ 直接显示：上一曲、播放/暂停、下一曲、列表按钮  
✅ 显示当前播放歌曲名  
✅ 点击列表按钮查看所有音乐  
✅ 加载完成后自动播放  
✅ 自动循环播放  
✅ 移动端完美适配  
✅ 暗色模式支持  
✅ 播放时的脉冲动画  

### 显示效果
- **位置**：左下角
- **控制条**：从左到右显示 [上一曲] [播放/暂停] [下一曲] [当前歌曲名] [列表]
- **播放列表**：点击列表按钮弹出，显示所有可播放的音乐

### 使用方法

#### 1. 准备音乐文件
将你的音乐文件（.mp3 格式）上传到 GitHub 仓库

#### 2. 修改配置
打开 `music-player.js` 文件，找到 `CONFIG` 对象并修改：

```javascript
const CONFIG = {
    // CDN 基础路径（修改为你的实际地址）
    cdnBase: 'https://cdn.jsdelivr.net/gh/zeyouerxing/my-nezhajs-cdn/',
    
    // 音乐列表（添加你的音乐文件名）
    playlist: [
        '我们都一样.mp3',
        '第二首歌.mp3',
        '第三首歌.mp3',
        // 在这里添加更多音乐...
    ],
    
    // 默认音量（0-1）
    defaultVolume: 0.7,
    
    // 是否自动播放
    autoplay: true,
    
    // 是否循环播放
    loop: true
};
```

#### 3. 引入代码
在 Nezha 自定义代码区域添加：

```html
<script src="https://cdn.jsdelivr.net/gh/你的用户名/你的仓库名@main/music-player.js"></script>
```

#### 示例：
```html
<script src="https://cdn.jsdelivr.net/gh/zeyouerxing/my-nezhajs-cdn/music-player.js"></script>
```

---

## 🎨 完整集成示例

### Nezha 自定义代码区域完整配置：

```html
<!-- Nezha 基础配置 -->
<script>
    window.CustomLogo = "https://i.imgs.ovh/2026/01/05/y7isvC.jpeg";
    window.ShowNetTransfer  = "true";
    window.DisableAnimatedMan  = "true";
    window.CustomDesc ="重要的不是速度，而是感受。";
</script>

<!-- 背景图片 -->
<script>
    window.CustomBackgroundImage="https://i.imgs.ovh/2026/01/07/yO9SRt.jpeg";
</script>

<!-- 其他装饰效果 -->
<script src="https://cdn.jsdelivr.net/gh/zeyouerxing/my-nezhajs-cdn/aixin.js"></script>
<script src="https://cdn.jsdelivr.net/gh/zeyouerxing/my-nezhajs-cdn/yinghua.js"></script>
<span class="js-cursor-container"></span>
<script src="https://cdn.jsdelivr.net/gh/zeyouerxing/my-nezhajs-cdn/xiaoxingxing.js"></script>

<!-- 🎵 音乐播放器（左下角） -->
<script src="https://cdn.jsdelivr.net/gh/zeyouerxing/my-nezhajs-cdn/music-player.js"></script>

<!-- 📍 IP 欢迎弹窗（右下角） -->
<script src="https://cdn.jsdelivr.net/gh/zeyouerxing/my-nezhajs-cdn/ip-welcome.js"></script>

<!-- 其他自定义代码 -->
<script>
    var observer = new MutationObserver(function(mutationsList, observer) {
        var xpath = "/html/body/div/div/main/div[2]/section[1]/div[4]/div";
        var container = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    
        if (container) {
            observer.disconnect();
            var existingImg = container.querySelector("img");
            if (existingImg) {
                container.removeChild(existingImg);
            }
            var imgElement = document.createElement("img");
            imgElement.src = "https://i.imgs.ovh/2026/01/05/y7i8xq.webp";
            imgElement.style.position = "absolute";
            imgElement.style.right = "8px";
            imgElement.style.top = "-80px";
            imgElement.style.zIndex = "10";
            imgElement.style.width = "90px";
            container.appendChild(imgElement);
        }
    });
    var config = { childList: true, subtree: true };
    observer.observe(document.body, config);
</script>
```

---

## 📁 文件结构

将以下文件上传到你的 GitHub 仓库（例如：`my-nezhajs-cdn`）：

```
my-nezhajs-cdn/
├── ip-welcome.js          # IP 欢迎弹窗
├── music-player.js        # 音乐播放器
├── 我们都一样.mp3         # 音乐文件1
├── 第二首歌.mp3           # 音乐文件2
├── 第三首歌.mp3           # 音乐文件3
└── ...                    # 更多音乐文件
```

---

## ⚙️ 配置参数说明

### IP 欢迎弹窗配置
在 `ip-welcome.js` 中可修改以下参数：

```javascript
const CONFIG = {
    storageKey: 'ip_welcome_shown',  // localStorage 键名
    displayDuration: 10000,           // 首次显示时长（毫秒）
    apiDelay: 500                     // API 请求延迟（毫秒）
};
```

### 音乐播放器配置
在 `music-player.js` 中可修改以下参数：

```javascript
const CONFIG = {
    cdnBase: 'https://cdn.jsdelivr.net/gh/你的用户名/你的仓库名/',
    playlist: ['歌曲1.mp3', '歌曲2.mp3'],
    defaultVolume: 0.7,    // 默认音量 0-1
    autoplay: true,        // 是否自动播放
    loop: true             // 是否循环播放
};
```

---

## 🎨 设计风格统一

两个组件采用统一的设计语言：

### 颜色主题
- 主色调：紫色渐变（`#667eea` → `#764ba2`）
- 背景：半透明毛玻璃效果
- 边框：白色半透明
- 悬停：紫色半透明高亮

### 动画效果
- 淡入淡出：cubic-bezier(0.68, -0.55, 0.265, 1.55)
- 脉冲动画：2秒循环
- 悬停缩放：1.1倍

### 布局位置
- **IP 弹窗**：右下角（距离底部和右侧各 20px）
- **音乐播放器**：左下角（距离底部和左侧各 20px）
- **互不冲突**：两者分别在屏幕两侧，互不遮挡

---

## 📱 移动端适配

### 自动适配功能
- 屏幕宽度 ≤ 768px 时自动切换到移动端样式
- 所有元素自动缩小以适应小屏幕
- 触摸优化，点击区域加大
- 列表面板宽度自适应

### 移动端表现
- IP 弹窗宽度自适应屏幕
- 音乐播放器控制条紧凑排列
- 列表面板不超出屏幕范围

---

## 🌙 暗色模式

两个组件都支持系统暗色模式自动适配：

### 自动检测
```css
@media (prefers-color-scheme: dark) {
    /* 暗色模式样式 */
}
```

### 暗色模式变化
- 背景：从白色变为深灰色
- 文字：从深色变为浅色
- 渐变色：保持紫色主题，调整透明度

---

## 🔧 常见问题

### IP 弹窗相关

**Q: 为什么显示"远方"？**  
A: 可能是 API 请求失败或网络问题，请检查浏览器控制台的错误信息。

**Q: 如何修改弹窗位置？**  
A: 修改 `ip-welcome.js` 中的 CSS：
```css
#ip-welcome-widget {
    bottom: 20px;  /* 距离底部 */
    right: 20px;   /* 距离右侧 */
}
```

**Q: 显示的是拼音而不是中文？**  
A: 文件中已内置中文映射表，如果还显示拼音，请确保使用的是最新版本的 `ip-welcome.js`。

### 音乐播放器相关

**Q: 音乐无法播放？**  
A: 检查：
1. 音乐文件是否正确上传到 GitHub
2. CDN 地址是否正确（注意结尾要有 `/`）
3. 文件名是否与配置中的一致
4. 浏览器控制台是否有错误信息

**Q: 自动播放不起作用？**  
A: 现代浏览器通常会阻止自动播放音频。用户需要先与页面交互（如点击）后才能自动播放。建议保持 `autoplay: true`，浏览器会在允许的情况下自动播放。

**Q: 如何添加更多音乐？**  
A: 在 `music-player.js` 的 `playlist` 数组中添加更多文件名：
```javascript
playlist: [
    '歌曲1.mp3',
    '歌曲2.mp3',
    '歌曲3.mp3',
    '歌曲4.mp3',  // 继续添加...
],
```

**Q: 能否关闭自动播放？**  
A: 可以，将 `autoplay` 设置为 `false`：
```javascript
autoplay: false,
```

### 通用问题

**Q: 两个组件会冲突吗？**  
A: 不会！IP 弹窗在右下角，音乐播放器在左下角，设计时已考虑互不影响。

**Q: 移动端显示正常吗？**  
A: 完全支持，两个组件都有完善的移动端适配。

**Q: 如何只使用其中一个组件？**  
A: 只引入你需要的那个 JS 文件即可，两者完全独立。

**Q: 支持哪些浏览器？**  
A: 
- ✅ Chrome / Edge（推荐）
- ✅ Firefox
- ✅ Safari
- ✅ 移动端浏览器

---

## 📊 性能优化建议

### IP 弹窗
- 首次加载后会记录在 localStorage，再次访问不会重复请求 API
- API 请求有 500ms 延迟，避免影响页面加载速度
- 轻量级设计，总体积小于 10KB

### 音乐播放器
- 音乐文件建议控制在 10MB 以内
- 使用 `preload="metadata"` 预加载元数据
- CDN 加速确保快速加载

---

## 🎯 自定义修改指南

### 修改颜色主题
两个组件都使用相同的紫色渐变，如需修改，搜索以下颜色代码并替换：

```css
/* 主渐变色 */
linear-gradient(135deg, #667eea 0%, #764ba2 100%)

/* 主色调 */
#667eea  /* 紫色 */
#764ba2  /* 深紫色 */
```

### 修改动画速度
```css
transition: all 0.3s ease;  /* 修改 0.3s 为其他值 */
```

### 修改字体大小
在各自的 CSS 中搜索 `font-size` 并调整数值。

---

## 📝 音乐文件命名建议

### 推荐命名方式
- ✅ `歌曲名.mp3`（如：`我们都一样.mp3`）
- ✅ `歌手-歌曲名.mp3`（如：`周杰伦-晴天.mp3`）
- ✅ 使用中文、英文、数字都可以

### 不推荐
- ❌ 文件名包含特殊字符：`歌曲名?.mp3`
- ❌ 文件名有空格，建议用 `-` 代替

---

## 🔄 更新日志

### IP 欢迎弹窗 v1.0.0 (2025-02-07)
- 初始版本发布
- 支持中文地理位置显示
- 添加移动端适配
- 添加暗色模式支持

### 音乐播放器 v2.0.0 (2025-02-07)
- 重新设计为简洁控制条样式
- 直接显示所有控制按钮
- 添加当前播放歌曲名显示
- 统一紫色渐变主题
- 优化移动端体验

---

## 💡 使用建议

1. **先测试后部署**：在本地或测试环境先测试，确认无误后再部署到生产环境
2. **合理配置音乐数量**：建议播放列表不超过 20 首，避免加载过慢
3. **注意版权**：使用音乐文件时请注意版权问题
4. **定期检查**：定期检查 CDN 链接是否有效，GitHub 仓库是否正常
5. **备份配置**：保存好修改后的配置文件，避免丢失

---

## 📞 支持与反馈

如有问题或建议，欢迎通过以下方式反馈：
- GitHub Issues
- 在使用说明下方留言

---

## 📜 许可说明

这两个组件为开源项目，可自由使用和修改。

---

## 🎉 结语

通过这两个精美的组件，你的 Nezha 监控页面将更加生动有趣！

- 左下角：悠扬的背景音乐 🎵
- 右下角：温馨的访客欢迎 📍

祝你使用愉快！✨
