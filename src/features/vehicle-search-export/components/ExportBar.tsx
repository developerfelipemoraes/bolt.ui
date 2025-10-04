import { FileDown, FileSpreadsheet, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ExportBarProps {
  totalResults: number;
  selectedCount: number;
  onExportSelectedPDF: () => void;
  onExportSelectedXLSX: () => void;
  onExportAllPDF: () => void;
  onExportAllXLSX: () => void;
}

export function ExportBar({
  totalResults,
  selectedCount,
  onExportSelectedPDF,
  onExportSelectedXLSX,
  onExportAllPDF,
  onExportAllXLSX,
}: ExportBarProps) {
  return (
    <div className="flex items-center justify-between gap-4 p-4 bg-gray-50 border-b">
      <div className="text-sm text-gray-600">
        {totalResults} {totalResults === 1 ? 'resultado' : 'resultados'}
        {selectedCount > 0 && (
          <span className="ml-2 font-medium text-gray-900">
            ({selectedCount} {selectedCount === 1 ? 'selecionado' : 'selecionados'})
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onExportSelectedPDF}
          disabled={selectedCount === 0}
        >
          <FileDown className="h-4 w-4 mr-2" />
          Exportar PDF
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onExportSelectedXLSX}
          disabled={selectedCount === 0}
        >
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Exportar XLSX
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Menu className="h-4 w-4 mr-2" />
              Exportar Todos
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onExportAllPDF}>
              <FileDown className="h-4 w-4 mr-2" />
              PDF (Lote)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onExportAllXLSX}>
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              XLSX (Planilha)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
