import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeatureContactDesktopPageComponent } from './feature-contact-desktop-page.component';

describe('FeatureContactDesktopPageComponent', () => {
  let component: FeatureContactDesktopPageComponent;
  let fixture: ComponentFixture<FeatureContactDesktopPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureContactDesktopPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureContactDesktopPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
