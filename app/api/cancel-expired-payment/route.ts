import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { paymentId } = await request.json();

    if (!paymentId) {
      return NextResponse.json(
        { success: false, error: 'Payment ID é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar reserva pelo paymentId
    const reservation = await prisma.reservation.findFirst({
      where: {
        paymentId: paymentId,
        status: 'pending' // Só cancela se ainda estiver pendente
      }
    });

    if (!reservation) {
      return NextResponse.json({
        success: false,
        error: 'Reserva não encontrada ou já processada'
      });
    }

    // Cancelar a reserva
    await prisma.reservation.update({
      where: { id: reservation.id },
      data: { status: 'cancelled' }
    });

    console.log(`Reserva ${reservation.id} cancelada por expiração de pagamento`);

    return NextResponse.json({
      success: true,
      message: 'Reserva cancelada por expiração'
    });

  } catch (error) {
    console.error('Erro ao cancelar reserva expirada:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao cancelar reserva' },
      { status: 500 }
    );
  }
}
