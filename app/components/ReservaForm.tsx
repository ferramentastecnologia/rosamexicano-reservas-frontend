'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Calendar, User, CreditCard, Clock, ChevronDown, Users } from 'lucide-react';
import CalendarioReserva from './CalendarioReserva';

type ReservaFormData = {
  nome: string;
  email: string;
  telefone: string;
  data: string;
  horario: string;
  numeroPessoas: number;
};

const horarios = ['18:00', '18:30', '19:00', '19:30'];

export default function ReservaForm() {
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [horarioDropdownOpen, setHorarioDropdownOpen] = useState(false);
  const [selectedHorario, setSelectedHorario] = useState<string>('');
  const horarioDropdownRef = useRef<HTMLDivElement>(null);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (horarioDropdownRef.current && !horarioDropdownRef.current.contains(event.target as Node)) {
        setHorarioDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm<ReservaFormData>();

  const watchedData = useWatch({ control, name: 'data' });
  const watchedHorario = useWatch({ control, name: 'horario' });
  const watchedNumeroPessoas = useWatch({ control, name: 'numeroPessoas' });

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setValue('data', date);
  };

  const onSubmit = async (data: ReservaFormData) => {
    setLoading(true);

    try {
      const availabilityResponse = await fetch('/api/check-availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: data.data,
          horario: data.horario,
          numeroPessoas: data.numeroPessoas,
        }),
      });

      const availabilityData = await availabilityResponse.json();

      if (!availabilityData.available) {
        alert(
          `Infelizmente não temos disponibilidade para ${data.numeroPessoas} pessoas neste horário.\n\n` +
          `Capacidade disponível: ${availabilityData.capacity?.available || 0} pessoas\n\n` +
          `Por favor, escolha outro horário ou reduza o número de pessoas.`
        );
        setLoading(false);
        return;
      }

      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erro na resposta:', errorData);
        alert(`Erro ao processar reserva: ${errorData.error || 'Tente novamente.'}`);
        setLoading(false);
        return;
      }

      const result = await response.json();

      if (result.success && result.pixQrCode) {
        const paymentData = encodeURIComponent(JSON.stringify(result));
        window.location.href = `/pagamento?data=${paymentData}`;
      } else {
        alert('Erro ao processar reserva. Tente novamente.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao processar reserva. Verifique sua conexão e tente novamente.');
      setLoading(false);
    }
  };

  const inputClasses = "w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-[#C2185B] focus:ring-2 focus:ring-[#C2185B]/20 text-base text-gray-800 placeholder:text-gray-400 transition-all shadow-sm";
  const labelClasses = "block text-base font-medium text-gray-700 mb-3";
  const errorClasses = "text-[#d71919] text-sm mt-1 font-medium";

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 border-2 border-[#C2185B]/20 shadow-xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Linha 1: Dados Pessoais | Data e Horário */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-10">
          {/* Coluna 1: Dados Pessoais */}
          <div className="space-y-5">
            <h4 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
              <User className="w-4 h-4 text-[#C2185B]" />
              Seus Dados
            </h4>

            <div>
              <label className={labelClasses}>Nome Completo *</label>
              <input
                {...register('nome', { required: 'Nome é obrigatório' })}
                type="text"
                className={inputClasses}
                placeholder="Seu nome completo"
              />
              {errors.nome && <p className={errorClasses}>{errors.nome.message}</p>}
            </div>

            <div>
              <label className={labelClasses}>E-mail *</label>
              <input
                {...register('email', {
                  required: 'E-mail é obrigatório',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'E-mail inválido',
                  },
                })}
                type="email"
                className={inputClasses}
                placeholder="seu@email.com"
              />
              {errors.email && <p className={errorClasses}>{errors.email.message}</p>}
            </div>

            <div>
              <label className={labelClasses}>Telefone/WhatsApp *</label>
              <input
                {...register('telefone', {
                  required: 'Telefone é obrigatório',
                  pattern: {
                    value: /^[\d\s()+-]+$/,
                    message: 'Telefone inválido',
                  },
                })}
                type="tel"
                className={inputClasses}
                placeholder="(00) 00000-0000"
              />
              {errors.telefone && <p className={errorClasses}>{errors.telefone.message}</p>}
            </div>

            {/* Número de Pessoas */}
            <div>
              <label className={labelClasses}>
                <Users className="w-3.5 h-3.5 inline mr-1.5 text-[#C2185B]" />
                Número de Pessoas *
              </label>
              <input
                {...register('numeroPessoas', {
                  required: 'Número de pessoas é obrigatório',
                  valueAsNumber: true,
                  min: { value: 2, message: 'Mínimo 2 pessoas' },
                  max: { value: 60, message: 'Máximo 60 pessoas' },
                  validate: (value) => {
                    if (value % 2 !== 0) {
                      return 'Apenas múltiplos de 2';
                    }
                    return true;
                  }
                })}
                type="number"
                min="2"
                max="60"
                step="2"
                placeholder="Número de pessoas"
                className={inputClasses}
              />
              {errors.numeroPessoas && <p className={errorClasses}>{errors.numeroPessoas.message}</p>}
              <p className="text-xs text-gray-400 mt-1">
                Múltiplos de 2 • Mín: 2 • Máx: 60
              </p>
            </div>

            {/* Horário */}
            <div>
              <label className={labelClasses}>
                <Clock className="w-3.5 h-3.5 inline mr-1.5 text-[#C2185B]" />
                Horário *
              </label>
              <input type="hidden" {...register('horario', { required: 'Horário é obrigatório' })} />
              <div ref={horarioDropdownRef} className="relative">
                <button
                  type="button"
                  onClick={() => setHorarioDropdownOpen(!horarioDropdownOpen)}
                  className={`${inputClasses} flex items-center justify-between cursor-pointer`}
                >
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#C2185B]" />
                    <span className={selectedHorario ? 'text-gray-800' : 'text-gray-400'}>
                      {selectedHorario || 'Selecione o horário'}
                    </span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${horarioDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {horarioDropdownOpen && (
                  <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xl">
                    {horarios.map((horario) => (
                      <button
                        key={horario}
                        type="button"
                        onClick={() => {
                          setSelectedHorario(horario);
                          setValue('horario', horario);
                          setHorarioDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors ${
                          selectedHorario === horario
                            ? 'bg-[#C2185B] text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">{horario}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {errors.horario && <p className={errorClasses}>{errors.horario.message}</p>}
            </div>
          </div>

          {/* Coluna 2: Data */}
          <div className="space-y-5">
            <h4 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
              <Calendar className="w-4 h-4 text-[#C2185B]" />
              Data da Reserva
            </h4>

            {/* Calendário */}
            <div>
              <input type="hidden" {...register('data', { required: 'Selecione uma data' })} />
              <CalendarioReserva
                onSelectDate={handleDateSelect}
                selectedDate={selectedDate}
              />
              {errors.data && <p className={errorClasses}>{errors.data.message}</p>}
              {selectedDate && (
                <p className="text-[#C2185B] text-xs mt-2 font-medium">
                  {new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long',
                  })}
                </p>
              )}
            </div>
          </div>
        </div>


        {/* Linha 3: Resumo e Botão de Pagamento */}
        <div className="border-t border-gray-200 pt-6">
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
            {/* Destaque do benefício */}
            <div className="bg-[#00897B]/10 border border-[#00897B]/30 rounded-lg p-3 mb-4 flex items-center gap-3">
              <div className="bg-[#00897B] rounded-full p-2 shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <div>
                <p className="text-[#00897B] font-bold text-sm">Você não perde nada!</p>
                <p className="text-gray-600 text-xs">Os R$ 50 viram crédito para consumir no restaurante</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Info do valor */}
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1 font-medium">Valor da Reserva</p>
                  <p className="text-3xl font-bold text-[#E65100]">R$ 50,00</p>
                </div>
                <div className="border-l border-gray-300 pl-4">
                  <div className="bg-[#00897B]/10 text-[#00897B] text-xs font-bold px-3 py-2 rounded-full inline-block border border-[#00897B]/30">
                    100% VIRA CONSUMAÇÃO
                  </div>
                </div>
              </div>

              {/* Botão */}
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto bg-gradient-to-r from-[#C2185B] to-[#E65100] hover:from-[#a8155a] hover:to-[#d45a00] text-white font-bold text-base px-8 py-4 rounded-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#C2185B]/30 hover:scale-105"
              >
                {loading ? (
                  'Processando...'
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Continuar para Pagamento
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-3 text-center md:text-left">
              Em caso de não comparecimento, o valor ficará retido • Pagamento seguro via PIX
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
