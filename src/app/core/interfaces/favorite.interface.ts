import { ClientProduct } from './product.interface';

/**
 * Interfaz para representar un producto guardado en favoritos
 * Soporta estructura de carpetas anidadas
 */
export interface Favorite {
  /** ID único del registro de favorito */
  id: string;
  /** ID del producto guardado en favoritos */
  productId: string;
  /** ID del usuario propietario de los favoritos */
  userId: string;
  /** Ruta de carpeta anidada (ej: "Electrónica/Teléfonos") */
  folderPath: string;
  /** Fecha de creación del registro de favorito */
  createdAt: string;
  /** Fecha de última actualización del registro de favorito */
  updatedAt: string;
  /** Producto asociado (opcional para carga diferida) */
  product?: ClientProduct;
}

/**
 * Interfaz para representar una carpeta de favoritos
 */
export interface FavoriteFolder {
  /** Ruta única de la carpeta (ej: "Electrónica/Teléfonos") */
  path: string;
  /** Nombre visible de la carpeta */
  name: string;
  /** Número de productos en la carpeta */
  productCount: number;
  /** Subcarpetas hijas */
  subfolders: FavoriteFolder[];
}
