import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function checkUser() {
  console.log('🔍 Verificando usuário no banco de dados...\n');
  
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.log('❌ Variáveis de ambiente não configuradas!');
    return;
  }
  
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Primeiro, vamos ver a estrutura da tabela users
    console.log('📋 Verificando estrutura da tabela users...');
    const { data: allUsers, error: structureError } = await supabase
      .from('users')
      .select('*')
      .limit(1);
    
    if (structureError) {
      console.log('❌ Erro ao verificar estrutura:', structureError.message);
      return;
    }
    
    if (allUsers && allUsers.length > 0) {
      console.log('📊 Colunas da tabela users:', Object.keys(allUsers[0]));
    }
    
    // Verificar se o usuário Samuel existe
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'samuel@empresa.com');
    
    if (error) {
      console.log('❌ Erro ao buscar usuário:', error.message);
      return;
    }
    
    if (users && users.length > 0) {
      console.log('\n✅ Usuário Samuel encontrado:');
      console.log('📧 Email:', users[0].email);
      console.log('👤 Nome:', users[0].name);
      console.log('👨‍💼 Cargo:', users[0].role);
    } else {
      console.log('\n❌ Usuário Samuel não encontrado!');
      console.log('📝 Criando usuário Samuel...');
      
      // Criar usuário sem a coluna password (que pode não existir)
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([
          {
            name: 'Samuel Silva',
            email: 'samuel@empresa.com',
            role: 'Técnico',
            department: 'TI',
            status: 'Ativo'
          }
        ])
        .select();
      
      if (insertError) {
        console.log('❌ Erro ao criar usuário:', insertError.message);
        console.log('💡 Tentando criar com estrutura mínima...');
        
        // Tentar criar com apenas os campos básicos
        const { data: simpleUser, error: simpleError } = await supabase
          .from('users')
          .insert([
            {
              name: 'Samuel Silva',
              email: 'samuel@empresa.com'
            }
          ])
          .select();
        
        if (simpleError) {
          console.log('❌ Erro ao criar usuário simples:', simpleError.message);
        } else {
          console.log('✅ Usuário Samuel criado com sucesso!');
          console.log('📧 Email: samuel@empresa.com');
        }
      } else {
        console.log('✅ Usuário Samuel criado com sucesso!');
        console.log('📧 Email: samuel@empresa.com');
      }
    }
    
  } catch (error) {
    console.log('❌ Erro geral:', error.message);
  }
}

checkUser(); 