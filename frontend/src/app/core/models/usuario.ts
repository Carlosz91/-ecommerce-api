export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  googleId?: string;
  avatarUrl?: string;
  telefono?: string;
  direccion?: string;
  emailVerified?: boolean;
}
