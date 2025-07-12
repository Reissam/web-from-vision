// Exemplo de servidor Node.js para envio de e-mails via Gmail
// Este é um exemplo para você implementar quando quiser envio real de e-mails

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Configurar transporter do Gmail
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER, // seu-email@gmail.com
    pass: process.env.GMAIL_APP_PASSWORD // App Password do Gmail
  }
});

// Rota para enviar convite
app.post('/api/send-invite-gmail', async (req, res) => {
  try {
    const { name, email, role, department, inviteLink } = req.body;

    // Template do e-mail
    const emailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Convite para TecnoChamados</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
          .user-info { background: white; padding: 15px; border-radius: 6px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Bem-vindo ao TecnoChamados!</h1>
          </div>
          <div class="content">
            <h2>Olá ${name}!</h2>
            <p>Você foi convidado para fazer parte do sistema TecnoChamados.</p>
            
            <div class="user-info">
              <h3>Seus dados:</h3>
              <p><strong>Nome:</strong> ${name}</p>
              <p><strong>E-mail:</strong> ${email}</p>
              <p><strong>Função:</strong> ${role}</p>
              <p><strong>Departamento:</strong> ${department}</p>
            </div>
            
            <p>Para ativar sua conta e criar sua senha, clique no botão abaixo:</p>
            
            <a href="${inviteLink}" class="button">Ativar Minha Conta</a>
            
            <p>Ou copie e cole este link no seu navegador:</p>
            <p style="word-break: break-all; background: #f3f4f6; padding: 10px; border-radius: 4px; font-size: 12px;">
              ${inviteLink}
            </p>
            
            <p><strong>Importante:</strong> Este link é válido por 24 horas. Após esse período, você precisará solicitar um novo convite.</p>
          </div>
          <div class="footer">
            <p>© 2024 TecnoChamados. Todos os direitos reservados.</p>
            <p>Se você não solicitou este convite, ignore este e-mail.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Configurar opções do e-mail
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Convite para TecnoChamados',
      html: emailContent
    };

    // Enviar e-mail
    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: 'E-mail enviado com sucesso!' });

  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    res.status(500).json({ success: false, error: 'Erro ao enviar e-mail' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Para usar este servidor, você precisa:

// 1. Instalar dependências:
// npm init -y
// npm install express nodemailer cors dotenv

// 2. Criar arquivo .env:
// GMAIL_USER=seu-email@gmail.com
// GMAIL_APP_PASSWORD=sua_app_password

// 3. Configurar App Password no Gmail:
// - Vá em Configurações da Conta Google
// - Segurança > Verificação em duas etapas (ativar)
// - Senhas de app > Gerar nova senha
// - Use essa senha no GMAIL_APP_PASSWORD

// 4. Executar o servidor:
// node server.js

// 5. Atualizar o frontend para usar a API:
// fetch('http://localhost:3001/api/send-invite-gmail', {
//   method: 'POST',
//   headers: { 'Content-Type': 'application/json' },
//   body: JSON.stringify(inviteData)
// }); 