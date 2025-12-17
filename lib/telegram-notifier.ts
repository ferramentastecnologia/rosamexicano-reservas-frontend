/**
 * Telegram Notifier
 *
 * Envia notificações via Telegram Bot para alertas de última hora
 * (reservas feitas para o mesmo dia)
 */

export interface TelegramNotificationPayload {
  customerName: string;
  reservationDate: string;
  reservationTime: string;
  partySize: number;
  reservationId: string;
  value: number;
}

/**
 * Verifica se a reserva é de mesma data (última hora)
 * Se hoje é 17/12/2025, só considera "última hora" se a reserva for para 17/12/2025
 */
export function isSameDayReservation(reservationDate: string): boolean {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Parse reservation date - assumes format "DD/MM/YYYY" or "YYYY-MM-DD"
    let reservationDay: Date;

    if (reservationDate.includes('/')) {
      // Format: "DD/MM/YYYY"
      const [day, month, year] = reservationDate.split('/');
      reservationDay = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    } else {
      // Format: "YYYY-MM-DD"
      reservationDay = new Date(reservationDate + 'T00:00:00');
    }

    reservationDay.setHours(0, 0, 0, 0);

    return reservationDay.getTime() === today.getTime();
  } catch (error) {
    console.error('Erro ao verificar se é reserva de mesma data:', error);
    return false;
  }
}

/**
 * Formata a mensagem para o Telegram
 */
function formatTelegramMessage(payload: TelegramNotificationPayload): string {
  return (
    `🚨 <b>RESERVA DE ÚLTIMA HORA!</b>\n\n` +
    `👤 <b>Cliente:</b> ${payload.customerName}\n` +
    `📅 <b>Data:</b> ${payload.reservationDate}\n` +
    `⏰ <b>Horário:</b> ${payload.reservationTime}\n` +
    `👥 <b>Pessoas:</b> ${payload.partySize}\n` +
    `💰 <b>Valor:</b> R$ ${payload.value.toFixed(2)}\n` +
    `🆔 <b>ID:</b> ${payload.reservationId}\n\n` +
    `⚠️ <i>Prepare-se para a chegada do cliente!</i>`
  );
}

/**
 * Envia notificação via Telegram
 */
export async function sendTelegramNotification(
  payload: TelegramNotificationPayload,
  botToken?: string,
  chatId?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Se não for reserva de mesma data, não enviar notificação
    if (!isSameDayReservation(payload.reservationDate)) {
      console.log('Reserva não é de mesma data, notificação Telegram não enviada');
      return { success: true };
    }

    // Obter credenciais do Telegram das env vars
    const TELEGRAM_BOT_TOKEN = botToken || process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = chatId || process.env.TELEGRAM_CHAT_ID;

    // Se credenciais não estão configuradas, apenas logar
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.warn('⚠️ Telegram não configurado (TELEGRAM_BOT_TOKEN ou TELEGRAM_CHAT_ID não definidos)');
      console.info('📨 Notificação que seria enviada:', formatTelegramMessage(payload));
      return { success: true }; // Não falhar a requisição se Telegram não está configurado
    }

    // Formatar mensagem
    const message = formatTelegramMessage(payload);

    // Enviar para Telegram
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      const errorMsg = result.description || result.error_description || 'Erro desconhecido';
      console.error('❌ Erro ao enviar notificação Telegram:', errorMsg);
      return {
        success: false,
        error: errorMsg,
      };
    }

    console.log('✅ Notificação Telegram enviada com sucesso');
    return { success: true };
  } catch (error) {
    console.error('❌ Erro na tentativa de enviar Telegram:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}
