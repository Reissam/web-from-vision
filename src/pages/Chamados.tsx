import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Plus, Search, MoreHorizontal } from 'lucide-react';

interface Ticket {
  id: string;
  client: string;
  subject: string;
  category: string;
  technician: string;
  status: string;
  date: string;
}

export const Chamados: React.FC = () => {
  const [tickets] = useState<Ticket[]>([
    { id: '#1254', client: 'Empresa XYZ', subject: 'Servidor não responde', category: 'Hardware', technician: 'Pendente', status: 'Pendente', date: '23/08/2023' },
    { id: '#1253', client: 'Empresa ABC', subject: 'Instalação de nova impressora', category: 'Hardware', technician: 'Em Andamento', status: 'Em Andamento', date: '22/08/2023' },
    { id: '#1252', client: 'Empresa DEF', subject: 'Configuração de rede Wi-Fi', category: 'Rede', technician: 'Resolvido', status: 'Resolvido', date: '21/08/2023' },
    { id: '#1251', client: 'Empresa XYZ', subject: 'Atualização de software ERP', category: 'Software', technician: 'Resolvido', status: 'Resolvido', date: '20/08/2023' },
    { id: '#1250', client: 'Empresa ABC', subject: 'Problema com email', category: 'Software', technician: 'Pendente', status: 'Pendente', date: '19/08/2023' },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
              <DialogTitle>Novo Chamado</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Cliente</label>
                <Input placeholder="Digite para buscar cliente" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Tipo de Chamado</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hardware">Hardware</SelectItem>
                      <SelectItem value="software">Software</SelectItem>
                      <SelectItem value="rede">Rede</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Descrição do Chamado</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a descrição" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="servidor">Problema com servidor</SelectItem>
                      <SelectItem value="impressora">Instalação de impressora</SelectItem>
                      <SelectItem value="email">Problema com email</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Técnico Responsável</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o técnico responsável" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="joao">João Silva</SelectItem>
                    <SelectItem value="maria">Maria Santos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Defeito Informado</label>
                <Textarea placeholder="Descreva o problema informado pelo cliente" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Defeito Constatado</label>
                <Textarea placeholder="Descreva o problema constatado pelo técnico" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Serviço Executado</label>
                <Textarea placeholder="Descreva o serviço realizado" />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-3 block">Status do Chamado</label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="pendente" />
                    <Label htmlFor="pendente">Pendente</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="andamento" />
                    <Label htmlFor="andamento">Em Andamento</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="resolvido" />
                    <Label htmlFor="resolvido">Resolvido</Label>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Prioridade do Chamado</label>
                <Select>
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
                  <Input type="time" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Hora Saída</label>
                  <Input type="time" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Data</label>
                <Input type="date" />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Salvar
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
                      <Button variant="outline" size="sm">Detalhes</Button>
                      <Button variant="outline" size="sm">Editar</Button>
                      <Button variant="outline" size="sm">Excluir</Button>
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
