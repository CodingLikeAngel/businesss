import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UIGamingVariantsShowcaseComponent } from './gaming-variants-showcase.component';
import { UIButtonComponent } from '../button/button.component';
import { UIInputComponent } from '../forms/input/input.component';

describe('UIGamingVariantsShowcaseComponent', () => {
  let component: UIGamingVariantsShowcaseComponent;
  let fixture: ComponentFixture<UIGamingVariantsShowcaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UIGamingVariantsShowcaseComponent, UIButtonComponent, UIInputComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(UIGamingVariantsShowcaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have 10 gaming variants', () => {
    expect(component.gamingVariants.length).toBe(10);
  });

  it('should have correct variant IDs', () => {
    const expectedVariants = [
      'pokemon', 'animal-crossing', 'assassins-creed', 'far-cry', 'watch-dogs',
      'bioshock-enhanced', 'lol', 'overwatch', 'minecraft', 'fortnite'
    ];
    
    const actualVariants = component.gamingVariants.map(v => v.id);
    expect(actualVariants).toEqual(expectedVariants);
  });

  it('should have input values for all variants', () => {
    const variants = component.gamingVariants;
    variants.forEach(variant => {
      expect((component.inputValues as Record<string, string>)[variant.id]).toBeTruthy();
    });
  });

  it('should generate correct input placeholders', () => {
    const placeholder = component.getInputPlaceholder('pokemon');
    expect(placeholder).toContain('Pokémon');
  });

  it('should handle button clicks', () => {
    spyOn(console, 'log');
    component.onButtonClick('pokemon');
    expect(console.log).toHaveBeenCalledWith('Button clicked with variant: pokemon');
  });

  it('should render all variant cards', () => {
    const compiled = fixture.nativeElement;
    const variantCards = compiled.querySelectorAll('.variant-card');
    expect(variantCards.length).toBe(10);
  });

  it('should render buttons and inputs for each variant', () => {
    const compiled = fixture.nativeElement;
    const buttons = compiled.querySelectorAll('lib-ui-components-button');
    const inputs = compiled.querySelectorAll('lib-ui-components-input');
    
    expect(buttons.length).toBe(10);
    expect(inputs.length).toBe(10);
  });
});