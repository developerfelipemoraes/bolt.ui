import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Building2, User, Mail, Phone, MapPin, Calendar, DollarSign } from 'lucide-react';
import { SupplierInfo } from '../types';

interface SupplierStepProps {
  data: SupplierInfo;
  onChange: (data: SupplierInfo) => void;
}

export const SupplierStep: React.FC<SupplierStepProps> = ({ data, onChange }) => {
  const handleChange = (field: keyof SupplierInfo, value: string | number) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Informações do Fornecedor
          </CardTitle>
          <CardDescription>
            Registre os dados do fornecedor e informações de compra do veículo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="supplierName">
                <span className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Nome do Fornecedor *
                </span>
              </Label>
              <Input
                id="supplierName"
                value={data.supplierName || ''}
                onChange={(e) => handleChange('supplierName', e.target.value)}
                placeholder="Nome da empresa fornecedora"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplierCNPJ">
                <span className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  CNPJ *
                </span>
              </Label>
              <Input
                id="supplierCNPJ"
                value={data.supplierCNPJ || ''}
                onChange={(e) => handleChange('supplierCNPJ', e.target.value)}
                placeholder="00.000.000/0000-00"
                maxLength={18}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="supplierContact">
                <span className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Pessoa de Contato
                </span>
              </Label>
              <Input
                id="supplierContact"
                value={data.supplierContact || ''}
                onChange={(e) => handleChange('supplierContact', e.target.value)}
                placeholder="Nome do responsável"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplierEmail">
                <span className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </span>
              </Label>
              <Input
                id="supplierEmail"
                type="email"
                value={data.supplierEmail || ''}
                onChange={(e) => handleChange('supplierEmail', e.target.value)}
                placeholder="fornecedor@email.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="supplierPhone">
                <span className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Telefone
                </span>
              </Label>
              <Input
                id="supplierPhone"
                value={data.supplierPhone || ''}
                onChange={(e) => handleChange('supplierPhone', e.target.value)}
                placeholder="(00) 00000-0000"
                maxLength={15}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplierAddress">
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Endereço
                </span>
              </Label>
              <Input
                id="supplierAddress"
                value={data.supplierAddress || ''}
                onChange={(e) => handleChange('supplierAddress', e.target.value)}
                placeholder="Endereço completo"
              />
            </div>
          </div>

          <div className="border-t pt-4 mt-4">
            <h3 className="text-lg font-semibold mb-4">Informações de Compra</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="purchaseDate">
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Data da Compra
                  </span>
                </Label>
                <Input
                  id="purchaseDate"
                  type="date"
                  value={data.purchaseDate || ''}
                  onChange={(e) => handleChange('purchaseDate', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="purchasePrice">
                  <span className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Valor de Compra (R$)
                  </span>
                </Label>
                <Input
                  id="purchasePrice"
                  type="number"
                  value={data.purchasePrice || ''}
                  onChange={(e) => handleChange('purchasePrice', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={data.notes || ''}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Informações adicionais sobre o fornecedor ou a compra..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
