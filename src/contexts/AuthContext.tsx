import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, User } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  canManageUsers: () => boolean;
  canCreateAdmin: () => boolean;
  canDeleteAdmin: () => boolean;
  canEditTickets: () => boolean;
  canDeleteTickets: () => boolean;
  canManageClients: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Verificar permissões baseadas no role do usuário
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;

    switch (user.role) {
      case 'Administrador':
        return true; // Administradores têm todas as permissões
      case 'Gestor':
        // Gestores têm acesso total, exceto criar/excluir administradores
        return permission !== 'create_admin' && permission !== 'delete_admin';
      case 'Técnico':
        // Técnicos só podem visualizar e editar chamados
        return ['view_tickets', 'edit_tickets'].includes(permission);
      default:
        return false;
    }
  };

  const canManageUsers = (): boolean => {
    return hasPermission('manage_users');
  };

  const canCreateAdmin = (): boolean => {
    return hasPermission('create_admin');
  };

  const canDeleteAdmin = (): boolean => {
    return hasPermission('delete_admin');
  };

  const canEditTickets = (): boolean => {
    return hasPermission('edit_tickets');
  };

  const canDeleteTickets = (): boolean => {
    return hasPermission('delete_tickets');
  };

  const canManageClients = (): boolean => {
    return hasPermission('manage_clients');
  };

  // Carregar usuário do localStorage ao inicializar
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const value: AuthContextType = {
    user,
    login,
    logout,
    hasPermission,
    canManageUsers,
    canCreateAdmin,
    canDeleteAdmin,
    canEditTickets,
    canDeleteTickets,
    canManageClients,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 