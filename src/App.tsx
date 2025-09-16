import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/components/auth';
import { ProtectedRoute } from '@/components/auth';
import { VehicleManagement } from './pages/VehicleManagement';
import AppMain from './pages/App';
import CRMTest from './pages/CRMTest';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();


const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route 
              path="/"               element={
                <ProtectedRoute>
                  <CRMTest />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/crm/*" 
              element={
                <ProtectedRoute>
                  <CRMTest />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/app" 
              element={
                <ProtectedRoute>
                  <AppMain />
                </ProtectedRoute>
              } 
            />
            <Route path="/vehicles" element={<VehicleManagement />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;