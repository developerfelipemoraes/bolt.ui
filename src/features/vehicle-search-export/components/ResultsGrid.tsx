import { useState } from 'react';
import { CreditCard as Edit, Trash2, ExternalLink, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { NormalizedVehicle, formatBRL, getOptionalsList } from '../libs/data-normalizers';
import { SortField, SortDirection } from '../libs/search';

interface ResultsGridProps {
  vehicles: NormalizedVehicle[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onEdit: (sku: string) => void;
  onDelete: (sku: string) => void;
  sortField: SortField;
  sortDirection: SortDirection;
  onSortChange: (field: SortField, direction: SortDirection) => void;
}

export function ResultsGrid({
  vehicles,
  selectedIds,
  onSelectionChange,
  onEdit,
  onDelete,
  sortField,
  sortDirection,
  onSortChange,
}: ResultsGridProps) {
  const isAllSelected = vehicles.length > 0 && selectedIds.length === vehicles.length;
  const isSomeSelected = selectedIds.length > 0 && selectedIds.length < vehicles.length;

  const handleSelectAll = () => {
    if (isAllSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange(vehicles.map((v) => v.sku));
    }
  };

  const handleSelectOne = (sku: string) => {
    if (selectedIds.includes(sku)) {
      onSelectionChange(selectedIds.filter((id) => id !== sku));
    } else {
      onSelectionChange([...selectedIds, sku]);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      onSortChange(field, sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      onSortChange(field, 'asc');
    }
  };

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort(field)}>
      <div className="flex items-center gap-1">
        {children}
        <ArrowUpDown className="h-3 w-3" />
      </div>
    </TableHead>
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <ScrollArea className="flex-1">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={isAllSelected}
                  ref={(el) => {
                    if (el) {
                      (el as any).indeterminate = isSomeSelected;
                    }
                  }}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="w-24">Alterar</TableHead>
              <TableHead className="w-24">Excluir</TableHead>
              <TableHead className="w-24">Imagem Anuncio</TableHead>
              <TableHead className="w-24">Image Principal</TableHead>
              <TableHead className="min-w-[200px]">Nome do Produto</TableHead>
              <TableHead>Status do Produto</TableHead>
              <SortableHeader field="price">Preco</SortableHeader>
              <TableHead>Cidade do Produto</TableHead>
              <TableHead>Quantidade Disp.</TableHead>
              <TableHead>Fornecedor</TableHead>
              <TableHead>Telefone Fornecedor</TableHead>
              <TableHead>Empresa Forncedor</TableHead>
              <TableHead>Ano Fabricacao</TableHead>
              <SortableHeader field="modelYear">Ano Modelo</SortableHeader>
              <TableHead>Fab. Chassi</TableHead>
              <TableHead>Modelo Chassi</TableHead>
              <TableHead>Fab. Carroceria</TableHead>
              <TableHead>Modelo Carroceria</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Sub-Categoria</TableHead>
              <TableHead>Sistema de Tracao</TableHead>
              <TableHead>Posicao de Motor</TableHead>
              <TableHead className="min-w-[200px]">Opcionais do Produto</TableHead>
              <TableHead>Tem Ar-Condicionado?</TableHead>
              <TableHead>Tem Banheiro?</TableHead>
              <TableHead>Tem Bancos Reclináveis?</TableHead>
              <TableHead>Tem USB?</TableHead>
              <TableHead>Tem Porta Pacote?</TableHead>
              <TableHead>Tem Sistema de Som?</TableHead>
              <TableHead>Tem TV?</TableHead>
              <TableHead>Tem Wifi?</TableHead>
              <TableHead>Tem Vidro Basculante?</TableHead>
              <TableHead>Tem Vidro Colado?</TableHead>
              <TableHead>Tem Cortina?</TableHead>
              <TableHead>Acessibilidade?</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={37} className="text-center py-8 text-gray-500">
                  Nenhum veículo encontrado
                </TableCell>
              </TableRow>
            ) : (
              vehicles.map((vehicle) => (
                <TableRow key={vehicle.sku} className={selectedIds.includes(vehicle.sku) ? 'bg-blue-50' : ''}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(vehicle.sku)}
                      onCheckedChange={() => handleSelectOne(vehicle.sku)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => onEdit(vehicle.sku)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (confirm(`Deseja realmente excluir ${vehicle.title}?`)) {
                          onDelete(vehicle.sku);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                  <TableCell>
                    {vehicle.adPageUrl ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <a
                              href={vehicle.adPageUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex"
                            >
                              <ExternalLink className="h-4 w-4 text-blue-500 hover:text-blue-700" />
                            </a>
                          </TooltipTrigger>
                          <TooltipContent>Abrir página do anúncio</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {vehicle.imageUrl ? (
                      <img
                        src={vehicle.imageUrl}
                        alt={vehicle.title}
                        className="w-16 h-12 object-cover rounded"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-16 h-12 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">
                        N/A
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{vehicle.title || '—'}</TableCell>
                  <TableCell>
                    <Badge variant={vehicle.status === 'Disponível' ? 'default' : 'secondary'}>
                      {vehicle.status || '—'}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold">{formatBRL(vehicle.price)}</TableCell>
                  <TableCell>{vehicle.city || '—'}</TableCell>
                  <TableCell>{vehicle.availableQuantity}</TableCell>
                  <TableCell>{vehicle.supplierContactName || vehicle.supplierCompanyName || '—'}</TableCell>
                  <TableCell>{vehicle.supplierPhone || '—'}</TableCell>
                  <TableCell>{vehicle.supplierCompanyName || '—'}</TableCell>
                  <TableCell>{vehicle.fabricationYear || '—'}</TableCell>
                  <TableCell>{vehicle.modelYear || '—'}</TableCell>
                  <TableCell>{vehicle.chassisManufacturer || '—'}</TableCell>
                  <TableCell>{vehicle.chassisModel || '—'}</TableCell>
                  <TableCell>{vehicle.bodyManufacturer || '—'}</TableCell>
                  <TableCell>{vehicle.bodyModel || '—'}</TableCell>
                  <TableCell>{vehicle.category || '—'}</TableCell>
                  <TableCell>{vehicle.subcategory || '—'}</TableCell>
                  <TableCell>{vehicle.driveSystem}</TableCell>
                  <TableCell>{vehicle.motorPosition}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {getOptionalsList(vehicle.optionals).map((opt) => (
                        <Badge key={opt} variant="outline" className="text-xs">
                          {opt}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{vehicle.optionals.airConditioning ? 'Sim' : 'Não'}</TableCell>
                  <TableCell>{vehicle.optionals.bathroom ? 'Sim' : 'Não'}</TableCell>
                  <TableCell>{vehicle.optionals.reclinableSeats ? 'Sim' : 'Não'}</TableCell>
                  <TableCell>{vehicle.optionals.usb ? 'Sim' : 'Não'}</TableCell>
                  <TableCell>{vehicle.optionals.packageHolder ? 'Sim' : 'Não'}</TableCell>
                  <TableCell>{vehicle.optionals.soundSystem ? 'Sim' : 'Não'}</TableCell>
                  <TableCell>{vehicle.optionals.tv ? 'Sim' : 'Não'}</TableCell>
                  <TableCell>{vehicle.optionals.wifi ? 'Sim' : 'Não'}</TableCell>
                  <TableCell>{vehicle.optionals.tiltingGlass ? 'Sim' : 'Não'}</TableCell>
                  <TableCell>{vehicle.optionals.gluedGlass ? 'Sim' : 'Não'}</TableCell>
                  <TableCell>{vehicle.optionals.curtain ? 'Sim' : 'Não'}</TableCell>
                  <TableCell>{vehicle.optionals.accessibility ? 'Sim' : 'Não'}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
