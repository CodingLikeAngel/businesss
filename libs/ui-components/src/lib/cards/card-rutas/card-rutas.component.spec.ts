import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardRutasComponent } from './card-rutas.component';

describe('CardRutasComponent', () => {
  let component: CardRutasComponent;
  let fixture: ComponentFixture<CardRutasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardRutasComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CardRutasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
