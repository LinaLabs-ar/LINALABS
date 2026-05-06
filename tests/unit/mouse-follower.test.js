// tests/unit/mouse-follower.test.js

const MouseFollower = require('./mouse-follower');

describe('MouseFollower', () => {
  let follower;

  beforeEach(() => {
    // Create mock DOM element
    document.body.innerHTML = '<div id="mouse-follower" style="position: fixed;"></div>';
    follower = new MouseFollower(document.getElementById('mouse-follower'));
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

      expect(follower.targetX).toBe(500);
      expect(follower.targetY).toBe(300);
    });

    it('should apply easing when tracking mouse', () => {
      follower.targetX = 500;
      follower.targetY = 300;

      follower.updatePosition(null);  // No event, just update easing

      // x,y should be between 0 and targetX/targetY due to easing
      expect(follower.x).toBeGreaterThan(0);
      expect(follower.x).toBeLessThan(500);
      expect(follower.y).toBeGreaterThan(0);
      expect(follower.y).toBeLessThan(300);
    });

    it('should render position to DOM element with transform', () => {
      follower.updatePosition(new MouseEvent('mousemove', {
        clientX: 100,
        clientY: 150
      }));
      follower.render();

      const element = document.getElementById('mouse-follower');
      expect(element.style.transform).toContain('translate');
    });

    it('should handle edge case: mouse at negative coordinates', () => {
      const event = new MouseEvent('mousemove', {
        clientX: -50,
        clientY: -25
      });

      follower.updatePosition(event);

      expect(follower.targetX).toBe(-50);
      expect(follower.targetY).toBe(-25);
    });
  });

  describe('render()', () => {
    it('should apply transform to element', () => {
      follower.x = 100;
      follower.y = 150;

      follower.render();

      const element = document.getElementById('mouse-follower');
      const transform = element.style.transform;

      expect(transform).toContain('translate');
    });
  });
});
