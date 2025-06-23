import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Libro {
  id: string; // o number, según tu preferencia y la base de datos
  titulo: string;
  descripcion: string;
  imagen: string;
}

interface Coleccion {
  id: string;
  nombre: string;
  expandida: boolean;
  biblioteca: Libro[];
}

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

  colecciones: Coleccion[] = [
    {
      id: Date.now().toString() + Math.random().toString(36).substring(2), // <-- agrega el id
      nombre: 'Colección 1',
      expandida: false,
      biblioteca: [
        // Libros aquí
      ]
    },
    // Puedes agregar más colecciones
  ];

  editando: {ci: number, i: number} | null = null;
  editandoBiblioteca: number | null = null;
  editandoNombreColeccion: number | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const data = localStorage.getItem('usuarioData');
    if (data) {
      this.usuarioData = JSON.parse(data);
    }
  }

  // Para editar un libro de una colección
  editarCard(ci: number, i: number) {
    this.editando = {ci, i};
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

  eliminarCard(ci: number, i: number) {
    this.colecciones[ci].biblioteca.splice(i, 1);
  }

  agregarCard(ci: number) {
    this.colecciones[ci].biblioteca.push({
      id: Date.now().toString() + Math.random().toString(36).substring(2),
      titulo: 'Nuevo libro',
      descripcion: '',
      imagen: ''
    });
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

  toggleColeccion(index: number) {
    this.colecciones[index].expandida = !this.colecciones[index].expandida;
  }

  agregarColeccion() {
    this.colecciones.push({
      id: Date.now().toString() + Math.random().toString(36).substring(2),
      nombre: `Colección ${this.colecciones.length + 1}`,
      expandida: false,
      biblioteca: []
    });
  }

  // Para la biblioteca principal
  editarCardBiblioteca(i: number) {
    this.editandoBiblioteca = i;
  }

  guardarEdicionBiblioteca() {
    this.editandoBiblioteca = null;
  }

  cancelarEdicionBiblioteca() {
    this.editandoBiblioteca = null;
  }

  eliminarCardBiblioteca(i: number) {
    this.biblioteca.splice(i, 1);
  }

  agregarCardBiblioteca() {
    this.biblioteca.push({
      titulo: 'Nuevo libro',
      descripcion: '',
      imagen: ''
    });
  }

  // Método para activar la edición
  editarNombreColeccion(ci: number) {
    this.editandoNombreColeccion = ci;
  }

  // Guardar el nombre editado
  guardarNombreColeccion() {
    this.editandoNombreColeccion = null;
  }

  // Cancelar la edición
  cancelarNombreColeccion() {
    this.editandoNombreColeccion = null;
  }
}

