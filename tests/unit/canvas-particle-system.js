// tests/unit/canvas-particle-system.js

class CanvasParticleSystem {
  constructor(canvasElement, particleCount = 100, particleSize = 2, speed = 0.5) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.particleCount = particleCount;
    this.particleSize = particleSize;
    this.speed = speed;
    this.particles = [];
    this.animationId = null;
    this.isAnimating = false;

    this.initialize();
  }

  initialize() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      const particle = {
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 2 * this.speed,
        vy: (Math.random() - 0.5) * 2 * this.speed,
        life: 1,
        opacity: 1
      };
      this.particles.push(particle);
    }
  }

  updateParticles() {
    this.particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life -= 0.005;
      particle.opacity = particle.life;

      if (particle.x < 0) particle.x = this.canvas.width;
      if (particle.x > this.canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = this.canvas.height;
      if (particle.y > this.canvas.height) particle.y = 0;

      if (particle.life <= 0) {
        particle.x = Math.random() * this.canvas.width;
        particle.y = Math.random() * this.canvas.height;
        particle.vx = (Math.random() - 0.5) * 2 * this.speed;
        particle.vy = (Math.random() - 0.5) * 2 * this.speed;
        particle.life = 1;
        particle.opacity = 1;
      }
    });
  }

  renderParticles() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach((particle) => {
      this.ctx.globalAlpha = particle.opacity;
      this.ctx.fillStyle = 'rgba(255, 255, 255, 1)';
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, this.particleSize, 0, Math.PI * 2);
      this.ctx.fill();
    });

    this.ctx.globalAlpha = 1;
  }

  animate() {
    if (!this.isAnimating) return;

    this.updateParticles();
    this.renderParticles();

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  start() {
    this.isAnimating = true;
    this.animate();
  }

  stop() {
    this.isAnimating = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CanvasParticleSystem;
}
