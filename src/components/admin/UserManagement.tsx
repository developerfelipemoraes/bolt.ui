import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Mail, 
  Shield,
  Building2,
  Crown,
  UserCheck,
  UserX
} from 'lucide-react';
import { useAuth } from '@/components/auth';
import { User, UserRole } from '@/types/auth';
import { toast } from 'sonner';
import { PermissionGuard } from '@/components/ui/permission-guard';

interface UserManagementProps {
  className?: string;
}

// Mock users data - em produção viria da API
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'admin@aurovel.com',
    name: 'Administrador Aurovel',
    companyId: 'aurovel',
    role: UserRole.SUPER_ADMIN,
    permissions: [],
    isActive: true,
    lastLogin: '2024-01-15T10:30:00',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15'
  },
  {
    id: '3',
    email: 'admin@techsolutions.com',
    name: 'Admin Tech Solutions',
    companyId: 'tech-solutions',
    role: UserRole.COMPANY_ADMIN,
    permissions: [],
    isActive: true,
    lastLogin: '2024-01-14T15:20:00',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-14'
  },
  {
    id: '4',
    email: 'user@techsolutions.com',
    name: 'Usuário Tech Solutions',
    companyId: 'tech-solutions',
    role: UserRole.USER,
    permissions: [],
    isActive: true,
    lastLogin: '2024-01-13T09:15:00',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-13'
  }
];

export const UserManagement: React.FC<UserManagementProps> = ({ className = "" }) => {
  const { user, company, isSuperAdmin, isCompanyAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteData, setInviteData] = useState({
    email: '',
    name: '',
    role: UserRole.USER
  });

  useEffect(() => {
    loadUsers();
  }, [company]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      // Filtrar usuários baseado na empresa e role
      let filteredUsers = MOCK_USERS;
      
      if (!isSuperAdmin && company) {
        // Company admin só vê usuários da própria empresa
        filteredUsers = MOCK_USERS.filter(u => u.companyId === company.id);
      }
      
      setUsers(filteredUsers);
    } catch (error) {
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const handleInviteUser = async () => {
    try {
      const newUser: User = {
        id: Date.now().toString(),
        email: inviteData.email,
        name: inviteData.name,
        companyId: company?.id || '',
        role: inviteData.role,
        permissions: [],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setUsers(prev => [...prev, newUser]);
      setShowInviteDialog(false);
      setInviteData({ email: '', name: '', role: UserRole.USER });
      
      toast.success('Usuário convidado com sucesso!');
    } catch (error) {
      toast.error('Erro ao convidar usuário');
    }
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, isActive: !u.isActive } : u
    ));
    toast.success('Status do usuário atualizado');
  };

  const handleUpdateRole = (userId: string, newRole: UserRole) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, role: newRole } : u
    ));
    toast.success('Role do usuário atualizado');
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return <Crown className="h-4 w-4 text-purple-600" />;
      case UserRole.COMPANY_ADMIN:
        return <Shield className="h-4 w-4 text-blue-600" />;
      case UserRole.USER:
        return <Users className="h-4 w-4 text-gray-600" />;
      default:
        return <Users className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return 'Super Admin';
      case UserRole.COMPANY_ADMIN:
        return 'Admin da Empresa';
      case UserRole.USER:
        return 'Usuário';
      default:
        return role;
    }
  };

  const canManageUser = (targetUser: User) => {
    if (!user) return false;
    
    // Super admin pode gerenciar qualquer usuário
    if (isSuperAdmin) return true;
    
    // Company admin pode gerenciar usuários da própria empresa (exceto outros admins)
    if (isCompanyAdmin && targetUser.companyId === user.companyId) {
      return targetUser.role === UserRole.USER;
    }
    
    return false;
  };

  if (!isCompanyAdmin && !isSuperAdmin) {
    return null;
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Gestão de Usuários
            <Badge variant="secondary">{users.length}</Badge>
          </CardTitle>
          
          <PermissionGuard resource="users" action="create">
            <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Convidar Usuário
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Convidar Novo Usuário</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="invite-email">Email</Label>
                    <Input
                      id="invite-email"
                      type="email"
                      value={inviteData.email}
                      onChange={(e) => setInviteData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="usuario@empresa.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="invite-name">Nome</Label>
                    <Input
                      id="invite-name"
                      value={inviteData.name}
                      onChange={(e) => setInviteData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Nome completo"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="invite-role">Nível de Acesso</Label>
                    <Select
                      value={inviteData.role}
                      onValueChange={(value: UserRole) => setInviteData(prev => ({ ...prev, role: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {isSuperAdmin && (
                          <SelectItem value={UserRole.COMPANY_ADMIN}>
                            <div className="flex items-center gap-2">
                              <Shield className="h-4 w-4" />
                              Admin da Empresa
                            </div>
                          </SelectItem>
                        )}
                        <SelectItem value={UserRole.USER}>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Usuário
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={handleInviteUser} className="flex-1">
                      Enviar Convite
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowInviteDialog(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </PermissionGuard>
        </div>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Carregando usuários...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {users.map((targetUser) => (
              <div key={targetUser.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    {getRoleIcon(targetUser.role)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{targetUser.name}</span>
                      <Badge 
                        variant={targetUser.isActive ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {targetUser.isActive ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">{targetUser.email}</div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      {getRoleIcon(targetUser.role)}
                      <span>{getRoleLabel(targetUser.role)}</span>
                      {targetUser.lastLogin && (
                        <span>• Último login: {new Date(targetUser.lastLogin).toLocaleDateString('pt-BR')}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                {canManageUser(targetUser) && (
                  <div className="flex items-center gap-2">
                    <PermissionGuard resource="users" action="update" showFallback={false}>
                      <Select
                        value={targetUser.role}
                        onValueChange={(value: UserRole) => handleUpdateRole(targetUser.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {isSuperAdmin && (
                            <SelectItem value={UserRole.COMPANY_ADMIN}>Admin</SelectItem>
                          )}
                          <SelectItem value={UserRole.USER}>Usuário</SelectItem>
                        </SelectContent>
                      </Select>
                    </PermissionGuard>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleUserStatus(targetUser.id)}
                    >
                      {targetUser.isActive ? (
                        <UserX className="h-4 w-4" />
                      ) : (
                        <UserCheck className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                )}
              </div>
            ))}
            
            {users.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>Nenhum usuário encontrado</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserManagement;