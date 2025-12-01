import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Email de reserva aprovada
export async function sendApprovalEmail(reservation: any): Promise<boolean> {
  try {
    const { nome, email, data, horario, numeroPessoas } = reservation;
    const dataFormatada = new Date(data + 'T00:00:00').toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    const mailOptions = {
      from: `"Rosa Mexicano" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `✅ Reserva Aprovada - ${dataFormatada} às ${horario}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #E53935 0%, #B71C1C 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { padding: 10px 0; border-bottom: 1px solid #eee; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Reserva Aprovada!</h1>
              <p>Rosa Mexicano</p>
            </div>
            <div class="content">
              <p>Olá <strong>${nome}</strong>,</p>
              <p>Ótima notícia! Sua reserva foi <strong>aprovada</strong> pelo restaurante.</p>

              <div class="details">
                <h3 style="margin-top: 0; color: #E53935;">📋 Detalhes da Reserva</h3>
                <div class="detail-row">📅 Data: <strong>${dataFormatada}</strong></div>
                <div class="detail-row">🕐 Horário: <strong>${horario}</strong></div>
                <div class="detail-row" style="border-bottom: none;">👥 Pessoas: <strong>${numeroPessoas}</strong></div>
              </div>

              <p><strong>Importante:</strong></p>
              <ul>
                <li>Chegue com 10 minutos de antecedência</li>
                <li>O valor de R$ 50,00 será convertido em consumação</li>
              </ul>

              <p>Esperamos você! 🌮</p>
            </div>
            <div class="footer">
              <p><strong>Rosa Mexicano</strong></p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email de aprovação enviado para:', email);
    return true;
  } catch (error) {
    console.error('Erro ao enviar email de aprovação:', error);
    return false;
  }
}

// Email de reserva rejeitada
export async function sendRejectionEmail(reservation: any): Promise<boolean> {
  try {
    const { nome, email, data, horario } = reservation;
    const dataFormatada = new Date(data + 'T00:00:00').toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    const mailOptions = {
      from: `"Rosa Mexicano" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `❌ Reserva não aprovada - ${dataFormatada} às ${horario}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #666 0%, #333 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Reserva não aprovada</h1>
              <p>Rosa Mexicano</p>
            </div>
            <div class="content">
              <p>Olá <strong>${nome}</strong>,</p>
              <p>Infelizmente não foi possível aprovar sua reserva para <strong>${dataFormatada}</strong> às <strong>${horario}</strong>.</p>

              <p>O valor pago será estornado em até 5 dias úteis.</p>

              <p>Pedimos desculpas pelo inconveniente. Entre em contato conosco para mais informações ou para reagendar.</p>

              <p>Atenciosamente,<br>Equipe Rosa Mexicano</p>
            </div>
            <div class="footer">
              <p><strong>Rosa Mexicano</strong></p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email de rejeição enviado para:', email);
    return true;
  } catch (error) {
    console.error('Erro ao enviar email de rejeição:', error);
    return false;
  }
}

export async function sendVoucherEmail(
  to: string,
  voucherData: any,
  pdfBuffer: Buffer
): Promise<boolean> {
  try {
    const { nome, data, horario, numeroPessoas } = voucherData.reservation;
    const dataFormatada = new Date(data + 'T00:00:00').toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    const mailOptions = {
      from: `"Mortadella Ristorante" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: `✅ Reserva Confirmada - ${dataFormatada} às ${horario}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0e9a20 0%, #0a6b16 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .voucher-code { background: #fff; padding: 20px; border-left: 4px solid #0e9a20; margin: 20px 0; font-size: 24px; font-weight: bold; text-align: center; color: #0e9a20; font-family: 'Courier New', monospace; }
            .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { padding: 10px 0; border-bottom: 1px solid #eee; }
            .detail-label { color: #666; font-weight: normal; }
            .detail-value { color: #000; font-weight: bold; }
            .highlight { background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .button { display: inline-block; padding: 12px 30px; background: #0e9a20; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Reserva Confirmada!</h1>
              <p>Mortadella Ristorante & Pizzeria</p>
            </div>

            <div class="content">
              <p>Olá <strong>${nome}</strong>,</p>

              <p>Sua reserva foi confirmada com sucesso! Estamos muito felizes em recebê-lo(a).</p>

              <div class="voucher-code">
                ${voucherData.codigo}
              </div>

              <p style="text-align: center; color: #666; font-size: 14px;">
                <strong>Guarde este código!</strong> Apresente-o na chegada ao restaurante.
              </p>

              <div class="details">
                <h3 style="margin-top: 0; color: #0e9a20;">📋 Detalhes da Reserva</h3>

                <div class="detail-row">
                  <span class="detail-label">📅 Data:</span>
                  <span class="detail-value">${dataFormatada}</span>
                </div>

                <div class="detail-row">
                  <span class="detail-label">🕐 Horário:</span>
                  <span class="detail-value">${horario}</span>
                </div>

                <div class="detail-row">
                  <span class="detail-label">👥 Número de Pessoas:</span>
                  <span class="detail-value">${numeroPessoas} pessoas</span>
                </div>

                <div class="detail-row" style="border-bottom: none;">
                  <span class="detail-label">💰 Valor Pago:</span>
                  <span class="detail-value">R$ 50,00</span>
                </div>
              </div>

              <div class="highlight">
                <strong style="color: #0e9a20;">✨ 100% Conversível em Consumação</strong><br>
                <span style="font-size: 14px;">O valor de R$ 50,00 retorna integralmente no dia da sua reserva!</span>
              </div>

              <h3 style="color: #0e9a20;">📝 Próximos Passos</h3>
              <ol>
                <li>Mantenha este e-mail guardado</li>
                <li>Apresente o código do voucher na chegada</li>
                <li>Chegue com 10 minutos de antecedência</li>
                <li>Aproveite sua experiência gastronômica!</li>
              </ol>

              <p style="margin-top: 30px;">
                <strong>Precisa alterar ou cancelar?</strong><br>
                Entre em contato conosco:
              </p>

              <p>
                📞 Telefone: <strong>(47) 3037-6060</strong><br>
                💬 WhatsApp: <strong>(47) 99766-0505</strong><br>
                📧 E-mail: <strong>contato@mortadella.com.br</strong>
              </p>

              <div style="text-align: center; margin-top: 30px;">
                <a href="https://wa.me/5547997660505" class="button">Falar no WhatsApp</a>
              </div>
            </div>

            <div class="footer">
              <p><strong>Mortadella Ristorante & Pizzeria</strong></p>
              <p>Av. Martin Luther, 1001 - Victor Konder, Blumenau/SC</p>
              <p>Desde 2009 servindo com qualidade</p>
            </div>
          </div>
        </body>
        </html>
      `,
      attachments: [
        {
          filename: `voucher-${voucherData.codigo}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email enviado:', info.messageId);
    return true;
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return false;
  }
}
