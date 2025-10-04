export interface SupplierInfo {
  supplierName: string;
  supplierCNPJ: string;
  supplierContact: string;
  supplierEmail: string;
  supplierPhone: string;
  supplierAddress: string;
  purchaseDate?: string;
  purchasePrice?: number;
  notes?: string;
}

export interface VehicleEditorData {
  sku?: string;
  id?: string;
  category: string;
  subcategory?: string;
  chassisInfo: {
    chassisManufacturer: string;
    bodyManufacturer: string;
    chassisModel: string;
    bodyModel: string;
  };
  vehicleData: {
    fabricationYear: number;
    modelYear: number;
    mileage: number;
    licensePlate: string;
    renavam: string;
    chassis: string;
    busPrefix?: string;
    availableQuantity: number;
    internalNotes: string;
  };
  productIdentification: {
    title: string;
  };
  secondaryInfo: {
    capacity: number;
    condition: 'new' | 'used' | 'semi-new';
    fuelType: string;
    steering: 'assisted' | 'hydraulic' | 'mechanical';
    singleOwner: boolean;
    description: string;
  };
  seatConfiguration?: {
    conventional: number;
    executive: number;
    semiSleeper: number;
    sleeper: number;
    sleeperBed: number;
    fixed: number;
  };
  optionals: {
    airConditioning: boolean;
    usb: boolean;
    packageHolder: boolean;
    soundSystem: boolean;
    monitor: boolean;
    wifi: boolean;
    bathroom: boolean;
    glasType: 'glued' | 'tilting';
    curtain: boolean;
    cabin: boolean;
    accessibility: boolean;
    factoryRetarder: boolean;
    optionalRetarder: boolean;
    legSupport: boolean;
    coffeeMaker: boolean;
  };
  location: {
    address: string;
    neighborhood: string;
    state: string;
    city: string;
    zipCode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  supplier?: SupplierInfo;
  media?: {
    originalPhotos: string[];
    treatedPhotos: string[];
    documentPhotos: string[];
    video?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface VehicleListItem {
  id: string;
  sku: string;
  title: string;
  category: string;
  subcategory?: string;
  year: number;
  licensePlate?: string;
  status: 'available' | 'sold' | 'reserved';
  thumbnailUrl?: string;
  supplier?: {
    name: string;
  };
}
