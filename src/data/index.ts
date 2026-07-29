import camerasData from './cameras.json';
import sensorsData from './sensors.json';
import plansData from './plans.json';
import extrasData from './extras.json';

// Type Definitions
export interface ProductVariant {
  name: string;
  img: string;
}

export interface ProductItem {
  title: string;
  description: string;
  price: number;
  oldPrice: number | null;
  variants: ProductVariant[];
}

// Extracted Arrays
export const cameras: ProductItem[] = camerasData.cameras;
export const sensors: ProductItem[] = sensorsData.sensors;
export const plans: ProductItem[] = plansData.plans;
export const extras: ProductItem[] = extrasData.extras;

const data = {
  cameras,
  sensors,
  plans,
  extras,
};

export default data;