import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function testConnection() {
  console.log('🔍 Testando conexão com Supabase...\n');
  
  // Verificar variáveis de ambiente
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
  
  console.log('📋 Variáveis de ambiente:');
  console.log('VITE_SUPABASE_URL:', supabaseUrl ? '✅ Configurada' : '❌ Não configurada');
  console.log('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Configurada' : '❌ Não configurada');
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.log('\n❌ Erro: Variáveis de ambiente não configuradas!');
    console.log('📝 Crie um arquivo .env.local com:');
    console.log('VITE_SUPABASE_URL=sua_url_do_supabase');
    console.log('VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase');
    return;
  }
  
  try {
    // Criar cliente Supabase
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Testar conexão básica
    console.log('\n🔗 Testando conexão...');
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error) {
      console.log('❌ Erro na conexão:', error.message);
      
      if (error.message.includes('JWT')) {
        console.log('\n💡 Dica: Verifique se a chave anônima está correta');
      } else if (error.message.includes('relation')) {
        console.log('\n💡 Dica: As tabelas podem não estar criadas ainda');
      }
    } else {
      console.log('✅ Conexão bem-sucedida!');
      
      // Testar tabelas
      console.log('\n📊 Testando tabelas...');
      
      const tables = ['users', 'clients', 'tickets'];
      for (const table of tables) {
        try {
          const { data, error } = await supabase.from(table).select('count').limit(1);
          if (error) {
            console.log(`❌ Tabela ${table}: ${error.message}`);
          } else {
            console.log(`✅ Tabela ${table}: OK`);
          }
        } catch (err) {
          console.log(`❌ Tabela ${table}: ${err.message}`);
        }
      }
    }
    
  } catch (error) {
    console.log('❌ Erro geral:', error.message);
  }
}

testConnection(); 