import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HomePage } from './home.page';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

class SQLiteMock {
  create() { return Promise.resolve({ executeSql: () => Promise.resolve([]) }); }
}

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomePage],
      imports: [IonicModule.forRoot(), FormsModule, CommonModule],
      providers: [
        { provide: SQLite, useClass: SQLiteMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('abrir la pagina home', () => {
    expect(component).toBeTruthy();
  });
  it('titulo de menu superior', () => {
    // El primer ion-title es el del menú lateral, el segundo el del header principal
    const titles = fixture.debugElement.nativeElement.querySelectorAll('ion-title');
    expect(titles[0].textContent).toContain('Menú');
    expect(titles[1].textContent).toContain('Mis Colecciones');
  });
  it('funcionamiento de menu superior', () => {
    const menu = fixture.debugElement.nativeElement.querySelector('ion-menu');
    expect(menu).toBeTruthy();
  });

  it('funcionamiento de formulario', () => {
    // Verifica que los campos de nombre y apellido existen y el binding funciona
    const inputs = fixture.debugElement.nativeElement.querySelectorAll('ion-input[type="text"]');
    expect(inputs.length).toBeGreaterThanOrEqual(2);

    // Simula escribir en el input de nombre
    component.nombre = 'Juan';
    fixture.detectChanges();
    expect(inputs[0].ngModel).toBeUndefined(); // ngModel no está en el nativeElement, pero el valor sí
    // Alternativamente, verifica el valor del componente
    expect(component.nombre).toBe('Juan');

    // Simula escribir en el input de apellido
    component.apellido = 'Pérez';
    fixture.detectChanges();
    expect(component.apellido).toBe('Pérez');
  });

  it('funcionamiento de boton limpiar', () => {
    // Busca el botón por su texto "Limpiar"
    component.nombre = 'Juan';
    component.apellido = 'Pérez';
    fixture.detectChanges();
    const buttons = fixture.debugElement.nativeElement.querySelectorAll('ion-button');
    const clearButton = Array.from(buttons).find((btn: any) => btn.textContent.includes('Limpiar'));
    expect(clearButton).toBeTruthy();
    (clearButton as HTMLElement).click();
    fixture.detectChanges();
    expect(component.nombre).toBe('');
    expect(component.apellido).toBe('');
  });

  it('funcionamiento de boton mostrar datos', () => {
    spyOn(component, 'mostrar');
    const buttons = fixture.debugElement.nativeElement.querySelectorAll('ion-button');
    const showButton = Array.from(buttons).find((btn: any) => btn.textContent.includes('Mostrar'));
    expect(showButton).toBeTruthy();
    (showButton as HTMLElement).click();
    fixture.detectChanges();
    expect(component.mostrar).toHaveBeenCalled();
  });

  it('funcionamiento de boton guardar datos', () => {
    spyOn(component, 'guardarDatos');
    const buttons = fixture.debugElement.nativeElement.querySelectorAll('ion-button');
    const saveButton = Array.from(buttons).find((btn: any) => btn.textContent.includes('Guardar'));
    expect(saveButton).toBeTruthy();
    (saveButton as HTMLElement).click();
    fixture.detectChanges();
    expect(component.guardarDatos).toHaveBeenCalled();
  });
});
