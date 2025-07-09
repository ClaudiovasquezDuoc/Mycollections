import { Component, Input } from '@angular/core';
import { ModalController, NavParams, ToastController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-card-detalles',
  templateUrl: './card-detalles.page.html',
  styleUrls: ['./card-detalles.page.scss'],
  standalone: false
})
export class CardDetallesPage {
  libro: any;
  comentarioTexto: string = '';
  comentarioImagen: string = '';
  comentarios: any[] = [];

  rating = 0;
  hoverRating = 0;
  nuevaResena = '';
  reviews: any[] = [];

  fotos: string[] = [];
  fotoGrandeIndex: number | null = null;

  constructor(private navParams: NavParams, private modalCtrl: ModalController, private toastCtrl: ToastController) {
    this.libro = this.navParams.get('data');
  }

  setRating(star: number) {
    this.rating = star;
    // Aquí puedes guardar la puntuación en tu base de datos si lo deseas
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

  agregarResena() {
    if (this.nuevaResena.trim()) {
      this.reviews.push({ texto: this.nuevaResena });
      this.nuevaResena = '';
      // Aquí puedes guardar la reseña en tu base de datos si lo deseas
    }
  }

  agregarFoto(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.fotos.push(e.target.result);
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
