# Sistema de Gerenciamento de Chamados

Sistema moderno para gerenciamento de chamados técnicos construído com React, TypeScript, Tailwind CSS e Supabase.

## 🚀 Configuração Rápida com MCP

### Pré-requisitos
- Node.js 18+ instalado
- Conta no Supabase (gratuita)

### Configuração Automatizada

1. **Execute o script de configuração:**
   ```bash
   npm run setup:supabase
   ```

2. **O script irá:**
   - ✅ Criar projeto no Supabase
   - ✅ Configurar tabelas (users, clients, tickets)
   - ✅ Inserir dados de exemplo
   - ✅ Configurar variáveis de ambiente
   - ✅ Configurar Row Level Security (RLS)

3. **Inicie o servidor:**
   ```bash
   npm run dev
   ```

### Configuração Manual (Alternativa)

Se preferir configurar manualmente:

1. **Crie um projeto no Supabase:**
   - Acesse https://supabase.com
   - Crie novo projeto
   - Copie as credenciais

2. **Configure as variáveis de ambiente:**
   ```bash
   # Crie o arquivo .env.local
   VITE_SUPABASE_URL=sua_url_do_projeto
   VITE_SUPABASE_ANON_KEY=sua_chave_anonima
   ```

3. **Execute o SQL no Supabase:**
   ```sql
   -- Tabela de Usuários
   create table users (
     id uuid default uuid_generate_v4() primary key,
     name text not null,
     email text not null unique,
     role text not null,
     department text not null,
     status text not null,
     created_at timestamp with time zone default timezone('utc'::text, now()) not null,
     updated_at timestamp with time zone default timezone('utc'::text, now()) not null
   );

   -- Tabela de Clientes
   create table clients (
     id uuid default uuid_generate_v4() primary key,
     name text not null,
     unit text not null,
     phone text not null,
     email text not null,
     city text not null,
     state text,
     cep text,
     active_tickets integer default 0,
     created_at timestamp with time zone default timezone('utc'::text, now()) not null,
     updated_at timestamp with time zone default timezone('utc'::text, now()) not null
   );

   -- Tabela de Tickets
   create table tickets (
     id uuid default uuid_generate_v4() primary key,
     client text not null,
     subject text not null,
     category text not null,
     technician text not null,
     status text not null,
     date text not null,
     reported_issue text,
     confirmed_issue text,
     service_performed text,
     priority text,
     arrival_time text,
     departure_time text,
     created_at timestamp with time zone default timezone('utc'::text, now()) not null,
     updated_at timestamp with time zone default timezone('utc'::text, now()) not null
   );
   ```

## 🛠️ Funcionalidades

### Dashboard
- Visão geral dos chamados
- Estatísticas em tempo real
- Gráficos interativos

### Gerenciamento de Chamados
- ✅ Criar novo chamado
- ✅ Editar chamado existente
- ✅ Excluir chamado
- ✅ Visualizar detalhes
- ✅ Filtros por status
- ✅ Busca por cliente/assunto

### Gerenciamento de Clientes
- ✅ Cadastrar cliente
- ✅ Editar informações
- ✅ Excluir cliente
- ✅ Visualizar chamados ativos

### Gerenciamento de Usuários
- ✅ Cadastrar usuário
- ✅ Definir funções
- ✅ Gerenciar status
- ✅ Controle de acesso

## 🎨 Tecnologias

- **Frontend:** React 18 + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Backend:** Supabase (PostgreSQL)
- **Build Tool:** Vite
- **Charts:** Recharts
- **Icons:** Lucide React
- **Forms:** React Hook Form + Zod

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes base (shadcn/ui)
│   ├── charts/         # Componentes de gráficos
│   └── layout/         # Componentes de layout
├── pages/              # Páginas da aplicação
├── lib/                # Utilitários e configurações
├── hooks/              # Custom hooks
└── main.tsx           # Ponto de entrada
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Preview do build
- `npm run lint` - Executa ESLint
- `npm run setup:supabase` - Configuração automatizada do Supabase

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático

### Netlify
1. Conecte seu repositório ao Netlify
2. Configure as variáveis de ambiente
3. Deploy automático

## 📝 Licença

MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📞 Suporte

- 📧 Email: suporte@exemplo.com
- 💬 Discord: [Link do servidor]
- 📖 Documentação: [Link da documentação] 