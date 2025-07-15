import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Plus, Search, MoreHorizontal } from 'lucide-react';
import { supabase, Ticket, Client } from '@/lib/supabase';
import { toast } from 'sonner';
import { Combobox } from '@/components/ui/combobox';
import { useAuth } from '@/contexts/AuthContext';

export const Chamados: React.FC = () => {
  const { canEditTickets, canDeleteTickets } = useAuth();
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
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (error) {
      console.error('Erro ao buscar chamados:', error);
      toast.error('Erro ao carregar chamados');
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
    // Criar uma nova janela para impressão
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    // Obter os valores dos campos
    const printData = {
      cliente: formData.client,
      osNumber: formData.osNumber,
      tipo: formData.type,
      tecnico: formData.technician,
      descricao: formData.description,
      defeitoInformado: formData.reportedIssue,
      defeitoConstatado: formData.confirmedIssue,
      servicoExecutado: formData.servicePerformed,
      status: formData.status,
      prioridade: formData.priority,
      horaChegada: formData.arrivalTime,
      horaSaida: formData.departureTime,
      data: formData.date
    };

    // Informações do cliente selecionado
    const clienteInfo = selectedClient ? {
      nome: selectedClient.name,
      cidade: selectedClient.city,
      telefone: selectedClient.phone || 'Não informado',
      email: selectedClient.email || 'Não informado',
      unidade: selectedClient.unit || 'Não informado'
    } : null;

    // HTML para impressão
    const printHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Chamado Técnico - Impressão</title>
        <style>
          @media print {
            body { margin: 0; padding: 15px; font-family: Arial, sans-serif; }
            .no-print { display: none !important; }
            .print-header { text-align: center; margin-bottom: 15px; border-bottom: 1px solid #000; padding-bottom: 5px; }
            .print-title { font-size: 18px; font-weight: bold; margin-bottom: 5px; }
            .print-subtitle { font-size: 12px; color: #666; }
            .field-group { margin-bottom: 12px; }
            .field-label { font-weight: bold; font-size: 11px; color: #333; margin-bottom: 3px; }
            .field-value { font-size: 11px; color: #000; margin-bottom: 8px; padding: 4px; border: 1px solid #ddd; background-color: #f9f9f9; min-height: 16px; }
            .field-value:empty::after { content: "Não preenchido"; color: #999; font-style: italic; }
            .two-columns { display: flex; gap: 15px; }
            .column { flex: 1; }
            .signature-section { margin-top: 20px; display: flex; justify-content: space-between; }
            .signature-box { width: 45%; text-align: center; }
            .signature-line { border-top: 1px solid #000; margin-top: 30px; padding-top: 3px; font-size: 10px; }
            .page-break { page-break-before: always; }
          }
        </style>
      </head>
      <body>
        <div class="print-header">
          <div class="print-title">CHAMADO TÉCNICO</div>
          <div class="print-subtitle">Sistema de Gerenciamento de Chamados</div>
        </div>

        <div class="field-group">
          <div class="field-label">CLIENTE:</div>
          <div class="field-value">${printData.cliente || 'Não selecionado'}</div>
        </div>

        ${clienteInfo ? `
        <div class="field-group">
          <div class="field-label">INFORMAÇÕES DO CLIENTE:</div>
          <div class="two-columns">
            <div class="column">
              <div class="field-label">Nome:</div>
              <div class="field-value">${clienteInfo.nome}</div>
            </div>
            <div class="column">
              <div class="field-label">Cidade:</div>
              <div class="field-value">${clienteInfo.cidade}</div>
            </div>
          </div>
          <div class="two-columns">
            <div class="column">
              <div class="field-label">Telefone:</div>
              <div class="field-value">${clienteInfo.telefone}</div>
            </div>
            <div class="column">
              <div class="field-label">E-mail:</div>
              <div class="field-value">${clienteInfo.email}</div>
            </div>
          </div>
          <div class="field-label">Unidade:</div>
          <div class="field-value">${clienteInfo.unidade}</div>
        </div>
        ` : ''}

        <div class="two-columns">
          <div class="column">
            <div class="field-label">Nº DE OS:</div>
            <div class="field-value">${printData.osNumber}</div>
          </div>
          <div class="column">
            <div class="field-label">DATA:</div>
            <div class="field-value">${printData.data}</div>
          </div>
        </div>

        <div class="two-columns">
          <div class="column">
            <div class="field-label">TIPO DE CHAMADO:</div>
            <div class="field-value">${printData.tipo}</div>
          </div>
          <div class="column">
            <div class="field-label">TÉCNICO RESPONSÁVEL:</div>
            <div class="field-value">${printData.tecnico}</div>
          </div>
        </div>

        <div class="field-group">
          <div class="field-label">DESCRIÇÃO DO CHAMADO:</div>
          <div class="field-value">${printData.descricao}</div>
        </div>

        <div class="field-group">
          <div class="field-label">DEFEITO INFORMADO:</div>
          <div class="field-value">${printData.defeitoInformado}</div>
        </div>

        <div class="field-group">
          <div class="field-label">DEFEITO CONSTATADO:</div>
          <div class="field-value">${printData.defeitoConstatado}</div>
        </div>

        <div class="field-group">
          <div class="field-label">SERVIÇO EXECUTADO:</div>
          <div class="field-value">${printData.servicoExecutado}</div>
        </div>

        <div class="two-columns">
          <div class="column">
            <div class="field-label">STATUS:</div>
            <div class="field-value">${printData.status}</div>
          </div>
          <div class="column">
            <div class="field-label">PRIORIDADE:</div>
            <div class="field-value">${printData.prioridade}</div>
          </div>
        </div>

        <div class="two-columns">
          <div class="column">
            <div class="field-label">HORA CHEGADA:</div>
            <div class="field-value">${printData.horaChegada}</div>
          </div>
          <div class="column">
            <div class="field-label">HORA SAÍDA:</div>
            <div class="field-value">${printData.horaSaida}</div>
          </div>
        </div>

        <div class="signature-section">
          <div class="signature-box">
            <div class="signature-line">Assinatura do Técnico</div>
          </div>
          <div class="signature-box">
            <div class="signature-line">Assinatura do Cliente</div>
          </div>
        </div>

        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() {
              window.close();
            };
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(printHTML);
    printWindow.document.close();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chamados</h1>
          <p className="text-gray-600">Gerencie todos os chamados técnicos</p>
        </div>
        {canEditTickets() && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus size={16} className="mr-2" />
                Novo Chamado
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" aria-describedby="descricao-dialogo-chamado">
            <DialogHeader>
              <DialogTitle>{selectedTicket ? 'Editar Chamado' : 'Novo Chamado'}</DialogTitle>
              <DialogDescription id="descricao-dialogo-chamado">
                Preencha os dados do chamado e salve para registrar ou atualizar.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Cliente</label>
                <Combobox
                  options={clientOptions}
                  value={formData.client}
                  onValueChange={(value) => handleInputChange('client', value)}
                  placeholder="Digite para buscar cliente..."
                  searchPlaceholder="Buscar cliente..."
                  emptyText="Nenhum cliente encontrado."
                />
                
                {/* Informações do cliente */}
                {selectedClient && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg border">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Nome:</span>
                        <p className="text-gray-900">{selectedClient.name}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Cidade:</span>
                        <p className="text-gray-900">{selectedClient.city}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Telefone:</span>
                        <p className="text-gray-900">{selectedClient.phone || 'Não informado'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">E-mail:</span>
                        <p className="text-gray-900">{selectedClient.email || 'Não informado'}</p>
                      </div>
                      <div className="col-span-2">
                        <span className="font-medium text-gray-700">Unidade:</span>
                        <p className="text-gray-900">{selectedClient.unit || 'Não informado'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Nº de OS</label>
                <Input 
                  placeholder="Digite o número da OS" 
                  value={formData.osNumber}
                  onChange={(e) => handleInputChange('osNumber', e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Tipo de Chamado</label>
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
              
              <div>
                <label className="text-sm font-medium text-gray-700">Técnico Responsável</label>
                <Select value={formData.technician} onValueChange={(value) => handleInputChange('technician', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o técnico responsável" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="João Silva">João Silva</SelectItem>
                    <SelectItem value="Maria Santos">Maria Santos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Campo 1: Descrição do Chamado (campo independente) */}
              <div>
                <label className="text-sm font-medium text-gray-700">Descrição do Chamado</label>
                <Textarea 
                  placeholder="Descreva brevemente o chamado (assunto)"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              </div>
              
              {/* Campo 2: Defeito Informado (campo independente) */}
              <div>
                <label className="text-sm font-medium text-gray-700">Defeito Informado</label>
                <Textarea 
                  placeholder="Descreva o problema informado pelo cliente"
                  value={formData.reportedIssue}
                  onChange={(e) => handleInputChange('reportedIssue', e.target.value)}
                />
              </div>
              
              {/* Campo 3: Defeito Constatado (campo independente) */}
              <div>
                <label className="text-sm font-medium text-gray-700">Defeito Constatado</label>
                <Textarea 
                  placeholder="Descreva o problema constatado pelo técnico"
                  value={formData.confirmedIssue}
                  onChange={(e) => handleInputChange('confirmedIssue', e.target.value)}
                />
              </div>
              
              {/* Campo 4: Serviço Executado (campo independente) */}
              <div>
                <label className="text-sm font-medium text-gray-700">Serviço Executado</label>
                <Textarea 
                  placeholder="Descreva o serviço realizado"
                  value={formData.servicePerformed}
                  onChange={(e) => handleInputChange('servicePerformed', e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-3 block">Status do Chamado</label>
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

              <div>
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Hora Chegada</label>
                  <Input 
                    type="time" 
                    value={formData.arrivalTime}
                    onChange={(e) => handleInputChange('arrivalTime', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Hora Saída</label>
                  <Input 
                    type="time" 
                    value={formData.departureTime}
                    onChange={(e) => handleInputChange('departureTime', e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Data</label>
                <Input 
                  type="date" 
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                />
              </div>

              {/* Áreas de assinatura */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="flex flex-col items-center">
                  <div className="w-full border-t border-gray-400 mb-1"></div>
                  <span className="text-xs text-gray-600">Assinatura do Técnico</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-full border-t border-gray-400 mb-1"></div>
                  <span className="text-xs text-gray-600">Assinatura do Cliente</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={handlePrint}>
                  Imprimir
                </Button>
                <Button variant="outline" onClick={handleCloseDialog}>
                  Cancelar
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSave}>
                  Salvar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        )}
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input placeholder="Buscar por cliente, assunto..." className="pl-10" />
              </div>
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
              {tickets.map((ticket) => (
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
                      {canEditTickets() && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEdit(ticket)}
                        >
                          Editar
                        </Button>
                      )}
                      {canDeleteTickets() && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDelete(ticket)}
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

      {/* Diálogo de Detalhes */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-2xl" aria-describedby="descricao-dialogo-detalhes">
          <DialogHeader>
            <DialogTitle>Detalhes do Chamado</DialogTitle>
            <DialogDescription id="descricao-dialogo-detalhes">
              Visualize as informações detalhadas do chamado selecionado.
            </DialogDescription>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">ID do Chamado</label>
                  <p className="text-sm text-gray-900">{selectedTicket.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Cliente</label>
                  <p className="text-sm text-gray-900">{selectedTicket.client}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Assunto</label>
                  <p className="text-sm text-gray-900">{selectedTicket.subject}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Categoria</label>
                  <p className="text-sm text-gray-900">{selectedTicket.category}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Técnico</label>
                  <p className="text-sm text-gray-900">{selectedTicket.technician}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <p className={`text-sm ${getStatusColor(selectedTicket.status)} px-2 py-1 rounded-full inline-block`}>
                    {selectedTicket.status}
                  </p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Data</label>
                <p className="text-sm text-gray-900">{selectedTicket.date}</p>
              </div>
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
