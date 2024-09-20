// [TOREV]: Currently not using this types.
import type { SupplierProductType } from "ui/domain";

export interface CatalogFilterType {
  key: string;
  label: string;
  value: string;
}

export interface CategoryFilter {
  title: string;
  path: string;
  children?: CategoryFilter[];
}

export interface CatalogData {
  products: SupplierProductType[];
  totalResults: number;
  categories: CategoryFilter[];
}

// -- Context Variable Definitions

export interface CatalogState {
  sellerId: string;
  catalog: SupplierProductType[];
  filters: CatalogFilterType[];
  search?: string;
  productDetails?: SupplierProductType;
  loading: boolean;
  error?: string;
}

export interface CatalogActions {
  fetchCatalog: (unitId: string) => Promise<void>;
  searchCatalog: (
    unitId: string,
    filters: CatalogFilterType,
    search?: string
  ) => Promise<void>;
  fetchProductDetails: (
    unitId: string,
    supplierProductId: string
  ) => Promise<void>;
}
