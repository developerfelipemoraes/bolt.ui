import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Shield,
  Users,
  Crown
} from 'lucide-react';
import { toast } from 'sonner';

interface LoginData {
  email: string;
  password: string;
  company?: string;
}

interface LoginComponentProps {
  onLogin: (userData: any) => void;
  className?: string;
}

// Dados mockados das empresas e usuários
const COMPANIES = {
  'aurovel': {
    id: 'aurovel',
    name: 'Aurovel',
    type: 'master',
    logo: '👑',
    description: 'Controle Total do Sistema'
  },
  'tech-solutions': {
    id: 'tech-solutions', 
    name: 'Tech Solutions Ltda',
    type: 'client',
    logo: '🏢',
    description: 'Empresa Cliente'
  },
  'inovacao-digital': {
    id: 'inovacao-digital',
    name: 'Inovação Digital S.A.',
    type: 'client', 
    logo: '💡',
    description: 'Empresa Cliente'
  }
};

const USERS = [
  // Usuários Aurovel (controle total)
  {
    id: '1',
    email: 'admin@aurovel.com',
    password: 'admin123',
    name: 'Administrador Aurovel',
    company: 'aurovel',
    role: 'super_admin',
    permissions: ['all']
  },
  {
    id: '2', 
    email: 'manager@aurovel.com',
    password: 'manager123',
    name: 'Gerente Aurovel',
    company: 'aurovel',
    role: 'admin',
    permissions: ['read', 'write', 'delete', 'manage_companies']
  },
  // Usuários Tech Solutions
  {
    id: '3',
    email: 'admin@techsolutions.com',
    password: 'tech123',
    name: 'Admin Tech Solutions',
    company: 'tech-solutions',
    role: 'company_admin',
    permissions: ['read', 'write', 'delete_own']
  },
  {
    id: '4',
    email: 'user@techsolutions.com', 
    password: 'user123',
    name: 'Usuário Tech Solutions',
    company: 'tech-solutions',
    role: 'user',
    permissions: ['read', 'write_own']
  },
  // Usuários Inovação Digital
  {
    id: '5',
    email: 'admin@inovacaodigital.com',
    password: 'inov123',
    name: 'Admin Inovação Digital',
    company: 'inovacao-digital',
    role: 'company_admin',
    permissions: ['read', 'write', 'delete_own']
  }
];

export const LoginComponent: React.FC<LoginComponentProps> = ({ onLogin, className = "" }) => {
  const [loginData, setLoginData] = useState<LoginData>({
    email: '',
    password: '',
    company: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginType, setLoginType] = useState<'email' | 'company'>('email');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simular delay de autenticação
      await new Promise(resolve => setTimeout(resolve, 1000));

      let user = null;

      if (loginType === 'email') {
        // Login por email/senha
        user = USERS.find(u => 
          u.email === loginData.email && 
          u.password === loginData.password
        );
      } else {
        // Login por empresa (apenas Aurovel)
        if (loginData.company === 'aurovel' && loginData.password === 'aurovel2024') {
          user = USERS[0]; // Super admin da Aurovel
        }
      }

      if (!user) {
        setError('Credenciais inválidas');
        toast.error('Falha no login', {
          description: 'Email, senha ou empresa incorretos'
        });
        return;
      }

      const company = COMPANIES[user.company as keyof typeof COMPANIES];
      
      const userData = {
        ...user,
        companyData: company,
        loginTime: new Date().toISOString()
      };

      // Salvar no localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      
      toast.success('Login realizado com sucesso!', {
        description: `Bem-vindo, ${user.name}`
      });

      onLogin(userData);

    } catch (err) {
      setError('Erro interno do servidor');
      toast.error('Erro no login');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (userType: string) => {
    const credentials: { [key: string]: { email: string; password: string } } = {
      'aurovel-admin': { email: 'admin@aurovel.com', password: 'admin123' },
      'aurovel-manager': { email: 'manager@aurovel.com', password: 'manager123' },
      'tech-admin': { email: 'admin@techsolutions.com', password: 'tech123' },
      'tech-user': { email: 'user@techsolutions.com', password: 'user123' },
      'inov-admin': { email: 'admin@inovacaodigital.com', password: 'inov123' }
    };

    const cred = credentials[userType];
    if (cred) {
      setLoginData({ ...loginData, email: cred.email, password: cred.password });
      setLoginType('email');
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 ${className}`}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">CRM Login</h1>
          <p className="text-gray-600 mt-2">Acesse sua conta para continuar</p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-center">Fazer Login</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={loginType} onValueChange={(value) => setLoginType(value as 'email' | 'company')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </TabsTrigger>
                <TabsTrigger value="company" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Empresa
                </TabsTrigger>
              </TabsList>

              <form onSubmit={handleLogin} className="space-y-4 mt-6">
                <TabsContent value="email" className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="password">Senha</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Sua senha"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="company" className="space-y-4">
                  <div>
                    <Label htmlFor="company">Empresa</Label>
                    <Input
                      id="company"
                      type="text"
                      placeholder="Nome da empresa"
                      value={loginData.company}
                      onChange={(e) => setLoginData({ ...loginData, company: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="company-password">Senha da Empresa</Label>
                    <div className="relative">
                      <Input
                        id="company-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Senha da empresa"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Alert>
                    <Crown className="h-4 w-4" />
                    <AlertDescription>
                      Login por empresa disponível apenas para <strong>Aurovel</strong> (controle total)
                    </AlertDescription>
                  </Alert>
                </TabsContent>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Entrando...' : 'Entrar'}
                </Button>
              </form>
            </Tabs>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4" />
              Credenciais de Demonstração
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="default" className="bg-purple-600">
                  <Crown className="h-3 w-3 mr-1" />
                  Aurovel
                </Badge>
                <span className="text-xs text-muted-foreground">Controle Total</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => fillDemoCredentials('aurovel-admin')}
                  className="text-xs"
                >
                  Super Admin
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => fillDemoCredentials('aurovel-manager')}
                  className="text-xs"
                >
                  Gerente
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Tech Solutions</Badge>
                <span className="text-xs text-muted-foreground">Cliente</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => fillDemoCredentials('tech-admin')}
                  className="text-xs"
                >
                  Admin
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => fillDemoCredentials('tech-user')}
                  className="text-xs"
                >
                  Usuário
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Inovação Digital</Badge>
                <span className="text-xs text-muted-foreground">Cliente</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => fillDemoCredentials('inov-admin')}
                className="text-xs w-full"
              >
                Admin
              </Button>
            </div>

            <Alert className="mt-4">
              <Shield className="h-4 w-4" />
              <AlertDescription className="text-xs">
                <strong>Login Aurovel por empresa:</strong><br/>
                Empresa: "aurovel" | Senha: "aurovel2024"
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginComponent;