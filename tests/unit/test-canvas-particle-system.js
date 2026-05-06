// tests/unit/test-canvas-particle-system.js

const CanvasParticleSystem = require('./canvas-particle-system');

describe('CanvasParticleSystem', () => {
  let canvasElement, system, mockCtx;

  beforeEach(() => {
    // Create mock canvas element
    canvasElement = document.createElement('canvas');
    canvasElement.width = 800;
    canvasElement.height = 600;
    canvasElement.id = 'test-canvas';
    document.body.appendChild(canvasElement);

    // Mock canvas 2D context
    mockCtx = {
      clearRect: jasmine.createSpy('clearRect'),
      fillRect: jasmine.createSpy('fillRect'),
      arc: jasmine.createSpy('arc'),
      fill: jasmine.createSpy('fill'),
      beginPath: jasmine.createSpy('beginPath'),
      fillStyle: '',
      globalAlpha: 1
    };

    // Override getContext to return our mock
    spyOn(canvasElement, 'getContext').and.returnValue(mockCtx);
  });

  afterEach(() => {
    document.body.removeChild(canvasElement);
  });

  describe('Initialization Tests', () => {
    it('should create instance with default parameters', () => {
      system = new CanvasParticleSystem(canvasElement);
      expect(system.canvas).toBe(canvasElement);
      expect(system.particleCount).toBe(100);
      expect(system.particleSize).toBe(2);
      expect(system.speed).toBe(0.5);
    });

    it('should create instance with custom parameters', () => {
      system = new CanvasParticleSystem(canvasElement, 50, 3, 0.8);
      expect(system.particleCount).toBe(50);
      expect(system.particleSize).toBe(3);
      expect(system.speed).toBe(0.8);
    });

    it('should initialize particles array with correct count', () => {
      system = new CanvasParticleSystem(canvasElement, 30, 2, 0.5);
      system.initialize();
      expect(system.particles.length).toBe(30);
    });

    it('should create particles with valid properties (position in bounds)', () => {
      system = new CanvasParticleSystem(canvasElement, 10, 2, 0.5);
      system.initialize();

      system.particles.forEach(particle => {
        expect(particle.x).toBeGreaterThanOrEqual(0);
        expect(particle.x).toBeLessThanOrEqual(800);
        expect(particle.y).toBeGreaterThanOrEqual(0);
        expect(particle.y).toBeLessThanOrEqual(600);
        expect(particle.life).toBe(1);
        expect(particle.opacity).toBe(1);
      });
    });

    it('should set velocities within speed range', () => {
      system = new CanvasParticleSystem(canvasElement, 10, 2, 0.5);
      system.initialize();

      system.particles.forEach(particle => {
        expect(particle.vx).toBeGreaterThanOrEqual(-0.5);
        expect(particle.vx).toBeLessThanOrEqual(0.5);
        expect(particle.vy).toBeGreaterThanOrEqual(-0.5);
        expect(particle.vy).toBeLessThanOrEqual(0.5);
      });
    });
  });

  describe('Particle Behavior Tests', () => {
    it('should move particles by velocity each frame', () => {
      system = new CanvasParticleSystem(canvasElement, 1, 2, 0.5);
      system.initialize();

      const particle = system.particles[0];
      const initialX = particle.x;
      const initialY = particle.y;
      const vx = particle.vx;
      const vy = particle.vy;

      system.updateParticles();

      expect(particle.x).toBeCloseTo(initialX + vx, 0.1);
      expect(particle.y).toBeCloseTo(initialY + vy, 0.1);
    });

    it('should decrease particle life each frame', () => {
      system = new CanvasParticleSystem(canvasElement, 1, 2, 0.5);
      system.initialize();

      const particle = system.particles[0];
      const initialLife = particle.life;

      system.updateParticles();

      expect(particle.life).toBeLessThan(initialLife);
      expect(particle.life).toBeCloseTo(initialLife - 0.005, 0.001);
    });

    it('should decrease opacity proportionally with life', () => {
      system = new CanvasParticleSystem(canvasElement, 1, 2, 0.5);
      system.initialize();

      const particle = system.particles[0];
      particle.life = 0.5;

      system.updateParticles();

      expect(particle.opacity).toBeLessThanOrEqual(0.5);
    });

    it('should wrap particles at canvas edges', () => {
      system = new CanvasParticleSystem(canvasElement, 1, 2, 0.5);
      system.initialize();

      const particle = system.particles[0];
      particle.x = 799;
      particle.vx = 10;

      system.updateParticles();

      expect(particle.x).toBeGreaterThanOrEqual(0);
      expect(particle.x).toBeLessThanOrEqual(800);
    });

    it('should reset particles when life reaches 0', () => {
      system = new CanvasParticleSystem(canvasElement, 1, 2, 0.5);
      system.initialize();

      const particle = system.particles[0];
      particle.life = 0.003;

      system.updateParticles();

      expect(particle.life).toBeGreaterThan(0);
      expect(particle.opacity).toBeGreaterThan(0);
    });
  });

  describe('Rendering Tests', () => {
    it('should clear canvas before drawing', () => {
      system = new CanvasParticleSystem(canvasElement, 5, 2, 0.5);
      system.initialize();
      system.renderParticles();

      expect(mockCtx.clearRect).toHaveBeenCalledWith(0, 0, 800, 600);
    });

    it('should draw correct number of particles', () => {
      system = new CanvasParticleSystem(canvasElement, 5, 2, 0.5);
      system.initialize();
      system.renderParticles();

      expect(mockCtx.beginPath.calls.count()).toBe(5);
    });

    it('should apply opacity to particles during render', () => {
      system = new CanvasParticleSystem(canvasElement, 1, 2, 0.5);
      system.initialize();

      system.particles[0].opacity = 0.75;

      system.renderParticles();

      expect(mockCtx.globalAlpha).toBe(0.75);
    });
  });

  describe('Animation Control Tests', () => {
    it('should start animation and set isAnimating to true', () => {
      system = new CanvasParticleSystem(canvasElement, 5, 2, 0.5);
      system.initialize();

      expect(system.isAnimating).toBe(false);

      system.start();

      expect(system.isAnimating).toBe(true);
    });

    it('should stop animation and set isAnimating to false', () => {
      system = new CanvasParticleSystem(canvasElement, 5, 2, 0.5);
      system.initialize();
      system.start();

      system.stop();

      expect(system.isAnimating).toBe(false);
      expect(mockCtx.clearRect).toHaveBeenCalled();
    });
  });
});
