export interface User {
  id: number;
  uuid?: string; // UUID original de la base de datos
  name: string;
  email: string;
  role: 'Administrador' | 'Usuario';
  status: 'Activo' | 'Inactivo';
  lastAccess?: string;
  createdAt?: Date;
  updatedAt?: Date;
  avatar?: string;
  authProvider?: 'email' | 'google';
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  postal_code?: string;
  first_name?: string;
  last_name?: string;
}

export interface UserFilters {
  role?: string;
  status?: string;
  search?: string;
}