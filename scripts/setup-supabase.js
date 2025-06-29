#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

console.log('🚀 Configuração do Supabase para Sistema de Chamados\n');

async function setupSupabase() {
  try {
    console.log('📋 Passos para configuração:');
    console.log('1. Crie um projeto no Supabase (https://supabase.com)');
    console.log('2. Obtenha as credenciais do projeto');
    console.log('3. Execute o SQL fornecido\n');

    const supabaseUrl = await question('🔗 URL do projeto Supabase: ');
    const supabaseKey = await question('🔑 Chave anônima do Supabase: ');

    if (!supabaseUrl || !supabaseKey) {
      console.log('❌ Credenciais são obrigatórias!');
      process.exit(1);
    }

    // Criar arquivo .env.local
    const envContent = `VITE_SUPABASE_URL=${supabaseUrl}
VITE_SUPABASE_ANON_KEY=${supabaseKey}`;

    const envPath = path.join(process.cwd(), '.env.local');
    
    if (fs.existsSync(envPath)) {
      console.log('⚠️  Arquivo .env.local já existe. Fazendo backup...');
      fs.copyFileSync(envPath, envPath + '.backup');
    }

    fs.writeFileSync(envPath, envContent);
    console.log('✅ Arquivo .env.local criado com sucesso!');

    // Criar arquivo SQL para execução manual
    const sqlContent = `-- Script SQL para executar no Supabase
-- Copie e cole este código no SQL Editor do Supabase

-- Tabela de Usuários
create table if not exists users (
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
create table if not exists clients (
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
create table if not exists tickets (
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

-- Inserir dados de exemplo
insert into users (name, email, role, department, status) values
('João Silva', 'joao.silva@exemplo.com', 'Administrador', 'TI', 'Ativo'),
('Maria Santos', 'maria.santos@exemplo.com', 'Técnico', 'Suporte', 'Ativo'),
('Carlos Oliveira', 'carlos.oliveira@exemplo.com', 'Gestor', 'Financeiro', 'Inativo')
on conflict (email) do nothing;

insert into clients (name, unit, phone, email, city, active_tickets) values
('Empresa XYZ', '12.345.678/0001-90', '(11) 3456-7890', 'contato@xyz.com.br', 'São Paulo', 5),
('Empresa ABC', '98.765.432/0001-21', '(11) 2345-6789', 'contato@abc.com.br', 'Rio de Janeiro', 3),
('Empresa DEF', '45.678.901/0001-23', '(31) 3456-7890', 'contato@def.com.br', 'Belo Horizonte', 2)
on conflict (email) do nothing;

insert into tickets (client, subject, category, technician, status, date) values
('Empresa XYZ', 'Servidor não responde', 'Hardware', 'Pendente', 'Pendente', '23/08/2023'),
('Empresa ABC', 'Instalação de nova impressora', 'Hardware', 'Em Andamento', 'Em Andamento', '22/08/2023'),
('Empresa DEF', 'Configuração de rede Wi-Fi', 'Rede', 'Resolvido', 'Resolvido', '21/08/2023')
on conflict do nothing;

-- Configurar Row Level Security (RLS)
alter table users enable row level security;
alter table clients enable row level security;
alter table tickets enable row level security;

-- Políticas básicas para desenvolvimento
create policy "Enable all operations for users" on users for all using (true);
create policy "Enable all operations for clients" on clients for all using (true);
create policy "Enable all operations for tickets" on tickets for all using (true);
`;

    const sqlPath = path.join(process.cwd(), 'supabase-setup.sql');
    fs.writeFileSync(sqlPath, sqlContent);
    console.log('✅ Arquivo supabase-setup.sql criado!');

    console.log('\n🎉 Configuração concluída!');
    console.log('\n📋 Próximos passos:');
    console.log('1. Acesse o dashboard do Supabase');
    console.log('2. Vá em SQL Editor');
    console.log('3. Execute o código do arquivo supabase-setup.sql');
    console.log('4. Execute: npm run dev');
    console.log('5. Teste a aplicação!');

    console.log('\n🔗 Links úteis:');
    console.log('- Dashboard Supabase: https://supabase.com/dashboard');
    console.log('- SQL Editor: https://supabase.com/dashboard/project/[SEU_PROJETO]/sql');
    console.log('- Documentação: https://supabase.com/docs');

  } catch (error) {
    console.error('❌ Erro durante a configuração:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

setupSupabase(); 