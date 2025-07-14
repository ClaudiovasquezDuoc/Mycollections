import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { GoogleBooksService } from './google-books.service';

describe('GoogleBooksService', () => {
  let service: GoogleBooksService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(GoogleBooksService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('debe crear el componente', () => {
    expect(service).toBeTruthy();
  });

  it('debe buscar un libro por título y llamar al endpoint correcto', () => {
    const mockResponse = { items: [{ id: '1', volumeInfo: { title: 'Angular' } }] };
    const titulo = 'Angular';

    service.buscarLibro(titulo).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      `https://www.googleapis.com/books/v1/volumes?q=Angular&langRestrict=es`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
    httpMock.verify();
  });
});
