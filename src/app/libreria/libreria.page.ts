import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-libreria',
  templateUrl: 'libreria.page.html',
  styleUrls: ['libreria.page.scss'],
  standalone: false
})
export class LibreriaPage implements OnInit {
  usuarioData: any = {};
  mostrarDatos = false;

  biblioteca = [
    { titulo: 'Libro 1', descripcion: 'Descripción del libro 1', imagen: '' },
    { titulo: 'Libro 2', descripcion: 'Descripción del libro 2', imagen: '' }
  ];

  editando: number | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const data = localStorage.getItem('usuarioData');
    if (data) {
      this.usuarioData = JSON.parse(data);
    }
  }

  editarCard(index: number) {
    this.editando = index;
  }

  guardarEdicion() {
    this.editando = null;
  }

  cancelarEdicion() {
    this.editando = null;
  }

  onFileSelected(event: any, card: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        card.imagen = e.target.result; // Base64 para mostrar la imagen
      };
      reader.readAsDataURL(file);
    }
  }

  agregarCard() {
    const nuevo = {
      titulo: `Libro ${this.biblioteca.length + 1}`,
      descripcion: 'Buscando descripción...',
      imagen: ''
    };
    this.biblioteca.push(nuevo);
    this.buscarDescripcionLibro(nuevo.titulo, nuevo);
  }

  buscarDescripcionLibro(titulo: string, card: any) {
    const url = `https://openlibrary.org/search.json?title=${encodeURIComponent(titulo)}`;
    this.http.get<any>(url).subscribe(res => {
      if (res.docs && res.docs.length > 0) {
        const workKey = res.docs[0].key;
        this.http.get<any>(`https://openlibrary.org${workKey}.json`).subscribe(work => {
          card.descripcion = work.description?.value || work.description || 'Sin descripción disponible';
        }, () => {
          card.descripcion = 'Sin descripción disponible';
        });
      } else {
        card.descripcion = 'Sin descripción disponible';
      }
    }, () => {
      card.descripcion = 'Sin descripción disponible';
    });
  }

  eliminarCard(index: number) {
    this.biblioteca.splice(index, 1);
  }

  getImagenLibro(titulo: string): string {
    switch (titulo) {
      case 'Libro 1':
        return 'assets/img/libro1.jpg';
      case 'Libro 2':
        return 'assets/img/libro2.jpg';
      default:
        return 'assets/img/default.jpg';
    }
  }
}

