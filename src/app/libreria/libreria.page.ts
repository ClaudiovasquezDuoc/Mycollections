import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { DbserviceService } from '../services/dbservice.service';
import { GoogleBooksService } from '../services/google-books.service';
import { Geolocation } from '@capacitor/geolocation';
import { LogrosService } from '../services/logros.service';
import { ModalController } from '@ionic/angular';
import { CardDetallesPage } from '../modal/card-detalles/card-detalles.page';

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

  biblioteca: any[] = [];
  usuarioId: number = 1; // O el id del usuario logueado
  editandoBiblioteca: number | null = null;

  nuevoLibroVisible = false;
  nuevoLibroTitulo = '';
  nuevoLibroImagen = '';
  nuevoLibroDescripcion = '';


  apiDebugData: any = null;

  private buscarDescripcionTimeout: any;

  cardExpandida: number | null = null;

  constructor(private http: HttpClient, private dbService: DbserviceService, private googleBooks: GoogleBooksService, private logrosService: LogrosService, private modalController: ModalController) { }

  async ngOnInit() {
    const data = localStorage.getItem('usuarioData');
    if (data) {
      this.usuarioData = JSON.parse(data);
    }
    this.usuarioNombre = localStorage.getItem('usuarioNombre') || 'Usuario';
    this.biblioteca = await this.dbService.getLibros(this.usuarioId);
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

  async agregarCardBiblioteca() {
    const nuevoLibro = {
      titulo: 'Nuevo libro',
      descripcion: '',
      imagen: '',
      id_usuario: this.usuarioId
    };
    await this.dbService.addLibro(
      nuevoLibro.titulo,
      nuevoLibro.descripcion,
      nuevoLibro.imagen,
      nuevoLibro.id_usuario
    );
    this.biblioteca = await this.dbService.getLibros(this.usuarioId);
    this.logrosService.libroCreado();

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

  editarCardBiblioteca(i: number) {
    this.editandoBiblioteca = i;
  }

  cancelarEdicionBiblioteca() {
    this.editandoBiblioteca = null;
  }

  async guardarEdicionBiblioteca() {
    if (this.editandoBiblioteca !== null) {
      const libroEditado = this.biblioteca[this.editandoBiblioteca];
      // Actualiza el libro en la base de datos/localStorage
      await this.dbService.actualizarLibro(libroEditado);
      this.biblioteca = await this.dbService.getLibros(this.usuarioId);
      this.editandoBiblioteca = null;
      this.cardExpandida = null;
    }
  }

  async eliminarCardBiblioteca(card: any) {
    await this.dbService.eliminarLibro(card.id);
    this.biblioteca = await this.dbService.getLibros(this.usuarioId);
  }

  mostrarFormularioNuevoLibro() {
    this.nuevoLibroVisible = true;
    this.nuevoLibroTitulo = '';
    this.nuevoLibroImagen = '';
  }

  cerrarFormularioNuevoLibro() {
    this.nuevoLibroVisible = false;
  }

  onFileSelectedNuevoLibro(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.nuevoLibroImagen = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  async tomarFotoNuevoLibro() {
    try {
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });
      this.nuevoLibroImagen = image.dataUrl || '';
    } catch (error) {
      console.log('Cámara cancelada o error:', error);
    }
  }

  async guardarNuevoLibro() {
    if (!this.nuevoLibroTitulo) return;

    if (!this.nuevoLibroImagen) {
      this.nuevoLibroImagen = 'assets/img/sin_imagen.jpg';
    }

    // Guardar el libro
    await this.dbService.addLibro(
      this.nuevoLibroTitulo,
      this.nuevoLibroDescripcion,
      this.nuevoLibroImagen,
      this.usuarioId,

    );
    this.logrosService.libroCreado();
    // Recarga la lista completa para evitar el card vacío
    this.biblioteca = await this.dbService.getLibros(this.usuarioId);
    this.nuevoLibroVisible = false;
  }

  // Función para calcular porcentaje de coincidencia de palabras
  private calcularSimilitud(tituloA: string, tituloB: string): number {
    const palabrasA = tituloA.toLowerCase().split(/\s+/);
    const palabrasB = tituloB.toLowerCase().split(/\s+/);
    const coincidencias = palabrasA.filter(palabra => palabrasB.includes(palabra)).length;
    return coincidencias / Math.max(palabrasA.length, palabrasB.length);
  }
  buscarDescripcionLibro(titulo: string) {
    if (!titulo || titulo.trim() === '') {
      this.nuevoLibroDescripcion = '';
      return;
    }
    if (this.buscarDescripcionTimeout) {
      clearTimeout(this.buscarDescripcionTimeout);
    }
    this.buscarDescripcionTimeout = setTimeout(() => {
      this.googleBooks.buscarLibro(titulo).subscribe((result: any) => {
        if (!result.items || result.items.length === 0) {
          this.nuevoLibroDescripcion = '';
          return;
        }
        let mejorCoincidencia = null;
        let mayorSimilitud = 0;
        for (const item of result.items) {
          const tituloApi = item.volumeInfo.title || '';
          const idioma = item.volumeInfo.language || '';
          if (idioma !== 'es') continue;
          const similitud = this.calcularSimilitud(titulo, tituloApi);
          if (similitud > mayorSimilitud) {
            mayorSimilitud = similitud;
            mejorCoincidencia = item;
          }
        }
        if (mejorCoincidencia && mejorCoincidencia.volumeInfo.description) {
          this.nuevoLibroDescripcion = mejorCoincidencia.volumeInfo.description;
        } else {
          this.nuevoLibroDescripcion = '';
        }
      });
    }, 500);
  }

  expandirCard(i: number) {
    this.cardExpandida = this.cardExpandida === i ? null : i;
  }

  async obtenerYGuardarUbicacion() {
    try {
      const position = await Geolocation.getCurrentPosition();
      const ubicacion = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        timestamp: position.timestamp
      };
      localStorage.setItem('ubicacion', JSON.stringify(ubicacion));
      console.log('Ubicación guardada:', ubicacion);
    } catch (error) {
      console.error('Error obteniendo ubicación:', error);
    }
  }

  async verCoordenadas() {
    try {
      const position = await Geolocation.getCurrentPosition();
      console.log('Datos completos del GPS:', position);
      console.log('Latitud:', position.coords.latitude);
      console.log('Longitud:', position.coords.longitude);
      // Puedes mostrar también la precisión, altitud, etc.
    } catch (error) {
      console.error('Error obteniendo ubicación:', error);
    }
  }

  async openCardDetail(card: any) {
    const modal = await this.modalController.create({
      component: CardDetallesPage,
      componentProps: { libro: card },
      cssClass: 'modal-detalles-personalizado' // <--- tu clase personalizada
    });
    await modal.present();
  }


  
}


