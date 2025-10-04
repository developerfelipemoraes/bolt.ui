import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Save, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { vehicleEditorApi } from '../services/vehicleEditorApi';
import { VehicleEditorData, SupplierInfo } from '../types';
import { SupplierStep } from '../components/SupplierStep';
import { BasicInfoStep, ChassisInfoStep, VehicleDataStep, LocationStep } from '../components/VehicleEditorSteps';

interface Step {
  id: number;
  title: string;
  component: React.ComponentType<any>;
}

const STEPS: Step[] = [
  { id: 1, title: 'Informações Básicas', component: BasicInfoStep },
  { id: 2, title: 'Chassi e Carroceria', component: ChassisInfoStep },
  { id: 3, title: 'Dados do Veículo', component: VehicleDataStep },
  { id: 4, title: 'Localização', component: LocationStep },
  { id: 5, title: 'Fornecedor', component: SupplierStep },
];

export const VehicleEditorWizard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = id !== 'new';

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [vehicleData, setVehicleData] = useState<Partial<VehicleEditorData>>({
    category: '',
    chassisInfo: {
      chassisManufacturer: '',
      bodyManufacturer: '',
      chassisModel: '',
      bodyModel: '',
    },
    vehicleData: {
      fabricationYear: new Date().getFullYear(),
      modelYear: new Date().getFullYear(),
      mileage: 0,
      licensePlate: '',
      renavam: '',
      chassis: '',
      availableQuantity: 1,
      internalNotes: '',
    },
    productIdentification: {
      title: '',
    },
    secondaryInfo: {
      capacity: 0,
      condition: 'used',
      fuelType: 'diesel',
      steering: 'assisted',
      singleOwner: false,
      description: '',
    },
    seatConfiguration: {
      conventional: 0,
      executive: 0,
      semiSleeper: 0,
      sleeper: 0,
      sleeperBed: 0,
      fixed: 0,
    },
    optionals: {
      airConditioning: false,
      usb: false,
      packageHolder: false,
      soundSystem: false,
      monitor: false,
      wifi: false,
      bathroom: false,
      glasType: 'glued',
      curtain: false,
      cabin: false,
      accessibility: false,
      factoryRetarder: false,
      optionalRetarder: false,
      legSupport: false,
      coffeeMaker: false,
    },
    location: {
      address: '',
      neighborhood: '',
      state: '',
      city: '',
      zipCode: '',
    },
    supplier: {
      supplierName: '',
      supplierCNPJ: '',
      supplierContact: '',
      supplierEmail: '',
      supplierPhone: '',
      supplierAddress: '',
    },
  });

  useEffect(() => {
    if (isEditMode) {
      loadVehicle();
    }
  }, [id]);

  const loadVehicle = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const data = await vehicleEditorApi.getVehicleById(id);
      if (data) {
        setVehicleData(data as Partial<VehicleEditorData>);
      } else {
        toast.error('Veículo não encontrado');
        navigate('/vehicle-editor');
      }
    } catch (error) {
      toast.error('Erro ao carregar veículo');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStepChange = (field: string, value: any) => {
    setVehicleData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let result;
      if (isEditMode && id) {
        result = await vehicleEditorApi.updateVehicle(id, vehicleData);
      } else {
        result = await vehicleEditorApi.createVehicle(vehicleData);
      }

      if (result.success) {
        toast.success(isEditMode ? 'Veículo atualizado com sucesso!' : 'Veículo criado com sucesso!');
        navigate('/vehicle-editor');
      } else {
        toast.error(result.error || 'Erro ao salvar veículo');
      }
    } catch (error) {
      toast.error('Erro ao salvar veículo');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const progress = (currentStep / STEPS.length) * 100;
  const CurrentStepComponent = STEPS[currentStep - 1].component;

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando veículo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate('/vehicle-editor')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold">
          {isEditMode ? 'Editar Veículo' : 'Novo Veículo'}
        </h1>
        <div className="w-24"></div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">
            Etapa {currentStep} de {STEPS.length}
          </span>
          <span className="text-gray-600">{STEPS[currentStep - 1].title}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">{STEPS[currentStep - 1].title}</h2>
          </div>

          {currentStep === 5 ? (
            <SupplierStep
              data={vehicleData.supplier || {} as SupplierInfo}
              onChange={(data) => handleStepChange('supplier', data)}
            />
          ) : (
            <CurrentStepComponent
              data={vehicleData}
              onChange={handleStepChange}
            />
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Anterior
        </Button>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </>
            )}
          </Button>

          {currentStep < STEPS.length ? (
            <Button onClick={handleNext}>
              Próximo
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Finalizando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Finalizar
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
