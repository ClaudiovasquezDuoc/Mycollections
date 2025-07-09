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
          fecha_creacion INTEGER,  -- <-- Agrega este campo
          FOREIGN KEY(id_usuario) REFERENCES usuario(id_usuario)
        )`, []
      );

      // Crear tabla libreria
      await this.database.executeSql(
        `CREATE TABLE IF NOT EXISTS libreria (
          id_libreria INTEGER PRIMARY KEY AUTOINCREMENT,
          id_libro INTEGER,
          nombre VARCHAR(100),
          direccion VARCHAR(200),
          telefono VARCHAR(20),
          email VARCHAR(100),
          horario VARCHAR(100),
          imagen TEXT,
          rating INTEGER,
          resenas TEXT,
          FOREIGN KEY(id_libro) REFERENCES libro(id_libro)
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
    id_usuario: number
  ) {
    await this.dbReady;
    const fecha_creacion = Date.now();
    if (this.useSQLite) {
      let data = [titulo, descripcion, imagen, id_usuario, fecha_creacion];
      return this.database.executeSql(
        "INSERT INTO libro (titulo, descripcion, imagen, id_usuario, fecha_creacion) VALUES (?, ?, ?, ?, ?)",
        data
      );
    } else {
      // localStorage fallback
      const libros = JSON.parse(localStorage.getItem('libros') || '[]');
      const id = Date.now();
      libros.push({ id, titulo, descripcion, imagen, id_usuario, fecha_creacion });
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
      query += ' ORDER BY fecha_creacion ASC'; // <-- Ordena por fecha ascendente
      const res = await this.database.executeSql(query, params);
      let libros = [];
      for (let i = 0; i < res.rows.length; i++) {
        const libro = res.rows.item(i);
        libro.id = libro.id_libro;
        libros.push(libro);
      }
      return libros;
    } else {
      let libros = JSON.parse(localStorage.getItem('libros') || '[]');
      if (id_usuario !== undefined) {
        libros = libros.filter((l: any) => l.id_usuario === id_usuario);
      }
      // Ordena por fecha_creacion ascendente
      libros.sort((a: any, b: any) => a.fecha_creacion - b.fecha_creacion);
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

  // Métodos CRUD para libreria

  async addLibreria(
    id_libro: number,
    nombre: string,
    direccion: string,
    telefono: string,
    email: string,
    horario: string,
    imagen: string,
    rating: number = 0
  ) {
    await this.dbReady;
    if (this.useSQLite) {
      let data = [id_libro, nombre, direccion, telefono, email, horario, imagen, rating];
      try {
        return await this.database.executeSql(
          "INSERT INTO libreria (id_libro, nombre, direccion, telefono, email, horario, imagen, rating, resenas) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [...data, "[]"]
        );
      } catch (e) {
        // Fallback localStorage
        const librerias = JSON.parse(localStorage.getItem('librerias') || '[]');
        librerias.push({ id_libro, nombre, direccion, telefono, email, horario, imagen, rating, resenas: "[]" });
        localStorage.setItem('librerias', JSON.stringify(librerias));
        return Promise.resolve();
      }
    } else {
      // Fallback localStorage
      const librerias = JSON.parse(localStorage.getItem('librerias') || '[]');
      librerias.push({ id_libro, nombre, direccion, telefono, email, horario, imagen, rating, resenas: "[]" });
      localStorage.setItem('librerias', JSON.stringify(librerias));
      return Promise.resolve();
    }
  }

  async getLibrerias(id_libro?: number) {
    await this.dbReady;
    if (this.useSQLite) {
      let query = 'SELECT * FROM libreria';
      let params: any[] = [];
      if (id_libro !== undefined) {
        query += ' WHERE id_libro = ?';
        params = [id_libro];
      }
      try {
        const res = await this.database.executeSql(query, params);
        let librerias = [];
        for (let i = 0; i < res.rows.length; i++) {
          librerias.push(res.rows.item(i));
        }
        return librerias;
      } catch (e) {
        // Fallback localStorage
        let librerias = JSON.parse(localStorage.getItem('librerias') || '[]');
        if (id_libro !== undefined) {
          librerias = librerias.filter((l: any) => l.id_libro === id_libro);
        }
        return librerias;
      }
    } else {
      let librerias = JSON.parse(localStorage.getItem('librerias') || '[]');
      if (id_libro !== undefined) {
        librerias = librerias.filter((l: any) => l.id_libro === id_libro);
      }
      return librerias;
    }
  }

  async actualizarLibreria(libreria: Libreria) {
    await this.dbReady;
    if (this.useSQLite) {
      try {
        return await this.database.executeSql(
          `UPDATE libreria SET nombre = ?, direccion = ?, telefono = ?, email = ?, horario = ?, imagen = ?, rating = ?, resenas = ? WHERE id_libreria = ?`,
          [libreria.nombre, libreria.direccion, libreria.telefono, libreria.email, libreria.horario, libreria.imagen, libreria.rating || 0, libreria.resenas || "[]", libreria.id_libreria]
        );
      } catch (e) {
        // Fallback localStorage
        let librerias = JSON.parse(localStorage.getItem('librerias') || '[]');
        const idx = librerias.findIndex((l: any) => l.id_libreria === libreria.id_libreria);
        if (idx !== -1) {
          librerias[idx] = libreria;
          localStorage.setItem('librerias', JSON.stringify(librerias));
        }
        return Promise.resolve();
      }
    } else {
      let librerias = JSON.parse(localStorage.getItem('librerias') || '[]');
      const idx = librerias.findIndex((l: any) => l.id_libreria === libreria.id_libreria);
      if (idx !== -1) {
        librerias[idx] = libreria;
        localStorage.setItem('librerias', JSON.stringify(librerias));
      }
      return Promise.resolve();
    }
  }

  async eliminarLibreria(id_libreria: number) {
    await this.dbReady;
    if (this.useSQLite) {
      try {
        return await this.database.executeSql(
          `DELETE FROM libreria WHERE id_libreria = ?`,
          [id_libreria]
        );
      } catch (e) {
        // Fallback localStorage
        let librerias = JSON.parse(localStorage.getItem('librerias') || '[]');
        librerias = librerias.filter((l: any) => l.id_libreria !== id_libreria);
        localStorage.setItem('librerias', JSON.stringify(librerias));
        return Promise.resolve();
      }
    } else {
      let librerias = JSON.parse(localStorage.getItem('librerias') || '[]');
      librerias = librerias.filter((l: any) => l.id_libreria !== id_libreria);
      localStorage.setItem('librerias', JSON.stringify(librerias));
      return Promise.resolve();
    }
  }



}

// Fuera de la clase, al final del archivo:
export interface Libreria {
  id_libreria?: number;
  id_libro: number;
  nombre: string;
  direccion: string;
  telefono: string;
  email: string;
  horario: string;
  imagen: string; // ruta o base64
  rating?: number;
  resenas?: string; // JSON.stringify([{texto:string}])
}

