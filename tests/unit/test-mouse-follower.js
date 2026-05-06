// tests/unit/mouse-follower.test.js

const MouseFollower = require('./mouse-follower');

describe('MouseFollower', () => {
  let follower;

  beforeEach(() => {
    // Create mock DOM element
    document.body.innerHTML = '<div id="mouse-follower" style="position: fixed;"></div>';
    follower = new MouseFollower(document.getElementById('mouse-follower'));
  });

  describe('constructor()', () => {
    it('should throw error when element is null', () => {
      expect(() => {
        new MouseFollower(null);
      }).toThrow('MouseFollower requires a DOM element');
    });

    it('should throw error when element is undefined', () => {
      expect(() => {
        new MouseFollower(undefined);
      }).toThrow('MouseFollower requires a DOM element');
    });

    it('should throw error when easing is <= 0', () => {
      const element = document.getElementById('mouse-follower');
      expect(() => {
        new MouseFollower(element, 0);
      }).toThrow('Easing must be between 0 and 1');

      expect(() => {
        new MouseFollower(element, -0.5);
      }).toThrow('Easing must be between 0 and 1');
    });

    it('should throw error when easing is >= 1', () => {
      const element = document.getElementById('mouse-follower');
      expect(() => {
        new MouseFollower(element, 1);
      }).toThrow('Easing must be between 0 and 1');

      expect(() => {
        new MouseFollower(element, 1.5);
      }).toThrow('Easing must be between 0 and 1');
    });

    it('should accept valid easing values', () => {
      const element = document.getElementById('mouse-follower');
      expect(() => {
        new MouseFollower(element, 0.15);
      }).not.toThrow();

      expect(() => {
        new MouseFollower(element, 0.5);
      }).not.toThrow();

      expect(() => {
        new MouseFollower(element, 0.99);
      }).not.toThrow();
    });
  });

  describe('updatePosition()', () => {
    it('should initialize position to 0,0', () => {
      expect(follower.x).toBe(0);
      expect(follower.y).toBe(0);
    });

    it('should update targetX/targetY on mouse move event', () => {
      const event = new MouseEvent('mousemove', {
        clientX: 500,
        clientY: 300
      });

      follower.updatePosition(event);

      expect(follower.t