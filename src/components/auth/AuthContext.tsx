import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  company: string;
  role: 'super_admin' | 'admin' | 'company_admin' | 'user';
  permissions: string[];
  companyData: {
    id: string;
    name: string;
    type: 'master' | 'client';
    logo: string;
    description: string;
  };
  loginTime: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
  isAurovel: boolean;
  canAccessCompany: (companyId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Verificar se há usuário salvo no localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    
    // Super admin da Aurovel tem todas as permissões
    if (user.role === 'super_admin' && user.company === 'aurovel') {
      return true;
    }
    
    // Verificar permissão específica
    return user.permissions.includes(permission) || user.permissions.includes('all');
  };

  const isAurovel = user?.company === 'aurovel';

  const canAccessCompany = (companyId: string): boolean => {
    if (!user) return false;
    
    // Aurovel pode acessar qualquer empresa
    if (user.company === 'aurovel') {
      return true;
    }
    
    // Outras empresas só podem acessar seus próprios dados
    return user.company === companyId;
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    hasPermission,
    isAurovel,
    canAccessCompany
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