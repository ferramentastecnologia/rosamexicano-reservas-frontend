import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendApprovalEmail, sendRejectionEmail } from '@/lib/email-sender';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = await request.json();

    const reservation = await prisma.reservation.update({
      where: { id },
      data: { status }
    });

    // Enviar email de notificação (não bloqueia a resposta)
    if (status === 'approved') {
      sendApprovalEmail(reservation).catch(err =>
        console.error('Erro ao enviar email de aprovação:', err)
      );
    } else if (status === 'rejected') {
      sendRejectionEmail(reservation).catch(err =>
        console.error('Erro ao enviar email de rejeição:', err)
      );
    }

    return NextResponse.json(reservation);
  } catch (error) {
    console.error('Erro ao atualizar reserva:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar reserva' },
      { status: 500 }
    );
  }
}
