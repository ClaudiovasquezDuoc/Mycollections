import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardDetallesPage } from './card-detalles.page';

describe('CardDetallesPage', () => {
  let component: CardDetallesPage;
  let fixture: ComponentFixture<CardDetallesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CardDetallesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
