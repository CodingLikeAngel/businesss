import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardAnimatedComponent } from './card-animated.component';

describe('CardAnimatedComponent', () => {
  let component: CardAnimatedComponent;
  let fixture: ComponentFixture<CardAnimatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardAnimatedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CardAnimatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
