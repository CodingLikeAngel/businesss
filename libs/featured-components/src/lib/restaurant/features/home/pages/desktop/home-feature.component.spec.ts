import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeDesktopFeatureComponent } from './home-feature.component';

describe('HomeDesktopFeatureComponent', () => {
  let component: HomeDesktopFeatureComponent;
  let fixture: ComponentFixture<HomeDesktopFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeDesktopFeatureComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeDesktopFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});