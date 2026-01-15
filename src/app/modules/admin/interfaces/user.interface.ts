export interface User {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Usuario';
  status: 'Activo' | 'Inactivo';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserFilters {
  role?: string;
  status?: string;
  search?: string;
}