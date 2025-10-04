import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { SearchBar } from '../components/SearchBar';
import { FilterPanel } from '../components/FilterPanel';
import { ResultsGrid } from '../components/ResultsGrid';
import { ExportBar } from '../components/ExportBar';
import { NormalizedVehicle, normalizeVehicle } from '../libs/data-normalizers';
import {
  searchVehicles,
  SearchFilters,
  SortField,
  SortDirection,
  getUniqueValues,
  getYearRange,
  getPriceRange,
} from '../libs/search';
import { exportVehicleToPDF, exportVehiclesToPDFBatch } from '../libs/pdf';
import { exportToXLSX, generateXLSXFilename } from '../libs/xls';

export function VehicleSearchPage() {
  const navigate = useNavigate();
  const [allVehicles, setAllVehicles] = useState<NormalizedVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    categories: [],
    subcategories: [],
    yearFabricationMin: null,
    yearFabricationMax: null,
    yearModelMin: null,
    yearModelMax: null,
    priceMin: null,
    priceMax: null,
    cities: [],
    states: [],
    status: [],
    optionals: {},
  });
  const [sortField, setSortField] = useState<SortField>('relevance');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      setLoading(true);

      const response = await fetch('/seed-data/CrmVeiculosAurovel.vehicles.json');
      if (!response.ok) {
        throw new Error('Failed to load vehicles data');
      }

      const rawData = await response.json();
      const normalized = rawData.map(normalizeVehicle);
      setAllVehicles(normalized);
    } catch (error) {
      console.error('Error loading vehicles:', error);
      toast.error('Erro ao carregar veículos');
    } finally {
      setLoading(false);
    }
  };

  const filteredVehicles = useMemo(() => {
    return searchVehicles(allVehicles, {
      query: searchQuery,
      filters,
      sortField,
      sortDirection,
    });
  }, [allVehicles, searchQuery, filters, sortField, sortDirection]);

  const availableCategories = useMemo(() => getUniqueValues(allVehicles, 'category'), [allVehicles]);
  const availableSubcategories = useMemo(() => getUniqueValues(allVehicles, 'subcategory'), [allVehicles]);
  const availableCities = useMemo(() => getUniqueValues(allVehicles, 'city'), [allVehicles]);
  const availableStates = useMemo(() => getUniqueValues(allVehicles, 'state'), [allVehicles]);
  const availableStatus = useMemo(() => getUniqueValues(allVehicles, 'status'), [allVehicles]);
  const yearRange = useMemo(() => getYearRange(allVehicles), [allVehicles]);
  const priceRange = useMemo(() => getPriceRange(allVehicles), [allVehicles]);

  const selectedVehicles = useMemo(() => {
    return filteredVehicles.filter((v) => selectedIds.includes(v.sku));
  }, [filteredVehicles, selectedIds]);

  const handleEdit = (sku: string) => {
    navigate(`/vehicle-editor/edit/${sku}`);
  };

  const handleDelete = (sku: string) => {
    setAllVehicles((prev) => prev.filter((v) => v.sku !== sku));
    setSelectedIds((prev) => prev.filter((id) => id !== sku));
    toast.success('Veículo excluído');
  };

  const handleExportSelectedPDF = async () => {
    if (selectedVehicles.length === 0) return;

    try {
      toast.loading('Exportando PDF...');

      if (selectedVehicles.length === 1) {
        await exportVehicleToPDF(selectedVehicles[0]);
      } else {
        await exportVehiclesToPDFBatch(selectedVehicles);
      }

      toast.dismiss();
      toast.success('PDF exportado com sucesso!');
    } catch (error) {
      toast.dismiss();
      toast.error('Erro ao exportar PDF');
      console.error(error);
    }
  };

  const handleExportSelectedXLSX = () => {
    if (selectedVehicles.length === 0) return;

    try {
      const filename = generateXLSXFilename();
      exportToXLSX(selectedVehicles, filename);
      toast.success('XLSX exportado com sucesso!');
    } catch (error) {
      toast.error('Erro ao exportar XLSX');
      console.error(error);
    }
  };

  const handleExportAllPDF = async () => {
    if (filteredVehicles.length === 0) return;

    try {
      toast.loading('Exportando todos os veículos em PDF...');
      await exportVehiclesToPDFBatch(filteredVehicles);
      toast.dismiss();
      toast.success('PDF exportado com sucesso!');
    } catch (error) {
      toast.dismiss();
      toast.error('Erro ao exportar PDF');
      console.error(error);
    }
  };

  const handleExportAllXLSX = () => {
    if (filteredVehicles.length === 0) return;

    try {
      const filename = generateXLSXFilename();
      exportToXLSX(filteredVehicles, filename);
      toast.success('XLSX exportado com sucesso!');
    } catch (error) {
      toast.error('Erro ao exportar XLSX');
      console.error(error);
    }
  };

  const handleSortChange = (field: SortField, direction: SortDirection) => {
    setSortField(field);
    setSortDirection(direction);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando veículos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="border-b bg-white p-4">
        <div className="flex items-center gap-4 max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold">Pesquisa de Veículos</h1>
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <FilterPanel
          filters={filters}
          onFiltersChange={setFilters}
          availableCategories={availableCategories}
          availableSubcategories={availableSubcategories}
          availableCities={availableCities}
          availableStates={availableStates}
          availableStatus={availableStatus}
          yearRange={yearRange}
          priceRange={priceRange}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <ExportBar
            totalResults={filteredVehicles.length}
            selectedCount={selectedIds.length}
            onExportSelectedPDF={handleExportSelectedPDF}
            onExportSelectedXLSX={handleExportSelectedXLSX}
            onExportAllPDF={handleExportAllPDF}
            onExportAllXLSX={handleExportAllXLSX}
          />

          <ResultsGrid
            vehicles={filteredVehicles}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            onEdit={handleEdit}
            onDelete={handleDelete}
            sortField={sortField}
            sortDirection={sortDirection}
            onSortChange={handleSortChange}
          />
        </div>
      </div>
    </div>
  );
}
