import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VideogamesFooterComponent } from './videogames-footer.component';

describe('VideogamesFooterComponent', () => {
  let component: VideogamesFooterComponent;
  let fixture: ComponentFixture<VideogamesFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideogamesFooterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VideogamesFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
