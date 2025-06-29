#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Iniciando configuração automatizada do Supabase...\n');

// Verificar se o Supabase CLI está instalado
try {
  execSync('supabase --version', { stdio: 'ignore' });
} catch (error) {
  console.log('📦 Instalando Supabase CLI...');
  execSync('npm install -g supabase', { stdio: 'inherit' });
}

// Verificar se o arquivo .env.local já existe
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  console.log('⚠️  Arquivo .env.local já existe. Fazendo backup...');
  fs.copyFileSync(envPath, envPath + '.backup');
}

// Executar o script MCP
console.log('🔧 Executando configuração do Supabase...');
try {
  execSync('mcp run scripts/supabase-setup.mcp', { stdio: 'inherit' });
  console.log('\n✅ Configuração do Supabase concluída com sucesso!');
} catch (error) {
  console.error('\n❌ Erro durante a configuração:', error.message);
  process.exit(1);
}

// Verificar se as variáveis de ambiente foram criadas
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  if (envContent.includes('VITE_SUPABASE_URL') && envContent.includes('VITE_SUPABASE_ANON_KEY')) {
    console.log('✅ Variáveis de ambiente configuradas');
  } else {
    console.log('⚠️  Variáveis de ambiente não encontradas. Configure manualmente:');
    console.log('   VITE_SUPABASE_URL=sua_url_do_supabase');
    console.log('   VITE_SUPABASE_ANON_KEY=sua_chave_anonima');
  }
}

console.log('\n🎉 Próximos passos:');
console.log('1. Reinicie o servidor: npm run dev');
console.log('2. Teste as funcionalidades na aplicação');
console.log('3. Acesse o dashboard do Supabase para monitorar os dados');

console.log('\n📚 Recursos úteis:');
console.log('- Dashboard Supabase: https://supabase.com/dashboard');
console.log('- Documentação: https://supabase.com/docs');
console.log('- Exemplos: https://supabase.com/examples'); 