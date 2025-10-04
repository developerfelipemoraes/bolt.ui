import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export const BasicInfoStep: React.FC<{ data: any; onChange: (field: string, value: any) => void }> = ({ data, onChange }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Categoria *</Label>
            <Input
              id="category"
              value={data.category || ''}
              onChange={(e) => onChange('category', e.target.value)}
              placeholder="Ex: Ônibus, Caminhão, Van..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subcategory">Subcategoria</Label>
            <Input
              id="subcategory"
              value={data.subcategory || ''}
              onChange={(e) => onChange('subcategory', e.target.value)}
              placeholder="Ex: Urbano, Rodoviário..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Título do Anúncio *</Label>
            <Input
              id="title"
              value={data.productIdentification?.title || ''}
              onChange={(e) => onChange('productIdentification', { ...data.productIdentification, title: e.target.value })}
              placeholder="Ex: Ônibus Mercedes-Benz O500 2018"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const ChassisInfoStep: React.FC<{ data: any; onChange: (field: string, value: any) => void }> = ({ data, onChange }) => {
  const chassisInfo = data.chassisInfo || {};

  const handleChange = (field: string, value: string) => {
    onChange('chassisInfo', { ...chassisInfo, [field]: value });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="chassisManufacturer">Fabricante do Chassi *</Label>
              <Input
                id="chassisManufacturer"
                value={chassisInfo.chassisManufacturer || ''}
                onChange={(e) => handleChange('chassisManufacturer', e.target.value)}
                placeholder="Ex: Mercedes-Benz"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="chassisModel">Modelo do Chassi *</Label>
              <Input
                id="chassisModel"
                value={chassisInfo.chassisModel || ''}
                onChange={(e) => handleChange('chassisModel', e.target.value)}
                placeholder="Ex: O500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bodyManufacturer">Fabricante da Carroceria</Label>
              <Input
                id="bodyManufacturer"
                value={chassisInfo.bodyManufacturer || ''}
                onChange={(e) => handleChange('bodyManufacturer', e.target.value)}
                placeholder="Ex: Marcopolo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bodyModel">Modelo da Carroceria</Label>
              <Input
                id="bodyModel"
                value={chassisInfo.bodyModel || ''}
                onChange={(e) => handleChange('bodyModel', e.target.value)}
                placeholder="Ex: Paradiso G7"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const VehicleDataStep: React.FC<{ data: any; onChange: (field: string, value: any) => void }> = ({ data, onChange }) => {
  const vehicleData = data.vehicleData || {};

  const handleChange = (field: string, value: string | number) => {
    onChange('vehicleData', { ...vehicleData, [field]: value });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fabricationYear">Ano de Fabricação *</Label>
              <Input
                id="fabricationYear"
                type="number"
                value={vehicleData.fabricationYear || new Date().getFullYear()}
                onChange={(e) => handleChange('fabricationYear', parseInt(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="modelYear">Ano do Modelo *</Label>
              <Input
                id="modelYear"
                type="number"
                value={vehicleData.modelYear || new Date().getFullYear()}
                onChange={(e) => handleChange('modelYear', parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mileage">Quilometragem</Label>
              <Input
                id="mileage"
                type="number"
                value={vehicleData.mileage || 0}
                onChange={(e) => handleChange('mileage', parseInt(e.target.value))}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="licensePlate">Placa</Label>
              <Input
                id="licensePlate"
                value={vehicleData.licensePlate || ''}
                onChange={(e) => handleChange('licensePlate', e.target.value)}
                placeholder="ABC-1234"
                maxLength={8}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="chassis">Chassi</Label>
              <Input
                id="chassis"
                value={vehicleData.chassis || ''}
                onChange={(e) => handleChange('chassis', e.target.value)}
                placeholder="Número do chassi"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="renavam">RENAVAM</Label>
              <Input
                id="renavam"
                value={vehicleData.renavam || ''}
                onChange={(e) => handleChange('renavam', e.target.value)}
                placeholder="Número do RENAVAM"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="internalNotes">Notas Internas</Label>
            <Textarea
              id="internalNotes"
              value={vehicleData.internalNotes || ''}
              onChange={(e) => handleChange('internalNotes', e.target.value)}
              placeholder="Observações internas sobre o veículo..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const LocationStep: React.FC<{ data: any; onChange: (field: string, value: any) => void }> = ({ data, onChange }) => {
  const location = data.location || {};

  const handleChange = (field: string, value: string) => {
    onChange('location', { ...location, [field]: value });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Endereço *</Label>
            <Input
              id="address"
              value={location.address || ''}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Rua, número"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="neighborhood">Bairro</Label>
              <Input
                id="neighborhood"
                value={location.neighborhood || ''}
                onChange={(e) => handleChange('neighborhood', e.target.value)}
                placeholder="Bairro"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Cidade *</Label>
              <Input
                id="city"
                value={location.city || ''}
                onChange={(e) => handleChange('city', e.target.value)}
                placeholder="Cidade"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="state">Estado *</Label>
              <Input
                id="state"
                value={location.state || ''}
                onChange={(e) => handleChange('state', e.target.value)}
                placeholder="UF"
                maxLength={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode">CEP</Label>
              <Input
                id="zipCode"
                value={location.zipCode || ''}
                onChange={(e) => handleChange('zipCode', e.target.value)}
                placeholder="00000-000"
                maxLength={9}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
