import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search } from 'lucide-react';
import { supabase, Client } from '@/lib/supabase';
import { toast } from 'sonner';

export const Clientes: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    unit: '',
    phone: '',
    email: '',
    city: '',
    state: '',
    cep: ''
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      toast.error('Erro ao carregar clientes');
    }
  };

  const handleEdit = (client: Client) => {
    setSelectedClient(client);
    setFormData({
      name: client.name,
      unit: client.unit,
      phone: client.phone,
      email: client.email,
      city: client.city,
      state: client.state || '',
      cep: client.cep || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (client: Client) => {
    if (window.confirm(`Tem certeza que deseja excluir o cliente ${client.name}?`)) {
      try {
        const { error } = await supabase
          .from('clients')
          .delete()
          .eq('id', client.id);

        if (error) throw error;
        
        toast.success('Cliente excluído com sucesso');
        fetchClients();
      } catch (error) {
        console.error('Erro ao excluir cliente:', error);
        toast.error('Erro ao excluir cliente');
      }
    }
  };

  const handleSave = async () => {
    try {
      const clientData = {
        name: formData.name,
        unit: formData.unit,
        phone: formData.phone,
        email: formData.email,
        city: formData.city,
        state: formData.state,
        cep: formData.cep,
        active_tickets: 0,
        updated_at: new Date().toISOString()
      };

      if (selectedClient) {
        // Atualizar cliente existente
        const { error } = await supabase
          .from('clients')
          .update(clientData)
          .eq('id', selectedClient.id);

        if (error) throw error;
        toast.success('Cliente atualizado com sucesso');
      } else {
        // Criar novo cliente
        const { error } = await supabase
          .from('clients')
          .insert([{
            ...clientData,
            created_at: new Date().toISOString()
          }]);

        if (error) throw error;
        toast.success('Cliente criado com sucesso');
      }

      setIsDialogOpen(false);
      setSelectedClient(null);
      fetchClients();
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      toast.error('Erro ao salvar cliente');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-600">Gerencie seus clientes</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus size={16} className="mr-2" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedClient ? 'Editar Cliente' : 'Novo Cliente'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Nome do Cliente</label>
                <Input 
                  placeholder="Nome do Cliente" 
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Unidade de Atendimento</label>
                <Input 
                  placeholder="Nome da Unidade" 
                  value={formData.unit}
                  onChange={(e) => handleInputChange('unit', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Númro da Agência</label>
                <Input 
                  placeholder="000000" 
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
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
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Cidade</label>
                  <Input 
                    placeholder="Cidade" 
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Estado</label>
                  <Input 
                    placeholder="UF" 
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">CEP</label>
                  <Input 
                    placeholder="00000-000" 
                    value={formData.cep}
                    onChange={(e) => handleInputChange('cep', e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => {
                  setIsDialogOpen(false);
                  setSelectedClient(null);
                  setFormData({
                    name: '',
                    unit: '',
                    phone: '',
                    email: '',
                    city: '',
                    state: '',
                    cep: ''
                  });
                }}>
                  Cancelar
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSave}>
                  Salvar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unidade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cidade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chamados Ativos</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{client.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{client.unit}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">{client.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">{client.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{client.city}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{client.activeTickets}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEdit(client)}
                      >
                        Editar
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDelete(client)}
                      >
                        Excluir
                      </Button>
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
