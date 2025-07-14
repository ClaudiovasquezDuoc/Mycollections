import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginPage } from './login.page';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { IonicModule } from '@ionic/angular';
import { DbserviceService } from '../services/dbservice.service';

class SQLiteMock {
  create() { return Promise.resolve({ executeSql: () => Promise.resolve([]) }); }
}

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginPage],
      imports: [IonicModule.forRoot(), FormsModule],
      providers: [
        { provide: SQLite, useClass: SQLiteMock },
        DbserviceService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('abrir pagina login', () => {
    expect(component).toBeTruthy();
  });

  it('completar el formulario y enviarlo, abriendo el modal si no hay usuarios', async () => {
    // Nombre aleatorio (max 20 letras)
    const nombre = Array.from({length: 8}, () => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('');
    // Clave numérica (4 dígitos)
    const clave = Math.floor(1000 + Math.random() * 9000).toString();
    component.usuario = nombre;
    component.contrasena = clave;
    fixture.detectChanges();

    // Simular que no hay usuarios registrados
    spyOn(component['dbService'], 'getUsuarios').and.returnValue(Promise.resolve([]));
    // Espiar alertController.create
    const alertSpy = jasmine.createSpyObj('Alert', ['present']);
    spyOn(component['alertController'], 'create').and.returnValue(Promise.resolve(alertSpy));

    await component.ingresar();
    expect(component.usuarioInvalido).toBeTrue();
    expect(component['alertController'].create).toHaveBeenCalled();
    expect(alertSpy.present).toHaveBeenCalled();
  });

  it('llamar a irRegistro al hacer clic en el botón', () => {
    spyOn(component, 'irRegistro');
    fixture.detectChanges();
    const btn = fixture.debugElement.nativeElement.querySelector('.boton-registro');
    btn.click();
    expect(component.irRegistro).toHaveBeenCalled();
  });

// ...existing code...
});
