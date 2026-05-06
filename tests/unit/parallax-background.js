// tests/unit/parallax-background.js

class ParallaxBackground {
  constructor(container, layers = [], scrollMultiplier = 0.5) {
    this.container = container;
    this.layers = Array.isArray(layers) ? layers : [];
    this.scrollMultiplier = scrollMultiplier;
    this.scrollY = 0;
    this.layerOffsets = [];
    this.scrollHandler = null;
  }

  initialize() {
    // Query all elements in container with data-depth attribute
    const elements = this.container.querySelectorAll('[data-depth]');

    // Create layer objects for each element
    this.layers = Array.from(elements).map((element) => {
      const depth = parseFloat(element.getAttribute('data-depth'));
      return {
        element,
        depth,
        initialOffset: 0
      };
    });

    // Initialize layer offsets array with zeros
    this.layerOffsets = this.layers.map(() => 0);
  }

  updateLayerOffsets() {
    // For each layer: offset = scrollY * depth * scrollMultiplier
    this.layerOffsets = this.layers.map((layer) => {
      return this.scrollY * layer.depth * this.scrollMultiplier;
    });

    // Apply calculated offset to layer elements via transform
    this.layers.forEach((layer, index) => {
      const offset = this.layerOffsets[index];
      layer.element.style.transform = `translateY(${offset}px)`;
    });
  }

  handleScroll(scrollY) {
    // Update scroll position
    this.scrollY = scrollY;

    // Call updateLayerOffsets to apply transforms
    this.updateLayerOffsets();
  }

  attachScrollListener() {
    // Create scroll event handler that calls handleScroll
    this.scrollHandler = () => {
      this.handleScroll(window.scrollY || window.pageYOffset);
    };

    // Add scroll event listener to window
    window.addEventListener('scroll', this.scrollHandler);
  }

  detachScrollListener() {
    // Remove scroll event listener
    if (this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler);
      this.scrollHandler = null;
    }
  }

  setScrollMultiplier(value) {
    // Validate value is between 0 and 1
    if (typeof value !== 'number' || value < 0 || value > 1) {
      throw new Error('Scroll multiplier must be a number between 0 and 1');
    }

    // Update scroll multiplier
    this.scrollMultiplier = value;

    // Trigger immediate update
    this.updateLayerOffsets();
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ParallaxBackground;
}
