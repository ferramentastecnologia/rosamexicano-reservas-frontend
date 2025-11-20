import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const TOTAL_TABLES = 15;

export async function POST(request: Request) {
  try {
    const { data, horario } = await request.json();

    if (!data) {
      return NextResponse.json(
        { error: 'Data é obrigatória' },
        { status: 400 }
      );
    }

    // Buscar todas as reservas para a DATA (independente do horário)
    // As mesas são compartilhadas entre todos os horários do dia
    const whereClause: any = {
      data,
      status: {
        in: ['pending', 'confirmed']
      }
    };

    // Se horário for fornecido, filtra também por horário (apenas para visualização)
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
        mesasSelecionadas: true,
        status: true,
        horario: true,
      }
    });

    // Criar mapa de mesas com informações
    // Uma mesa pode ter múltiplas reservas (diferentes horários)
    const tableMap = new Map<number, any[]>();

    reservations.forEach(reservation => {
      if (reservation.mesasSelecionadas) {
        try {
          const tables = JSON.parse(reservation.mesasSelecionadas);
          tables.forEach((tableNum: number) => {
            if (!tableMap.has(tableNum)) {
              tableMap.set(tableNum, []);
            }
            tableMap.get(tableNum)!.push({
              id: reservation.id,
              code: reservation.externalRef,
              name: reservation.nome,
              people: reservation.numeroPessoas,
              status: reservation.status,
              horario: reservation.horario,
            });
          });
        } catch (e) {
          console.error('Erro ao parsear mesas:', e);
        }
      }
    });

    // Criar array completo de mesas (1-15)
    const tables = Array.from({ length: TOTAL_TABLES }, (_, i) => {
      const tableNumber = i + 1;
      const reservationsForTable = tableMap.get(tableNumber);

      if (reservationsForTable && reservationsForTable.length > 0) {
        return {
          tableNumber,
          occupied: true,
          reservations: reservationsForTable,
          // Para compatibilidade, manter a primeira reserva como "reservation"
          reservation: reservationsForTable[0],
        };
      }

      return {
        tableNumber,
        occupied: false,
        reservations: [],
        reservation: null,
      };
    });

    return NextResponse.json({
      date: data,
      time: horario,
      tables,
      summary: {
        total: TOTAL_TABLES,
        occupied: tableMap.size,
        available: TOTAL_TABLES - tableMap.size,
        totalPeople: reservations.reduce((sum, r) => sum + r.numeroPessoas, 0),
      }
    });

  } catch (error) {
    console.error('Erro ao buscar ocupação:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar ocupação de mesas' },
      { status: 500 }
    );
  }
}
