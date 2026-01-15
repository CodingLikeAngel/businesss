import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UIButtonComponent, baseButtonVariants } from './button.component';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { heroStar, heroRocketLaunch, heroArrowRight } from '@ng-icons/heroicons/outline';

export @Component({
  standalone: true,
  imports: [UIButtonComponent],
  template: `
    <lib-ui-button
      [variant]="variant"
      [rounded]="rounded"
      [size]="size"
      [dark]="dark"
      [disabled]="disabled"
      [leadingIcon]="leadingIcon"
      [trailingIcon]="trailingIcon"
      [ariaLabel]="ariaLabel"
      (buttonClick)="onButtonClick($event)"
    >
      {{ content }}
    </lib-ui-button>
  `,
})
class TestHostComponent {
  variant = 'secondary';
  rounded: 'none' | 'md' | 'full' = 'none';
  size: 'sm' | 'md' | 'lg' = 'md';
  dark = false;
  disabled = false;
  leadingIcon?: string;
  trailingIcon?: string;
  ariaLabel?: string;
  content = '';
  onButtonClick = jest.fn();
}

describe('UIButtonComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideIcons({ heroStar, heroRocketLaunch, heroArrowRight })],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply default classes correctly', () => {
    const buttonElement = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(buttonElement.classList).toContain('btn');
    expect(buttonElement.classList).toContain('btn-secondary');
    expect(buttonElement.classList).toContain('btn-md');
    expect(buttonElement.classList).not.toContain('dark');
    expect(buttonElement.classList).not.toContain('btn-disabled');
  });

  it('should apply variant class based on input', () => {
    component.variant = 'primary';
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(buttonElement.classList).toContain('btn-primary');
    expect(buttonElement.classList).not.toContain('btn-secondary');
  });

  it('should apply rounded class "md" when specified', () => {
    component.rounded = 'md';
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(buttonElement.classList).toContain('btn-rounded-md');
  });

  it('should apply rounded class "full" when specified', () => {
    component.rounded = 'full';
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(buttonElement.classList).toContain('btn-rounded-full');
  });

  it('should apply size class based on input', () => {
    component.size = 'lg';
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(buttonElement.classList).toContain('btn-lg');
    expect(buttonElement.classList).not.toContain('btn-md');
  });

  it('should apply dark class when dark is true', () => {
    component.dark = true;
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(buttonElement.classList).toContain('dark');
  });

  it('should not apply dark class when dark is false', () => {
    component.dark = false;
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(buttonElement.classList).not.toContain('dark');
  });

  it('should apply disabled class and attribute when disabled is true', () => {
    component.disabled = true;
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(buttonElement.classList).toContain('btn-disabled');
    expect(buttonElement.getAttribute('disabled')).toBe('');
    expect(buttonElement.getAttribute('aria-disabled')).toBe('true');
  });

  it('should add no-icons class when rounded is full and no icons are present', () => {
    component.rounded = 'full';
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(buttonElement.classList).toContain('no-icons');
  });

  it('should not add no-icons class when leading icon is present', () => {
    component.rounded = 'full';
    component.leadingIcon = 'heroStar';
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(buttonElement.classList).not.toContain('no-icons');
  });

  it('should not add no-icons class when trailing icon is present', () => {
    component.rounded = 'full';
    component.trailingIcon = 'heroArrowRight';
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(buttonElement.classList).not.toContain('no-icons');
  });

  it('should render leading icon when provided', () => {
    component.leadingIcon = 'heroStar';
    fixture.detectChanges();
    const iconElement = fixture.debugElement.query(By.css('ng-icon.icon'));
    expect(iconElement).toBeTruthy();
    expect(iconElement.nativeElement.children.length).toBeGreaterThan(0);
  });

  it('should render trailing icon when provided', () => {
    component.trailingIcon = 'heroArrowRight';
    fixture.detectChanges();
    const iconElement = fixture.debugElement.query(By.css('ng-icon.icon'));
    expect(iconElement).toBeTruthy();
    expect(iconElement.nativeElement.children.length).toBeGreaterThan(0);
  });

  it('should render custom text as leading icon if not a hero icon', () => {
    component.leadingIcon = '★';
    fixture.detectChanges();
    const spanElement = fixture.debugElement.query(By.css('span.icon'));
    expect(spanElement).toBeTruthy();
    expect(spanElement.nativeElement.textContent).toBe('★');
  });

  it('should render custom text as trailing icon if not a hero icon', () => {
    component.trailingIcon = '→';
    fixture.detectChanges();
    const spanElement = fixture.debugElement.query(By.css('span.icon'));
    expect(spanElement).toBeTruthy();
    expect(spanElement.nativeElement.textContent).toBe('→');
  });

  it('should not render leading icon when provided but not a hero icon', () => {
    component.leadingIcon = 'star';
    fixture.detectChanges();
    const iconElement = fixture.debugElement.query(By.css('ng-icon.icon'));
    expect(iconElement).toBeNull();
    const spanElement = fixture.debugElement.query(By.css('span.icon'));
    expect(spanElement).toBeTruthy();
  });

  it('should not render trailing icon when provided but not a hero icon', () => {
    component.trailingIcon = 'arrow';
    fixture.detectChanges();
    const iconElement = fixture.debugElement.query(By.css('ng-icon.icon'));
    expect(iconElement).toBeNull();
    const spanElement = fixture.debugElement.query(By.css('span.icon'));
    expect(spanElement).toBeTruthy();
  });

  it('should emit buttonClick event when clicked and not disabled', () => {
    const buttonElement = fixture.debugElement.query(By.css('button')).nativeElement;
    buttonElement.click();
    fixture.detectChanges();
    expect(component.onButtonClick).toHaveBeenCalled();
  });

  it('should not emit buttonClick event when disabled', () => {
    component.disabled = true;
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('button')).nativeElement;
    buttonElement.click();
    fixture.detectChanges();
    expect(component.onButtonClick).not.toHaveBeenCalled();
  });

  it('should set aria-label from input', () => {
    component.ariaLabel = 'Custom Button';
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(buttonElement.getAttribute('aria-label')).toBe('Custom Button');
  });

  it('should set default aria-label when not provided', () => {
    const buttonElement = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(buttonElement.getAttribute('aria-label')).toBe('Button');
  });

  it('should have role="button" and tabindex="0"', () => {
    const buttonElement = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(buttonElement.getAttribute('role')).toBe('button');
    expect(buttonElement.getAttribute('tabindex')).toBe('0');
  });

  it('should render projected content', () => {
    component.content = 'Click Me';
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(buttonElement.textContent).toContain('Click Me');
  });

  it('should handle undefined icons and not render them', () => {
    component.leadingIcon = undefined;
    component.trailingIcon = undefined;
    fixture.detectChanges();
    const buttonComponent = fixture.debugElement.query(By.css('lib-ui-button')).componentInstance as UIButtonComponent;
    expect(buttonComponent.isIconClass(undefined)).toBe(false); // Forzamos la ejecución
    const ngIconElements = fixture.debugElement.queryAll(By.css('ng-icon.icon'));
    const spanElements = fixture.debugElement.queryAll(By.css('span.icon'));
    expect(ngIconElements.length).toBe(0);
    expect(spanElements.length).toBe(0);
  });

  it('should handle rounded full with non-hero leading icon and no trailing icon', () => {
    component.rounded = 'full';
    component.leadingIcon = '★';
    component.trailingIcon = undefined;
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('button')).nativeElement;
    const spanElement = fixture.debugElement.query(By.css('span.icon'));
    expect(buttonElement.classList).not.toContain('no-icons');
    expect(spanElement).toBeTruthy();
    expect(spanElement.nativeElement.textContent).toBe('★');
  });

  it('should handle rounded full with no leading icon and non-hero trailing icon', () => {
    component.rounded = 'full';
    component.leadingIcon = undefined;
    component.trailingIcon = '→';
    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('button')).nativeElement;
    const spanElement = fixture.debugElement.query(By.css('span.icon'));
    expect(buttonElement.classList).not.toContain('no-icons');
    expect(spanElement).toBeTruthy();
    expect(spanElement.nativeElement.textContent).toBe('→');
  });
});
