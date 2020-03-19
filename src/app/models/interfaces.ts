export interface LoginResponse{
  dataUser: User,
  error: string
}

export interface User{
  usuario: string,
  password: string,
  id: number,
  nombre: string,
  apellidos: string,
  isAdmin: boolean,
  accessToken: string,
  expiresIn: string
}

export interface Contrato{
  adelanto: number,
  apellidos: string,
  ci: string,
  edad: number,
  nombre: string,
  numero_contrato: number,
  tipo_contrato: string,
  precio: number,
  telefono: Array<number>,
  fotos: Array<Foto>,
  accesorios: Array<Accesorio>,
  fecha_entrega: Date,
  fecha_cita: Date,
  hora_cita: string,
  estado: string
}
export interface Foto{
  cantidad: number,
  dimension: string
}

export interface Accesorio{
  cantidad: number,
  tipo: string
}

export interface HoraTipoNombre{
  position: number,
  name: string,
  weight: string
}
