'use client';

import { AlertCircle } from 'lucide-react';

interface CaixaInformacaoProps {
  customerName: string;
}

/**
 * Componente para exibir informações da reserva para o caixa
 * Mostra: Nome do cliente + lembrete de consumação obrigatória de R$50
 */
export function CaixaInformacao({ customerName }: CaixaInformacaoProps) {
  return (
    <div className="bg-gradient-to-r from-[#E53935] to-[#B71C1C] rounded-lg p-5 border-2 border-yellow-400 shadow-lg">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-6 h-6 text-yellow-300 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-sm font-bold text-white mb-2">INFORMAÇÃO PARA O CAIXA</h4>
          <div className="space-y-2">
            <div className="bg-black/30 rounded px-3 py-2">
              <p className="text-xs text-yellow-200 uppercase tracking-wider">Cliente</p>
              <p className="text-lg font-bold text-white">{customerName}</p>
            </div>
            <div className="bg-black/30 rounded px-3 py-2">
              <p className="text-xs text-yellow-200 uppercase tracking-wider">Consumação Mínima</p>
              <p className="text-lg font-bold text-white">R$ 50,00</p>
            </div>
            <p className="text-xs text-yellow-100 italic">
              ✓ Cliente já pagou R$ 50,00 antecipadamente via PIX
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
