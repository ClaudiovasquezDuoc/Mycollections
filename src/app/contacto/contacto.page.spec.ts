import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ContactoPage } from './contacto.page';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Geolocation } from '@capacitor/geolocation';
class SQLiteMock {
  create() { return Promise.resolve({ executeSql: () => Promise.resolve([]) }); }
}

describe('ContactoPage', () => {
  let geolocationRequestSpy: jasmine.Spy;
  let geolocationGetPosSpy: jasmine.Spy;
  let component: ContactoPage;
  let fixture: ComponentFixture<ContactoPage>;

  let router: Router;
  beforeAll(() => {
    geolocationRequestSpy = spyOn(Geolocation as any, 'requestPermissions').and.returnValue(Promise.resolve());
    geolocationGetPosSpy = spyOn(Geolocation as any, 'getCurrentPosition').and.returnValue(Promise.resolve({ coords: { latitude: 1, longitude: 2 } } as any));
  });

  afterAll(() => {
    geolocationRequestSpy.and.callThrough();
    geolocationGetPosSpy.and.callThrough();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContactoPage],
      imports: [IonicModule.forRoot(), FormsModule, CommonModule, RouterTestingModule.withRoutes([])],
      providers: [
        { provide: SQLite, useClass: SQLiteMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    fixture = TestBed.createComponent(ContactoPage);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe tener un elemento de menú para "/home" y ser clicable', () => {
    fixture.detectChanges();
    const items = fixture.debugElement.queryAll(By.css('ion-item'));
    const homeBtn = items.find(el => el.attributes['routerLink'] === '/home');
    expect(homeBtn).toBeTruthy();
    homeBtn!.nativeElement.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    // No assertion for navigation, leave for e2e
  });

  it('debe tener un elemento de menú para "/libreria" y ser clicable', () => {
    fixture.detectChanges();
    const items = fixture.debugElement.queryAll(By.css('ion-item'));
    const libreriaBtn = items.find(el => el.attributes['routerLink'] === '/libreria');
    expect(libreriaBtn).toBeTruthy();
    libreriaBtn!.nativeElement.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    // No assertion for navigation, leave for e2e
  });

  it('debe expandir y colapsar las secciones "¿Quiénes somos?" y "Contacto"', () => {
    // Expandir "¿Quiénes somos?"
    const quienesBtn = fixture.debugElement.queryAll(By.css('ion-item'))[2];
    quienesBtn.triggerEventHandler('click', {});
    fixture.detectChanges();
    expect(component.expandido).toBe(1);
    // Collapse
    quienesBtn.triggerEventHandler('click', {});
    fixture.detectChanges();
    expect(component.expandido).toBeNull();
    // Expand "Contacto"
    const contactoBtn = fixture.debugElement.queryAll(By.css('ion-item'))[3];
    contactoBtn.triggerEventHandler('click', {});
    fixture.detectChanges();
    expect(component.expandido).toBe(2);
  });

  it('llamar a centrarEnGPS al hacer clic en el icono de localización', () => {
    spyOn(component, 'centrarEnGPS');
    fixture.detectChanges();
    const fabBtn = fixture.debugElement.nativeElement.querySelector('ion-fab-button');
    fabBtn.click();
    expect(component.centrarEnGPS).toHaveBeenCalled();
  });
});
