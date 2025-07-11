import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Plus, Search } from 'lucide-react';
import { supabase, Ticket, Client } from '@/lib/supabase';
import { toast } from 'sonner';
import { Combobox } from '@/components/ui/combobox';

export const Chamados: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    client: '',
    osNumber: '',
    type: '',
    description: '',
    technician: '',
    reportedIssue: '',
    confirmedIssue: '',
    servicePerformed: '',
    status: '',
    priority: '',
    arrivalTime: '',
    departureTime: '',
    date: ''
  });

  useEffect(() => {
    fetchTickets();
    fetchClients();
  }, []);

  const fetchTickets = async () => {
    try {
      const { data, error } = await supabase.from('tickets').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setTickets(data || []);
    } catch (error) {
      console.error('Erro ao buscar chamados:', error);
      toast.error('Erro ao carregar chamados');
    }
  };

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase.from('clients').select('*').order('name', { ascending: true });
      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      toast.error('Erro ao carregar clientes');
    }
  };

  // Opções do Combobox
  const clientOptions = clients.map(client => ({
    value: client.name,
    label: `${client.name} - ${client.city}`
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pendente':
        return 'bg-orange-100 text-orange-800';
      case 'Em Andamento':
        return 'bg-blue-100 text-blue-800';
      case 'Resolvido':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'client') {
      const client = clients.find(c => c.name === value);
      setSelectedClient(client || null);
    }
  };

  const handleViewDetails = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsDetailsDialogOpen(true);
  };

  const handleEdit = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setFormData({
      client: ticket.client,
      osNumber: ticket.id.replace('#', ''),
      type: ticket.category,
      description: ticket.subject,
      technician: ticket.technician,
      reportedIssue: ticket.reported_issue || '',
      confirmedIssue: ticket.confirmed_issue || '',
      servicePerformed: ticket.service_performed || '',
      status: ticket.status,
      priority: ticket.priority || '',
      arrivalTime: ticket.arrival_time || '',
      departureTime: ticket.departure_time || '',
      date: ticket.date
    });
    const client = clients.find(c => c.name === ticket.client);
    setSelectedClient(client || null);
    setIsDialogOpen(true);
  };

  const handleDelete = async (ticket: Ticket) => {
    if (window.confirm(`Tem certeza que deseja excluir o chamado ${ticket.id}?`)) {
      try {
        const { error } = await supabase.from('tickets').delete().eq('id', ticket.id);
        if (error) throw error;
        toast.success('Chamado excluído com sucesso');
        fetchTickets();
      } catch (error) {
        console.error('Erro ao excluir chamado:', error);
        toast.error('Erro ao excluir chamado');
      }
    }
  };

  const handleSave = async () => {
    try {
      const ticketData = {
        client: formData.client,
        subject: formData.description,
        category: formData.type,
        technician: formData.technician,
        status: formData.status,
        date: formData.date,
        reported_issue: formData.reportedIssue,
        confirmed_issue: formData.confirmedIssue,
        service_performed: formData.servicePerformed,
        priority: formData.priority,
        arrival_time: formData.arrivalTime,
        departure_time: formData.departureTime,
        updated_at: new Date().toISOString()
      };
      if (selectedTicket) {
        const { error } = await supabase.from('tickets').update(ticketData).eq('id', selectedTicket.id);
        if (error) throw error;
        toast.success('Chamado atualizado com sucesso');
      } else {
        const { error } = await supabase.from('tickets').insert([{ ...ticketData, created_at: new Date().toISOString() }]);
        if (error) throw error;
        toast.success('Chamado criado com sucesso');
      }
      setIsDialogOpen(false);
      setSelectedTicket(null);
      setSelectedClient(null);
      fetchTickets();
    } catch (error) {
      console.error('Erro ao salvar chamado:', error);
      toast.error('Erro ao salvar chamado');
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedTicket(null);
    setSelectedClient(null);
    setFormData({
      client: '', osNumber: '', type: '', description: '', technician: '',
      reportedIssue: '', confirmedIssue: '', servicePerformed: '', status: '',
      priority: '', arrivalTime: '', departureTime: '', date: ''
    });
  };

  return (
    <div className="p-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chamados</h1>
          <p className="text-gray-600">Gerencie todos os chamados técnicos</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus size={16} className="mr-2" /> Novo Chamado
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedTicket ? 'Editar Chamado' : 'Novo Chamado'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Campos do formulário */}
              <label className="text-sm font-medium text-gray-700">Cliente</label>
              <Combobox
                options={clientOptions}
                value={formData.client}
                onValueChange={(value) => handleInputChange('client', value)}
                placeholder="Digite para buscar cliente..."
              />
              {/* Informações do cliente */}
              {selectedClient && (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg border">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="font-medium">Nome:</span> {selectedClient.name}</div>
                    <div><span className="font-medium">Cidade:</span> {selectedClient.city}</div>
                    <div><span className="font-medium">Telefone:</span> {selectedClient.phone || 'Não informado'}</div>
                    <div><span className="font-medium">E-mail:</span> {selectedClient.email || 'Não informado'}</div>
                    <div className="col-span-2"><span className="font-medium">Endereço:</span> {selectedClient.address || 'Não informado'}</div>
                  </div>
                </div>
              )}
              {/* Outros campos */}
              <Input placeholder="Nº de OS" value={formData.osNumber} onChange={(e) => handleInputChange('osNumber', e.target.value)} />
              {/* ... (demais campos como mostrado na sua descrição, Textarea, Select, Checkbox etc.) */}
              {/* Bloco assinaturas + botões */}
              <div className="grid grid-cols-2 gap-4 mt-12">
                <div className="flex flex-col items-center">
                  <div className="w-full border-t border-gray-400 mb-1"></div>
                  <span className="text-xs text-gray-600">Assinatura do Técnico</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-full border-t border-gray-400 mb-1"></div>
                  <span className="text-xs text-gray-600">Assinatura do Cliente</span>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-10">
                <Button variant="outline" onClick={() => window.print()}>Imprimir</Button>
                <Button variant="outline" onClick={handleCloseDialog}>Cancelar</Button>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSave}>Salvar</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {/* Aqui segue o restante da tabela, busca, filtros etc. conforme você já tem */}
    </div>
  );
};
