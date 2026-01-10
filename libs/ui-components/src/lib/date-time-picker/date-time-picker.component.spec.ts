import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UIDateTimePickerComponent } from './date-time-picker.component';

describe('DateTimePickerComponent', () => {
  let component: UIDateTimePickerComponent;
  let fixture: ComponentFixture<UIDateTimePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UIDateTimePickerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UIDateTimePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
