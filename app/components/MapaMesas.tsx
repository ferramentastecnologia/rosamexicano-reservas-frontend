'use client';

import { useState, useEffect } from 'react';
import { Check, X, Users } from 'lucide-react';

type Mesa = {
  number: number;
  available: boolean;
  capacity: number;
};

type MapaMesasProps = {
  data: string;
  horario: string;
  numeroPessoas: number;
  onMesasSelect: (mesas: number[]) => void;
};

export default function MapaMesas({ data, horario, numeroPessoas, onMesasSelect }: MapaMesasProps) {
  const [tables, setTables] = useState<Mesa[]>([]);
  const [selectedTables, setSelectedTables] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data && horario) {
      loadAvailableTables();
    }
  }, [data, horario]);

  useEffect(() => {
    // Calcular mesas necessárias automaticamente
    if (numeroPessoas > 0) {
      const mesasNecessarias = Math.ceil(numeroPessoas / 4);
      // Limpar seleção anterior se mudar o número de pessoas
      setSelectedTables([]);
    }
  }, [numeroPessoas]);

  const loadAvailableTables = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/get-available-tables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, horario }),
      });

      const result = await response.json();
      if (result.tables) {
        setTables(result.tables);
      }
    } catch (error) {
      console.error('Erro ao carregar mesas:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTable = (tableNumber: number) => {
    const table = tables.find(t => t.number === tableNumber);
    if (!table || !table.available) return;

    const mesasNecessarias = Math.ceil(numeroPessoas / 4);

    setSelectedTables(prev => {
      const isSelected = prev.includes(tableNumber);

      if (isSelected) {
        // Remover mesa
        const newSelection = prev.filter(num => num !== tableNumber);
        onMesasSelect(newSelection);
        return newSelection;
      } else {
        // Adicionar mesa (se não exceder o necessário)
        if (prev.length < mesasNecessarias) {
          const newSelection = [...prev, tableNumber].sort((a, b) => a - b);
          onMesasSelect(newSelection);
          return newSelection;
        }
        return prev;
      }
    });
  };

  const mesasNecessarias = Math.ceil(numeroPessoas / 4);
  const capacidadeSelecionada = selectedTables.length * 4;
  const selecaoCompleta = selectedTables.length === mesasNecessarias;

  if (!data || !horario) {
    return (
      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
        <p className="text-zinc-400 text-center">
          Selecione primeiro a data e o horário para ver as mesas disponíveis
        </p>
      </div>
    );
  }

  if (numeroPessoas === 0 || isNaN(numeroPessoas)) {
    return (
      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
        <p className="text-zinc-400 text-center">
          Informe o número de pessoas para selecionar as mesas
        </p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
      <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Users className="w-5 h-5 text-[#E53935]" />
        Seleção de Mesas
      </h4>

      {/* Informações */}
      <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
        <div className="bg-black rounded p-3 border border-zinc-700">
          <p className="text-zinc-400 text-xs mb-1">Pessoas</p>
          <p className="text-white font-semibold">{numeroPessoas}</p>
        </div>
        <div className="bg-black rounded p-3 border border-zinc-700">
          <p className="text-zinc-400 text-xs mb-1">Mesas Necessárias</p>
          <p className="text-white font-semibold">{mesasNecessarias}</p>
        </div>
        <div className="bg-black rounded p-3 border border-zinc-700">
          <p className="text-zinc-400 text-xs mb-1">Mesas Selecionadas</p>
          <p className={`font-semibold ${selecaoCompleta ? 'text-green-500' : 'text-yellow-500'}`}>
            {selectedTables.length} / {mesasNecessarias}
          </p>
        </div>
        <div className="bg-black rounded p-3 border border-zinc-700">
          <p className="text-zinc-400 text-xs mb-1">Capacidade Total</p>
          <p className="text-white font-semibold">{capacidadeSelecionada} lugares</p>
        </div>
      </div>

      {/* Status da Seleção */}
      {selectedTables.length > 0 && (
        <div className={`mb-4 p-3 rounded border ${
          selecaoCompleta
            ? 'bg-green-900/20 border-green-800'
            : 'bg-yellow-900/20 border-yellow-800'
        }`}>
          <p className={`text-sm ${selecaoCompleta ? 'text-green-400' : 'text-yellow-400'}`}>
            {selecaoCompleta ? (
              <>
                <Check className="w-4 h-4 inline mr-1" />
                Seleção completa! Mesas: {selectedTables.join(', ')}
              </>
            ) : (
              <>
                Selecione mais {mesasNecessarias - selectedTables.length} mesa(s)
              </>
            )}
          </p>
        </div>
      )}

      {/* Mapa de Mesas */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#E53935] mx-auto"></div>
          <p className="text-zinc-400 mt-2 text-sm">Carregando mesas...</p>
        </div>
      ) : (
        <div className="grid grid-cols-5 gap-3">
          {tables.map(table => {
            const isSelected = selectedTables.includes(table.number);
            const isAvailable = table.available;

            return (
              <button
                key={table.number}
                type="button"
                onClick={() => toggleTable(table.number)}
                disabled={!isAvailable}
                className={`
                  aspect-square rounded-lg border-2 flex flex-col items-center justify-center
                  transition-all duration-200 relative
                  ${isSelected
                    ? 'bg-[#E53935] border-[#E53935] text-white scale-105 shadow-lg'
                    : isAvailable
                      ? 'bg-zinc-800 border-zinc-700 text-white hover:border-[#E53935] hover:scale-105'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-600 cursor-not-allowed'
                  }
                `}
              >
                <span className="text-lg font-bold">{table.number}</span>
                <span className="text-xs mt-1">
                  {isAvailable ? (
                    isSelected ? <Check className="w-4 h-4" /> : `${table.capacity}p`
                  ) : (
                    <X className="w-4 h-4" />
                  )}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Legenda */}
      <div className="mt-4 flex gap-4 text-xs text-zinc-400 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-zinc-800 border border-zinc-700 rounded"></div>
          <span>Disponível</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[#E53935] border border-[#E53935] rounded"></div>
          <span>Selecionada</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-zinc-950 border border-zinc-800 rounded"></div>
          <span>Ocupada</span>
        </div>
      </div>

      {/* Botão de Atualizar */}
      <button
        type="button"
        onClick={loadAvailableTables}
        className="mt-4 w-full py-2 bg-zinc-800 hover:bg-zinc-700 rounded text-sm text-zinc-300 transition"
      >
        🔄 Atualizar Disponibilidade
      </button>
    </div>
  );
}
