/**
 * 流星背景特效 - 纯JS实现
 */
const canvas = document.getElementById('starCanvas');
const ctx = canvas.getContext('2d');

let width, height;

// 初始化画布尺寸
function initCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
initCanvas();
window.addEventListener('resize', initCanvas);

const random = (min, max) => Math.random() * (max - min) + min;

/**
 * 流星类：从左上向右下移动
 */
class Meteor {
    constructor() {
        this.reset();
    }

    reset() {
        // 随机初始位置：确保从左上角的扇形区域出发
        if (Math.random() > 0.5) {
            this.x = random(-200, width * 0.4);
            this.y = -50;
        } else {
            this.x = -50;
            this.y = random(-200, height * 0.4);
        }
        
        this.speed = random(3, 8);       // 移动速度
        this.len = random(60, 160);      // 拖尾长度
        this.size = random(0.8, 2.5);    // 粗细
        this.baseOpacity = random(0.4, 0.9); // 基础亮度
        this.isFlashing = Math.random() > 0.4; // 60%的流星会闪烁
    }

    update() {
        this.x += this.speed;
        this.y += this.speed;

        // 流星闪烁逻辑：随机瞬间降低亮度
        if (this.isFlashing) {
            this.renderOpacity = Math.random() > 0.05 ? this.baseOpacity : 0.1;
        } else {
            this.renderOpacity = this.baseOpacity;
        }

        // 越界重置
        if (this.x > width + 100 || this.y > height + 100) {
            this.reset();
        }
    }

    draw() {
        ctx.save();
        const grad = ctx.createLinearGradient(this.x, this.y, this.x - this.len, this.y - this.len);
        grad.addColorStop(0, `rgba(255, 255, 255, ${this.renderOpacity})`);
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.strokeStyle = grad;
        ctx.lineWidth = this.size;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - this.len, this.y - this.len);
        ctx.stroke();
        ctx.restore();
    }
}

/**
 * 散星类：屏幕随机位置闪烁
 */
class TwinkleStar {
    constructor() {
        this.active = false;
    }

    spawn() {
        this.x = random(50, width - 50);
        this.y = random(50, height - 50);
        this.size = random(1, 3);
        this.opacity = 0;
        this.maxOpacity = random(0.5, 1);
        this.step = random(0.01, 0.03); // 闪烁速度
        this.state = 'in'; 
        this.active = true;
    }

    update() {
        if (!this.active) return;

        if (this.state === 'in') {
            this.opacity += this.step;
            if (this.opacity >= this.maxOpacity) this.state = 'out';
        } else {
            this.opacity -= this.step * 0.5;
            if (this.opacity <= 0) this.active = false;
        }
    }

    draw() {
        if (!this.active) return;
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// 实例列表
const meteors = Array.from({ length: 8 }, () => new Meteor());
const flashStars = Array.from({ length: 3 }, () => new TwinkleStar());

function animate() {
    // 每一帧覆盖一层极薄的黑色，产生拖尾重影感
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.fillRect(0, 0, width, height);

    // 绘制流星
    meteors.forEach(m => {
        m.update();
        m.draw();
    });

    // 绘制偶尔出现的闪烁星
    flashStars.forEach(s => {
        if (!s.active && Math.random() < 0.008) { // 极低概率触发，保证不频繁
            s.spawn();
        }
        s.update();
        s.draw();
    });

    requestAnimationFrame(animate);
}

// 启动动画
animate();
