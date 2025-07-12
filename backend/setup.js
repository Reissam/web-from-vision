#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 Configuração do Backend de E-mail');
console.log('=====================================\n');

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setup() {
  try {
    // Verificar se package.json existe
    if (!fs.existsSync('package.json')) {
      console.log('❌ package.json não encontrado. Execute este script na pasta backend/');
      process.exit(1);
    }

    // Verificar se .env já existe
    if (fs.existsSync('.env')) {
      const overwrite = await question('⚠️  Arquivo .env já existe. Deseja sobrescrever? (s/N): ');
      if (overwrite.toLowerCase() !== 's' && overwrite.toLowerCase() !== 'sim') {
        console.log('✅ Configuração cancelada.');
        process.exit(0);
      }
    }

    console.log('\n📧 Configuração do Gmail');
    console.log('------------------------');
    
    const gmailUser = await question('Digite seu e-mail do Gmail: ');
    
    console.log('\n🔐 Configuração do App Password');
    console.log('Para criar um App Password:');
    console.log('1. Acesse: https://myaccount.google.com/security');
    console.log('2. Ative "Verificação em duas etapas"');
    console.log('3. Vá em "Senhas de app"');
    console.log('4. Selecione "E-mail" e "Outro (nome personalizado)"');
    console.log('5. Digite "TecnoChamados" e clique "Gerar"');
    console.log('6. Copie a senha de 16 caracteres\n');
    
    const appPassword = await question('Digite o App Password (16 caracteres): ');
    
    if (appPassword.length !== 16) {
      console.log('❌ App Password deve ter exatamente 16 caracteres!');
      process.exit(1);
    }

    const port = await question('Porta do servidor (padrão: 3001): ') || '3001';
    const corsOrigin = await question('Origem CORS (padrão: http://localhost:5173): ') || 'http://localhost:5173';

    // Criar arquivo .env
    const envContent = `# Configurações do Gmail
GMAIL_USER=${gmailUser}
GMAIL_APP_PASSWORD=${appPassword}

# Configurações do servidor
PORT=${port}

# Configurações do CORS
CORS_ORIGIN=${corsOrigin}
`;

    fs.writeFileSync('.env', envContent);

    console.log('\n✅ Arquivo .env criado com sucesso!');
    console.log('\n📋 Próximos passos:');
    console.log('1. Instale as dependências: npm install');
    console.log('2. Inicie o servidor: npm run dev');
    console.log('3. Teste a conexão: http://localhost:' + port + '/api/health');
    console.log('\n🎉 Configuração concluída!');

  } catch (error) {
    console.error('❌ Erro durante a configuração:', error.message);
  } finally {
    rl.close();
  }
}

setup(); 