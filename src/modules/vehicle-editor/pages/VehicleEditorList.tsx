import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, CreditCard as Edit, Plus, Truck, Calendar, MapPin } from 'lucide-react';
import { vehicleEditorApi } from '../services/vehicleEditorApi';
import { toast } from 'sonner';

interface VehicleListItem {
  id: string;
  sku?: string;
  title?: string;
  category?: string;
  subcategory?: string;
  year?: number;
  licensePlate?: string;
  status?: string;
  thumbnailUrl?: string;
  supplier?: {
    name?: string;
  };
}

export const VehicleEditorList: React.FC = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<VehicleListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  useEffect(() => {
    loadVehicles();
  }, [page]);

  const loadVehicles = async () => {
    setLoading(true);
    try {
      const response = await vehicleEditorApi.getVehicles(page, limit, searchTerm);
      setVehicles(response.data as VehicleListItem[]);
      setTotal(response.total);
    } catch (error) {
      toast.error('Erro ao carregar veículos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    loadVehicles();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleEdit = (vehicleId: string) => {
    navigate(`/vehicle-editor/edit/${vehicleId}`);
  };

  const handleCreate = () => {
    navigate('/vehicle-editor/new');
  };

  const getStatusBadge = (status?: string) => {
    const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      available: { label: 'Disponível', variant: 'default' },
      sold: { label: 'Vendido', variant: 'secondary' },
      reserved: { label: 'Reservado', variant: 'outline' },
    };

    const statusInfo = statusMap[status || 'available'] || { label: status || 'N/A', variant: 'outline' as const };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Editor de Veículos
              <Badge variant="secondary">{total}</Badge>
            </CardTitle>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Veículo
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por SKU, título, placa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch}>Buscar</Button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Carregando veículos...</p>
            </div>
          ) : vehicles.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Truck className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>Nenhum veículo encontrado</p>
              {searchTerm && (
                <p className="text-sm mt-2">Tente ajustar os termos da busca</p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {vehicles.map((vehicle) => (
                <Card key={vehicle.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {vehicle.thumbnailUrl ? (
                          <img
                            src={vehicle.thumbnailUrl}
                            alt={vehicle.title || 'Veículo'}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Truck className="h-10 w-10 text-gray-400" />
                        )}
                      </div>

                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold">
                            {vehicle.title || 'Sem título'}
                          </h3>
                          {vehicle.sku && (
                            <Badge variant="outline" className="font-mono">
                              SKU: {vehicle.sku}
                            </Badge>
                          )}
                          {getStatusBadge(vehicle.status)}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          {vehicle.category && (
                            <span className="flex items-center gap-1">
                              <Truck className="h-4 w-4" />
                              {vehicle.category}
                              {vehicle.subcategory && ` - ${vehicle.subcategory}`}
                            </span>
                          )}
                          {vehicle.year && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {vehicle.year}
                            </span>
                          )}
                          {vehicle.licensePlate && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {vehicle.licensePlate}
                            </span>
                          )}
                        </div>

                        {vehicle.supplier?.name && (
                          <p className="text-sm text-gray-500">
                            Fornecedor: {vehicle.supplier.name}
                          </p>
                        )}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(vehicle.id)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {total > limit && (
                <div className="flex justify-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                  >
                    Anterior
                  </Button>
                  <span className="flex items-center px-4">
                    Página {page} de {Math.ceil(total / limit)}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setPage(page + 1)}
                    disabled={page >= Math.ceil(total / limit)}
                  >
                    Próxima
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
