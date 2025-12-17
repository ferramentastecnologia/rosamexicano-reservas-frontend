/**
 * Middleware simplificado - sem validação JWT
 * A autenticação é feita no client-side
 */

import { NextResponse } from 'next/server';

export function middleware() {
  // Deixa tudo passar - autenticação feita no client-side
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
