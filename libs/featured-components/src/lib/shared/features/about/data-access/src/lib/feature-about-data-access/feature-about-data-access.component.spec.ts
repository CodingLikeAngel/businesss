import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeatureAboutDataAccessComponent } from './feature-about-data-access.component';

describe('FeatureAboutDataAccessComponent', () => {
  let component: FeatureAboutDataAccessComponent;
  let fixture: ComponentFixture<FeatureAboutDataAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureAboutDataAccessComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureAboutDataAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
