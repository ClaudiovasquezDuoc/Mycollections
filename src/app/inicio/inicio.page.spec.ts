import { ComponentFixture, TestBed, fakeAsync, tick  } from '@angular/core/testing';
import { InicioPage } from './inicio.page';
import { Router } from '@angular/router';
import { AuthGuard } from '../services/auth-guard.service';

describe('InicioPage', () => {
  let component: InicioPage;
  let fixture: ComponentFixture<InicioPage>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({
      declarations: [InicioPage],
      providers: [{ provide: Router, useValue: routerSpy }]
    });
    fixture = TestBed.createComponent(InicioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('iniciar pagina inicio', () => {
    expect(component).toBeTruthy();
  });

  it('navegar a /login despues de 5 segundos', fakeAsync(() => {
    component.ngOnInit();
    tick(5000);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  }));
});