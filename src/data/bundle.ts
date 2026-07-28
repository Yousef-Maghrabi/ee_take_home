import bundleData from './data.json';

export interface Variant {
  id: string;
  name: string;
  colorHex: string;
  image: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  discountBadge?: string;
  learnMoreUrl: string;
  defaultImage: string;
  variants?: Variant[];
}

export interface Step {
  id: number;
  stepNumber: number;
  title: string;
  category: 'cameras' | 'plans' | 'sensors' | 'protection';
  products: Product[];
}

export interface InitialCartItem {
  productId: string;
  variantId: string | null;
  quantity: number;
  category: string;
}

export interface BundleData {
  steps: Step[];
  initialCart: InitialCartItem[];
}

export const data = bundleData as BundleData;
export default data;