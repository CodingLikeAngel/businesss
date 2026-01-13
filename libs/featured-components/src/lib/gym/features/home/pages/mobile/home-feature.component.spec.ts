import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeMobileFeatureComponent } from './home-feature.component';

describe('HomeMobileFeatureComponent', () => {
  let component: HomeMobileFeatureComponent;
  let fixture: ComponentFixture<HomeMobileFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeMobileFeatureComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeMobileFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});