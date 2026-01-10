import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainDekstopLayoutComponent } from './main-dekstop-layout.component';

describe('MainDekstopLayoutComponent', () => {
  let component: MainDekstopLayoutComponent;
  let fixture: ComponentFixture<MainDekstopLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainDekstopLayoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MainDekstopLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
