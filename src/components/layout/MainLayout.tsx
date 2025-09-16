import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Building2, 
  Car,
  Search, 
  BarChart3,
  Crown,
  Shield,
  Home
} from 'lucide-react';
import { UserMenu, useAuth } from '@/components/auth';

export default function MainLayout() {
  const { user, isAurovel } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/contacts', label: 'Contatos', icon: Users },
    { path: '/companies', label: 'Empresas', icon: Building2 },
    { path: '/vehicles', label: 'Veículos', icon: Car },
    { path: '/matching', label: 'Matching', icon: Search },
  ];

  const isActivePath = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${isAurovel ? 'bg-gradient-to-r from-purple-600 to-indigo-600' : 'bg-gradient-to-r from-blue-600 to-indigo-600'} rounded-lg flex items-center justify-center`}>
                {isAurovel ? <Crown className="h-6 w-6 text-white" /> : <Shield className="h-6 w-6 text-white" />}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {isAurovel ? 'CRM Master Control' : 'Sistema CRM'}
                </h1>
                <p className="text-sm text-gray-600">
                  {isAurovel ? 'Controle Total - Aurovel' : `${user?.companyData.name}`}
                </p>
              </div>
            </div>
            
            {/* Navigation */}
            <div className="hidden md:flex items-center gap-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.path}
                    variant={isActivePath(item.path) ? "default" : "ghost"}
                    size="sm"
                    onClick={() => navigate(item.path)}
                    className="flex items-center gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              {isAurovel && (
                <Badge variant="default" className="bg-purple-600">
                  <Crown className="h-3 w-3 mr-1" />
                  Controle Total
                </Badge>
              )}
              <UserMenu />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-2">
          <div className="flex gap-1 overflow-x-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.path}
                  variant={isActivePath(item.path) ? "default" : "ghost"}
                  size="sm"
                  onClick={() => navigate(item.path)}
                  className="flex items-center gap-2 whitespace-nowrap"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Outlet />
    </div>
  );
}