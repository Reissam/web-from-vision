import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Plus, Search, MoreHorizontal } from 'lucide-react';

// Mock data para demonstração
const mockTickets = [
  {
    id: '#001',
    client: 'João Silva',
    subject: 'Problema na impressora',
    category: 'Corretiva',
    technician: 'João Silva',
    status: 'Pendente',
    date: '2024-01-15',
    reported_issue: 'Impressora não está imprimindo',
    confirmed_issue: 'Cartucho de tinta vazio',
    service_performed: 'Substituição do cartucho',
    priority: 'media',
    arrival_time: '09:00',
    departure_time: '10:30'
  },
  {
    id: '#002',
    client: 'Maria Santos',
    subject: 'Manutenção preventiva',
    category: 'Preventiva',
    technician: 'Maria Santos',
    status: 'Em Andamento',
    date: '2024-01-16',
    reported_issue: 'Manutenção programada',
    confirmed_issue: 'Limpeza necessária',
    service_performed: 'Limpeza completa do equipamento',
    priority: 'baixa',
    arrival_time: '14:00',
    departure_time: '16:00'
  }
];

const mockClients = [
  { id: 1, name: 'João Silva', city: 'São Paulo', phone: '(11) 99999-9999', email: 'joao@email.com', address: 'Rua A, 123' },
  { id: 2, name: 'Maria Santos', city: 'Rio de Janeiro', phone: '(21) 88888-8888', email: 'maria@email.com', address: 'Rua B, 456' }
];

// Componente Combobox simplificado
const Combobox = ({ options, value, onValueChange, placeholder }) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="relative">
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          setSearchValue(e.target.value);
          onValueChange(e.target.value);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
      />
      {open && filteredOptions.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-40 overflow-y-auto">
          {filteredOptions.map((option) => (
            <div
              key={option.value}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onValueChange(option.value);
                setOpen(false);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function Chamados() {
  const [tickets, setTickets] = useState(mockTickets);
  const [clients, setClients] = useState(mockClients);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
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

  // Converter clientes para formato do Combobox
  const clientOptions = clients.map(client => ({
    value: client.name,
    label: `${client.name} - ${client.city}`
  }));

  const getStatusColor = (status) => {
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

  const handleViewDetails = (ticket) => {
    setSelectedTicket(ticket);
    setIsDetailsDialogOpen(true);
  };

  const handleEdit = (ticket) => {
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

  const handleInputChange = (field, value) => {
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

  const handleDelete = (ticket) => {
    if (window.confirm(`Tem certeza que deseja excluir o chamado ${ticket.id}?`)) {
      setTickets(tickets.filter(t => t.id !== ticket.id));
    }
  };

  const handleSave = () => {
    // Simular salvamento
    console.log('Salvando chamado:', formData);
    setIsDialogOpen(false);
    setSelectedTicket(null);
    setSelectedClient(null);
    handleCloseDialog();
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
              <Plus size={16} className="mr-2" />
              Novo Chamado
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedTicket ? 'Editar Chamado' : 'Novo Chamado'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
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
                        <span className="font-medium text-gray-700">Endereço:</span>
                        <p className="text-gray-900">{selectedClient.address || 'Não informado'}</p>
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
                <Button variant="outline" onClick={() => window.print()}>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Diálogo de Detalhes */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Chamado</DialogTitle>
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
