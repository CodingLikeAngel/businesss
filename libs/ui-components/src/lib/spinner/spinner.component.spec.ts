import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UISpinnerComponent } from './spinner.component';

describe('UISpinnerComponent', () => {
  let component: UISpinnerComponent;
  let fixture: ComponentFixture<UISpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UISpinnerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UISpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
