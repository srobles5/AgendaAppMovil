export interface Client {
  id: number;
  identificacion: string;
  nombre: string;
  descripcion: string | null;
  direccion: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Role {
  id: number;
  nombre: string;
  descripcion: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface Worker {
  id: number;
  identificacion: string;
  nombres: string;
  apellidos: string;
  celular: string;
  foto_perfil: string | null;
  id_rol: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  nombre_apellido: string;
  estado: string;
  rol: Role;
}

export interface Support {
  id: number;
  firma: string;
  observacion: string | null;
  id_servicio: number;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: number;
  titulo: string;
  descripcion: string;
  fecha_evento: string;
  hora_evento: string;
  estado: string;
  direccion: string;
  precio: string;
  id_cliente: number;
  id_user_asignado: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  fecha_hora_evento: string;
  cliente: Client;
  trabajador: Worker;
  soporte?: Support;
}

export interface ServicesResponse {
  status: number;
  message: string;
  data: Service[];
  error: string | null;
} 