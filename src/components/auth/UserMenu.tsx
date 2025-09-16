import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  LogOut, 
  Settings, 
  Crown, 
  Building2, 
  Shield,
  Users
} from 'lucide-react';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface UserMenuProps {
  className?: string;
}

export const UserMenu: React.FC<UserMenuProps> = ({ className = "" }) => {
  const { user, logout, isAurovel } = useAuth();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    toast.success('Logout realizado com sucesso');
  };

  const getRoleDisplay = (role: string) => {
    const roles = {
      'super_admin': 'Super Admin',
      'admin': 'Administrador',
      'company_admin': 'Admin da Empresa',
      'user': 'Usuário'
    };
    return roles[role as keyof typeof roles] || role;
  };

  const getRoleBadgeVariant = (role: string) => {
    if (role === 'super_admin') return 'default';
    if (role === 'admin') return 'secondary';
    if (role === 'company_admin') return 'outline';
    return 'secondary';
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={`relative h-10 w-10 rounded-full ${className}`}>
          <Avatar className="h-10 w-10">
            <AvatarFallback className={`${isAurovel ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white'}`}>
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-2">
              <div className="text-lg">{user.companyData.logo}</div>
              <div>
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground mt-1">
                  {user.email}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge 
                variant={getRoleBadgeVariant(user.role)}
                className="text-xs"
              >
                {isAurovel && user.role === 'super_admin' && <Crown className="h-3 w-3 mr-1" />}
                {user.role === 'admin' && <Shield className="h-3 w-3 mr-1" />}
                {user.role === 'company_admin' && <Building2 className="h-3 w-3 mr-1" />}
                {user.role === 'user' && <Users className="h-3 w-3 mr-1" />}
                {getRoleDisplay(user.role)}
              </Badge>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Building2 className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {user.companyData.name}
                </span>
              </div>
              {isAurovel && (
                <div className="flex items-center gap-2">
                  <Crown className="h-3 w-3 text-purple-600" />
                  <span className="text-xs text-purple-600 font-medium">
                    Controle Total do Sistema
                  </span>
                </div>
              )}
            </div>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <div className="p-2">
          <div className="text-xs text-muted-foreground mb-2">Permissões:</div>
          <div className="flex flex-wrap gap-1">
            {user.permissions.slice(0, 3).map((permission) => (
              <Badge key={permission} variant="outline" className="text-xs">
                {permission === 'all' ? 'Todas' : permission}
              </Badge>
            ))}
            {user.permissions.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{user.permissions.length - 3} mais
              </Badge>
            )}
          </div>
        </div>

        <DropdownMenuSeparator />
        
        <DropdownMenuItem className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Configurações</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          className="cursor-pointer text-red-600 focus:text-red-600"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;