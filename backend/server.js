const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Configurar transporter do Gmail
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

// Verificar conexão com Gmail
transporter.verify(function(error, success) {
  if (error) {
    console.error('Erro na configuração do Gmail:', error);
  } else {
    console.log('✅ Servidor de e-mail configurado com sucesso!');
  }
});

// Rota para enviar convite por e-mail
app.post('/api/send-invite-gmail', async (req, res) => {
  try {
    const { name, email, role, department, inviteLink } = req.body;

    // Validar dados obrigatórios
    if (!name || !email || !role || !department || !inviteLink) {
      return res.status(400).json({
        success: false,
        error: 'Todos os campos são obrigatórios'
      });
    }

    // Template do e-mail
    const emailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Convite para TecnoChamados</title>
        <style>
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0; 
            background-color: #f5f5f5; 
          }
          .container { 
            max-width: 600px; 
            margin: 20px auto; 
            background: white; 
            border-radius: 10px; 
            overflow: hidden; 
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
          }
          .header { 
            background: linear-gradient(135deg, #2563eb, #1d4ed8); 
            color: white; 
            padding: 30px; 
            text-align: center; 
          }
          .header h1 { 
            margin: 0; 
            font-size: 28px; 
            font-weight: 600; 
          }
          .content { 
            padding: 40px 30px; 
          }
          .welcome-text { 
            font-size: 18px; 
            margin-bottom: 25px; 
            color: #374151; 
          }
          .user-info { 
            background: #f8fafc; 
            padding: 20px; 
            border-radius: 8px; 
            margin: 25px 0; 
            border-left: 4px solid #2563eb; 
          }
          .user-info h3 { 
            margin: 0 0 15px 0; 
            color: #1f2937; 
            font-size: 16px; 
          }
          .user-info p { 
            margin: 8px 0; 
            color: #4b5563; 
          }
          .button-container { 
            text-align: center; 
            margin: 30px 0; 
          }
          .button { 
            display: inline-block; 
            background: linear-gradient(135deg, #2563eb, #1d4ed8); 
            color: white; 
            padding: 15px 30px; 
            text-decoration: none; 
            border-radius: 8px; 
            font-weight: 600; 
            font-size: 16px; 
            transition: all 0.3s ease; 
            box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2); 
          }
          .button:hover { 
            transform: translateY(-2px); 
            box-shadow: 0 6px 12px rgba(37, 99, 235, 0.3); 
          }
          .link-text { 
            background: #f3f4f6; 
            padding: 15px; 
            border-radius: 6px; 
            font-size: 13px; 
            word-break: break-all; 
            color: #6b7280; 
            margin: 20px 0; 
            border: 1px solid #e5e7eb; 
          }
          .warning { 
            background: #fef3c7; 
            border: 1px solid #f59e0b; 
            color: #92400e; 
            padding: 15px; 
            border-radius: 6px; 
            margin: 20px 0; 
            font-size: 14px; 
          }
          .footer { 
            background: #f9fafb; 
            padding: 25px; 
            text-align: center; 
            color: #6b7280; 
            font-size: 14px; 
            border-top: 1px solid #e5e7eb; 
          }
          .footer p { 
            margin: 5px 0; 
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Bem-vindo ao TecnoChamados!</h1>
          </div>
          <div class="content">
            <p class="welcome-text">Olá <strong>${name}</strong>!</p>
            <p>Você foi convidado para fazer parte do sistema TecnoChamados, nossa plataforma de gerenciamento de chamados técnicos.</p>
            
            <div class="user-info">
              <h3>📋 Seus dados de acesso:</h3>
              <p><strong>Nome:</strong> ${name}</p>
              <p><strong>E-mail:</strong> ${email}</p>
              <p><strong>Função:</strong> ${role}</p>
              <p><strong>Departamento:</strong> ${department}</p>
            </div>
            
            <p>Para ativar sua conta e criar sua senha de acesso, clique no botão abaixo:</p>
            
            <div class="button-container">
              <a href="${inviteLink}" class="button">🔐 Ativar Minha Conta</a>
            </div>
            
            <p>Ou copie e cole este link no seu navegador:</p>
            <div class="link-text">${inviteLink}</div>
            
            <div class="warning">
              <strong>⚠️ Importante:</strong> Este link é válido por 24 horas. Após esse período, você precisará solicitar um novo convite.
            </div>
            
            <p>Após ativar sua conta, você poderá:</p>
            <ul>
              <li>Acessar o sistema com seu e-mail e senha</li>
              <li>Visualizar e gerenciar chamados técnicos</li>
              <li>Colaborar com sua equipe</li>
            </ul>
          </div>
          <div class="footer">
            <p><strong>© 2024 TecnoChamados</strong></p>
            <p>Sistema de Gerenciamento de Chamados Técnicos</p>
            <p>Se você não solicitou este convite, ignore este e-mail.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Configurar opções do e-mail
    const mailOptions = {
      from: `"TecnoChamados" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: '🎉 Convite para TecnoChamados - Ative sua conta',
      html: emailContent
    };

    // Enviar e-mail
    const info = await transporter.sendMail(mailOptions);

    console.log('✅ E-mail enviado com sucesso:', {
      messageId: info.messageId,
      to: email,
      subject: mailOptions.subject
    });

    res.json({
      success: true,
      messageId: info.messageId,
      message: 'E-mail enviado com sucesso'
    });

  } catch (error) {
    console.error('❌ Erro ao enviar e-mail:', error);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor ao enviar e-mail',
      details: error.message
    });
  }
});

// Rota de teste
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Servidor de e-mail funcionando!',
    timestamp: new Date().toISOString()
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor de e-mail rodando na porta ${PORT}`);
  console.log(`📧 Endpoint: http://localhost:${PORT}/api/send-invite-gmail`);
  console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
}); 