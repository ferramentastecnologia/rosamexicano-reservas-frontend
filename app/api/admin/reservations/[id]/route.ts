import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

    return NextResponse.json(reservation);
  } catch (error) {
    console.error('Erro ao atualizar reserva:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar reserva' },
      { status: 500 }
    );
  }
}
