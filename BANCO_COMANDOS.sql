-- ============================================
-- ROSAMEXICANO - REMOVER SELEÇÃO DE MESA
-- COMANDOS PARA EXECUTAR NO BANCO DE PRODUÇÃO
-- ============================================

-- Remove a coluna mesasSelecionadas (customers não selecionam mesa mais)
ALTER TABLE "Reservation" DROP COLUMN IF EXISTS "mesasSelecionadas";

-- Adiciona coluna para o restaurante atribuir a mesa depois do pagamento
ALTER TABLE "Reservation" ADD COLUMN "mesaAtribuida" TEXT;

-- Cria índice para queries mais rápidas
CREATE INDEX "Reservation_mesaAtribuida_idx" ON "Reservation"("mesaAtribuida");
