import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeatureContactApiComponent } from './feature-contact-api.component';

describe('FeatureContactApiComponent', () => {
  let component: FeatureContactApiComponent;
  let fixture: ComponentFixture<FeatureContactApiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureContactApiComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureContactApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
