import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeatureAboutApiComponent } from './feature-about-api.component';

describe('FeatureAboutApiComponent', () => {
  let component: FeatureAboutApiComponent;
  let fixture: ComponentFixture<FeatureAboutApiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureAboutApiComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureAboutApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
