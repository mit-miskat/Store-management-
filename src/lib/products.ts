import { Product } from '../types/index.ts';
import { toEnglishDigits } from './money.ts';

export interface ProductFilterOptions {
  searchQuery?: string;
  chip?: 'all' | 'low_stock' | 'OEM' | 'ফিটিং';
  category?: string;
}

/**
 * Filters products by name, code (SKU / barcode, supporting both English and Bengali digits),
 * applicable bike model, stock chip, and category.
 */
export function filterProducts(
  products: Product[],
  options: ProductFilterOptions = {}
): Product[] {
  const { searchQuery = '', chip = 'all', category = 'all' } = options;
  const rawQuery = searchQuery.trim().toLowerCase();
  const normalizedQuery = toEnglishDigits(rawQuery);

  return products.filter((p) => {
    if (rawQuery) {
      const nameMatch = p.name.toLowerCase().includes(rawQuery);
      const skuMatch = p.sku.toLowerCase().includes(normalizedQuery) || p.sku.toLowerCase().includes(rawQuery);
      const barcodeMatch =
        p.barcode.toLowerCase().includes(normalizedQuery) ||
        p.barcode.toLowerCase().includes(rawQuery);
      const bikeMatch = p.applicableBike.toLowerCase().includes(rawQuery);

      if (!nameMatch && !skuMatch && !barcodeMatch && !bikeMatch) {
        return false;
      }
    }

    if (chip === 'low_stock' && p.stockQty > p.minStock) return false;
    if (chip === 'OEM' && p.partType !== 'OEM') return false;
    if (chip === 'ফিটিং' && p.partType !== 'ফিটিং') return false;

    if (category !== 'all' && p.category !== category) return false;

    return true;
  });
}
