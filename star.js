/* 网页特效 - 流星（带拖尾粒子碎屑） */
(function () {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  document.body.appendChild(canvas);

  canvas.style.cssText = `
    position:fixed;
    left:0;
    top:0;
    pointer-events:none;
    z-index:9999;
  `;

  let W, H;
  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  const meteors = [];
  const particles = [];
  const stars = [];

  const rand = (min, max) => Math.random() * (max - min) + min;

  /* 拖尾粒子 */
  function Particle(x, y) {
    this.x = x;
    this.y = y;
    this.vx = rand(-0.6, 0.6);
    this.vy = rand(-0.6, 0.6);
    this.r = rand(0.5, 1.5);
    this.alpha = rand(0.4, 0.8);
    this.life = rand(20, 40);
  }

  Particle.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;
    this.life--;
    this.alpha *= 0.96;
    this.r *= 0.97;
  };

  Particle.prototype.draw = function () {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  /* 流星 */
  function Meteor() {
    this.reset();
  }

  Meteor.prototype.reset = function () {
    this.x = rand(-W * 0.2, 0);
    this.y = rand(-H * 0.2, 0);
    this.len = rand(100, 220);
    this.speed = rand(7, 13);
    this.size = rand(1, 2.5);
    this.alpha = rand(0.6, 1);
    this.flash = Math.random() < 0.5;
    this.flashSpeed = rand(0.02, 0.05);
  };

  Meteor.prototype.update = function () {
    this.x += this.speed;
    this.y += this.speed * 0.9;

    /* 闪烁 */
    if (this.flash) {
      this.alpha += Math.sin(Date.now() * this.flashSpeed) * 0.02;
      this.alpha = Math.max(0.3, Math.min(1, this.alpha));
    }

    /* 生成拖尾粒子 */
    if (Math.random() < 0.6 && particles.length < 300) {
      particles.push(
        new Particle(
          this.x - this.len * 0.8,
          this.y - this.len * 0.8
        )
      );
    }

    if (this.x > W || this.y > H) {
      this.reset();
    }
  };

  Meteor.prototype.draw = function () {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.lineWidth = this.size;
    ctx.lineCap = "round";

    const grad = ctx.createLinearGradient(
      this.x,
      this.y,
      this.x - this.len,
      this.y - this.len
    );
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(1, "rgba(255,255,255,0)");

    ctx.strokeStyle = grad;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x - this.len, this.y - this.len);
    ctx.stroke();
    ctx.restore();
  };

  /* 闪烁星点 */
  function Star() {
    this.x = rand(0, W);
    this.y = rand(0, H);
    this.r = rand(1, 2);
    this.alpha = 0;
    this.life = rand(10, 20);
  }

  Star.prototype.update = function () {
    this.life--;
    this.alpha = Math.sin(this.life * 0.3);
  };

  Star.prototype.draw = function () {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  /* 初始化 */
  for (let i = 0; i < 10; i++) meteors.push(new Meteor());

  function loop() {
    ctx.clearRect(0, 0, W, H);

    /* 流星 */
    meteors.forEach(m => {
      m.update();
      m.draw();
    });

    /* 拖尾粒子 */
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw();
      if (particles[i].life <= 0 || particles[i].alpha < 0.05) {
        particles.splice(i, 1);
      }
    }

    /* 偶尔闪星 */
    if (Math.random() < 0.012 && stars.length < 2) {
      stars.push(new Star());
    }

    for (let i = stars.length - 1; i >= 0; i--) {
      stars[i].update();
      stars[i].draw();
      if (stars[i].life <= 0) stars.splice(i, 1);
    }

    requestAnimationFrame(loop);
  }

  loop();
})();
