import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';



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
  usuarioNombre: string = '';

  biblioteca = [
    { titulo: 'Libro 1', descripcion: 'Descripción del libro 1', imagen: '' },
    { titulo: 'Libro 2', descripcion: 'Descripción del libro 2', imagen: '' }
  ];


  editando: { ci: number, i: number } | null = null;
  editandoBiblioteca: number | null = null;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    const data = localStorage.getItem('usuarioData');
    if (data) {
      this.usuarioData = JSON.parse(data);
    }
    this.usuarioNombre = localStorage.getItem('usuarioNombre') || 'Usuario';
  }

  // Para editar un libro de una colección
  editarCard(ci: number, i: number) {
    this.editando = { ci, i };
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

  async tomarFotoLibro(index: number) {
    try {
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });
      this.biblioteca[index].imagen = image.dataUrl || '';
    } catch (error) {
      console.log('Cámara cancelada o error:', error);
    }
  }
}


