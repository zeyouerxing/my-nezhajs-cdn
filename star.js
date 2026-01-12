(function () {

  /* 防止 CDN 重复加载 */
  if (window.__METEOR_EFFECT__) return;
  window.__METEOR_EFFECT__ = true;

  function startMeteor() {

    /* body 兜底检测（关键） */
    if (!document.body) {
      setTimeout(startMeteor, 50);
      return;
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    document.body.appendChild(canvas);

    canvas.style.cssText = `
      position:fixed;
      inset:0;
      pointer-events:none;
      z-index:999999;
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

    const rand = (a, b) => Math.random() * (b - a) + a;

    /* 拖尾粒子 */
    function Particle(x, y) {
      this.x = x;
      this.y = y;
      this.vx = rand(-0.5, 0.5);
      this.vy = rand(-0.5, 0.5);
      this.r = rand(0.6, 1.6);
      this.alpha = rand(0.4, 0.9);
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
      this.len = rand(120, 260);
      this.speed = rand(8, 14);
      this.size = rand(1, 2.4);
      this.alpha = rand(0.6, 1);
    };

    Meteor.prototype.update = function () {
      this.x += this.speed;
      this.y += this.speed * 0.9;

      if (Math.random() < 0.7 && particles.length < 300) {
        particles.push(
          new Particle(
            this.x - this.len * 0.8,
            this.y - this.len * 0.8
          )
        );
      }

      if (this.x > W || this.y > H) this.reset();
    };

    Meteor.prototype.draw = function () {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.lineWidth = this.size;
      ctx.lineCap = "round";

      const g = ctx.createLinearGradient(
        this.x, this.y,
        this.x - this.len, this.y - this.len
      );
      g.addColorStop(0, "rgba(255,255,255,1)");
      g.addColorStop(1, "rgba(255,255,255,0)");

      ctx.strokeStyle = g;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x - this.len, this.y - this.len);
      ctx.stroke();
      ctx.restore();
    };

    /* 初始化 */
    for (let i = 0; i < 8; i++) meteors.push(new Meteor());

    function loop() {
      ctx.clearRect(0, 0, W, H);

      meteors.forEach(m => {
        m.update();
        m.draw();
      });

      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].life <= 0 || particles[i].alpha < 0.05) {
          particles.splice(i, 1);
        }
      }

      requestAnimationFrame(loop);
    }

    loop();
  }

  startMeteor();

})();
