export interface NormalizedVehicle {
  sku: string;
  title: string;
  status: string;
  price: number;
  city: string;
  state: string;
  availableQuantity: number;
  supplierContactName: string;
  supplierCompanyName: string;
  supplierPhone: string;
  fabricationYear: number | null;
  modelYear: number | null;
  chassisManufacturer: string;
  chassisModel: string;
  bodyManufacturer: string;
  bodyModel: string;
  category: string;
  subcategory: string;
  driveSystem: string;
  motorPosition: string;
  description: string;
  imageUrl: string;
  adPageUrl: string;
  allImages: string[];
  updatedAt: string;

  optionals: {
    airConditioning: boolean;
    bathroom: boolean;
    reclinableSeats: boolean;
    usb: boolean;
    packageHolder: boolean;
    soundSystem: boolean;
    tv: boolean;
    wifi: boolean;
    tiltingGlass: boolean;
    gluedGlass: boolean;
    curtain: boolean;
    accessibility: boolean;
  };

  rawData: any;
}

export function normalizeVehicle(raw: any): NormalizedVehicle {
  const sku = raw.Sku || raw.productCode || '';
  const price = parseFloat(raw.ProductIdentification?.Price?.$numberDecimal || '0');

  const treatedPhotos = raw.Media?.TreatedPhotos || [];
  const originalPhotos = raw.Media?.OriginalPhotos || [];
  const allPhotos = [...treatedPhotos, ...originalPhotos].filter(
    (url: string) => url && !url.toLowerCase().endsWith('.psd')
  );
  const imageUrl = allPhotos[0] || '';

  const adPageUrl = extractAdPageUrl(raw.SecondaryInfo?.Description || '');

  const driveSystem = extractDriveSystem(raw.ChassisInfo?.ChassisModel || '');

  const description = raw.SecondaryInfo?.Description || '';
  const reclinableSeats = /Bancos Reclináveis/i.test(description);

  const optionals = {
    airConditioning: raw.Optionals?.AirConditioning || false,
    bathroom: raw.Optionals?.Bathroom || false,
    reclinableSeats,
    usb: raw.Optionals?.Usb || false,
    packageHolder: raw.Optionals?.PackageHolder || false,
    soundSystem: raw.Optionals?.SoundSystem || false,
    tv: raw.Optionals?.Monitor || false,
    wifi: raw.Optionals?.Wifi || false,
    tiltingGlass: raw.Optionals?.GlasType === 1,
    gluedGlass: raw.Optionals?.GlasType === 0,
    curtain: raw.Optionals?.Curtain || false,
    accessibility: raw.Optionals?.Accessibility || false,
  };

  return {
    sku,
    title: raw.ProductIdentification?.Title || '',
    status: raw.StatusVeiculo || '',
    price,
    city: raw.Location?.City || '',
    state: raw.Location?.State || '',
    availableQuantity: raw.VehicleData?.AvailableQuantity || 0,
    supplierContactName: raw.Supplier?.ContactName || '',
    supplierCompanyName: raw.Supplier?.CompanyName || '',
    supplierPhone: raw.Supplier?.Phone || '',
    fabricationYear: raw.VehicleData?.FabricationYear || null,
    modelYear: raw.VehicleData?.ModelYear || null,
    chassisManufacturer: raw.ChassisInfo?.ChassisManufacturer || '',
    chassisModel: raw.ChassisInfo?.ChassisModel || '',
    bodyManufacturer: raw.ChassisInfo?.BodyManufacturer || '',
    bodyModel: raw.ChassisInfo?.BodyModel || '',
    category: raw.Category?.Name || '',
    subcategory: raw.Subcategory?.Name || '',
    driveSystem,
    motorPosition: '—',
    description,
    imageUrl,
    adPageUrl,
    allImages: allPhotos,
    updatedAt: raw.UpdatedAt || '',
    optionals,
    rawData: raw,
  };
}

function extractAdPageUrl(description: string): string {
  const match = description.match(/Página Aurovel:\s*(https?:\/\/\S+)/i);
  return match ? match[1] : '';
}

function extractDriveSystem(chassisModel: string): string {
  const match = chassisModel.match(/\b([246]x[24])\b/);
  return match ? match[1] : '—';
}

export function getOptionalsList(optionals: NormalizedVehicle['optionals']): string[] {
  const list: string[] = [];
  if (optionals.airConditioning) list.push('Ar-Condicionado');
  if (optionals.bathroom) list.push('Banheiro');
  if (optionals.reclinableSeats) list.push('Bancos Reclináveis');
  if (optionals.usb) list.push('USB');
  if (optionals.packageHolder) list.push('Porta Pacote');
  if (optionals.soundSystem) list.push('Som');
  if (optionals.tv) list.push('TV');
  if (optionals.wifi) list.push('Wifi');
  if (optionals.tiltingGlass) list.push('Vidro Basculante');
  if (optionals.gluedGlass) list.push('Vidro Colado');
  if (optionals.curtain) list.push('Cortina');
  if (optionals.accessibility) list.push('Acessibilidade');
  return list;
}

export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
