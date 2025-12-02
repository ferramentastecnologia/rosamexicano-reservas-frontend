import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Validar (marcar como utilizado) voucher
export async function POST(
  request: Request,
  { params }: { params: Promise<{ codigo: string }> }
) {
  try {
    const { codigo } = await params;

    // Buscar voucher
    const voucher = await prisma.voucher.findUnique({
      where: { codigo: codigo.toUpperCase() },
    });

    if (!voucher) {
      return NextResponse.json(
        { error: 'Voucher não encontrado' },
        { status: 404 }
      );
    }

    if (voucher.utilizado) {
      return NextResponse.json(
        { error: 'Voucher já foi utilizado' },
        { status: 400 }
      );
    }

    // Verificar validade
    if (new Date() > new Date(voucher.dataValidade)) {
      return NextResponse.json(
        { error: 'Voucher expirado' },
        { status: 400 }
      );
    }

    // Marcar como utilizado
    const updatedVoucher = await prisma.voucher.update({
      where: { codigo: codigo.toUpperCase() },
      data: {
        utilizado: true,
        dataUtilizacao: new Date(),
      },
      include: {
        reservation: true,
      }
    });

    console.log(`Voucher ${codigo} validado com sucesso!`);

    return NextResponse.json({
      success: true,
      message: 'Voucher validado com sucesso',
      voucher: updatedVoucher,
    });
  } catch (error) {
    console.error('Erro ao validar voucher:', error);
    return NextResponse.json(
      { error: 'Erro ao validar voucher' },
      { status: 500 }
    );
  }
}
