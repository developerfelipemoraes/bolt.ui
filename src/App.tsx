import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/components/auth';
import { ProtectedRoute } from '@/components/auth';
import CRMDashboard from './pages/CRMDashboard';
import ContactManagement from './pages/ContactManagement';
import CompanyManagement from './pages/CompanyManagement';
import VehicleManagement from './pages/VehicleManagement';
import MatchingSystem from './pages/MatchingSystem';
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
                  <CRMDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <CRMDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/contacts/*" 
              element={
                <ProtectedRoute>
                  <ContactManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/companies/*" 
              element={
                <ProtectedRoute>
                  <CompanyManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/vehicles/*" 
              element={
                <ProtectedRoute>
                  <VehicleManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/matching/*" 
              element={
                <ProtectedRoute>
                  <MatchingSystem />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;