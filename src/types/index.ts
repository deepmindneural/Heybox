// Tipos para la aplicación HEYBOX

// Usuario
export interface Direccion {
  calle?: string;
  ciudad?: string;
  codigoPostal?: string;
  coordenadas?: {
    lat: number;
    lng: number;
  };
}

export interface MetodoPago {
  tipo: 'tarjeta' | 'paypal' | 'efectivo';
  detalles?: {
    ultimosDigitos?: string;
    fechaExpiracion?: string;
    titular?: string;
  };
}

export interface Usuario {
  _id?: string;
  nombre: string;
  email: string;
  telefono: string;
  direccion?: Direccion;
  rol?: 'cliente' | 'restaurante' | 'admin';
  metodosPago?: MetodoPago[];
  fechaRegistro?: Date;
  activo?: boolean;
}

// Restaurante
export interface AnilloProximidad {
  distancia: number;
  color: string;
}

export interface Horario {
  apertura: string;
  cierre: string;
}

export interface HorarioSemanal {
  lunes: Horario;
  martes: Horario;
  miercoles: Horario;
  jueves: Horario;
  viernes: Horario;
  sabado: Horario;
  domingo: Horario;
}

export interface Restaurante {
  _id?: string;
  nombre: string;
  descripcion: string;
  direccion: Direccion;
  telefono: string;
  horario: HorarioSemanal;
  logo?: string;
  imagenes?: string[];
  categoria: 'comida rápida' | 'gourmet' | 'vegetariano' | 'vegano' | 'cafetería' | 'postres' | 'otro';
  calificacion?: number;
  numeroCalificaciones?: number;
  activo?: boolean;
  usuario: string | Usuario;
  anillosProximidad?: AnilloProximidad[];
}

// Producto
export interface Producto {
  _id?: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen?: string;
  categoria: string;
  disponible?: boolean;
  opciones?: {
    nombre: string;
    selecciones: {
      nombre: string;
      precio?: number;
    }[];
  }[];
  restaurante: string | Restaurante;
}

// Pedido
export interface ProductoPedido {
  producto: string | Producto;
  cantidad: number;
  precio: number;
  opciones?: string[];
  comentarios?: string;
}

export interface DetallePago {
  transaccionId?: string;
  ultimosDigitos?: string;
}

export interface Pedido {
  _id?: string;
  numeroPedido: string;
  usuario: string | Usuario;
  restaurante: string | Restaurante;
  productos: ProductoPedido[];
  estado: 'pendiente' | 'confirmado' | 'en_preparacion' | 'listo' | 'entregado' | 'cancelado';
  metodoPago: {
    tipo: 'tarjeta' | 'paypal' | 'efectivo';
    detalles?: DetallePago;
  };
  total: number;
  subtotal: number;
  impuestos: number;
  propina?: number;
  descuento?: number;
  direccionEntrega?: Direccion;
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
  tiempoEstimado?: number;
  tiempoPreparacion?: number;
  codigoRetiro?: string;
  notas?: string;
  historialEstados?: {
    estado: string;
    fecha: Date;
    comentario?: string;
  }[];
}
