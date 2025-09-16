import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, 
  Building2, 
  Car,
  Search, 
  BarChart3,
  UserPlus,
  Building,
  Plus,
  TrendingUp,
  Crown,
  Shield,
  ArrowRight
} from 'lucide-react';
import { UserMenu, useAuth } from '@/components/auth';
import { useNavigate } from 'react-router-dom';

export default function CRMDashboard() {
  const { user, isAurovel } = useAuth();
  const navigate = useNavigate();

  // Mock data - em produção viria da API
  const stats = {
    totalContacts: 156,
    totalCompanies: 43,
    totalVehicles: 89,
    totalMatches: 67,
    contactsThisMonth: 12,
    companiesThisMonth: 8,
    vehiclesThisMonth: 15,
    matchingRate: 78
  };

  const recentActivity = [
    { type: 'contact', action: 'Novo contato cadastrado: João Silva', time: '2 horas atrás', icon: Users },
    { type: 'company', action: 'Empresa atualizada: Tech Solutions', time: '4 horas atrás', icon: Building2 },
    { type: 'vehicle', action: 'Veículo cadastrado: Ônibus Mercedes', time: '6 horas atrás', icon: Car },
    { type: 'match', action: 'Correspondência confirmada', time: '1 dia atrás', icon: Search },
    { type: 'company', action: 'Nova empresa: Inovação Digital', time: '2 dias atrás', icon: Building2 }
  ];

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

      {/* Access Control Info */}
      {isAurovel && (
        <div className="max-w-7xl mx-auto px-6 py-2">
          <Alert className="border-purple-200 bg-purple-50">
            <Crown className="h-4 w-4 text-purple-600" />
            <AlertDescription className="text-purple-800">
              <strong>Modo Aurovel:</strong> Você tem controle total do sistema e pode acessar dados de todas as empresas.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contatos (PF)</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.totalContacts}</div>
              <p className="text-xs text-muted-foreground">
                +{stats.contactsThisMonth} este mês
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Empresas (PJ)</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.totalCompanies}</div>
              <p className="text-xs text-muted-foreground">
                +{stats.companiesThisMonth} este mês
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Veículos</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.totalVehicles}</div>
              <p className="text-xs text-muted-foreground">
                +{stats.vehiclesThisMonth} este mês
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Correspondências</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.totalMatches}</div>
              <p className="text-xs text-muted-foreground">
                {stats.matchingRate}% taxa de match
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/contacts/new')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-600">
                <UserPlus className="h-5 w-5" />
                Novo Contato
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Cadastrar pessoa física com wizard completo
              </p>
              <Button className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar PF
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/companies/new')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <Building className="h-5 w-5" />
                Nova Empresa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Cadastrar pessoa jurídica com wizard completo
              </p>
              <Button variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar PJ
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/vehicles/new')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-600">
                <Car className="h-5 w-5" />
                Novo Veículo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Cadastrar veículo com wizard completo
              </p>
              <Button variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Veículo
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/matching')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-600">
                <Search className="h-5 w-5" />
                Smart Matching
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Correspondência inteligente PJ × PF
              </p>
              <Button variant="outline" className="w-full">
                <TrendingUp className="h-4 w-4 mr-2" />
                Executar Matching
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Atividade Recente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.type === 'contact' ? 'bg-blue-100 text-blue-600' :
                      activity.type === 'company' ? 'bg-green-100 text-green-600' :
                      activity.type === 'vehicle' ? 'bg-purple-100 text-purple-600' :
                      'bg-orange-100 text-orange-600'
                    }`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Navigation Menu */}
          <Card>
            <CardHeader>
              <CardTitle>Navegação Rápida</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="ghost" 
                className="w-full justify-between"
                onClick={() => navigate('/contacts')}
              >
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Gerenciar Contatos
                </div>
                <ArrowRight className="h-4 w-4" />
              </Button>

              <Button 
                variant="ghost" 
                className="w-full justify-between"
                onClick={() => navigate('/companies')}
              >
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Gerenciar Empresas
                </div>
                <ArrowRight className="h-4 w-4" />
              </Button>

              <Button 
                variant="ghost" 
                className="w-full justify-between"
                onClick={() => navigate('/vehicles')}
              >
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  Gerenciar Veículos
                </div>
                <ArrowRight className="h-4 w-4" />
              </Button>

              <Button 
                variant="ghost" 
                className="w-full justify-between"
                onClick={() => navigate('/matching')}
              >
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Sistema de Matching
                </div>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* System Info */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>📋 Sistema CRM Completo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-2 text-blue-600">👥 Módulo Contatos (PF)</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Wizard de 9 etapas completas</li>
                  <li>• Validação CPF, email, CEP</li>
                  <li>• Dados pessoais, documentos, endereço</li>
                  <li>• Informações profissionais e financeiras</li>
                  <li>• Sistema de compliance e KYC</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2 text-green-600">🏢 Módulo Empresas (PJ)</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Wizard de 11 etapas completas</li>
                  <li>• Validação CNPJ e dados comerciais</li>
                  <li>• Estrutura societária completa</li>
                  <li>• Informações financeiras e bancárias</li>
                  <li>• Licenças, seguros e compliance</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2 text-purple-600">🚗 Módulo Veículos</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Wizard de 11 etapas completas</li>
                  <li>• Categorias: ônibus, caminhões, carros</li>
                  <li>• Upload de mídia e documentos</li>
                  <li>• Configuração de opcionais</li>
                  <li>• Localização e descrição</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-orange-50 rounded-lg">
              <h4 className="font-semibold mb-2 text-orange-600">🤖 Sistema de Matching Inteligente</h4>
              <p className="text-sm text-orange-800">
                Algoritmo avançado para relacionar automaticamente contatos (PF) com empresas (PJ) 
                baseado em domínio de email, localização, cargo e outros critérios inteligentes.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}