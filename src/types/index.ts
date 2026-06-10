export interface Category {
  id: number;
  name: string;
  code: string;
  subcategories?: Subcategory[];
}

export interface Subcategory {
  id: number;
  name: string;
  code: string;
}

export type DeviceCondition = "BRAND_NEW" | "LIKE_NEW" | "EXCELLENT" | "GOOD" | "USED";

export interface ProductImage {
  id?: number;
  imageUrl: string;
}

export interface PhoneSpecification {
  productId?: number;
  brand: string;
  modelName: string;
  storageCapacity: string;
  color: string;
}

export interface Product {
  id?: number;
  title: string;
  description: string;
  price: number;
  category: Category;
  subcategory: Subcategory | null;
  deviceCondition: DeviceCondition;
  sold: boolean;
  soldAt: string | null;
  instagramVideoUrl: string | null;
  youtubeVideoUrl: string | null;
  images: ProductImage[];
  phoneSpecification: PhoneSpecification | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface HeroImage {
  id: number;
  imageUrl: string;
}

export interface StoreSettings {
  id: number;
  websiteName: string;
  logoUrl: string;
  footerDescription: string;
  contactPhone: string;
  contactAddress: string;
  whatsappNumber: string;
}
