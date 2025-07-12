import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavParams, ToastController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { DbserviceService, Libreria } from 'src/app/services/dbservice.service';

@Component({
  selector: 'app-card-detalles',
  templateUrl: './card-detalles.page.html',
  styleUrls: ['./card-detalles.page.scss'],
  standalone: false
})
export class CardDetallesPage implements OnInit {
  @Input() libro: any;
  libreria: Libreria | null = null;
  fotos: string[] = [];
  rating = 0;
  hoverRating: number = 0;
  reviews: { texto: string }[] = [];
  nuevaResena: string = '';
  comentarioTexto: string = '';
  comentarioImagen: string = '';
  comentarios: any[] = [];

  fotoGrandeIndex: number | null = null;

  constructor(private navParams: NavParams, private modalCtrl: ModalController, private toastCtrl: ToastController, private db: DbserviceService) {
    this.libro = this.navParams.get('data');
  }

  async ngOnInit() {
    // Cargar datos persistidos de la libreria asociada al libro
    const librerias = await this.db.getLibrerias(this.libro.id_libro);
    this.libreria = librerias.length ? librerias[0] : null;
    if (this.libreria) {
      this.fotos = this.libreria.imagen ? [this.libreria.imagen] : [];
      this.rating = this.libreria.rating || 0;
      // Cargar reseñas persistidas
      if (this.libreria.resenas) {
        try {
          this.reviews = JSON.parse(this.libreria.resenas);
        } catch {
          this.reviews = [];
        }
      } else {
        this.reviews = [];
      }
    }
    this.cargarResenas();
  }

  cargarResenas() {
    if (this.libro && this.libro.id) {
      const data = localStorage.getItem(`reseñas_${this.libro.id}`);
      this.reviews = data ? JSON.parse(data) : [];
    }
  }

  async setRating(star: number) {
    this.rating = star;
    if (this.libreria) {
      this.libreria.rating = star;
      await this.db.actualizarLibreria(this.libreria);
    } else {
      // Si no existe, crea la libreria con el rating
      await this.db.addLibreria(this.libro.id_libro, '', '', '', '', '', '', star);
    }
  }

  cerrar() {
    this.modalCtrl.dismiss();
  }

  async tomarFotoComentario() {
    try {
      const image = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt,
        quality: 70
      });
      this.comentarioImagen = image.dataUrl!;
    } catch (err) {
      console.error('Error al tomar foto', err);
    }
  }

  async agregarComentario() {
    if (!this.comentarioTexto && !this.comentarioImagen) return;

    this.comentarios.push({
      texto: this.comentarioTexto,
      imagen: this.comentarioImagen,
      fecha: new Date()
    });

    this.comentarioTexto = '';
    this.comentarioImagen = '';

    const toast = await this.toastCtrl.create({
      message: 'Comentario agregado',
      duration: 1500,
      color: 'success'
    });
    toast.present();
  }

  async agregarResena() {
    if (this.nuevaResena.trim()) {
      this.reviews.push({ texto: this.nuevaResena });
      this.guardarResenas();
      this.nuevaResena = '';
    }
  }

  guardarResenas() {
    if (this.libro && this.libro.id) {
      localStorage.setItem(`reseñas_${this.libro.id}`, JSON.stringify(this.reviews));
    }
  }

  async agregarFoto(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e: any) => {
        const nuevaFoto = e.target.result;
        this.fotos.push(nuevaFoto);
        if (this.libreria) {
          this.libreria.imagen = nuevaFoto;
          await this.db.actualizarLibreria(this.libreria);
        } else {
          // Si no existe, crea la libreria
          await this.db.addLibreria(this.libro.id_libro, '', '', '', '', '', nuevaFoto);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  abrirFotoGrande(index: number) {
    this.fotoGrandeIndex = index;
  }

  cerrarFotoGrande() {
    this.fotoGrandeIndex = null;
  }
}
