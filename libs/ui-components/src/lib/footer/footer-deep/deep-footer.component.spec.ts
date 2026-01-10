import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeepFooterComponent } from './deep-footer.component';

describe('DeepFooterComponent', () => {
  let component: DeepFooterComponent;
  let fixture: ComponentFixture<DeepFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeepFooterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DeepFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
