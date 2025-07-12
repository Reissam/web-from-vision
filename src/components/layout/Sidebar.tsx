
import React from 'react';
import { 
  LayoutDashboard, 
  Ticket, 
  Users, 
  UserCog,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  activeRoute: string;
  onNavigate: (route: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeRoute,
  onNavigate,
  collapsed,
  onToggleCollapse
}) => {
  const { user, canManageUsers, canManageClients } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', route: 'dashboard' },
    { icon: Ticket, label: 'Chamados', route: 'chamados' },
    ...(canManageClients() ? [{ icon: Users, label: 'Clientes', route: 'clientes' }] : []),
    ...(canManageUsers() ? [{ icon: UserCog, label: 'Usuários', route: 'usuarios' }] : []),
  ];
  return (
    <div className={cn(
      "bg-white border-r border-border h-screen transition-all duration-300 flex flex-col",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!collapsed && (
          <h1 className="text-xl font-bold text-blue-600">TecnoChamados</h1>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.route}
              onClick={() => onNavigate(item.route)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-lg mb-1 transition-colors text-left",
                activeRoute === item.route
                  ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              )}
            >
              <Icon size={20} />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* User Info */}
      {!collapsed && user && user.name && (
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-sm font-semibold">
                {user.name
                  ? user.name.split(' ').map(n => n[0]).join('').toUpperCase()
                  : ''}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">{user.role}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
