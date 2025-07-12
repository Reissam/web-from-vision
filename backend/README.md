# Backend para Envio Automático de E-mails

Este backend automatiza o envio de convites por e-mail usando Gmail e nodemailer.

## 🚀 Configuração Rápida

### 1. Instalar Dependências
```bash
cd backend
npm install
```

### 2. Configurar Gmail

#### 2.1. Habilitar Autenticação de 2 Fatores
1. Acesse [myaccount.google.com](https://myaccount.google.com)
2. Vá em "Segurança"
3. Ative "Verificação em duas etapas"

#### 2.2. Criar App Password
1. Ainda em "Segurança"
2. Clique em "Senhas de app"
3. Selecione "E-mail" e "Outro (nome personalizado)"
4. Digite "TecnoChamados" e clique "Gerar"
5. **Copie a senha gerada** (16 caracteres)

### 3. Configurar Variáveis de Ambiente
```bash
# Copie o arquivo de exemplo
cp env.example .env

# Edite o arquivo .env com suas credenciais
```

Conteúdo do arquivo `.env`:
```env
# Configurações do Gmail
GMAIL_USER=seu-email@gmail.com
GMAIL_APP_PASSWORD=sua-app-password-16-caracteres

# Configurações do servidor
PORT=3001

# Configurações do CORS
CORS_ORIGIN=http://localhost:5173
```

### 4. Iniciar o Servidor
```bash
# Desenvolvimento (com auto-reload)
npm run dev

# Produção
npm start
```

## ✅ Verificação

### Teste de Conexão
Acesse: `http://localhost:3001/api/health`

Deve retornar:
```json
{
  "success": true,
  "message": "Servidor de e-mail funcionando!",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### Teste de Envio
O frontend agora enviará e-mails automaticamente quando você:
1. Criar um novo usuário
2. Clicar em "Enviar Convite"

## 🔧 Funcionalidades

- ✅ Envio automático de convites
- ✅ Template HTML profissional
- ✅ Validação de dados
- ✅ Logs detalhados
- ✅ Tratamento de erros
- ✅ CORS configurado

## 📧 Template do E-mail

O e-mail inclui:
- Design responsivo e profissional
- Dados do usuário
- Link de ativação
- Instruções claras
- Aviso de validade (24h)

## 🐛 Solução de Problemas

### Erro: "Invalid login"
- Verifique se o App Password está correto
- Confirme que a autenticação de 2 fatores está ativa

### Erro: "Connection timeout"
- Verifique sua conexão com a internet
- Confirme se o Gmail não está bloqueado

### E-mail não chega
- Verifique a pasta de spam
- Confirme se o e-mail está correto
- Aguarde alguns minutos

### Erro CORS
- Verifique se `CORS_ORIGIN` está configurado corretamente
- Confirme se o frontend está rodando na porta 5173

## 📝 Logs

O servidor mostra logs detalhados:
- ✅ Configuração bem-sucedida
- ✅ E-mails enviados
- ❌ Erros de envio
- 📊 Estatísticas

## 🔒 Segurança

- App Password é mais seguro que senha normal
- CORS configurado para origem específica
- Validação de dados no servidor
- Logs sem informações sensíveis

## 🚀 Deploy

Para produção:
1. Configure variáveis de ambiente
2. Use PM2 ou similar para manter o processo ativo
3. Configure proxy reverso (nginx)
4. Use HTTPS

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs do servidor
2. Confirme as configurações do Gmail
3. Teste com e-mail diferente
4. Verifique a conectividade 