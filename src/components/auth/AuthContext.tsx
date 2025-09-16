import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Company, AuthContextType, UserRole, PermissionAction, ROLE_PERMISSIONS } from '@/types/auth';
import { toast } from 'sonner';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [availableCompanies, setAvailableCompanies] = useState<Company[]>([]);

  useEffect(() => {
    // Verificar se há usuário e empresa salvos no localStorage
    const savedUser = localStorage.getItem('user');
    const savedCompany = localStorage.getItem('company');
    
    if (savedUser && savedCompany) {
      try {
        const userData = JSON.parse(savedUser);
        const companyData = JSON.parse(savedCompany);
        setUser(userData);
        setCompany(companyData);
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('company');
      }
    }
  }, []);

  const login = (userData: User, companyData: Company) => {
    setUser(userData);
    setCompany(companyData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('company', JSON.stringify(companyData));
  };

  const logout = () => {
    setUser(null);
    setCompany(null);
    localStorage.removeItem('user');
    localStorage.removeItem('company');
    localStorage.removeItem('availableCompanies');
  };

  const hasPermission = (resource: string, action: PermissionAction): boolean => {
    if (!user) return false;
    
    // Super admin tem todas as permissões
    if (user.role === UserRole.SUPER_ADMIN) {
      return true;
    }
    
    // Verificar permissões específicas do role
    const rolePermissions = ROLE_PERMISSIONS[user.role] || [];
    
    return rolePermissions.some(permission => 
      permission.resource === resource && 
      permission.actions.includes(action)
    );
  };

  const canAccessCompany = (companyId: string): boolean => {
    if (!user || !company) return false;
    
    // Super admin pode acessar qualquer empresa
    if (user.role === UserRole.SUPER_ADMIN) {
      return true;
    }
    
    // Outros usuários só podem acessar sua própria empresa
    return user.companyId === companyId;
  };

  const canManageUser = (targetUserId: string): boolean => {
    if (!user) return false;
    
    // Super admin pode gerenciar qualquer usuário
    if (user.role === UserRole.SUPER_ADMIN) {
      return true;
    }
    
    // Company admin pode gerenciar usuários da sua empresa
    if (user.role === UserRole.COMPANY_ADMIN) {
      // Aqui verificaríamos se o target user é da mesma empresa
      return true; // Simplificado para MVP
    }
    
    return false;
  };

  const switchCompany = async (companyId: string): Promise<void> => {
    if (!user || user.role !== UserRole.SUPER_ADMIN) {
      throw new Error('Apenas super admin pode trocar de empresa');
    }
    
    // Aqui faria a busca da empresa na API
    // Por enquanto, simulando com dados mock
    const mockCompanies: Company[] = [
      {
        id: 'aurovel',
        name: 'Aurovel',
        type: 'master',
        logo: '👑',
        description: 'Controle Total do Sistema',
        settings: {
          maxUsers: 1000,
          allowedModules: ['all'],
          customBranding: true,
          dataRetentionDays: 365
        },
        isActive: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      },
      {
        id: 'tech-solutions',
        name: 'Tech Solutions Ltda',
        type: 'client',
        logo: '🏢',
        description: 'Empresa Cliente',
        settings: {
          maxUsers: 50,
          allowedModules: ['contacts', 'companies', 'vehicles'],
          customBranding: false,
          dataRetentionDays: 90
        },
        isActive: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      }
    ];
    
    const targetCompany = mockCompanies.find(c => c.id === companyId);
    if (targetCompany) {
      setCompany(targetCompany);
      localStorage.setItem('company', JSON.stringify(targetCompany));
      toast.success(`Empresa alterada para: ${targetCompany.name}`);
    }
  };

  // Computed properties
  const isAurovel = company?.type === 'master';
  const isSuperAdmin = user?.role === UserRole.SUPER_ADMIN;
  const isCompanyAdmin = user?.role === UserRole.COMPANY_ADMIN;

  const value: AuthContextType = {
    user,
    company,
    login,
    logout,
    isAuthenticated: !!user,
    hasPermission,
    canAccessCompany,
    canManageUser,
    isAurovel,
    isSuperAdmin,
    isCompanyAdmin,
    switchCompany
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export default AuthContext;