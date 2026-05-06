// tests/unit/mouse-follower.js

class MouseFollower {
  constructor(element, easing = 0.15) {
    // Input validation
    if (!element) {
      throw new Error('MouseFollower requires a DOM element');
    }
    if (easing <= 0 || easing >= 1) {
      throw new Error('Easing must be between 0 and 1');
    }

    this.element = element;
    this.easing = easing;
    this.x = 0;
    this.y = 0;
    this.targetX = 0;
    this.targetY = 0;

    // Store the event handler as a property to prevent memory leaks
    // This allows us to remove the exact same listener later
    this.mouseHandler = (e) => {
      this.updatePosition(e);
      this.render();
    };
  }

  updatePosition(event) {
    if (event) {
      this.targetX = event.clientX;
      this.targetY = event.clientY;
    }

    // Apply easing for smooth following
    this.x += (this.target