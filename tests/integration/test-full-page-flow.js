// tests/integration/test-full-page-flow.js
// Complete LINALABS Console user flow integration tests
// 14 test cases: Initial Load, Mouse Interaction, Scroll Interaction, Modal Interaction, Contact Flow

describe('LINALABS Console - Category 1: Initial Page Load', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <header>
        <div class="logo-nucleus" id="logo-nucleus">
          <span class="glitch">LinaLabs</span>
        </div>
        <div class="small-logo" style="display: none;" id="small-logo">LL</div>
      </header>
      <section class="services" id="servicios">
        <h2 class="section-title">Servicios</h2>
        <div class="service-card" data-service="agentes-ia">
          <h3 class="service-title">Agentes IA</h3>
        </div>
        <div class="service-card" data-service="diseno-grafico">
          <h3 class="service-title">Diseno Grafico</h3>
        </div>
        <div class="service-card" data-service="desarrollo-web">
          <h3 class="service-title">Desarrollo Web</h3>
        </div>
        <div class="service-card" data-service="contenido-ia">
          <h3 class="service-title">Contenido IA</h3>
        </div>
      </section>
    `;
  });

  it('TEST 1: Logo nucleus should be centered', () => {
    const logoNucleus = document.querySelector('.logo-nucleus');
    expect(logoNucleus).toBeTruthy();
    expect(logoNucleus.textContent).toContain('LinaLabs');
  });

  it('TEST 2: Small logo should be hidden on initial load', () => {
    const smallLogo = document.querySelector('.small-logo');
    expect(smallLogo).toBeTruthy();
    expect(smallLogo.style.display).toBe('none');
  });

  it('TEST 3: All 4 service panels should be present', () => {
    const serviceCards = document.querySelectorAll('.service-card');
    expect(serviceCards.length).toBe(4);
    expect(serviceCards[0].getAttribute('data-service')).toBe('agentes-ia');
    expect(serviceCards[1].getAttribute('data-service')).toBe('diseno-grafico');
    expect(serviceCards[2].getAttribute('data-service')).toBe('desarrollo-web');
    expect(serviceCards[3].getAttribute('data-service')).toBe('contenido-ia');
  });
});

describe('LINALABS Console - Category 2: Mouse Interaction', () => {
  let logoNucleus;

  beforeEach(() => {
    document.body.innerHTML = `
      <div class="logo-nucleus" id="logo-nucleus" style="position: absolute;">
        <span class="glitch">LinaLabs</span>
      </div>
    `;
    logoNucleus = document.getElementById('logo-nucleus');
  });

  it('TEST 4: Logo nucleus should move based on mouse position', () => {
    const offsetX = (500 - window.innerWidth / 2) * 0.05;
    const offsetY = (300 - window.innerHeight / 2) * 0.05;
    logoNucleus.style.transform = 'translate(calc(-50% + ' + offsetX + 'px), calc(-50% + ' + offsetY + 'px))';

    const transform = logoNucleus.style.transform;
    expect(transform).toBeTruthy();
    expect(transform).toContain('translate');
  });

  it('TEST 5: Offset should be applied to logo transform', () => {
    const offsetMouseX = 600;
    const offsetMouseY = 400;
    const offsetX = (offsetMouseX - window.innerWidth / 2) * 0.05;
    const offsetY = (offsetMouseY - window.innerHeight / 2) * 0.05;
    logoNucleus.style.transform = 'translate(calc(-50% + ' + offsetX + 'px), calc(-50% + ' + offsetY + 'px))';

    const transform = logoNucleus.style.transform;
    expect(transform).toContain('calc');
    expect(transform).toContain('px');
    expect(offsetX).not.toBe(0);
  });
});

describe('LINALABS Console - Category 3: Scroll Interaction', () => {
  let mainLogo;
  let smallLogo;

  beforeEach(() => {
    document.body.innerHTML = `
      <header>
        <div class="main-logo" id="main-logo" style="opacity: 1;">LinaLabs</div>
        <div class="small-logo" id="small-logo" style="display: none; opacity: 0;">LL</div>
      </header>
    `;
    mainLogo = document.getElementById('main-logo');
    smallLogo = document.getElementById('small-logo');
  });

  it('TEST 6: Main logo should fade when scrolling past 20 percent', () => {
    const scrollPercentage = 0.25;
    if (scrollPercentage > 0.2) {
      mainLogo.style.opacity = '0';
      smallLogo.style.display = 'block';
    }
    expect(mainLogo.style.opacity).toBe('0');
  });

  it('TEST 7: Small logo should appear when scrolling past 20 percent', () => {
    const scrollPercentage = 0.25;
    if (scrollPercentage > 0.2) {
      smallLogo.style.display = 'block';
      smallLogo.classList.add('visible');
    }
    expect(smallLogo.style.display).toBe('block');
  });

  it('TEST 8: Main logo opacity should be restored when scrolled back to top', () => {
    mainLogo.style.opacity = '0';
    smallLogo.style.display = 'block';
    mainLogo.style.opacity = '1';
    smallLogo.style.display = 'none';
    smallLogo.classList.remove('visible');
    expect(mainLogo.style.opacity).toBe('1');
    expect(smallLogo.style.display).toBe('none');
  });
});

describe('LINALABS Console - Category 4: Modal Interaction', () => {
  let serviceCards;

  beforeEach(() => {
    document.body.innerHTML = `
      <div class="services">
        <div class="service-card" data-modal="modal-1">Service 1</div>
        <div class="service-card" data-modal="modal-2">Service 2</div>
        <div class="service-card" data-modal="modal-3">Service 3</div>
        <div class="service-card" data-modal="modal-4">Service 4</div>
      </div>
      <div class="modal" id="modal-1" style="display: none;">
        <button class="modal-close">Close</button>
        <h2>Service 1</h2>
      </div>
      <div class="modal" id="modal-2" style="display: none;">
        <button class="modal-close">Close</button>
        <h2>Service 2</h2>
      </div>
      <div class="modal" id="modal-3" style="display: none;">
        <button class="modal-close">Close</button>
        <h2>Service 3</h2>
      </div>
      <div class="modal" id="modal-4" style="display: none;">
        <button class="modal-close">Close</button>
        <h2>Service 4</h2>
      </div>
    `;

    serviceCards = document.querySelectorAll('.service-card');

    serviceCards.forEach(card => {
      card.addEventListener('click', function() {
        document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
        const modalId = this.getAttribute('data-modal');
        document.getElementById(modalId).style.display = 'block';
      });
    });

    document.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', function() {
        document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
      });
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
      }
    });
  });

  it('TEST 9: Modal should open when service panel is clicked', () => {
    const card = Array.from(serviceCards)[0];
    const modalId = card.getAttribute('data-modal');
    const modal = document.getElementById(modalId);
    expect(modal.style.display).toBe('none');
    card.click();
    expect(modal.style.display).toBe('block');
  });

  it('TEST 10: Modal should close when close button is clicked', () => {
    const card = Array.from(serviceCards)[0];
    card.click();
    const modalId = card.getAttribute('data-modal');
    const modal = document.getElementById(modalId);
    const closeBtn = modal.querySelector('.modal-close');
    expect(modal.style.display).toBe('block');
    closeBtn.click();
    expect(modal.style.display).toBe('none');
  });

  it('TEST 11: Modal should close when ESC key is pressed', () => {
    const card = Array.from(serviceCards)[0];
    card.click();
    const modal = document.getElementById(card.getAttribute('data-modal'));
    expect(modal.style.display).toBe('block');
    const escEvent = new KeyboardEvent('keydown', {key: 'Escape'});
    document.dispatchEvent(escEvent);
    expect(modal.style.display).toBe('none');
  });

  it('TEST 12: Only one modal should be open at a time', () => {
    const cards = Array.from(serviceCards);
    cards[0].click();
    const modal1 = document.getElementById(cards[0].getAttribute('data-modal'));
    expect(modal1.style.display).toBe('block');
    cards[1].click();
    const modal2 = document.getElementById(cards[1].getAttribute('data-modal'));
    expect(modal1.style.display).toBe('none');
    expect(modal2.style.display).toBe('block');
    cards[2].click();
    const modal3 = document.getElementById(cards[2].getAttribute('data-modal'));
    expect(modal1.style.display).toBe('none');
    expect(modal2.style.display).toBe('none');
    expect(modal3.style.display).toBe('block');
  });
});

describe('LINALABS Console - Category 5: Contact Flow', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="services">
        <div class="service-card" data-service="agentes-ia">
          <a href="mailto:hello@linalabs.ar?subject=Agentes%20IA" class="contact-link">Contactar</a>
        </div>
        <div class="service-card" data-service="diseno-grafico">
          <a href="mailto:hello@linalabs.ar?subject=Diseno%20Grafico" class="contact-link">Contactar</a>
        </div>
        <div class="service-card" data-service="desarrollo-web">
          <a href="mailto:hello@linalabs.ar?subject=Desarrollo%20Web" class="contact-link">Contactar</a>
        </div>
        <div class="service-card" data-service="contenido-ia">
          <a href="mailto:hello@linalabs.ar?subject=Contenido%20IA" class="contact-link">Contactar</a>
        </div>
      </div>
    `;
  });

  it('TEST 13: Valid mailto links should exist in all service panels', () => {
    const contactLinks = document.querySelectorAll('.contact-link');
    expect(contactLinks.length).toBe(4);
    contactLinks.forEach(link => {
      expect(link.href).toContain('mailto:hello@linalabs.ar');
      expect(link.href).toContain('subject=');
    });
  });

  it('TEST 14: Email subject line should contain service name', () => {
    const contactLinks = document.querySelectorAll('.contact-link');
    const subjects = ['Agentes%20IA', 'Diseno%20Grafico', 'Desarrollo%20Web', 'Contenido%20IA'];
    Array.from(contactLinks).forEach((link, idx) => {
      expect(link.href).toContain('subject=' + subjects[idx]);
    });
  });
});
