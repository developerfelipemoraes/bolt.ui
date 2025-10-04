import { Routes, Route } from 'react-router-dom';
import { VehicleSearchPage } from './pages/VehicleSearchPage';

export function VehicleSearchExportModule() {
  return (
    <Routes>
      <Route path="/" element={<VehicleSearchPage />} />
    </Routes>
  );
}

export { VehicleSearchPage } from './pages/VehicleSearchPage';
