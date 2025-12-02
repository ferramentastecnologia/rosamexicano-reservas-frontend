import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// Endpoint para criar usuário admin padrão
// Acesse: GET /api/admin/setup
export async function GET() {
  try {
    const defaultEmail = 'ferramentas.starken@gmail.com';
    const defaultPassword = '7Cagonomato#';
    const defaultName = 'Administrador';

    // Verificar se já existe
    const existingAdmin = await prisma.admin.findUnique({
      where: { email: defaultEmail },
    });

    if (existingAdmin) {
      return NextResponse.json({
        success: false,
        message: 'Usuário admin já existe',
        email: defaultEmail,
      });
    }

    // Criar hash da senha
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    // Criar usuário admin
    const admin = await prisma.admin.create({
      data: {
        email: defaultEmail,
        password: hashedPassword,
        name: defaultName,
        role: 'admin',
        permissions: JSON.stringify(['dashboard', 'reservations', 'voucher', 'reports', 'users']),
        active: true,
      },
    });

    console.log('Usuário admin criado:', admin.email);

    return NextResponse.json({
      success: true,
      message: 'Usuário admin criado com sucesso',
      email: admin.email,
      name: admin.name,
    });
  } catch (error) {
    console.error('Erro ao criar admin:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao criar usuário admin' },
      { status: 500 }
    );
  }
}
