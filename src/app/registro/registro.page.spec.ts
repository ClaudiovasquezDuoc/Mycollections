
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroPage } from './registro.page';
import { DbserviceService } from '../services/dbservice.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

class SQLiteMock {
  create() { return Promise.resolve({ executeSql: () => Promise.resolve([]) }); }
}


describe('RegistroPage', () => {
  let component: RegistroPage;
  let fixture: ComponentFixture<RegistroPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistroPage],
      imports: [IonicModule.forRoot(), FormsModule, ReactiveFormsModule],
      providers: [
        { provide: SQLite, useClass: SQLiteMock },
        DbserviceService // solo si no es providedIn: 'root'
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    fixture = TestBed.createComponent(RegistroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('iniciar la pagina registro', () => {
    expect(component).toBeTruthy();
  });

  it('completar el formulario con datos válidos y enviarlo', () => {
    // Nombre y apellido: solo letras, max 20
    const nombre = 'Juan';
    const apellido = 'Perez';
    // Contraseña: 4 números aleatorios
    const contrasena = Math.floor(1000 + Math.random() * 9000).toString();
    // Nivel de educación: probar una de las opciones
    const nivelEducacion = 'universidad';
    // Fecha de nacimiento: cualquier fecha válida
    const fechaNacimiento = '2000-01-01';
    // Género: cualquiera
    const genero = 'masculino';

    component.registroForm.controls['nombre'].setValue(nombre);
    component.registroForm.controls['apellido'].setValue(apellido);
    component.registroForm.controls['contraseña'].setValue(contrasena);
    component.registroForm.controls['nivelEducacion'].setValue(nivelEducacion);
    component.registroForm.controls['fechaNacimiento'].setValue(fechaNacimiento);
    component.registroForm.controls['genero'].setValue(genero);

    expect(component.registroForm.valid).toBeTrue();

    // Simular submit
    spyOn(component, 'onSubmit');
    fixture.debugElement.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    expect(component.onSubmit).toHaveBeenCalled();
  });
});
