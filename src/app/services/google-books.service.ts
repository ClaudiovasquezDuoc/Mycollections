import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class GoogleBooksService {
  constructor(private http: HttpClient) {}

  buscarLibro(titulo: string) {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(titulo)}&langRestrict=es`;
    return this.http.get(url);
  }
}