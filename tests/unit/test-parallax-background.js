// tests/unit/test-parallax-background.js

const ParallaxBackground = require('./parallax-background');

describe('ParallaxBackground', () => {
  let container;

  beforeEach(() => {
    // Create mock container with layers
    document.body.innerHTML = '';
    container = document.createElement('div');
    container.id = 'parallax-container';

    const layer1 = document.createElement('div');
    layer1.className = 'parallax-layer';
    layer1.setAttribute('data-depth', '0.3');
    layer1.textContent = 'Layer 1';

    const layer2 = document.createElement('div');
    layer2.className = 'parallax-layer';
    layer2.setAttribute('data-depth', '0.6');
    layer2.textContent = 'Layer 2';

    const layer3 = document.createElement('div');
    layer3.className = 'parallax-layer';
    layer3.setAttribute('data-depth', '0.9');
    layer3.textContent = 'Layer 3';

    container.appendChild(layer1);
    container.appendChild(layer2);
    container.appendChild(layer3);
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('Initialization Tests', () => {
    it('should create instance with correct properties', () => {
      const system = new ParallaxBackground(container, [], 0.5);

      expect(system.container).toBe(container);
      expect(system.layers).toEqual([]);
      expect(system.scrollMultiplier).toBe(0.5);
      expect(system.scrollY).toBe(0);
    });

    it('should initialize layers from DOM elements with data-depth attributes', () => {
      const system = new ParallaxBackground(container);
      system.initialize();

      expect(system.layers.length).toBe(3);
      expect(system.layers[0].element).toBe(container.children[0]);
      expect(system.layers[1].element).toBe(container.children[1]);
      expect(system.layers[2].element).toBe(container.children[2]);
    });

    it('should extract depth values from data-depth attributes as numbers', () => {
      const system = new ParallaxBackground(container);
      system.initialize();

      expect(system.layers[0].depth).toBe(0.3);
      expect(system.layers[1].depth).toBe(0.6);
      expect(system.layers[2].depth).toBe(0.9);
      expect(typeof system.layers[0].depth).toBe('number');
      expect(typeof system.layers[1].depth).toBe('number');
      expect(typeof system.layers[2].depth).toBe('number');
    });
  });

  describe('Layer Management Tests', () => {
    it('should create layer objects with element, depth, and initialOffset properties', () => {
      const system = new ParallaxBackground(container);
      system.initialize();

      system.layers.forEach((layer) => {
        expect(layer).toHaveProperty('element');
        expect(layer).toHaveProperty('depth');
        expect(layer).toHaveProperty('initialOffset');
        expect(layer.element instanceof HTMLElement).toBe(true);
      });
    });

    it('should correctly parse depth values as numbers from string attributes', () => {
      const system = new ParallaxBackground(container);
      system.initialize();

      system.layers.forEach((layer) => {
        expect(typeof layer.depth).toBe('number');
        expect(layer.depth).toBeGreaterThanOrEqual(0);
        expect(layer.depth).toBeLessThanOrEqual(1);
      });
    });

    it('should handle multiple layers with different depths correctly', () => {
      const system = new ParallaxBackground(container);
      system.initialize();

      // Verify each layer has unique depth
      const depths = system.layers.map((l) => l.depth);
      expect(depths[0]).toBe(0.3);
      expect(depths[1]).toBe(0.6);
      expect(depths[2]).toBe(0.9);
      expect(new Set(depths).size).toBe(3); // All unique
    });

    it('should create empty layer array for container with no data-depth elements', () => {
      const emptyContainer = document.createElement('div');
      const div = document.createElement('div');
      emptyContainer.appendChild(div);
      document.body.appendChild(emptyContainer);

      const system = new ParallaxBackground(emptyContainer);
      system.initialize();

      expect(system.layers.length).toBe(0);
      expect(Array.isArray(system.layers)).toBe(true);

      document.body.removeChild(emptyContainer);
    });
  });

  describe('Parallax Calculation Tests', () => {
    it('should calculate scroll offset as scrollY * depth * multiplier', () => {
      const system = new ParallaxBackground(container, [], 0.5);
      system.initialize();

      // scrollY = 100, depth = 0.3, multiplier = 0.5
      // Expected offset = 100 * 0.3 * 0.5 = 15
      system.scrollY = 100;
      system.updateLayerOffsets();

      // Check first layer (depth 0.3): 100 * 0.3 * 0.5 = 15
      const expectedOffset1 = 100 * 0.3 * 0.5;
      expect(system.layerOffsets[0]).toBe(expectedOffset1);

      // Check second layer (depth 0.6): 100 * 0.6 * 0.5 = 30
      const expectedOffset2 = 100 * 0.6 * 0.5;
      expect(system.layerOffsets[1]).toBe(expectedOffset2);

      // Check third layer (depth 0.9): 100 * 0.9 * 0.5 = 45
      const expectedOffset3 = 100 * 0.9 * 0.5;
      expect(system.layerOffsets[2]).toBe(expectedOffset3);
    });

    it('should apply offset to correct layer only via transform', () => {
      const system = new ParallaxBackground(container, [], 0.5);
      system.initialize();

      system.scrollY = 100;
      system.updateLayerOffsets();

      const layer1 = container.children[0];
      const layer2 = container.children[1];
      const layer3 = container.children[2];

      // Each layer should have its own transform applied
      expect(layer1.style.transform).toContain('translateY');
      expect(layer2.style.transform).toContain('translateY');
      expect(layer3.style.transform).toContain('translateY');

      // Verify they are different offsets
      const transform1 = layer1.style.transform;
      const transform2 = layer2.style.transform;
      expect(transform1).not.toBe(transform2);
    });

    it('should create different offsets for different depths with same scroll amount', () => {
      const system = new ParallexBackground(container, [], 0.5);
      system.initialize();

      system.scrollY = 100;
      system.updateLayerOffsets();

      // Different depths should produce different offsets
      expect(system.layerOffsets[0]).not.toBe(system.layerOffsets[1]);
      expect(system.layerOffsets[1]).not.toBe(system.layerOffsets[2]);

      // Offsets should be in increasing order (as depth increases)
      expect(system.layerOffsets[0] < system.layerOffsets[1]).toBe(true);
      expect(system.layerOffsets[1] < system.layerOffsets[2]).toBe(true);
    });

    it('should update scroll offset when handleScroll is called', () => {
      const system = new ParallaxBackground(container, [], 0.5);
      system.initialize();

      expect(system.scrollY).toBe(0);
      expect(system.layerOffsets).toEqual([0, 0, 0]);

      system.handleScroll(150);

      expect(system.scrollY).toBe(150);
      expect(system.layerOffsets[0]).toBe(150 * 0.3 * 0.5);
      expect(system.layerOffsets[1]).toBe(150 * 0.6 * 0.5);
      expect(system.layerOffsets[2]).toBe(150 * 0.9 * 0.5);
    });
  });

  describe('Scroll Event Tests', () => {
    it('should add scroll event listener to window', () => {
      const system = new ParallaxBackground(container, [], 0.5);
      system.initialize();

      const addEventListenerSpy = spyOn(window, 'addEventListener');
      system.attachScrollListener();

      expect(addEventListenerSpy).toHaveBeenCalledWith('scroll', jasmine.any(Function));
    });

    it('should remove scroll event listener properly', () => {
      const system = new ParallaxBackground(container, [], 0.5);
      system.initialize();
      system.attachScrollListener();

      const removeEventListenerSpy = spyOn(window, 'removeEventListener');
      system.detachScrollListener();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', jasmine.any(Function));
    });
  });

  describe('Multiplier Control Tests', () => {
    it('should update parallax intensity with setScrollMultiplier', () => {
      const system = new ParallaxBackground(container, [], 0.5);
      system.initialize();

      expect(system.scrollMultiplier).toBe(0.5);

      system.setScrollMultiplier(0.7);
      expect(system.scrollMultiplier).toBe(0.7);

      system.scrollY = 100;
      system.updateLayerOffsets();

      // With new multiplier 0.7: 100 * 0.3 * 0.7 = 21
      expect(system.layerOffsets[0]).toBe(100 * 0.3 * 0.7);
    });
  });
});
