import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForestAnimationComponent } from './forest-animation.component';

describe('ForestAnimationComponent', () => {
  let component: ForestAnimationComponent;
  let fixture: ComponentFixture<ForestAnimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForestAnimationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ForestAnimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
