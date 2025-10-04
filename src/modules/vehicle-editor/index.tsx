import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { VehicleEditorList } from './pages/VehicleEditorList';
import { VehicleEditorWizard } from './pages/VehicleEditorWizard';

export const VehicleEditorModule: React.FC = () => {
  return (
    <Routes>
      <Route index element={<VehicleEditorList />} />
      <Route path="edit/:id" element={<VehicleEditorWizard />} />
      <Route path="new" element={<VehicleEditorWizard />} />
    </Routes>
  );
};

export * from './types';
export * from './services/vehicleEditorApi';
