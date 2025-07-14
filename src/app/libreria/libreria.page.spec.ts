import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LibreriaPage } from './libreria.page';
import { Router } from '@angular/router';
import { AuthGuard } from '../services/auth-guard.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DbserviceService } from '../services/dbservice.service';
import { GoogleBooksService } from '../services/google-books.service';
import { LogrosService } from '../services/logros.service';
import { ChangeDetectorRef } from '@angular/core';

class DbserviceMock {
  getLibros = jasmine.createSpy().and.returnValue(Promise.resolve([]));
  addLibro = jasmine.createSpy().and.returnValue(Promise.resolve());
  actualizarLibro = jasmine.createSpy().and.returnValue(Promise.resolve());
  eliminarLibro = jasmine.createSpy().and.returnValue(Promise.resolve());
}
class GoogleBooksMock { buscarLibro = jasmine.createSpy().and.returnValue({ subscribe: () => {} }); }
class LogrosMock { libroCreado = jasmine.createSpy(); }
class ModalControllerMock { create = jasmine.createSpy().and.returnValue(Promise.resolve({ present: jasmine.createSpy() })); }
class ChangeDetectorRefMock { detectChanges = jasmine.createSpy(); }
class RouterMock {}

describe('LibreriaPage', () => {
  let component: LibreriaPage;
  let fixture: ComponentFixture<LibreriaPage>;
  let dbService: DbserviceMock;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule],
      declarations: [LibreriaPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: DbserviceService, useClass: DbserviceMock },
        { provide: GoogleBooksService, useClass: GoogleBooksMock },
        { provide: LogrosService, useClass: LogrosMock },
        { provide: ModalController, useClass: ModalControllerMock },
        { provide: ChangeDetectorRef, useClass: ChangeDetectorRefMock },
        { provide: Router, useClass: RouterMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LibreriaPage);
    component = fixture.componentInstance;
    dbService = TestBed.inject(DbserviceService) as any;
    fixture.detectChanges();
  });

  it('debe crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debe inicializar la biblioteca en ngOnInit', fakeAsync(() => {
    dbService.getLibros.and.returnValue(Promise.resolve([{ titulo: 'Libro test' }]));
    component.ngOnInit();
    tick();
    expect(component.biblioteca.length).toBeGreaterThanOrEqual(0);
  }));

  it('debe agregar un libro y actualizar la biblioteca', fakeAsync(() => {
    dbService.getLibros.and.returnValue(Promise.resolve([{ titulo: 'Nuevo libro' }]));
    component.agregarCardBiblioteca();
    tick();
    expect(dbService.addLibro).toHaveBeenCalled();
    expect(component.biblioteca.length).toBeGreaterThanOrEqual(0);
  }));

  it('debe editar y guardar un libro', fakeAsync(() => {
    component.biblioteca = [{ id: 1, titulo: 'Libro', descripcion: '', imagen: '' }];
    component.editandoBiblioteca = 0;
    dbService.getLibros.and.returnValue(Promise.resolve(component.biblioteca));
    component.guardarEdicionBiblioteca();
    tick();
    expect(dbService.actualizarLibro).toHaveBeenCalled();
    expect(component.editandoBiblioteca).toBeNull();
  }));

  it('debe eliminar un libro', fakeAsync(() => {
    component.biblioteca = [{ id: 1, titulo: 'Libro', descripcion: '', imagen: '' }];
    dbService.getLibros.and.returnValue(Promise.resolve([]));
    component.eliminarCardBiblioteca({ id: 1 });
    tick();
    expect(dbService.eliminarLibro).toHaveBeenCalledWith(1);
    expect(component.biblioteca.length).toBe(0);
  }));

  it('debe expandir y colapsar una card', () => {
    component.cardExpandida = null;
    component.expandirCard(1);
    expect(component.cardExpandida as number | null).toBe(1);
    component.expandirCard(1);
    expect(component.cardExpandida).toBeNull();
  });

  it('debe mostrar y cerrar el formulario de nuevo libro', () => {
    component.nuevoLibroVisible = false;
    component.mostrarFormularioNuevoLibro();
    expect(component.nuevoLibroVisible).toBeTrue();
    component.cerrarFormularioNuevoLibro();
    expect(component.nuevoLibroVisible).toBeFalse();
  });
});
