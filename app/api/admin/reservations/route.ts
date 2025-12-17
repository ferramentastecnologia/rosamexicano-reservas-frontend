import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('[API] Buscando reservas...');

    const reservations = await prisma.reservation.findMany({
      include: {
        voucher: {
          select: {
            id: true,
            codigo: true,
            valor: true,
            utilizado: true,
            dataUtilizacao: true,
            dataValidade: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`[API] Encontradas ${reservations.length} reservas`);
    return NextResponse.json(reservations);
  } catch (error) {
    console.error('[API] Erro ao buscar reservas:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar reservas', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
