import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeatureContactMobilePageComponent } from './feature-contact-mobile-page.component';

describe('FeatureContactMobilePageComponent', () => {
  let component: FeatureContactMobilePageComponent;
  let fixture: ComponentFixture<FeatureContactMobilePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureContactMobilePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureContactMobilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
