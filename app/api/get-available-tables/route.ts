import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const TOTAL_TABLES = 15;
const PEOPLE_PER_TABLE = 4;

export async function POST(request: Request) {
  try {
    const { data, horario } = await request.json();

    if (!data || !horario) {
      return NextResponse.json(
        { error: 'Data e horário são obrigatórios' },
        { status: 400 }
      );
    }

    // Buscar todas as reservas para a data e horário
    const reservations = await prisma.reservation.findMany({
      where: {
        data: data,
        horario: horario,
        status: {
          in: ['pending', 'confirmed']
        }
      },
      select: {
        mesasSelecionadas: true,
        numeroPessoas: true,
      }
    });

    // Coletar todas as mesas ocupadas
    const occupiedTables = new Set<number>();
    reservations.forEach(reservation => {
      if (reservation.mesasSelecionadas) {
        try {
          const tables = JSON.parse(reservation.mesasSelecionadas);
          tables.forEach((tableNum: number) => occupiedTables.add(tableNum));
        } catch (e) {
          console.error('Erro ao parsear mesas:', e);
        }
      }
    });

    // Criar array de todas as mesas com status
    const tables = Array.from({ length: TOTAL_TABLES }, (_, i) => {
      const tableNumber = i + 1;
      return {
        number: tableNumber,
        available: !occupiedTables.has(tableNumber),
        capacity: PEOPLE_PER_TABLE,
      };
    });

    // Contar mesas disponíveis
    const availableTables = tables.filter(t => t.available).length;
    const totalCapacity = availableTables * PEOPLE_PER_TABLE;

    return NextResponse.json({
      tables,
      summary: {
        totalTables: TOTAL_TABLES,
        availableTables,
        occupiedTables: occupiedTables.size,
        totalCapacity,
      }
    });

  } catch (error) {
    console.error('Erro ao buscar mesas disponíveis:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar mesas disponíveis' },
      { status: 500 }
    );
  }
}
