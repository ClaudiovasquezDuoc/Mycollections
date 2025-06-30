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
          descripcion VARCHAR(250),
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

  async addLibro(
    titulo: string,
    descripcion: string,
    imagen: string,
    id_usuario: number // Relaciona el libro con el usuario
  ) {
    await this.dbReady;
    if (this.useSQLite) {
      let data = [titulo, descripcion, imagen, id_usuario];
      return this.database.executeSql(
        "INSERT INTO libro (titulo, descripcion, imagen, id_usuario) VALUES (?, ?, ?, ?)",
        data
      );
    } else {
      // localStorage fallback
      const libros = JSON.parse(localStorage.getItem('libros') || '[]');
      // Genera un id único usando timestamp
      const id = Date.now();
      libros.push({ id, titulo, descripcion, imagen, id_usuario});
      localStorage.setItem('libros', JSON.stringify(libros));
      return Promise.resolve();
    }
  }

  async getLibros(id_usuario?: number) {
    await this.dbReady;
    if (this.useSQLite) {
      let query = 'SELECT * FROM libro';
      let params: any[] = [];
      if (id_usuario !== undefined) {
        query += ' WHERE id_usuario = ?';
        params = [id_usuario];
      }
      const res = await this.database.executeSql(query, params);
      let libros = [];
      for (let i = 0; i < res.rows.length; i++) {
        const libro = res.rows.item(i);
        libro.id = libro.id_libro; // <-- Mapea id_libro a id
        libros.push(libro);
      }
      return libros;
    } else {
      let libros = JSON.parse(localStorage.getItem('libros') || '[]');
      if (id_usuario !== undefined) {
        libros = libros.filter((l: any) => l.id_usuario === id_usuario);
      }
      return libros;
    }
  }

  async actualizarLibro(libro: any) {
    await this.dbReady;
    if (this.useSQLite) {
      return this.database.executeSql(
        `UPDATE libro SET titulo = ?, descripcion = ?, imagen = ? WHERE id_libro = ?`,
        [libro.titulo, libro.descripcion, libro.imagen, libro.id]
      );
    } else {
      let libros = JSON.parse(localStorage.getItem('libros') || '[]');
      const idx = libros.findIndex((l: any) => l.id === libro.id);
      if (idx !== -1) {
        libros[idx] = libro;
        localStorage.setItem('libros', JSON.stringify(libros));
      }
      return Promise.resolve();
    }
  }

  async eliminarLibro(id: number) {
    await this.dbReady;
    if (this.useSQLite) {
      return this.database.executeSql(
        `DELETE FROM libro WHERE id_libro = ?`,
        [id]
      );
    } else {
      let libros = JSON.parse(localStorage.getItem('libros') || '[]');
      libros = libros.filter((l: any) => l.id !== id);
      localStorage.setItem('libros', JSON.stringify(libros));
      return Promise.resolve();
    }
  }
}
