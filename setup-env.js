import fs from 'fs';
import readline from 'readline';
import { execSync } from 'child_process';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupEnvironment() {
  console.log('🔧 Configuração das Variáveis de Ambiente\n');
  console.log('📝 Para encontrar essas informações:');
  console.log('1. Acesse https://supabase.com');
  console.log('2. Faça login e vá para seu projeto');
  console.log('3. Vá em Settings > API');
  console.log('4. Copie a URL e a anon key\n');
  
  const supabaseUrl = 'https://bkxcpfigdfwmsprflwqj.supabase.co';
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJreGNwZmlnZGZ3bXNwcmZsd3FqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExNDA4NzMsImV4cCI6MjA2NjcxNjg3M30.yqUL2zX6Aa7DbtYgXaSSTqKtnOpFjjXkXRQWRGh4KSI';
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.log('\n❌ Erro: URL e chave são obrigatórias!');
    rl.close();
    return;
  }
  
  // Criar conteúdo do arquivo .env.local
  const envContent = `VITE_SUPABASE_URL=${supabaseUrl}
VITE_SUPABASE_ANON_KEY=${supabaseAnonKey}`;
  
  try {
    fs.writeFileSync('.env.local', envContent);
    console.log('\n✅ Arquivo .env.local criado com sucesso!');
    console.log('📁 Localização: .env.local');
    
    console.log('\n🔍 Testando conexão...');
    execSync('node test-connection.js', { stdio: 'inherit' });
    
  } catch (error) {
    console.log('\n❌ Erro ao criar arquivo:', error.message);
  }
  
  rl.close();
}

setupEnvironment(); 