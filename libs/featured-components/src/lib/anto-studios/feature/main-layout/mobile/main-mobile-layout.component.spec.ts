import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainMobileLayoutComponent } from './main-mobile-layout.component';

describe('MainMobileLayoutComponent', () => {
  let component: MainMobileLayoutComponent;
  let fixture: ComponentFixture<MainMobileLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainMobileLayoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MainMobileLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
