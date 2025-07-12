// Serviço de e-mail usando Gmail
// Nota: Para usar Gmail, você precisa habilitar "Acesso a app menos seguro" ou usar App Password

interface InviteData {
  name: string;
  email: string;
  role: string;
  department: string;
  inviteLink: string;
}

export const sendInviteEmailGmail = async (inviteData: InviteData): Promise<{ success: boolean; error?: string }> => {
  try {
    // Como estamos no frontend, vamos simular o envio e mostrar o conteúdo
    // Em produção, isso seria feito via backend
    
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
            <h2>Olá ${inviteData.name}!</h2>
            <p>Você foi convidado para fazer parte do sistema TecnoChamados.</p>
            
            <div class="user-info">
              <h3>Seus dados:</h3>
              <p><strong>Nome:</strong> ${inviteData.name}</p>
              <p><strong>E-mail:</strong> ${inviteData.email}</p>
              <p><strong>Função:</strong> ${inviteData.role}</p>
              <p><strong>Departamento:</strong> ${inviteData.department}</p>
            </div>
            
            <p>Para ativar sua conta e criar sua senha, clique no botão abaixo:</p>
            
            <a href="${inviteData.inviteLink}" class="button">Ativar Minha Conta</a>
            
            <p>Ou copie e cole este link no seu navegador:</p>
            <p style="word-break: break-all; background: #f3f4f6; padding: 10px; border-radius: 4px; font-size: 12px;">
              ${inviteData.inviteLink}
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

    // Simular envio bem-sucedido
    console.log('E-mail que seria enviado via Gmail:', {
      to: inviteData.email,
      subject: 'Convite para TecnoChamados',
      html: emailContent
    });

    // Mostrar alerta com o conteúdo do e-mail
    const emailPreview = `
      📧 E-MAIL QUE SERIA ENVIADO:
      
      Para: ${inviteData.email}
      Assunto: Convite para TecnoChamados
      
      Olá ${inviteData.name}!
      
      Você foi convidado para fazer parte do sistema TecnoChamados.
      
      Seus dados:
      - Nome: ${inviteData.name}
      - E-mail: ${inviteData.email}
      - Função: ${inviteData.role}
      - Departamento: ${inviteData.department}
      
      Link de ativação: ${inviteData.inviteLink}
      
      Para configurar o envio real via Gmail, você precisará:
      1. Configurar um backend (Node.js)
      2. Usar nodemailer com Gmail
      3. Configurar App Password do Gmail
    `;

    alert(emailPreview);

    return { success: true };

  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    return { success: false, error: 'Erro ao enviar e-mail' };
  }
};

// Função para enviar e-mail via API backend (recomendado para produção)
export const sendInviteEmailViaGmailAPI = async (inviteData: InviteData): Promise<{ success: boolean; error?: string }> => {
  try {
    // Esta função seria chamada para uma API backend que usa Gmail
    const response = await fetch('http://localhost:3001/api/send-invite-gmail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inviteData),
    });

    const result = await response.json();
    
    if (response.ok) {
      return { success: true };
    } else {
      return { success: false, error: result.error || 'Erro ao enviar e-mail' };
    }
  } catch (error) {
    console.error('Erro ao enviar e-mail via API:', error);
    return { success: false, error: 'Erro de conexão' };
  }
}; 