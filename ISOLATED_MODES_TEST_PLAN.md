# Isolated Modes Test Plan

## Overview

This document outlines the comprehensive test strategy for all isolated mode components in the Visual Editor System.

## Test Structure

```
tests/
├── unit/
│   ├── components/
│   │   ├── hero-isolated-mode.spec.ts
│   │   ├── features-isolated-mode.spec.ts
│   │   ├── testimonials-isolated-mode.spec.ts
│   │   ├── pricing-isolated-mode.spec.ts
│   │   ├── gallery-isolated-mode.spec.ts
│   │   ├── contact-isolated-mode.spec.ts
│   │   ├── cta-isolated-mode.spec.ts
│   │   ├── stats-isolated-mode.spec.ts
│   │   ├── products-isolated-mode.spec.ts
│   │   ├── newsletter-isolated-mode.spec.ts
│   │   ├── faq-isolated-mode.spec.ts
│   │   ├── steps-isolated-mode.spec.ts
│   │   ├── reservation-isolated-mode.spec.ts
│   │   ├── promotions-isolated-mode.spec.ts
│   │   ├── restaurant-isolated-mode.spec.ts
│   │   ├── gym-isolated-mode.spec.ts
│   │   └── spa-isolated-mode.spec.ts
│   └── services/
│       └── isolated-mode-integration.service.spec.ts
├── integration/
│   ├── isolated-mode-to-component.spec.ts
│   └── isolated-mode-events.spec.ts
└── e2e/
    └── isolated-mode.spec.ts
```

---

## Unit Testing Strategy

### Component Test Categories

#### 1. Lifecycle Tests

```typescript
describe('Component Lifecycle', () => {
  it('should initialize with default content', () => {
    component.ngOnInit();
    expect(component.content.title).toBeDefined();
    expect(component.content.items.length).toBeGreaterThan(0);
  });

  it('should clean up event listeners on destroy', () => {
    const removeEventListenerSpy = spyOn(document, 'removeEventListener');
    component.ngOnDestroy();
    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', component.handleKeydown);
  });
});
```

#### 2. Content Management Tests

```typescript
describe('Content Management', () => {
  describe('addItem()', () => {
    it('should add a new item to the items array', () => {
      const initialLength = component.content.items.length;
      component.addItem();
      expect(component.content.items.length).toBe(initialLength + 1);
    });

    it('should initialize new item with default values', () => {
      component.addItem();
      const newItem = component.content.items[component.content.items.length - 1];
      expect(newItem.title).toBe('New Item');
      expect(newItem.description).toBeDefined();
    });
  });

  describe('removeItem()', () => {
    it('should remove item at specified index', () => {
      const initialLength = component.content.items.length;
      component.removeItem(0);
      expect(component.content.items.length).toBe(initialLength - 1);
    });

    it('should not modify array if index is out of bounds', () => {
      const initialLength = component.content.items.length;
      component.removeItem(999);
      expect(component.content.items.length).toBe(initialLength);
    });
  });
});
```

#### 3. Event Emission Tests

```typescript
describe('Event Emission', () => {
  describe('apply()', () => {
    it('should emit applied event with current content', () => {
      const expectedConfig = {
        ...component.config,
        content: { ...component.content },
      };
      component.applied.subscribe((config) => {
        expect(config).toEqual(expectedConfig);
      });
      component.apply();
    });
  });

  describe('close()', () => {
    it('should emit closed event', () => {
      let closedEmitted = false;
      component.closed.subscribe(() => {
        closedEmitted = true;
      });
      component.close();
      expect(closedEmitted).toBe(true);
    });
  });

  describe('cancel()', () => {
    it('should emit closed event without applying changes', () => {
      let appliedEmitted = false;
      component.applied.subscribe(() => {
        appliedEmitted = true;
      });
      component.cancel();
      expect(appliedEmitted).toBe(false);
    });
  });
});
```

#### 4. Keyboard Navigation Tests

```typescript
describe('Keyboard Navigation', () => {
  it('should close on Escape key', () => {
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    component.handleKeydown(event);
    expect(component.close).toHaveBeenCalled();
  });

  it('should not close on other keys', () => {
    const closeSpy = spyOn(component, 'close');
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    component.handleKeydown(event);
    expect(closeSpy).not.toHaveBeenCalled();
  });
});
```

#### 5. Overlay Click Tests

```typescript
describe('Overlay Interactions', () => {
  it('should emit closed on overlay click', () => {
    const overlay = fixture.nativeElement.querySelector('.isolated-mode-overlay');
    overlay.dispatchEvent(new MouseEvent('click'));
    expect(component.closed.emit).toHaveBeenCalled();
  });

  it('should stop propagation on container click', () => {
    const container = fixture.nativeElement.querySelector('.isolated-mode-container');
    const stopPropagationSpy = spyOn(event, 'stopPropagation');
    container.dispatchEvent(new MouseEvent('click'));
    expect(stopPropagationSpy).toHaveBeenCalled();
  });
});
```

#### 6. Content Binding Tests

```typescript
describe('Content Binding', () => {
  it('should bind title input to content.title', () => {
    const titleInput = fixture.nativeElement.querySelector('input[placeholder*="title"]');
    titleInput.value = 'New Title';
    titleInput.dispatchEvent(new Event('input'));
    expect(component.content.title).toBe('New Title');
  });

  it('should update preview when content changes', () => {
    component.content.title = 'Test Title';
    fixture.detectChanges();
    const previewTitle = fixture.nativeElement.querySelector('.preview-title');
    expect(previewTitle.textContent).toBe('Test Title');
  });
});
```

---

## Service Testing Strategy

### IsolatedModeIntegrationService Tests

```typescript
describe('IsolatedModeIntegrationService', () => {
  describe('Component Registration', () => {
    it('should register a component', () => {
      service.registerComponent('test-id', 'hero', mockHeroComponent);
      expect(service.getRegisteredComponent('test-id')).toBe(mockHeroComponent);
    });

    it('should unregister a component', () => {
      service.registerComponent('test-id', 'hero', mockHeroComponent);
      service.unregisterComponent('test-id');
      expect(service.getRegisteredComponent('test-id')).toBeNull();
    });

    it('should get components by type', () => {
      service.registerComponent('id1', 'hero', mockHero1);
      service.registerComponent('id2', 'hero', mockHero2);
      const components = service.getRegisteredComponentsByType('hero');
      expect(components.length).toBe(2);
    });
  });

  describe('Session Management', () => {
    it('should open an isolated mode session', () => {
      service.registerComponent('test-id', 'hero', mockHeroComponent);
      const session = service.openIsolatedMode('test-id', 'hero');
      expect(session).toBeDefined();
      expect(session.componentId).toBe('test-id');
      expect(session.modeType).toBe('hero');
    });

    it('should close session without changes', () => {
      service.registerComponent('test-id', 'hero', mockHeroComponent);
      service.openIsolatedMode('test-id', 'hero');
      service.closeIsolatedMode(false);
      expect(service.activeSession).toBeNull();
    });

    it('should emit events on session changes', () => {
      service.registerComponent('test-id', 'hero', mockHeroComponent);
      service.openIsolatedMode('test-id', 'hero');
      
      service.sessionEvents$.subscribe(event => {
        expect(event.type).toBe('opened');
      });
    });
  });

  describe('Content Mapping', () => {
    it('should extract content from hero component', () => {
      mockHeroComponent.title = signal('Test Title');
      const content = service['extractHeroContent'](mockHeroComponent);
      expect(content.title).toBe('Test Title');
    });

    it('should apply changes to component', () => {
      service.registerComponent('test-id', 'hero', mockHeroComponent);
      service.applyChangesToComponent('test-id', { title: 'New Title' });
      expect(mockHeroComponent.title.set).toHaveBeenCalledWith('New Title');
    });
  });
});
```

---

## Integration Testing

### Component Integration Tests

```typescript
describe('Isolated Mode Integration', () => {
  it('should sync content between isolated mode and component', async () => {
    // Open isolated mode
    const isolatedComponent = fixture.debugElement.query(By.css('lib-editor-hero-isolated-mode'));
    isolatedComponent.componentInstance.openIsolatedMode('hero-1', 'hero');

    // Make changes in isolated mode
    isolatedComponent.componentInstance.content.title = 'Modified Title';
    
    // Apply changes
    isolatedComponent.componentInstance.apply();

    // Verify component was updated
    const heroComponent = fixture.debugElement.query(By.css('lib-hero-section'));
    expect(heroComponent.componentInstance.title()).toBe('Modified Title');
  });

  it('should handle concurrent editing sessions', () => {
    const session1 = service.openIsolatedMode('id1', 'hero');
    const session2 = service.openIsolatedMode('id2', 'features');
    
    expect(service.activeSession).toBe(session2);
    expect(session1.status).toBe('closed');
  });
});
```

---

## E2E Testing

### Cypress Test Examples

```typescript
describe('Isolated Mode E2E', () => {
  beforeEach(() => {
    cy.visit('/editor');
  });

  it('should open isolated mode on section click', () => {
    cy.get('[data-testid="hero-section"]').click();
    cy.get('.isolated-mode-overlay').should('be.visible');
    cy.get('.mode-badge').should('contain', 'MODO AISLADO');
  });

  it('should update preview in real-time', () => {
    cy.get('[data-testid="hero-section"]').click();
    cy.get('input[placeholder="Título"]').type('New Title');
    cy.get('.preview-title').should('contain', 'New Title');
  });

  it('should apply changes on button click', () => {
    cy.get('[data-testid="hero-section"]').click();
    cy.get('input[placeholder="Título"]').type('Modified Title');
    cy.get('button:contains("Aplicar Cambios")').click();
    cy.get('.isolated-mode-overlay').should('not.exist');
    
    // Verify changes were applied to the section
    cy.get('[data-testid="hero-section"] .section-title')
      .should('contain', 'Modified Title');
  });

  it('should cancel changes on cancel button click', () => {
    cy.get('[data-testid="hero-section"]').click();
    cy.get('input[placeholder="Título"]').type('Modified Title');
    cy.get('button:contains("Cancelar")').click();
    cy.get('.isolated-mode-overlay').should('not.exist');
    
    // Verify original title is unchanged
    cy.get('[data-testid="hero-section"] .section-title')
      .should('not.contain', 'Modified Title');
  });

  it('should close on Escape key', () => {
    cy.get('[data-testid="hero-section"]').click();
    cy.get('.isolated-mode-overlay').should('be.visible');
    cy.type('{esc}');
    cy.get('.isolated-mode-overlay').should('not.exist');
  });
});
```

---

## Test Data

### Mock Objects

```typescript
const mockHeroContent: HeroIsolatedModeContent = {
  title: 'Welcome to Our Site',
  subtitle: 'Discover amazing features',
  backgroundImage: 'https://example.com/hero.jpg',
  buttonText: 'Get Started',
  buttonLink: '#signup',
  overlayOpacity: 0.5,
  variant: 'default',
  backgroundColor: '#1a1a2e',
  textColor: '#ffffff',
  buttonColor: '#6366f1'
};

const mockIsolatedModeConfig: IsolatedModeConfig = {
  id: 'test-isolated-mode',
  componentType: 'hero',
  content: mockHeroContent,
  styles: {},
  variants: ['default', 'dark', 'light'],
  metadata: {
    createdAt: Date.now(),
    modifiedAt: Date.now(),
    modifiedBy: 'test-user'
  }
};
```

---

## Test Coverage Goals

| Category | Target Coverage |
|----------|----------------|
| Unit Tests | 90% |
| Integration Tests | 80% |
| E2E Tests | Critical paths 100% |
| Overall | 85% |

---

## Running Tests

```bash
# Run all isolated mode tests
npm run test:isolated-modes

# Run specific isolated mode tests
npm run test:isolated-modes -- --grep="Hero"

# Run service tests
npm run test:isolated-modes -- --grep="IntegrationService"

# Run E2E tests
npm run e2e:isolated-modes

# Run with coverage
npm run test:isolated-modes -- --coverage
```

---

## Test Priority

### High Priority (Must Have)

1. ✅ Apply/Cancel button functionality
2. ✅ Content binding and preview updates
3. ✅ Overlay close behavior
4. ✅ Keyboard shortcuts (Escape)
5. ✅ Item add/remove functionality

### Medium Priority (Should Have)

1. ✅ Variant selection
2. ✅ Color picker functionality
3. ✅ Content extraction from components
4. ✅ Session management
5. ✅ Error handling for invalid inputs

### Low Priority (Nice to Have)

1. ✅ Accessibility testing
2. ✅ Performance benchmarks
3. ✅ Cross-browser testing
4. ✅ Mobile responsiveness
5. ✅ Animation smoothness

---

## Continuous Integration

### GitHub Actions Workflow

```yaml
name: Isolated Modes Tests

on:
  push:
    paths:
      - 'libs/shared-components/**/isolated-mode*/**'
      - 'libs/shared-components/**/*integration*.ts'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm install
      - run: npm run test:isolated-modes
        env:
          CI: true
      - run: npm run e2e:isolated-modes
        env:
          CI: true
      - uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: test-results
          path: coverage/
```

---

## Test Maintenance

### Guidelines

1. **Keep tests isolated**: Each test should be independent
2. **Use descriptive names**: Test names should describe what they verify
3. **Test behavior, not implementation**: Focus on public API
4. **Mock external dependencies**: Avoid network calls in unit tests
5. **Update tests when requirements change**: Keep tests in sync with code

### Review Checklist

- [ ] All critical paths are tested
- [ ] Edge cases are covered
- [ ] Error handling is verified
- [ ] Tests are maintainable and readable
- [ ] Test data is appropriate and minimal
- [ ] No flaky tests
