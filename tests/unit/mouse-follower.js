// tests/unit/mouse-follower.js

class MouseFollower {
  constructor(element, easing = 0.15) {
    this.element = element;
    this.easing = easing;
    this.x = 0;
    this.y = 0;
    this.targetX = 0;
    this.targetY = 0;
  }

  updatePosition(event) {
    if (event) {
      this.targetX = event.clientX;
      this.targetY = event.clientY;
    }

    // Apply easing for smooth following
    this.x += (this.targetX - this.x) * this.easing;
    this.y += (this.targetY - this.y) * this.easing;
  }

  render() {
    this.element.style.transform = `translate(${this.x}px, ${this.y}px)`;
    this.element.style.opacity = '0.7';
  }

  start() {
    document.addEventListener('mousemove', (e) => {
      this.updatePosition(e);
      this.render();
    });
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = MouseFollower;
}
