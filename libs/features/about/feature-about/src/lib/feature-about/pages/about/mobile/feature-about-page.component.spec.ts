import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeatureAboutPageComponent } from './feature-about-page.component';

describe('FeatureAboutPageComponent', () => {
  let component: FeatureAboutPageComponent;
  let fixture: ComponentFixture<FeatureAboutPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureAboutPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureAboutPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
