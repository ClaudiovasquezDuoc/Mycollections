import { TestBed } from '@angular/core/testing';
import { LogrosService } from './logros.service';
import { ToastController } from '@ionic/angular';

class ToastControllerMock {
  create = jasmine.createSpy().and.returnValue(Promise.resolve({ present: jasmine.createSpy() }));
}

describe('LogrosService', () => {
  let service: LogrosService;
  let toastController: ToastControllerMock;

  beforeEach(() => {
    toastController = new ToastControllerMock();
    TestBed.configureTestingModule({
      providers: [
        { provide: ToastController, useValue: toastController }
      ]
    });
    service = TestBed.inject(LogrosService);
  });

  it('debe mostrar logro al crear el primer libro', () => {
    service.libroCreado();
    expect(toastController.create).toHaveBeenCalled();
  });

  it('no debe mostrar logro de primer libro dos veces', () => {
    service.libroCreado();
    toastController.create.calls.reset();
    service.libroCreado();
    expect(toastController.create).not.toHaveBeenCalled();
  });

  it('debe mostrar logro al crear tres libros', () => {
    service.libroCreado(); // 1
    service.libroCreado(); // 2
    toastController.create.calls.reset();
    service.libroCreado(); // 3
    expect(toastController.create).toHaveBeenCalled();
  });

  it('debe mostrar logro al crear la cuenta', async () => {
    await service.cuentaCreada();
    expect(toastController.create).toHaveBeenCalled();
  });

  it('no debe mostrar logro de cuenta dos veces', async () => {
    await service.cuentaCreada();
    toastController.create.calls.reset();
    await service.cuentaCreada();
    expect(toastController.create).not.toHaveBeenCalled();
  });

  it('debe mostrar logro al agregar la primera reseña', () => {
    service.resenaAgregada();
    expect(toastController.create).toHaveBeenCalled();
  });

  it('no debe mostrar logro de primera reseña dos veces', () => {
    service.resenaAgregada();
    toastController.create.calls.reset();
    service.resenaAgregada();
    expect(toastController.create).not.toHaveBeenCalled();
  });
});
