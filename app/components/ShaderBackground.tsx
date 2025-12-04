'use client';

import { MeshGradient } from '@paper-design/shaders-react';
import type React from 'react';

interface ShaderBackgroundProps {
  children: React.ReactNode;
}

// Paleta Rosa Mexicano
// #ffc95b - Amarelo
// #d71919 - Vermelho
// #f98f21 - Laranja
// #25bcc0 - Turquesa
// #234c91 - Azul

export function ShaderBackground({ children }: ShaderBackgroundProps) {
  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Background Shader - Mesh Gradient com cores mexicanas */}
      <MeshGradient
        className="absolute inset-0 w-full h-full"
        colors={['#000000', '#d71919', '#f98f21', '#1a0a0a', '#2d0f0f']}
        speed={0.15}
        backgroundColor="#0a0a0a"
      />

      {/* Overlay escuro para legibilidade */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80" />

      {/* Conteúdo */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

export function ShaderBackgroundLight({ children }: ShaderBackgroundProps) {
  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      <MeshGradient
        className="absolute inset-0 w-full h-full opacity-30"
        colors={['#d71919', '#f98f21', '#ffc95b', '#25bcc0', '#234c91']}
        speed={0.1}
        backgroundColor="#111111"
      />

      <div className="absolute inset-0 bg-black/70" />

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
