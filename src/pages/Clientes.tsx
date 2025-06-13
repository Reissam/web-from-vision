import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search } from 'lucide-react';

interface Client {
  id: string;
  name: string;
  unit: string;
  phone: string;
  email: string;
  city: string;
  activeTickets: number;
}

export const Clientes: React.FC = () => {
  const [clients] = useState<Client[]>([
    { id: '1', name: 'Empresa XYZ', unit: '12.345.678/0001-90', phone: '(11) 3456-7890', email: 'contato@xyz.com.br', city: 'São Paulo', activeTickets: 5 },
    { id: '2', name: 'Empresa ABC', unit: '98.765.432/0001-21', phone: '(11) 2345-6789', email: 'contato@abc.com.br', city: 'Rio de Janeiro', activeTickets: 3 },
    { id: '3', name: 'Empresa DEF', unit: '45.678.901/0001-23', phone: '(31) 3456-7890', email: 'contato@def.com.br', city: 'Belo Horizonte', activeTickets: 2 },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
              <DialogTitle>Novo Cliente</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Nome da Empresa</label>
                <Input placeholder="Nome da empresa" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Unidade</label>
                  <Input placeholder="Unidade" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Telefone</label>
                  <Input placeholder="(00) 0000-0000" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <Input placeholder="contato@empresa.com" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Endereço</label>
                <Input placeholder="Rua, número, bairro" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Cidade</label>
                  <Input placeholder="Cidade" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Estado</label>
                  <Input placeholder="UF" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">CEP</label>
                  <Input placeholder="00000-000" />
                </div>
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
            <tbody className="bg-white divide-y divide-gray-200">
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
                      <Button variant="outline" size="sm">Detalhes</Button>
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
