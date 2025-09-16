import React, { useState } from 'react';
import { VehicleWizard } from '../components/VehicleWizard';
import { VehicleList } from '../components/VehicleList';
import { VehicleSummary } from '../components/VehicleSummary';
import { Vehicle } from '../types/vehicle';

type ViewMode = 'list' | 'add' | 'edit' | 'summary';

export const VehicleManagement: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('list');
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [summaryData, setSummaryData] = useState<Partial<Vehicle> | null>(null);

  const handleAddVehicle = () => {
    setEditingVehicle(null);
    setCurrentView('add');
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setCurrentView('edit');
  };

  const handleWizardComplete = (vehicleData: Vehicle) => {
    setSummaryData(vehicleData);
    setCurrentView('summary');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setEditingVehicle(null);
    setSummaryData(null);
  };

  const handleViewSummary = (vehicleData: Partial<Vehicle>) => {
    setSummaryData(vehicleData);
    setCurrentView('summary');
  };

  switch (currentView) {
    case 'add':
    case 'edit':
      return (
        <VehicleWizard
          onComplete={handleWizardComplete}
          onCancel={handleBackToList}
        />
      );
    
    case 'summary':
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">
                Veículo Cadastrado com Sucesso!
              </h1>
              <button
                onClick={handleBackToList}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Voltar à Lista
              </button>
            </div>
            
            {summaryData && <VehicleSummary vehicleData={summaryData} />}
          </div>
        </div>
      );
    
    case 'list':
    default:
      return (
        <VehicleList
          onAdd={handleAddVehicle}
          onEdit={handleEditVehicle}
        />
      );
  }
};