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

  const clientOptions = clients.map(client => ({
    value: client.name,
    label: `${client.name} - ${client.city}`
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pendente': return 'bg-orange-100 text-orange-800';
      case 'Em Andamento': return 'bg-blue-100 text-blue-800';
      case 'Resolvido': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'client') {
      const client = clients.find(c => c.name === value);
      setSelectedClient(client || null);
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

  /** ✅ Bloco Assinaturas + Botões */
  const AssinaturasEBotoes = () => (
    <>
      <div className="mt-12 grid grid-cols-2 gap-4">
        <div className="flex flex-col items-center">
          <div className="w-full border-t border-gray-400 mb-1"></div>
          <span className="text-xs text-gray-600">Assinatura do Técnico</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-full border-t border-gray-400 mb-1"></div>
          <span className="text-xs text-gray-600">Assinatura do Cliente</span>
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-10 no-print">
        <Button variant="outline" onClick={() => window.print()}>Imprimir</Button>
        <Button variant="outline" onClick={handleCloseDialog}>Cancelar</Button>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSave}>Salvar</Button>
      </div>
    </>
  );

  return (
    <div className="p-6">
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
              {/* ✅ Campos do formulário resumidos para exemplo */}
              <Combobox
                options={clientOptions}
                value={formData.client}
                onValueChange={(value) => handleInputChange('client', value)}
                placeholder="Selecione o cliente"
              />
              <Input placeholder="Nº de OS" value={formData.osNumber} onChange={(e) => handleInputChange('osNumber', e.target.value)} />
              <Textarea placeholder="Descrição do chamado" value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} />
              {/* ... (demais campos que você já tinha) */}
              {/* ✅ Inserir o bloco de assinaturas + botões */}
              <AssinaturasEBotoes />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* ✅ Busca e filtro */}
      <div className="flex gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <Input placeholder="Buscar por cliente, assunto..." className="pl-10" />
        </div>
        <Select>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="pendente">Pendente</SelectItem>
            <SelectItem value="andamento">Em Andamento</SelectItem>
            <SelectItem value="resolvido">Resolvido</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ✅ Tabela */}
      <div className="overflow-x-auto bg-white rounded-lg border">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assunto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoria</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Técnico</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {tickets.map(ticket => (
              <tr key={ticket.id}>
                <td className="px-6 py-4 text-sm">{ticket.id}</td>
                <td className="px-6 py-4 text-sm">{ticket.client}</td>
                <td className="px-6 py-4 text-sm">{ticket.subject}</td>
                <td className="px-6 py-4 text-sm">{ticket.category}</td>
                <td className="px-6 py-4 text-sm">{ticket.technician}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                    {ticket.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">{ticket.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
