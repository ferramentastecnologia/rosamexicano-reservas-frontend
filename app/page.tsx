'use client';

import { Calendar, Users, Clock, Check, MapPin, Phone } from 'lucide-react';
import ReservaForm from './components/ReservaForm';
import { ShaderBackground } from './components/ShaderBackground';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <ShaderBackground>
      <div className="min-h-screen text-white">
        {/* Header */}
        <header className="relative z-20 flex items-center justify-between p-4 md:p-6">
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo-rosa-mexicano.png"
              alt="Rosa Mexicano"
              width={140}
              height={47}
              priority
              className="h-10 md:h-12 w-auto drop-shadow-lg"
            />
          </div>
          <div className="flex items-center">
            <span className="text-xs text-white/80 glass px-4 py-2 rounded-full font-light">
              Reservas Online
            </span>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative py-12 md:py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-1.5 rounded-full glass mb-6">
                <span className="text-white/90 text-xs font-light">Final de Ano 2024/2025</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-light mb-6 leading-tight tracking-tight">
                Celebre com{' '}
                <span className="font-medium italic text-[#f98f21]">Sabor</span>
                <br />
                <span className="text-[#d71919]">Autêntico Mexicano</span>
              </h1>

              {/* Description */}
              <p className="text-base md:text-lg text-white/70 mb-8 max-w-2xl mx-auto font-light leading-relaxed">
                Reserve sua mesa e garanta momentos inesquecíveis.
                <br />
                <span className="text-[#ffc95b] font-medium">R$ 50,00</span>
                <span className="text-white/60 text-sm"> convertidos em consumação</span>
              </p>

              {/* Stats */}
              <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-sm text-white/60 border-t border-white/10 pt-6 max-w-xl mx-auto">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#f98f21]" />
                  <span className="font-light">Até 31 de dezembro</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#f98f21]" />
                  <span className="font-light">2 a 60 pessoas</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#f98f21]" />
                  <span className="font-light">18h às 19h30</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Benefícios */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="grid md:grid-cols-3 gap-4 md:gap-6">
              {[
                { title: 'Ambiente Exclusivo', desc: 'Espaço preparado para sua confraternização' },
                { title: 'Cardápio Especial', desc: 'Pratos e bebidas selecionados' },
                { title: 'Garantia de Mesa', desc: 'Valor retornável em consumação' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="glass-strong rounded-2xl p-6 text-center"
                >
                  <div className="w-10 h-10 btn-mexican rounded-full flex items-center justify-center mx-auto mb-3">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-base font-medium mb-1">{item.title}</h4>
                  <p className="text-white/50 text-sm font-light">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Formulário de Reserva */}
        <section id="reserva" className="py-12 md:py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-light mb-3">
                  Faça sua <span className="font-medium text-[#ffc95b]">Reserva</span>
                </h2>
                <p className="text-white/50 text-sm font-light">
                  Preencha os dados e garanta sua mesa
                </p>
              </div>

              {/* Info Box */}
              <div className="max-w-3xl mx-auto mb-8 glass-strong rounded-2xl p-5">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#25bcc0]" />
                    <span className="text-white/70">2 a 208 pessoas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#25bcc0]" />
                    <span className="text-white/70">Múltiplos de 2</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#25bcc0]" />
                    <span className="text-white/70">49 mesas por data</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#25bcc0]" />
                    <span className="text-white/70">208 pessoas/dia</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#25bcc0]" />
                    <span className="text-white/70">18:00 às 19:30</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#ffc95b]" />
                    <span className="text-white/70">Escolha suas mesas</span>
                  </div>
                </div>
              </div>

              <ReservaForm />
            </motion.div>
          </div>
        </section>

        {/* Como Funciona */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-3xl">
            <h3 className="text-2xl font-light text-center mb-8">
              Como <span className="font-medium text-[#f98f21]">funciona</span>
            </h3>
            <div className="space-y-4">
              {[
                { step: 1, title: 'Escolha data, horário e pessoas', desc: 'Preencha o formulário' },
                { step: 2, title: 'Pagamento de R$ 50,00', desc: '100% retorna em consumação' },
                { step: 3, title: 'Confirmação instantânea', desc: 'E-mail e WhatsApp' },
              ].map((item) => (
                <div key={item.step} className="flex gap-4 items-start glass-strong rounded-xl p-4">
                  <div className="flex-shrink-0 w-8 h-8 btn-mexican rounded-full flex items-center justify-center text-white font-medium text-sm">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-0.5">{item.title}</h4>
                    <p className="text-white/50 text-xs">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Galeria */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-5xl">
            <h3 className="text-2xl font-light text-center mb-8">
              Nosso <span className="font-medium text-[#ffc95b]">Ambiente</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                '/images/ambiente/bnu01.jpg',
                '/images/ambiente/bnu02.jpg',
                '/images/ambiente/bnu03.jpg',
                '/images/ambiente/bnu04.jpg',
                '/images/ambiente/bnu05.jpg',
                '/images/ambiente/a3b363b686c06baa2308326374f9406b.jpg',
              ].map((src, i) => (
                <div key={i} className="relative aspect-square overflow-hidden rounded-xl">
                  <Image
                    src={src}
                    alt={`Ambiente ${i + 1}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Localização */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="glass-strong rounded-2xl p-6 md:p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-light mb-6">
                    Nosso <span className="font-medium text-[#f98f21]">Restaurante</span>
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-[#d71919] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Localização</p>
                        <p className="text-white/60 text-sm">Rua Carlos Rischbieter, 64</p>
                        <p className="text-white/60 text-sm">Victor Konder, Blumenau/SC</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-[#d71919] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Contato</p>
                        <p className="text-white/60 text-sm">(47) 3288-3096</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <a
                      href="tel:+554732883096"
                      className="px-5 py-2.5 rounded-full glass text-white text-xs font-light hover:bg-white/10 transition-all"
                    >
                      Ligar
                    </a>
                    <a
                      href="https://www.google.com/maps/dir/?api=1&destination=Rua+Carlos+Rischbieter,+64+-+Victor+Konder,+Blumenau+-+SC"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-full btn-mexican text-white text-xs font-medium"
                    >
                      Como Chegar
                    </a>
                  </div>
                </div>

                <div className="h-[250px] md:h-auto rounded-xl overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps?q=Rua+Carlos+Rischbieter,+64+-+Victor+Konder,+Blumenau+-+SC&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: '250px' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Localização"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 border-t border-white/5">
          <div className="container mx-auto text-center">
            <Image
              src="/images/logo-rosa-mexicano.png"
              alt="Rosa Mexicano"
              width={120}
              height={40}
              className="h-8 w-auto mx-auto mb-4 opacity-70"
            />
            <p className="text-white/40 text-xs mb-1">© 2025 Rosa Mexicano Restaurante</p>
            <p className="text-white/30 text-xs">(47) 3288-3096 • Victor Konder, Blumenau/SC</p>
          </div>
        </footer>
      </div>
    </ShaderBackground>
  );
}
