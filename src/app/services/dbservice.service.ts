import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class DbserviceService {
  public database!: SQLiteObject;
  private dbReady: Promise<void>;
  private dbReadyResolve!: () => void;
  private useSQLite = false;

  constructor(private sqlite: SQLite, private platform: Platform) {
    this.dbReady = new Promise((resolve) => {
      this.dbReadyResolve = resolve;
    });
    this.platform.ready().then(() => {
      // Detecta si es Cordova/Capacitor
      this.useSQLite = !!(window as any).cordova || !!(window as any).Capacitor;
      this.crearBaseDatos();
    });
  }

  async crearBaseDatos() {
    if (this.useSQLite) {
      this.database = await this.sqlite.create({
        name: 'mycollections.db',
        location: 'default'
      });

      // Crear tabla usuario
      await this.database.executeSql(
        `CREATE TABLE IF NOT EXISTS usuario (
          id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre VARCHAR(20),
          apellido VARCHAR(20),
          contrasena VARCHAR(20),
          nivelEducacion VARCHAR(20),
          fechaNacimiento DATE,
          genero VARCHAR(20)
        )`, []
      );

      // Crear tabla libro
      await this.database.executeSql(
        `CREATE TABLE IF NOT EXISTS libro (
          id_libro INTEGER PRIMARY KEY AUTOINCREMENT,
          titulo VARCHAR(20),
          descripcion VARCHAR(100),
          imagen TEXT,
          id_usuario INTEGER,
          FOREIGN KEY(id_usuario) REFERENCES usuario(id_usuario)
        )`, []
      );
    }
    this.dbReadyResolve();
  }

  async addUsuario(
    nombre: string,
    apellido: string,
    contrasena: string,
    nivelEducacion: string,
    fechaNacimiento: string,
    genero: string
  ) {
    await this.dbReady;
    if (this.useSQLite) {
      let data = [nombre, apellido, contrasena, nivelEducacion, fechaNacimiento, genero];
      return this.database.executeSql(
        "INSERT INTO usuario (nombre, apellido, contrasena, nivelEducacion, fechaNacimiento, genero) VALUES (?, ?, ?, ?, ?, ?)",
        data
      );
    } else {
      // localStorage fallback
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
      usuarios.push({ nombre, apellido, contrasena, nivelEducacion, fechaNacimiento, genero });
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
      return Promise.resolve();
    }
  }

  async getUsuarios() {
    await this.dbReady;
    if (this.useSQLite) {
      const res = await this.database.executeSql('SELECT * FROM usuario', []);
      let usuarios = [];
      for (let i = 0; i < res.rows.length; i++) {
        usuarios.push(res.rows.item(i));
      }
      return usuarios;
    } else {
      return JSON.parse(localStorage.getItem('usuarios') || '[]');
    }
  }
}
