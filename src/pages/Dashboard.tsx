
import React from 'react';
import { StatCard } from '@/components/ui/stat-card';
import { TicketChart } from '@/components/charts/TicketChart';
import { Ticket, Clock, CheckCircle, Users } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const recentTickets = [
    { id: '#1254', client: 'Empresa XYZ', subject: 'Servidor não responde', status: 'Pendente', date: '23/08/2023' },
    { id: '#1253', client: 'Empresa ABC', subject: 'Instalação de nova impressora', status: 'Em Andamento', date: '22/08/2023' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Visão geral do sistema</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Chamados Abertos"
          value="42"
          icon={Ticket}
          color="blue"
        />
        <StatCard
          title="Em Andamento"
          value="28"
          icon={Clock}
          color="orange"
        />
        <StatCard
          title="Finalizados"
          value="156"
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Total de Clientes"
          value="18"
          icon={Users}
          color="purple"
        />
      </div>

      {/* Charts and Recent Tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TicketChart />
        
        <div className="bg-white rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Chamados Recentes</h3>
          <div className="space-y-4">
            {recentTickets.map((ticket) => (
              <div key={ticket.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{ticket.id}</p>
                  <p className="text-sm text-gray-600">{ticket.client}</p>
                  <p className="text-sm text-gray-500">{ticket.subject}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    ticket.status === 'Pendente' 
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {ticket.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{ticket.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
