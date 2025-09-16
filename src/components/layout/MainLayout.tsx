import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { 
  Users, 
  Building2, 
  Car,
  Search, 
  BarChart3,
  Crown,
  Shield,
  Home,
  TrendingUp,
  Calendar,
  FileText,
  Settings,
  Bell,
  Target,
  DollarSign,
  Activity
} from 'lucide-react';
import { UserMenu, useAuth } from '@/components/auth';

export default function MainLayout() {
  const { user, isAurovel } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');

  const mainMenuItems = [
    { 
      path: '/dashboard', 
      label: 'Dashboard', 
      icon: BarChart3,
      description: 'Visão geral e métricas'
    },
    { 
      path: '/contacts', 
      label: 'Contatos (PF)', 
      icon: Users,
      description: 'Gestão de pessoas físicas'
    },
    { 
      path: '/companies', 
      label: 'Empresas (PJ)', 
      icon: Building2,
      description: 'Gestão de pessoas jurídicas'
    },
    { 
      path: '/vehicles', 
      label: 'Veículos', 
      icon: Car,
      description: 'Estoque e produtos'
    },
  ];

  const crmMenuItems = [
    { 
      path: '/sales', 
      label: 'Vendas & Pipeline', 
      icon: DollarSign,
      description: 'Funil de vendas e oportunidades'
    },
    { 
      path: '/matching', 
      label: 'Smart Matching', 
      icon: Search,
      description: 'Correspondência inteligente'
    },
    { 
      path: '/tasks', 
      label: 'Tarefas & Atividades', 
      icon: Calendar,
      description: 'Agenda e follow-ups'
    },
    { 
      path: '/reports', 
      label: 'Relatórios', 
      icon: FileText,
      description: 'Analytics e insights'
    },
  ];

  const isActivePath = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-3 px-4 py-2">
              <div className={`w-8 h-8 ${isAurovel ? 'bg-gradient-to-r from-purple-600 to-indigo-600' : 'bg-gradient-to-r from-blue-600 to-indigo-600'} rounded-lg flex items-center justify-center`}>
                {isAurovel ? <Crown className="h-4 w-4 text-white" /> : <Shield className="h-4 w-4 text-white" />}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-gray-900 truncate">
                  {isAurovel ? 'CRM Master' : 'Sistema CRM'}
                </h2>
                <p className="text-xs text-gray-600 truncate">
                  {user?.companyData.name}
                </p>
              </div>
            </div>
            
            {isAurovel && (
              <div className="px-4 pb-2">
                <Badge variant="default" className="bg-purple-600 text-xs">
                  <Crown className="h-3 w-3 mr-1" />
                  Controle Total
                </Badge>
              </div>
            )}
          </SidebarHeader>

          <SidebarContent>
            {/* Search */}
            <SidebarGroup>
              <SidebarGroupContent>
                <div className="px-4 py-2">
                  <Input
                    placeholder="Buscar no CRM..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-8"
                  />
                </div>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Main Navigation */}
            <SidebarGroup>
              <SidebarGroupLabel>Módulos Principais</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {mainMenuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <SidebarMenuItem key={item.path}>
                        <SidebarMenuButton
                          onClick={() => navigate(item.path)}
                          isActive={isActivePath(item.path)}
                          tooltip={item.description}
                        >
                          <Icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* CRM Features */}
            <SidebarGroup>
              <SidebarGroupLabel>CRM Avançado</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {crmMenuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <SidebarMenuItem key={item.path}>
                        <SidebarMenuButton
                          onClick={() => navigate(item.path)}
                          isActive={isActivePath(item.path)}
                          tooltip={item.description}
                        >
                          <Icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Quick Stats */}
            <SidebarGroup>
              <SidebarGroupLabel>Estatísticas Rápidas</SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Contatos</span>
                    <span className="font-medium">156</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Empresas</span>
                    <span className="font-medium">43</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Veículos</span>
                    <span className="font-medium">89</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Matches</span>
                    <span className="font-medium text-green-600">67</span>
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <UserMenu />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center gap-2 flex-1">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <Badge variant="secondary" className="text-xs">3</Badge>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </header>
          <div className="flex-1 overflow-auto">
            <Outlet />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}