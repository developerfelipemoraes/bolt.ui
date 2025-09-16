export interface VehicleCategory {
  id: string;
  name: string;
  subcategories?: VehicleSubcategory[];
}

export interface VehicleSubcategory {
  id: string;
  name: string;
  description?: string;
}

export interface ChassisInfo {
  chassisManufacturer: string;
  bodyManufacturer: string;
  chassisModel: string;
  bodyModel: string;
}

export interface VehicleData {
  fabricationYear: number;
  modelYear: number;
  mileage: number;
  licensePlate: string;
  renavam: string;
  chassis: string;
  busPrefix?: string;
  availableQuantity: number;
  internalNotes: string;
}

export interface ProductIdentification {
  title: string;
}

export interface MediaUpload {
  originalPhotos: File[];
  treatedPhotos: File[];
  documentPhotos: File[];
  video?: File;
}

export interface SecondaryInfo {
  capacity: number;
  condition: 'new' | 'used' | 'semi-new';
  fuelType: string;
  steering: 'assisted' | 'hydraulic' | 'mechanical';
  singleOwner: boolean;
  description: string;
}

export interface SeatConfiguration {
  conventional: number;
  executive: number;
  semiSleeper: number;
  sleeper: number;
  sleeperBed: number;
  fixed: number;
}

export interface VehicleOptionals {
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
}

export interface LocationInfo {
  address: string;
  neighborhood: string;
  state: string;
  city: string;
  zipCode: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Vehicle {
  id?: string;
  category: VehicleCategory;
  subcategory?: VehicleSubcategory;
  chassisInfo: ChassisInfo;
  vehicleData: VehicleData;
  productIdentification: ProductIdentification;
  media: MediaUpload;
  secondaryInfo: SecondaryInfo;
  seatConfiguration?: SeatConfiguration;
  optionals: VehicleOptionals;
  description: string;
  location: LocationInfo;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface WizardStep {
  id: number;
  title: string;
  component: React.ComponentType<unknown>;
  isValid: boolean;
  isCompleted: boolean;
}