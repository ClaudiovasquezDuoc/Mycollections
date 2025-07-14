import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CardDetallesPage } from './card-detalles.page';
import { IonicModule } from '@ionic/angular';
import { NavParams, ModalController } from '@ionic/angular';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

class NavParamsMock {
  get(key: string) {
    if (key === 'libro') {
      return { imagen: 'mock.jpg', titulo: 'Mock', descripcion: 'Mock desc' };
    }
    return null;
  }
}
class SQLiteMock {
  create() {
    return Promise.resolve({
      executeSql: () => Promise.resolve([[]])
    });
  }
}
class ModalControllerMock {
  create() { return Promise.resolve({ present: () => Promise.resolve() }); }
}

describe('CardDetallesPage', () => {
  let component: CardDetallesPage;
  let fixture: ComponentFixture<CardDetallesPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), FormsModule, CommonModule],
      declarations: [CardDetallesPage],
      providers: [
        { provide: SQLite, useClass: SQLiteMock },
        { provide: ModalController, useClass: ModalControllerMock },
        { provide: NavParams, useClass: NavParamsMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    fixture = TestBed.createComponent(CardDetallesPage);
    component = fixture.componentInstance;
    component['libro'] = { imagen: 'mock.jpg', titulo: 'Mock', descripcion: 'Mock desc' };
    fixture.detectChanges();
  });

  it('iniciar modal', () => {
    expect(component).toBeTruthy();
  });
  it('definir un libro con caracteristicas', () => {
    expect(component.libro).toBeDefined();
    expect(component.libro.imagen).toBe('mock.jpg');
    expect(component.libro.titulo).toBe('Mock');
    expect(component.libro.descripcion).toBe('Mock desc');
  });
  it('debe cerrar el modal al llamar cerrar()', () => {
    spyOn(component, 'cerrar');
    component.cerrar();
    expect(component.cerrar).toHaveBeenCalled();
  });

  it('debe agregar una nueva reseña al array de reviews', () => {
    component.nuevaResena = 'Excelente libro';
    component.reviews = [];
    component.agregarResena();
    expect(component.reviews.some(r => r.texto === 'Excelente libro')).toBeTrue();
  });

  it('debe agregar fotos al array de fotos', () => {
    const fotos = ['foto1.jpg', 'foto2.jpg'];
    component.fotos = [];
    fotos.forEach(f => component.fotos.push(f));
    expect(component.fotos).toEqual(fotos);
  });

  it('debe cambiar el rating al llamar setRating', async () => {
    await component.setRating(4);
    expect(component.rating).toBe(4);
  });
});
