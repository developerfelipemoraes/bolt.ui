import Fuse from 'fuse.js';
import { NormalizedVehicle } from './data-normalizers';

export interface SearchFilters {
  categories: string[];
  subcategories: string[];
  yearFabricationMin: number | null;
  yearFabricationMax: number | null;
  yearModelMin: number | null;
  yearModelMax: number | null;
  priceMin: number | null;
  priceMax: number | null;
  cities: string[];
  states: string[];
  status: string[];
  optionals: {
    airConditioning?: boolean;
    bathroom?: boolean;
    reclinableSeats?: boolean;
    usb?: boolean;
    packageHolder?: boolean;
    soundSystem?: boolean;
    tv?: boolean;
    wifi?: boolean;
    tiltingGlass?: boolean;
    gluedGlass?: boolean;
    curtain?: boolean;
    accessibility?: boolean;
  };
}

export type SortField = 'relevance' | 'price' | 'modelYear' | 'updatedAt';
export type SortDirection = 'asc' | 'desc';

export interface SearchOptions {
  query: string;
  filters: SearchFilters;
  sortField: SortField;
  sortDirection: SortDirection;
}

const fuseOptions: Fuse.IFuseOptions<NormalizedVehicle> = {
  keys: [
    { name: 'sku', weight: 2 },
    { name: 'title', weight: 2 },
    { name: 'city', weight: 1 },
    { name: 'state', weight: 1 },
    { name: 'category', weight: 1 },
    { name: 'subcategory', weight: 1 },
    { name: 'chassisManufacturer', weight: 1 },
    { name: 'chassisModel', weight: 1 },
    { name: 'supplierCompanyName', weight: 1 },
    { name: 'supplierContactName', weight: 1 },
    { name: 'supplierPhone', weight: 1 },
  ],
  threshold: 0.3,
  includeScore: true,
};

export function searchVehicles(
  vehicles: NormalizedVehicle[],
  options: SearchOptions
): NormalizedVehicle[] {
  let results = [...vehicles];

  if (options.query.trim()) {
    const fuse = new Fuse(results, fuseOptions);
    const fuseResults = fuse.search(options.query);
    results = fuseResults.map((r) => r.item);
  }

  results = applyFilters(results, options.filters);

  if (options.sortField !== 'relevance' || !options.query.trim()) {
    results = sortVehicles(results, options.sortField, options.sortDirection);
  }

  return results;
}

function applyFilters(
  vehicles: NormalizedVehicle[],
  filters: SearchFilters
): NormalizedVehicle[] {
  return vehicles.filter((vehicle) => {
    if (filters.categories.length > 0 && !filters.categories.includes(vehicle.category)) {
      return false;
    }

    if (filters.subcategories.length > 0 && !filters.subcategories.includes(vehicle.subcategory)) {
      return false;
    }

    if (filters.yearFabricationMin !== null && vehicle.fabricationYear !== null) {
      if (vehicle.fabricationYear < filters.yearFabricationMin) return false;
    }

    if (filters.yearFabricationMax !== null && vehicle.fabricationYear !== null) {
      if (vehicle.fabricationYear > filters.yearFabricationMax) return false;
    }

    if (filters.yearModelMin !== null && vehicle.modelYear !== null) {
      if (vehicle.modelYear < filters.yearModelMin) return false;
    }

    if (filters.yearModelMax !== null && vehicle.modelYear !== null) {
      if (vehicle.modelYear > filters.yearModelMax) return false;
    }

    if (filters.priceMin !== null && vehicle.price < filters.priceMin) {
      return false;
    }

    if (filters.priceMax !== null && vehicle.price > filters.priceMax) {
      return false;
    }

    if (filters.cities.length > 0 && !filters.cities.includes(vehicle.city)) {
      return false;
    }

    if (filters.states.length > 0 && !filters.states.includes(vehicle.state)) {
      return false;
    }

    if (filters.status.length > 0 && !filters.status.includes(vehicle.status)) {
      return false;
    }

    for (const [key, value] of Object.entries(filters.optionals)) {
      if (value === true) {
        const optionalKey = key as keyof typeof vehicle.optionals;
        if (!vehicle.optionals[optionalKey]) {
          return false;
        }
      }
    }

    return true;
  });
}

function sortVehicles(
  vehicles: NormalizedVehicle[],
  sortField: SortField,
  direction: SortDirection
): NormalizedVehicle[] {
  const sorted = [...vehicles];
  const multiplier = direction === 'asc' ? 1 : -1;

  sorted.sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortField) {
      case 'price':
        aValue = a.price;
        bValue = b.price;
        break;
      case 'modelYear':
        aValue = a.modelYear || 0;
        bValue = b.modelYear || 0;
        break;
      case 'updatedAt':
        aValue = new Date(a.updatedAt).getTime();
        bValue = new Date(b.updatedAt).getTime();
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return -1 * multiplier;
    if (aValue > bValue) return 1 * multiplier;
    return 0;
  });

  return sorted;
}

export function getUniqueValues<T>(
  vehicles: NormalizedVehicle[],
  key: keyof NormalizedVehicle
): string[] {
  const values = vehicles
    .map((v) => v[key])
    .filter((v): v is string => typeof v === 'string' && v !== '');
  return Array.from(new Set(values)).sort();
}

export function getYearRange(vehicles: NormalizedVehicle[]): {
  minFabrication: number;
  maxFabrication: number;
  minModel: number;
  maxModel: number;
} {
  const fabricationYears = vehicles
    .map((v) => v.fabricationYear)
    .filter((y): y is number => y !== null);
  const modelYears = vehicles
    .map((v) => v.modelYear)
    .filter((y): y is number => y !== null);

  return {
    minFabrication: Math.min(...fabricationYears, new Date().getFullYear()),
    maxFabrication: Math.max(...fabricationYears, new Date().getFullYear()),
    minModel: Math.min(...modelYears, new Date().getFullYear()),
    maxModel: Math.max(...modelYears, new Date().getFullYear()),
  };
}

export function getPriceRange(vehicles: NormalizedVehicle[]): {
  min: number;
  max: number;
} {
  const prices = vehicles.map((v) => v.price).filter((p) => p > 0);

  return {
    min: Math.min(...prices, 0),
    max: Math.max(...prices, 0),
  };
}
