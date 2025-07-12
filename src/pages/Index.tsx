import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Dashboard } from './Dashboard';
import { Chamados } from './Chamados';
import { Clientes } from './Clientes';
import { Usuarios } from './Usuarios';
import { Login } from './Login';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const [activeRoute, setActiveRoute] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, login, logout } = useAuth();

  const handleLogin = (userData: any) => {
    login(userData);
    toast.success(`Bem-vindo, ${userData.name}!`);
  };

  const handleLogout = () => {
    logout();
    setActiveRoute('dashboard');
    toast.success('Logout realizado com sucesso!');
  };

  const { canManageUsers, canManageClients } = useAuth();

  const renderContent = () => {
    switch (activeRoute) {
      case 'dashboard':
        return <Dashboard />;
      case 'chamados':
        return <Chamados />;
      case 'clientes':
        return canManageClients() ? <Clientes /> : <Dashboard />;
      case 'usuarios':
        return canManageUsers() ? <Usuarios /> : <Dashboard />;
      default:
        return <Dashboard />;
    }
  };

  // Se não estiver logado, mostrar página de login
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        activeRoute={activeRoute}
        onNavigate={setActiveRoute}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className="flex-1 overflow-auto">
        {/* Header com informações do usuário */}
        <div className="bg-white border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-600">Logado como:</span>
                <span className="font-medium text-gray-900">{user.name}</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {user.role}
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center space-x-2"
            >
              <LogOut size={16} />
              <span>Sair</span>
            </Button>
          </div>
        </div>
        
        {/* Conteúdo principal */}
        <div className="flex-1">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Index;
