import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Plus, Search } from 'lucide-react';
import { supabase, User } from '@/lib/supabase';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { sendInviteEmailGmail, sendInviteEmailViaGmailAPI } from '@/services/gmailService';

export const Usuarios: React.FC = () => {
  const { user: currentUser, canManageUsers, canCreateAdmin, canDeleteAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    department: '',
    status: '',
    password: '',
    confirmPassword: ''
  });
  const [isSendingInvite, setIsSendingInvite] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      toast.error('Erro ao carregar usuários');
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      status: user.status,
      password: '',
      confirmPassword: ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (user: User) => {
    if (window.confirm(`Tem certeza que deseja excluir o usuário ${user.name}?`)) {
      try {
        const { error } = await supabase
          .from('users')
          .delete()
          .eq('id', user.id);

        if (error) throw error;
        
        toast.success('Usuário excluído com sucesso');
        fetchUsers();
      } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        toast.error('Erro ao excluir usuário');
      }
    }
  };

  const handleSave = async () => {
    try {
      if (!selectedUser) {
        // Gerar link de convite personalizado
        const inviteData = {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          department: formData.department,
          status: formData.status
        };
        
        // Criar link de convite com dados codificados
        const baseUrl = window.location.origin;
        const inviteLink = `${baseUrl}/invite?data=${encodeURIComponent(JSON.stringify(inviteData))}`;
        
        // Salvar dados do convite na tabela users (com status pendente)
        const userData = {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          department: formData.department,
          status: 'Pendente',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        const { error } = await supabase.from('users').insert([userData]);
        if (error) throw error;
        
        // Mostrar link de convite
        const shouldCopy = window.confirm(
          `Convite criado com sucesso!\n\nLink de convite: ${inviteLink}\n\nDeseja copiar o link para a área de transferência?`
        );
        
        if (shouldCopy) {
          navigator.clipboard.writeText(inviteLink);
          toast.success('Link copiado para a área de transferência!');
        }
        
        toast.success('Convite criado! Envie o link para o usuário.');
      } else {
        // Atualizar usuário existente
        const userData = {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          department: formData.department,
          status: formData.status,
          updated_at: new Date().toISOString()
        };
        const { error } = await supabase.from('users').update(userData).eq('id', selectedUser.id);
        if (error) throw error;
        toast.success('Usuário atualizado com sucesso');
      }
      setIsDialogOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      toast.error('Erro ao salvar usuário');
    }
  };

  const handleSendInvite = async () => {
    if (!formData.email) {
      toast.error('Por favor, insira um endereço de e-mail.');
      return;
    }

    if (!formData.name || !formData.role || !formData.department) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setIsSendingInvite(true);

    try {
      // Gerar link de convite personalizado
      const inviteData = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        department: formData.department,
        status: formData.status
      };
      
      const baseUrl = window.location.origin;
      const inviteLink = `${baseUrl}/invite?data=${encodeURIComponent(JSON.stringify(inviteData))}`;
      
      // Enviar e-mail usando Gmail via backend
      const emailResult = await sendInviteEmailViaGmailAPI({
        name: formData.name,
        email: formData.email,
        role: formData.role,
        department: formData.department,
        inviteLink: inviteLink
      });

      if (!emailResult.success) {
        toast.error(`Erro ao enviar e-mail: ${emailResult.error}`);
        return;
      }

      // Salvar dados do convite na tabela users (com status pendente)
      const userData = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        department: formData.department,
        status: 'Pendente',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { error } = await supabase.from('users').insert([userData]);
      if (error) throw error;
      
      toast.success('Convite enviado com sucesso! Verifique o e-mail do usuário.');
      setIsDialogOpen(false);
      setSelectedUser(null);
      fetchUsers();
      
    } catch (error) {
      console.error('Erro ao enviar convite:', error);
      toast.error('Erro ao enviar convite');
    } finally {
      setIsSendingInvite(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getStatusColor = (status: string) => {
    return status === 'Ativo' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-orange-100 text-orange-800';
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usuários</h1>
          <p className="text-gray-600">Gerencie os usuários do sistema</p>
        </div>
        {canManageUsers() && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus size={16} className="mr-2" />
                Novo Usuário
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-2xl" aria-describedby="descricao-dialogo-usuario">
            <DialogHeader>
              <DialogTitle>{selectedUser ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
              <DialogDescription id="descricao-dialogo-usuario">
                Preencha os dados do usuário e salve para registrar ou atualizar.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Nome</label>
                  <Input 
                    placeholder="Nome completo" 
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <Input 
                    placeholder="email@exemplo.com" 
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Função</label>
                  <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma função" />
                    </SelectTrigger>
                    <SelectContent>
                      {canCreateAdmin() && (
                        <SelectItem value="Administrador">Administrador</SelectItem>
                      )}
                      <SelectItem value="Técnico">Técnico</SelectItem>
                      <SelectItem value="Gestor">Gestor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Departamento</label>
                  <Input 
                    placeholder="Departamento" 
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Status</label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => {
                  setIsDialogOpen(false);
                  setSelectedUser(null);
                  setFormData({
                    name: '',
                    email: '',
                    role: '',
                    department: '',
                    status: '',
                    password: '',
                    confirmPassword: ''
                  });
                }}>
                  Cancelar
                </Button>
                {!selectedUser && (
                  <Button 
                    variant="outline" 
                    onClick={handleSendInvite}
                    disabled={isSendingInvite}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isSendingInvite ? 'Enviando...' : 'Enviar Convite'}
                  </Button>
                )}
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSave}>
                  Salvar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        )}
      </div>

      <div className="bg-white rounded-lg border border-border">
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input placeholder="Buscar por nome, email..." className="pl-10" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Função</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departamento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex gap-2">
                      {canManageUsers() && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEdit(user)}
                        >
                          Editar
                        </Button>
                      )}
                      {canManageUsers() && (user.role !== 'Administrador' || canDeleteAdmin()) && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDelete(user)}
                        >
                          Excluir
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
