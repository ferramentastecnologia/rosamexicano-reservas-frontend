'use client';

import { useState, useEffect } from 'react';
import { Check, X, Users, MapPin } from 'lucide-react';
import { TableArea, AREA_NAMES, AREA_DESCRIPTIONS } from '@/lib/tables-config';

type Mesa = {
  number: number;
  available: boolean;
  capacity: number;
  area: TableArea;
};

type MapaMesasProps = {
  data: string;
  horario: string;
  numeroPessoas: number;
  onMesasSelect: (mesas: number[]) => void;
  onAreaSelect?: (area: TableArea) => void;
};

export default function MapaMesas({ data, horario, numeroPessoas, onMesasSelect, onAreaSelect }: MapaMesasProps) {
  const [tables, setTables] = useState<Mesa[]>([]);
  const [selectedTables, setSelectedTables] = useState<number[]>([]);
  const [selectedArea, setSelectedArea] = useState<TableArea | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data && horario && selectedArea) {
      loadAvailableTables();
    }
  }, [data, horario, selectedArea]);

  useEffect(() => {
    if (numeroPessoas > 0) {
      setSelectedTables([]);
    }
  }, [numeroPessoas]);

  useEffect(() => {
    setSelectedTables([]);
    onMesasSelect([]);
  }, [selectedArea]);

  const loadAvailableTables = async () => {
    if (!selectedArea) return;

    setLoading(true);
    try {
      const response = await fetch('/api/get-available-tables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, horario, area: selectedArea }),
      });

      const result = await response.json();

      if (result.error) {
        console.error('Erro na API:', result.error);
        setTables([]);
      } else if (result.tables) {
        setTables(result.tables);
      } else {
        setTables([]);
      }
    } catch (error) {
      console.error('Erro ao carregar mesas:', error);
      setTables([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAreaSelect = (area: TableArea) => {
    setSelectedArea(area);
    onAreaSelect?.(area);
  };

  const toggleTable = (tableNumber: number) => {
    const table = tables.find(t => t.number === tableNumber);
    if (!table || !table.available) return;

    const mesasNecessarias = Math.ceil(numeroPessoas / 4);

    setSelectedTables(prev => {
      const isSelected = prev.includes(tableNumber);

      if (isSelected) {
        const newSelection = prev.filter(num => num !== tableNumber);
        onMesasSelect(newSelection);
        return newSelection;
      } else {
        if (prev.length < mesasNecessarias) {
          const newSelection = [...prev, tableNumber].sort((a, b) => a - b);
          onMesasSelect(newSelection);
          return newSelection;
        }
        return prev;
      }
    });
  };

  const pessoasValidas = numeroPessoas && !isNaN(numeroPessoas) && numeroPessoas > 0;
  const mesasNecessarias = pessoasValidas ? Math.ceil(numeroPessoas / 4) : 0;
  const selecaoCompleta = mesasNecessarias > 0 && selectedTables.length === mesasNecessarias;

  if (!data || !horario) {
    return (
      <div className="bg-black/30 rounded-xl p-5 border border-white/5">
        <p className="text-white/40 text-center text-sm">
          Selecione data e horário para ver as mesas
        </p>
      </div>
    );
  }

  if (!pessoasValidas) {
    return (
      <div className="bg-black/30 rounded-xl p-5 border border-white/5">
        <p className="text-white/40 text-center text-sm">
          Informe o número de pessoas para selecionar mesas
        </p>
      </div>
    );
  }

  return (
    <div className="bg-black/30 rounded-xl p-4 border border-white/5">
      <h4 className="text-sm font-light mb-4 flex items-center gap-2 text-white/90">
        <Users className="w-4 h-4 text-[#f98f21]" />
        Seleção de Mesas
      </h4>

      {/* Seletor de Área */}
      <div className="mb-4">
        <label className="block text-xs font-light text-white/50 mb-2 flex items-center gap-1.5">
          <MapPin className="w-3 h-3 text-[#f98f21]" />
          Área do restaurante
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['interno', 'semi-externo', 'externo'] as TableArea[]).map((area) => (
            <button
              key={area}
              type="button"
              onClick={() => handleAreaSelect(area)}
              className={`
                p-3 rounded-xl border transition-all duration-200 text-center
                ${selectedArea === area
                  ? 'btn-mexican border-transparent text-white'
                  : 'bg-white/5 border-white/5 text-white/70 hover:border-[#f98f21]/50 hover:bg-white/10'
                }
              `}
            >
              <p className="font-medium text-xs">{AREA_NAMES[area]}</p>
              <p className="text-[10px] mt-0.5 opacity-60">{AREA_DESCRIPTIONS[area]}</p>
            </button>
          ))}
        </div>
      </div>

      {selectedArea ? (
        <>
          {/* Informações */}
          <div className="mb-3 bg-black/40 rounded-lg p-3 border border-white/5">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-[10px] text-white/40">Pessoas</p>
                <p className="text-base font-medium text-[#f98f21]">{numeroPessoas}</p>
              </div>
              <div>
                <p className="text-[10px] text-white/40">Necessárias</p>
                <p className="text-base font-medium text-white">{mesasNecessarias}</p>
              </div>
              <div>
                <p className="text-[10px] text-white/40">Selecionadas</p>
                <p className={`text-base font-medium ${selecaoCompleta ? 'text-[#25bcc0]' : 'text-[#ffc95b]'}`}>
                  {selectedTables.length}/{mesasNecessarias}
                </p>
              </div>
            </div>
          </div>

          {/* Status */}
          {selectedTables.length > 0 && (
            <div className={`mb-3 p-2.5 rounded-lg border ${
              selecaoCompleta
                ? 'bg-[#25bcc0]/10 border-[#25bcc0]/30'
                : 'bg-[#ffc95b]/10 border-[#ffc95b]/30'
            }`}>
              <p className={`text-xs ${selecaoCompleta ? 'text-[#25bcc0]' : 'text-[#ffc95b]'}`}>
                {selecaoCompleta ? (
                  <>
                    <Check className="w-3 h-3 inline mr-1" />
                    Mesas: {selectedTables.join(', ')}
                  </>
                ) : (
                  <>Selecione mais {mesasNecessarias - selectedTables.length} mesa(s)</>
                )}
              </p>
            </div>
          )}

          {/* Mesas */}
          {loading ? (
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-lg bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : tables.length > 0 ? (
            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-[10px] text-white/40">
                  {tables.filter(t => t.available).length} disponíveis
                </p>
              </div>
              <div className="grid grid-cols-5 gap-2">
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
                        aspect-square rounded-lg border flex flex-col items-center justify-center
                        transition-all duration-200 relative
                        ${isSelected
                          ? 'btn-mexican border-transparent text-white scale-105'
                          : isAvailable
                            ? 'bg-white/5 border-white/10 text-white/70 hover:border-[#f98f21]/50 hover:scale-105'
                            : 'bg-black/30 border-white/5 text-white/20 cursor-not-allowed'
                        }
                      `}
                    >
                      {isSelected && (
                        <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#25bcc0] rounded-full flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                      <span className="text-sm font-medium">{table.number}</span>
                      <span className="text-[10px]">
                        {isAvailable ? `${table.capacity}p` : <X className="w-3 h-3" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-white/40">
              <p className="text-xs">Nenhuma mesa nesta área</p>
            </div>
          )}

          {/* Legenda */}
          <div className="mt-3 flex gap-3 text-[10px] text-white/40 justify-center">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-white/5 border border-white/10 rounded"></div>
              <span>Disponível</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 btn-mexican rounded"></div>
              <span>Selecionada</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-black/30 border border-white/5 rounded"></div>
              <span>Ocupada</span>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-6 text-white/40 border border-dashed border-white/10 rounded-lg">
          <MapPin className="w-6 h-6 mx-auto mb-2 opacity-40" />
          <p className="text-xs">Selecione uma área acima</p>
        </div>
      )}
    </div>
  );
}
