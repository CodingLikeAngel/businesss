import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UICardPremiumComponent } from './card-premium.component';

describe('CardPremiumComponent', () => {
  let component: UICardPremiumComponent;
  let fixture: ComponentFixture<UICardPremiumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UICardPremiumComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UICardPremiumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
