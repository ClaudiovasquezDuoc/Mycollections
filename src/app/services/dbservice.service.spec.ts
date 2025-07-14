import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DbserviceService } from './dbservice.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform } from '@ionic/angular';

class SQLiteMock {
  create() {
    return Promise.resolve({
      executeSql: () => Promise.resolve({ rows: { length: 0, item: () => ({}) } })
    });
  }
}
class PlatformMock {
  ready = () => Promise.resolve();
}

describe('DbserviceService', () => {
  let service: DbserviceService;

  beforeEach(fakeAsync(() => {
    // Limpia localStorage antes de cada test
    localStorage.clear();
    // Fuerza que no se detecte Cordova/Capacitor
    (window as any).cordova = undefined;
    (window as any).Capacitor = undefined;
    TestBed.configureTestingModule({
      providers: [
        { provide: SQLite, useClass: SQLiteMock },
        { provide: Platform, useClass: PlatformMock }
      ]
    });
    service = TestBed.inject(DbserviceService);
    // Espera a que la plataforma y la base de datos estén listas
    TestBed.inject(Platform).ready();
    tick();
  }));

  it('should be created', fakeAsync(() => {
    tick();
    expect(service).toBeTruthy();
  }));

  it('debe agregar y obtener usuarios usando localStorage', fakeAsync(() => {
    tick();
    service.addUsuario('Juan', 'Pérez', '1234', 'Secundaria', '2000-01-01', 'M');
    tick();
    service.getUsuarios().then(usuarios => {
      expect(usuarios.length).toBe(1);
      expect(usuarios[0].nombre).toBe('Juan');
    });
    tick();
  }));

  it('debe agregar y obtener libros usando localStorage', fakeAsync(() => {
    tick();
    service.addLibro('Libro 1', 'Desc', 'img.jpg', 1);
    tick();
    service.getLibros(1).then(libros => {
      expect(libros.length).toBe(1);
      expect(libros[0].titulo).toBe('Libro 1');
    });
    tick();
  }));

  it('debe actualizar un libro en localStorage', fakeAsync(() => {
    tick();
    service.addLibro('Libro 1', 'Desc', 'img.jpg', 1);
    tick();
    service.getLibros(1).then(libros => {
      const libro = libros[0];
      libro.titulo = 'Libro Actualizado';
      service.actualizarLibro(libro);
      tick();
      service.getLibros(1).then(libros2 => {
        expect(libros2[0].titulo).toBe('Libro Actualizado');
      });
    });
    tick();
  }));

  it('debe eliminar un libro en localStorage', fakeAsync(() => {
    tick();
    service.addLibro('Libro 1', 'Desc', 'img.jpg', 1);
    tick();
    service.getLibros(1).then(libros => {
      const libro = libros[0];
      service.eliminarLibro(libro.id);
      tick();
      service.getLibros(1).then(libros2 => {
        expect(libros2.length).toBe(0);
      });
    });
    tick();
  }));
});
