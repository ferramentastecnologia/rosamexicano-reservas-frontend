import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { data, horario, area } = await request.json();

    if (!data) {
      return NextResponse.json(
        { error: 'Data é obrigatória' },
        { status: 400 }
      );
    }

    // Buscar todas as reservas CONFIRMADAS para a DATA
    const whereClause: Record<string, unknown> = {
      data,
      status: 'confirmed'
    };

    if (horario) {
      whereClause.horario = horario;
    }

    const reservations = await prisma.reservation.findMany({
      where: whereClause,
      select: {
        id: true,
        externalRef: true,
        nome: true,
        numeroPessoas: true,
        status: true,
        horario: true,
      }
    });

    // Retornar apenas resumo de reservas sem informação de mesas
    return NextResponse.json({
      date: data,
      time: horario,
      area: area || 'all',
      summary: {
        totalReservations: reservations.length,
        totalPeople: reservations.reduce((sum, r) => sum + r.numeroPessoas, 0),
      },
      reservations: reservations.map(r => ({
        id: r.id,
        code: r.externalRef,
        name: r.nome,
        people: r.numeroPessoas,
        status: r.status,
        horario: r.horario,
      }))
    });

  } catch (error) {
    console.error('Erro ao buscar ocupação:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar ocupação de mesas' },
      { status: 500 }
    );
  }
}
