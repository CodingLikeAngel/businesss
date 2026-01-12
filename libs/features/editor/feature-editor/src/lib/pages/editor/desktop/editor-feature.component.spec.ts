import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditorDesktopFeatureComponent } from './editor-feature.component';

describe('HomeFeatureComponent', () => {
  let component: HomeFeatureComponent;
  let fixture: ComponentFixture<HomeFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeFeatureComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
