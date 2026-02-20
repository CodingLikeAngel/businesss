import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UIAccordionComponent } from './accordion.component';

describe('UIAccordionComponent', () => {
  let component: UIAccordionComponent;
  let fixture: ComponentFixture<UIAccordionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UIAccordionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UIAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
