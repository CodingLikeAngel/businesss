import { WebComponentExporter } from './web-component.exporter';
import { ComponentMetadata } from '../models/export.models';

/**
 * Unit tests for WebComponentExporter (DOC_MEJORAS – verificar generación de código limpio).
 */
describe('WebComponentExporter', () => {
  let exporter: WebComponentExporter;

  beforeEach(() => {
    exporter = new WebComponentExporter();
  });

  const minimalComponent: ComponentMetadata = {
    id: 'btn-1',
    name: 'TestButton',
    type: 'button',
    htmlTag: 'button',
    baseClassName: 'btn',
    props: [
      { name: 'label', type: 'string', required: true, defaultValue: 'Click' },
      { name: 'variant', type: 'string', required: false, defaultValue: 'primary' },
    ],
    slots: [],
    events: [],
    styles: { mode: 'css', content: '.btn { padding: 0.5rem 1rem; }' },
    variants: [],
    metadata: {
      createdAt: new Date(),
      updatedAt: new Date(),
      version: '1.0',
      author: 'test',
    },
  };

  it('should generate a string with the component class name', () => {
    const code = exporter.generate(minimalComponent);
    expect(code).toContain('class TestButton extends HTMLElement');
    expect(code).toContain("customElements.define('test-button'");
  });

  it('should include observedAttributes from props', () => {
    const code = exporter.generate(minimalComponent);
    expect(code).toContain("'label'");
    expect(code).toContain("'variant'");
  });

  it('should handle empty props', () => {
    const noProps = { ...minimalComponent, props: [] };
    const code = exporter.generate(noProps);
    expect(code).toContain('return []');
    expect(code).toContain('class TestButton extends HTMLElement');
  });

  it('should escape ${ in styles when embedded in render() innerHTML', () => {
    const withDollar: ComponentMetadata = { ...minimalComponent, styles: { mode: 'css' as const, content: '.x { color: ${value}; }' } };
    const code = exporter.generate(withDollar);
    expect(code).toContain('shadowRoot.innerHTML');
    expect(code).toContain('\\${value}');
  });
});
