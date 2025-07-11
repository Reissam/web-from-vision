import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Plus, Search, MoreHorizontal } from 'lucide-react';
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
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
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
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (error) {
      console.error('Erro ao buscar chamados:', error);
      toast.error('Erro ao carregar chamados');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      toast.error('Erro ao carregar clientes');
    }
  };

  // Converter clientes para formato do Combobox
  const clientOptions = clients.map(client => ({
    value: client.name,
    label: `${client.name} - ${client.city}`
  }));

  // Filtrar tickets baseado na busca e status
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
    
    // Encontrar o cliente selecionado
    const client = clients.find(c => c.name === ticket.client);
    setSelectedClient(client || null);
    
    setIsDialogOpen(true);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Quando o cliente for alterado, atualizar as informações do cliente
    if (field === 'client') {
      const client = clients.find(c => c.name === value);
      setSelectedClient(client || null);
    }
  };

  const handleDelete = async (ticket: Ticket) => {
    if (window.confirm(`Tem certeza que deseja excluir o chamado ${ticket.id}?`)) {
      try {
        const { error } = await supabase
          .from('tickets')
          .delete()
          .eq('id', ticket.id);

        if (error) throw error;
        
        toast.success('Chamado excluído com sucesso');
        fetchTickets();
      } catch (error) {
        console.error('Erro ao excluir chamado:', error);
        toast.error('Erro ao excluir chamado');
      }
    }
  };

  const validateForm = () => {
    const requiredFields = ['client', 'type', 'reportedIssue', 'technician', 'status', 'date'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      toast.error('Preencha todos os campos obrigatórios');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
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
        // Atualizar chamado existente
        const { error } = await supabase
          .from('tickets')
          .update(ticketData)
          .eq('id', selectedTicket.id);

        if (error) throw error;
        toast.success('Chamado atualizado com sucesso');
      } else {
        // Criar novo chamado
        const { error } = await supabase
          .from('tickets')
          .insert([{
            ...ticketData,
            created_at: new Date().toISOString()
          }]);

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
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedTicket(null);
    setSelectedClient(null);
    setFormData({
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
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6">
      <style jsx>{`
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          @page {
            size: A4;
            margin: 15mm;
          }
          
          body {
            font-size: 12px;
            line-height: 1.4;
          }
          
          .no-print {
            display: none !important;
          }
          
          .print-area {
            page-break-inside: avoid;
          }
          
          .print-signatures {
            margin-top: 80px !important;
            page-break-inside: avoid;
          }
          
          .print-field {
            margin-bottom: 8px;
          }
          
          .print-field label {
            font-weight: bold;
            font-size: 11px;
          }
          
          .print-field p, .print-field div {
            font-size: 12px;
            margin-top: 2px;
          }
          
          .print-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
          }
          
          .print-full-width {
            grid-column: 1 / -1;
          }
          
          .print-header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
          }
          
          .print-signature-area {
            border-top: 1px solid #000;
            text-align: center;
            padding-top: 5px;
            margin-top: 40px;
          }
        }
      `}</style>
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chamados</h1>
          <p className="text-gray-600">Gerencie todos os chamados técnicos</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus size={16} className="mr-2" />
              Novo Chamado
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedTicket ? 'Editar Chamado' : 'Novo Chamado'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 print-area">
              <div className="print-header no-print">
                <h2 className="text-xl font-bold">Ordem de Serviço</h2>
              </div>
              
              <div className="print-grid">
                <div className="print-field">
                  <label className="text-sm font-medium text-gray-700">Cliente *</label>
                  <div className="no-print">
                    <Combobox
                      options={clientOptions}
                      value={formData.client}
                      onValueChange={(value) => handleInputChange('client', value)}
                      placeholder="Digite para buscar cliente..."
                      searchPlaceholder="Buscar cliente..."
                      emptyText="Nenhum cliente encontrado."
                    />
                  </div>
                  <div className="print-only">
                    <p className="text-sm text-gray-900 border-b border-gray-300 pb-1">
                      {formData.client || '_________________________'}
                    </p>
                  </div>
                </div>
                
                <div className="print-field">
                  <label className="text-sm font-medium text-gray-700">Nº de OS</label>
                  <div className="no-print">
                    <Input 
                      placeholder="Digite o número da OS" 
                      value={formData.osNumber}
                      onChange={(e) => handleInputChange('osNumber', e.target.value)}
                    />
                  </div>
                  <div className="print-only">
                    <p className="text-sm text-gray-900 border-b border-gray-300 pb-1">
                      {formData.osNumber || '_________________________'}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Informações do cliente */}
              {selectedClient && (
                <div className="print-field print-full-width">
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg border print-grid">
                    <div className="print-field">
                      <span className="font-medium text-gray-700">Nome:</span>
                      <p className="text-gray-900">{selectedClient.name}</p>
                    </div>
                    <div className="print-field">
                      <span className="font-medium text-gray-700">Cidade:</span>
                      <p className="text-gray-900">{selectedClient.city}</p>
                    </div>
                    <div className="print-field">
                      <span className="font-medium text-gray-700">Telefone:</span>
                      <p className="text-gray-900">{selectedClient.phone || 'Não informado'}</p>
                    </div>
                    <div className="print-field">
                      <span className="font-medium text-gray-700">E-mail:</span>
                      <p className="text-gray-900">{selectedClient.email || 'Não informado'}</p>
                    </div>
                    <div className="print-field print-full-width">
                      <span className="font-medium text-gray-700">Endereço:</span>
                      <p className="text-gray-900">{selectedClient.address || 'Não informado'}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="print-grid">
                <div className="print-field">
                  <label className="text-sm font-medium text-gray-700">Tipo de Chamado *</label>
                  <div className="no-print">
                    <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Preventiva">Manutenção Preventiva</SelectItem>
                        <SelectItem value="Corretiva">Manutenção Corretiva</SelectItem>
                        <SelectItem value="Instalação">Instalação</SelectItem>
                        <SelectItem value="Manutenção">Manutenção Corretiva e Preventiva</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="print-only">
                    <p className="text-sm text-gray-900 border-b border-gray-300 pb-1">
                      {formData.type || '_________________________'}
                    </p>
                  </div>
                </div>
                
                <div className="print-field">
                  <label className="text-sm font-medium text-gray-700">Técnico Responsável *</label>
                  <div className="no-print">
                    <Select value={formData.technician} onValueChange={(value) => handleInputChange('technician', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o técnico responsável" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="joao">João Silva</SelectItem>
                        <SelectItem value="maria">Maria Santos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="print-only">
                    <p className="text-sm text-gray-900 border-b border-gray-300 pb-1">
                      {formData.technician || '_________________________'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="print-field print-full-width">
                <label className="text-sm font-medium text-gray-700">Defeito Informado *</label>
                <div className="no-print">
                  <Textarea 
                    placeholder="Descreva o problema informado pelo cliente"
                    value={formData.reportedIssue}
                    onChange={(e) => handleInputChange('reportedIssue', e.target.value)}
                  />
                </div>
                <div className="print-only">
                  <p className="text-sm text-gray-900 border-b border-gray-300 pb-1 min-h-[60px]">
                    {formData.reportedIssue || '________________________________________________________________________'}
                  </p>
                </div>
              </div>
              
              <div className="print-field print-full-width">
                <label className="text-sm font-medium text-gray-700">Defeito Constatado</label>
                <div className="no-print">
                  <Textarea 
                    placeholder="Descreva o problema constatado pelo técnico"
                    value={formData.confirmedIssue}
                    onChange={(e) => handleInputChange('confirmedIssue', e.target.value)}
                  />
                </div>
                <div className="print-only">
                  <p className="text-sm text-gray-900 border-b border-gray-300 pb-1 min-h-[60px]">
                    {formData.confirmedIssue || '________________________________________________________________________'}
                  </p>
                </div>
              </div>
              
              <div className="print-field print-full-width">
                <label className="text-sm font-medium text-gray-700">Serviço Executado</label>
                <div className="no-print">
                  <Textarea 
                    placeholder="Descreva o serviço realizado"
                    value={formData.servicePerformed}
                    onChange={(e) => handleInputChange('servicePerformed', e.target.value)}
                  />
                </div>
                <div className="print-only">
                  <p className="text-sm text-gray-900 border-b border-gray-300 pb-1 min-h-[60px]">
                    {formData.servicePerformed || '________________________________________________________________________'}
                  </p>
                </div>
              </div>
              
              <div className="print-grid">
                <div className="print-field no-print">
                  <label className="text-sm font-medium text-gray-700 mb-3 block">Status do Chamado *</label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="pendente" 
                        checked={formData.status === 'Pendente'}
                        onCheckedChange={(checked) => handleInputChange('status', checked ? 'Pendente' : '')}
                      />
                      <Label htmlFor="pendente">Pendente</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="andamento" 
                        checked={formData.status === 'Em Andamento'}
                        onCheckedChange={(checked) => handleInputChange('status', checked ? 'Em Andamento' : '')}
                      />
                      <Label htmlFor="andamento">Em Andamento</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="resolvido" 
                        checked={formData.status === 'Resolvido'}
                        onCheckedChange={(checked) => handleInputChange('status', checked ? 'Resolvido' : '')}
                      />
                      <Label htmlFor="resolvido">Resolvido</Label>
                    </div>
                  </div>
                </div>

                <div className="print-field no-print">
                  <label className="text-sm font-medium text-gray-700">Prioridade do Chamado</label>
                  <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a prioridade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baixa">Baixa</SelectItem>
                      <SelectItem value="media">Média</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="urgente">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="print-grid">
                <div className="print-field">
                  <label className="text-sm font-medium text-gray-700">Hora Chegada</label>
                  <div className="no-print">
                    <Input 
                      type="time" 
                      value={formData.arrivalTime}
                      onChange={(e) => handleInputChange('arrivalTime', e.target.value)}
                    />
                  </div>
                  <div className="print-only">
                    <p className="text-sm text-gray-900 border-b border-gray-300 pb-1">
                      {formData.arrivalTime || '_____________'}
                    </p>
                  </div>
                </div>
                
                <div className="print-field">
                  <label className="text-sm font-medium text-gray-700">Hora Saída</label>
                  <div className="no-print">
                    <Input 
                      type="time" 
                      value={formData.departureTime}
                      onChange={(e) => handleInputChange('departureTime', e.target.value)}
                    />
                  </div>
                  <div className="print-only">
                    <p className="text-sm text-gray-900 border-b border-gray-300 pb-1">
                      {formData.departureTime || '_____________'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="print-field">
                <label className="text-sm font-medium text-gray-700">Data *</label>
                <div className="no-print">
                  <Input 
                    type="date" 
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                  />
                </div>
                <div className="print-only">
                  <p className="text-sm text-gray-900 border-b border-gray-300 pb-1">
                    {formData.date || '_________________________'}
                  </p>
                </div>
              </div>

              {/* Espaço maior antes das assinaturas */}
              <div className="print-signatures">
                <div className="grid grid-cols-2 gap-8 mt-20">
                  <div className="flex flex-col items-center">
                    <div className="w-full print-signature-area">
                      <span className="text-sm text-gray-600">Assinatura do Técnico</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-full print-signature-area">
                      <span className="text-sm text-gray-600">Assinatura do Cliente</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-10 no-print">
                <Button variant="outline" onClick={handlePrint}>
                  Imprimir
                </Button>
                <Button variant="outline" onClick={handleCloseDialog}>
                  Cancelar
                </Button>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700" 
                  onClick={handleSave}
                  disabled={isLoading}
                >
                  {isLoading ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    
      <div className="bg-white rounded-lg border border-border">
        <div className="p-4 border-b border-border">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input 
                  placeholder="Buscar por cliente, assunto..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="Pendente">Pendente</SelectItem>
                <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                <SelectItem value="Resolvido">Resolvido</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assunto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Técnico</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    Carregando...
                  </td>
                </tr>
              ) : filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    Nenhum chamado encontrado
                  </td>
                </tr>
              ) : (
                filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ticket.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.client}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{ticket.subject}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.technician}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewDetails(ticket)}
                        >
                          Detalhes
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEdit(ticket)}
                        >
                          Editar
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDelete(ticket)}
                        >
                          Excluir
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
