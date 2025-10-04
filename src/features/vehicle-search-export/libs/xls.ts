import * as XLSX from 'xlsx';
import { NormalizedVehicle, getOptionalsList } from './data-normalizers';

export interface ExportColumn {
  header: string;
  key: keyof NormalizedVehicle | 'optionalsList' | 'actions';
  format?: (value: any, vehicle: NormalizedVehicle) => any;
}

const exportColumns: ExportColumn[] = [
  { header: 'SKU', key: 'sku' },
  { header: 'Nome do Produto', key: 'title' },
  { header: 'Status do Produto', key: 'status' },
  {
    header: 'Preco',
    key: 'price',
    format: (value) => value,
  },
  { header: 'Cidade do Produto', key: 'city' },
  { header: 'Quantidade Disp.', key: 'availableQuantity' },
  {
    header: 'Fornecedor',
    key: 'supplierContactName',
    format: (value, vehicle) => value || vehicle.supplierCompanyName,
  },
  { header: 'Telefone Fornecedor', key: 'supplierPhone' },
  { header: 'Empresa Forncedor', key: 'supplierCompanyName' },
  { header: 'Ano Fabricacao', key: 'fabricationYear' },
  { header: 'Ano Modelo', key: 'modelYear' },
  { header: 'Fab. Chassi', key: 'chassisManufacturer' },
  { header: 'Modelo Chassi', key: 'chassisModel' },
  { header: 'Fab. Carroceria', key: 'bodyManufacturer' },
  { header: 'Modelo Carroceria', key: 'bodyModel' },
  { header: 'Categoria', key: 'category' },
  { header: 'Sub-Categoria', key: 'subcategory' },
  { header: 'Sistema de Tracao', key: 'driveSystem' },
  { header: 'Posicao de Motor', key: 'motorPosition' },
  {
    header: 'Opcionais do Produto',
    key: 'optionalsList',
    format: (_, vehicle) => getOptionalsList(vehicle.optionals).join(', '),
  },
  {
    header: 'Tem Ar-Condicionado?',
    key: 'optionals',
    format: (_, vehicle) => vehicle.optionals.airConditioning,
  },
  {
    header: 'Tem Banheiro?',
    key: 'optionals',
    format: (_, vehicle) => vehicle.optionals.bathroom,
  },
  {
    header: 'Tem Bancos Reclináveis?',
    key: 'optionals',
    format: (_, vehicle) => vehicle.optionals.reclinableSeats,
  },
  {
    header: 'Tem USB?',
    key: 'optionals',
    format: (_, vehicle) => vehicle.optionals.usb,
  },
  {
    header: 'Tem Porta Pacote?',
    key: 'optionals',
    format: (_, vehicle) => vehicle.optionals.packageHolder,
  },
  {
    header: 'Tem Sistema de Som?',
    key: 'optionals',
    format: (_, vehicle) => vehicle.optionals.soundSystem,
  },
  {
    header: 'Tem TV?',
    key: 'optionals',
    format: (_, vehicle) => vehicle.optionals.tv,
  },
  {
    header: 'Tem Wifi?',
    key: 'optionals',
    format: (_, vehicle) => vehicle.optionals.wifi,
  },
  {
    header: 'Tem Vidro Basculante?',
    key: 'optionals',
    format: (_, vehicle) => vehicle.optionals.tiltingGlass,
  },
  {
    header: 'Tem Vidro Colado?',
    key: 'optionals',
    format: (_, vehicle) => vehicle.optionals.gluedGlass,
  },
  {
    header: 'Tem Cortina?',
    key: 'optionals',
    format: (_, vehicle) => vehicle.optionals.curtain,
  },
  {
    header: 'Acessibilidade?',
    key: 'optionals',
    format: (_, vehicle) => vehicle.optionals.accessibility,
  },
  { header: 'Imagem Principal', key: 'imageUrl' },
  { header: 'Página Anúncio', key: 'adPageUrl' },
];

export function exportToXLSX(
  vehicles: NormalizedVehicle[],
  filename: string
): void {
  const data = vehicles.map((vehicle) => {
    const row: any = {};

    exportColumns.forEach((column) => {
      const value = column.format
        ? column.format(vehicle[column.key as keyof NormalizedVehicle], vehicle)
        : vehicle[column.key as keyof NormalizedVehicle];

      row[column.header] = value === null || value === undefined ? '—' : value;
    });

    return row;
  });

  const worksheet = XLSX.utils.json_to_sheet(data);

  const colWidths = exportColumns.map((col) => ({
    wch: Math.max(col.header.length, 20),
  }));
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Veículos');

  XLSX.writeFile(workbook, filename);
}

export function generateXLSXFilename(): string {
  const now = new Date();
  const timestamp = now
    .toISOString()
    .replace(/[-:]/g, '')
    .replace('T', '-')
    .slice(0, 15);
  return `Aurovel-PESQUISA-${timestamp}.xlsx`;
}
