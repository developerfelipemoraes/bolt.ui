import { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { SearchFilters } from '../libs/search';

interface FilterPanelProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  availableCategories: string[];
  availableSubcategories: string[];
  availableCities: string[];
  availableStates: string[];
  availableStatus: string[];
  yearRange: { minFabrication: number; maxFabrication: number; minModel: number; maxModel: number };
  priceRange: { min: number; max: number };
}

export function FilterPanel({
  filters,
  onFiltersChange,
  availableCategories,
  availableSubcategories,
  availableCities,
  availableStates,
  availableStatus,
  yearRange,
  priceRange,
}: FilterPanelProps) {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    years: false,
    price: false,
    location: false,
    status: false,
    optionals: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleClearAll = () => {
    onFiltersChange({
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
  };

  const activeFiltersCount =
    filters.categories.length +
    filters.subcategories.length +
    filters.cities.length +
    filters.states.length +
    filters.status.length +
    (filters.yearFabricationMin !== null ? 1 : 0) +
    (filters.yearFabricationMax !== null ? 1 : 0) +
    (filters.yearModelMin !== null ? 1 : 0) +
    (filters.yearModelMax !== null ? 1 : 0) +
    (filters.priceMin !== null ? 1 : 0) +
    (filters.priceMax !== null ? 1 : 0) +
    Object.keys(filters.optionals).length;

  return (
    <div className="w-80 border-r bg-white flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg">Filtros</h3>
          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={handleClearAll}>
              <X className="h-4 w-4 mr-1" />
              Limpar ({activeFiltersCount})
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          <FilterSection
            title="Categoria / Subcategoria"
            expanded={expandedSections.categories}
            onToggle={() => toggleSection('categories')}
          >
            <div className="space-y-2">
              <Label className="text-xs text-gray-500">Categorias</Label>
              {availableCategories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`cat-${category}`}
                    checked={filters.categories.includes(category)}
                    onCheckedChange={(checked) => {
                      const newCategories = checked
                        ? [...filters.categories, category]
                        : filters.categories.filter((c) => c !== category);
                      onFiltersChange({ ...filters, categories: newCategories });
                    }}
                  />
                  <Label htmlFor={`cat-${category}`} className="text-sm cursor-pointer">
                    {category}
                  </Label>
                </div>
              ))}

              <Separator className="my-2" />

              <Label className="text-xs text-gray-500">Subcategorias</Label>
              {availableSubcategories.map((subcategory) => (
                <div key={subcategory} className="flex items-center space-x-2">
                  <Checkbox
                    id={`subcat-${subcategory}`}
                    checked={filters.subcategories.includes(subcategory)}
                    onCheckedChange={(checked) => {
                      const newSubcategories = checked
                        ? [...filters.subcategories, subcategory]
                        : filters.subcategories.filter((c) => c !== subcategory);
                      onFiltersChange({ ...filters, subcategories: newSubcategories });
                    }}
                  />
                  <Label htmlFor={`subcat-${subcategory}`} className="text-sm cursor-pointer">
                    {subcategory}
                  </Label>
                </div>
              ))}
            </div>
          </FilterSection>

          <FilterSection
            title="Anos"
            expanded={expandedSections.years}
            onToggle={() => toggleSection('years')}
          >
            <div className="space-y-3">
              <div>
                <Label className="text-xs text-gray-500 mb-1 block">Ano de Fabricação</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="De"
                    value={filters.yearFabricationMin ?? ''}
                    onChange={(e) =>
                      onFiltersChange({
                        ...filters,
                        yearFabricationMin: e.target.value ? parseInt(e.target.value) : null,
                      })
                    }
                    min={yearRange.minFabrication}
                    max={yearRange.maxFabrication}
                  />
                  <Input
                    type="number"
                    placeholder="Até"
                    value={filters.yearFabricationMax ?? ''}
                    onChange={(e) =>
                      onFiltersChange({
                        ...filters,
                        yearFabricationMax: e.target.value ? parseInt(e.target.value) : null,
                      })
                    }
                    min={yearRange.minFabrication}
                    max={yearRange.maxFabrication}
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs text-gray-500 mb-1 block">Ano Modelo</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="De"
                    value={filters.yearModelMin ?? ''}
                    onChange={(e) =>
                      onFiltersChange({
                        ...filters,
                        yearModelMin: e.target.value ? parseInt(e.target.value) : null,
                      })
                    }
                    min={yearRange.minModel}
                    max={yearRange.maxModel}
                  />
                  <Input
                    type="number"
                    placeholder="Até"
                    value={filters.yearModelMax ?? ''}
                    onChange={(e) =>
                      onFiltersChange({
                        ...filters,
                        yearModelMax: e.target.value ? parseInt(e.target.value) : null,
                      })
                    }
                    min={yearRange.minModel}
                    max={yearRange.maxModel}
                  />
                </div>
              </div>
            </div>
          </FilterSection>

          <FilterSection
            title="Preço"
            expanded={expandedSections.price}
            onToggle={() => toggleSection('price')}
          >
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Mínimo"
                value={filters.priceMin ?? ''}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    priceMin: e.target.value ? parseFloat(e.target.value) : null,
                  })
                }
                min={0}
              />
              <Input
                type="number"
                placeholder="Máximo"
                value={filters.priceMax ?? ''}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    priceMax: e.target.value ? parseFloat(e.target.value) : null,
                  })
                }
                min={0}
              />
            </div>
          </FilterSection>

          <FilterSection
            title="Localização"
            expanded={expandedSections.location}
            onToggle={() => toggleSection('location')}
          >
            <div className="space-y-2">
              <Label className="text-xs text-gray-500">Estados</Label>
              <ScrollArea className="h-32">
                {availableStates.map((state) => (
                  <div key={state} className="flex items-center space-x-2 mb-2">
                    <Checkbox
                      id={`state-${state}`}
                      checked={filters.states.includes(state)}
                      onCheckedChange={(checked) => {
                        const newStates = checked
                          ? [...filters.states, state]
                          : filters.states.filter((s) => s !== state);
                        onFiltersChange({ ...filters, states: newStates });
                      }}
                    />
                    <Label htmlFor={`state-${state}`} className="text-sm cursor-pointer">
                      {state}
                    </Label>
                  </div>
                ))}
              </ScrollArea>

              <Separator className="my-2" />

              <Label className="text-xs text-gray-500">Cidades</Label>
              <ScrollArea className="h-32">
                {availableCities.map((city) => (
                  <div key={city} className="flex items-center space-x-2 mb-2">
                    <Checkbox
                      id={`city-${city}`}
                      checked={filters.cities.includes(city)}
                      onCheckedChange={(checked) => {
                        const newCities = checked
                          ? [...filters.cities, city]
                          : filters.cities.filter((c) => c !== city);
                        onFiltersChange({ ...filters, cities: newCities });
                      }}
                    />
                    <Label htmlFor={`city-${city}`} className="text-sm cursor-pointer">
                      {city}
                    </Label>
                  </div>
                ))}
              </ScrollArea>
            </div>
          </FilterSection>

          <FilterSection
            title="Status"
            expanded={expandedSections.status}
            onToggle={() => toggleSection('status')}
          >
            <div className="space-y-2">
              {availableStatus.map((status) => (
                <div key={status} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${status}`}
                    checked={filters.status.includes(status)}
                    onCheckedChange={(checked) => {
                      const newStatus = checked
                        ? [...filters.status, status]
                        : filters.status.filter((s) => s !== status);
                      onFiltersChange({ ...filters, status: newStatus });
                    }}
                  />
                  <Label htmlFor={`status-${status}`} className="text-sm cursor-pointer">
                    {status}
                  </Label>
                </div>
              ))}
            </div>
          </FilterSection>

          <FilterSection
            title="Opcionais"
            expanded={expandedSections.optionals}
            onToggle={() => toggleSection('optionals')}
          >
            <div className="space-y-2">
              {[
                { key: 'airConditioning', label: 'Ar-Condicionado' },
                { key: 'bathroom', label: 'Banheiro' },
                { key: 'reclinableSeats', label: 'Bancos Reclináveis' },
                { key: 'usb', label: 'USB' },
                { key: 'packageHolder', label: 'Porta Pacote' },
                { key: 'soundSystem', label: 'Sistema de Som' },
                { key: 'tv', label: 'TV' },
                { key: 'wifi', label: 'Wifi' },
                { key: 'tiltingGlass', label: 'Vidro Basculante' },
                { key: 'gluedGlass', label: 'Vidro Colado' },
                { key: 'curtain', label: 'Cortina' },
                { key: 'accessibility', label: 'Acessibilidade' },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={`optional-${key}`}
                    checked={!!filters.optionals[key as keyof typeof filters.optionals]}
                    onCheckedChange={(checked) => {
                      const newOptionals = { ...filters.optionals };
                      if (checked) {
                        newOptionals[key as keyof typeof newOptionals] = true;
                      } else {
                        delete newOptionals[key as keyof typeof newOptionals];
                      }
                      onFiltersChange({ ...filters, optionals: newOptionals });
                    }}
                  />
                  <Label htmlFor={`optional-${key}`} className="text-sm cursor-pointer">
                    {label}
                  </Label>
                </div>
              ))}
            </div>
          </FilterSection>
        </div>
      </ScrollArea>
    </div>
  );
}

interface FilterSectionProps {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function FilterSection({ title, expanded, onToggle, children }: FilterSectionProps) {
  return (
    <div className="border rounded-lg">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-sm">{title}</span>
        {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {expanded && <div className="p-3 pt-0 border-t">{children}</div>}
    </div>
  );
}
