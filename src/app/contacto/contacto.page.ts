import { Component, AfterViewInit } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import * as L from 'leaflet';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.page.html',
  styleUrls: ['./contacto.page.scss'],
  standalone: false
})
export class ContactoPage implements AfterViewInit {
  map: any;
  expandido: number | null = null;
  ultimaUbicacion: [number, number] | null = null;

  constructor() { }

  async ngAfterViewInit() {
    // Obtener ubicación del usuario
    this.obtenerUbicacion();
  }

  async obtenerUbicacion() {
    await Geolocation.requestPermissions();
    const coordinates = await Geolocation.getCurrentPosition();
    const lat = coordinates.coords.latitude;
    const lng = coordinates.coords.longitude;
    this.ultimaUbicacion = [lat, lng];
    this.initMap(lat, lng);
    this.buscarLibrerias(lat, lng);
  }

  initMap(lat: number, lng: number) {
    this.map = L.map('map').setView([lat, lng], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Marcador de tu ubicación
    L.marker([lat, lng]).addTo(this.map)
      .bindPopup('Tu ubicación')
      .openPopup();

    // Forzar refresco de tamaño en móviles
    setTimeout(() => {
      this.map.invalidateSize();
    }, 300);

    setTimeout(() => {
      this.map.invalidateSize();
    }, 200);
  }

  buscarLibrerias(lat: number, lng: number) {
    // Consulta Overpass API para buscar librerías (bookstore) cerca
    const radius = 1000; // metros
    const query = `
      [out:json];
      (
        node["shop"="books"](around:${radius},${lat},${lng});
        way["shop"="books"](around:${radius},${lat},${lng});
        relation["shop"="books"](around:${radius},${lat},${lng});
      );
      out center;
    `;
    fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query,
      headers: { 'Content-Type': 'text/plain' }
    })
      .then(res => res.json())
      .then(data => {
        data.elements.forEach((el: any) => {
          let coords: [number, number] | null = null;
          if (el.type === 'node' && el.lat && el.lon) {
            coords = [el.lat, el.lon];
          } else if (el.center && el.center.lat && el.center.lon) {
            coords = [el.center.lat, el.center.lon];
          }
          if (coords) {
            L.marker(coords)
              .addTo(this.map)
              .bindPopup(el.tags.name || 'Librería');
          }
        });
      });
  }

  centrarEnGPS() {
    if (this.ultimaUbicacion && this.map) {
      this.map.setView(this.ultimaUbicacion, 15);
    }
  }
}
