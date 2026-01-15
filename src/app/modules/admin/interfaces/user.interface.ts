export interface User {
  id: number;
  name: string;
  email: string;
  role: 'Administrador' | 'Usuario';
  status: 'Activo' | 'Inactivo';
  lastAccess?: string;
  createdAt?: Date;
  updatedAt?: Date;
  avatar?: string;
}

export interface UserFilters {
  role?: string;
  status?: string;
  search?: string;
}