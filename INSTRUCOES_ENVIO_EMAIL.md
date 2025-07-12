# 📧 Instruções para Envio Automático de E-mails

## ✅ O que foi implementado

O sistema agora tem **envio automático de convites por e-mail** via Gmail! Quando você criar um novo usuário e clicar em "Enviar Convite", o e-mail será enviado automaticamente.

## 🚀 Como configurar

### 1. Configurar Gmail

#### 1.1. Habilitar Autenticação de 2 Fatores
1. Acesse [myaccount.google.com/security](https://myaccount.google.com/security)
2. Clique em "Verificação em duas etapas"
3. Ative a verificação

#### 1.2. Criar App Password
1. Ainda em "Segurança"
2. Clique em "Senhas de app"
3. Selecione "E-mail" e "Outro (nome personalizado)"
4. Digite "TecnoChamados" e clique "Gerar"
5. **Copie a senha de 16 caracteres**

### 2. Configurar Backend

#### 2.1. Executar Setup Automático
```bash
cd backend
npm run setup
```

O script irá pedir:
- Seu e-mail do Gmail
- O App Password (16 caracteres)
- Porta do servidor (padrão: 3001)
- Origem CORS (padrão: http://localhost:5173)

#### 2.2. Iniciar Servidor
```bash
npm run dev
```

Você verá:
```
🚀 Servidor de e-mail rodando na porta 3001
📧 Endpoint: http://localhost:3001/api/send-invite-gmail
🔍 Health check: http://localhost:3001/api/health
✅ Servidor de e-mail configurado com sucesso!
```

### 3. Testar

#### 3.1. Teste de Conexão
Acesse: `http://localhost:3001/api/health`

Deve retornar:
```json
{
  "success": true,
  "message": "Servidor de e-mail funcionando!",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

#### 3.2. Teste de Envio
1. Acesse a página de **Usuários** no sistema
2. Clique em **"Novo Usuário"**
3. Preencha os dados
4. Clique em **"Enviar Convite"**
5. O e-mail será enviado automaticamente!

## 📧 Como funciona

### Fluxo Completo
1. **Criação do usuário**: Dados salvos com status "Pendente"
2. **Geração do link**: Link único com dados codificados
3. **Envio automático**: E-mail enviado via Gmail
4. **Ativação**: Usuário clica no link e cria senha
5. **Acesso**: Usuário pode fazer login normalmente

### Template do E-mail
- ✅ Design profissional e responsivo
- ✅ Dados do usuário incluídos
- ✅ Link de ativação seguro
- ✅ Instruções claras
- ✅ Aviso de validade (24h)

## 🔧 Solução de Problemas

### E-mail não chega
1. **Verifique spam/lixo eletrônico**
2. **Aguarde alguns minutos**
3. **Confirme o e-mail está correto**
4. **Verifique os logs do servidor**

### Erro "Invalid login"
1. **Confirme o App Password está correto**
2. **Verifique se a autenticação de 2 fatores está ativa**
3. **Gere um novo App Password se necessário**

### Erro de conexão
1. **Verifique se o servidor está rodando**
2. **Confirme a porta 3001 está livre**
3. **Verifique o firewall**

### Erro CORS
1. **Confirme o frontend está na porta 5173**
2. **Verifique a configuração CORS_ORIGIN**

## 📝 Logs do Servidor

O servidor mostra logs detalhados:
```
✅ Servidor de e-mail configurado com sucesso!
✅ E-mail enviado com sucesso: {
  messageId: "abc123...",
  to: "usuario@exemplo.com",
  subject: "🎉 Convite para TecnoChamados - Ative sua conta"
}
```

## 🔒 Segurança

- ✅ App Password é mais seguro que senha normal
- ✅ CORS configurado para origem específica
- ✅ Validação de dados no servidor
- ✅ Logs sem informações sensíveis
- ✅ Link de convite com dados codificados

## 🎯 Próximos Passos

1. **Configure o Gmail** seguindo as instruções acima
2. **Execute o setup** do backend
3. **Inicie o servidor** de e-mail
4. **Teste o envio** criando um usuário
5. **Verifique o e-mail** na caixa de entrada

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs do servidor
2. Confirme as configurações do Gmail
3. Teste com e-mail diferente
4. Verifique a conectividade

---

**🎉 Parabéns! Seu sistema agora tem envio automático de convites por e-mail!** 