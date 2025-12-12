// Configuração das Mesas - Rosa Mexicano

export type TableArea = 'interno' | 'semi-externo' | 'externo';

export interface TableConfig {
  number: number;
  capacity: number;
  area: TableArea;
  description?: string;
  canCombine?: boolean; // Se pode ser combinada com outras mesas (padrão: true)
  linkedTable?: number; // Número da mesa vinculada que pode combinar com esta
}

// Mesas que NÃO existem
const MESAS_INEXISTENTES = [9, 13, 15];

// Área Interna (01-25, exceto 9, 13, 15)
const areaInterna: TableConfig[] = [
  { number: 1, capacity: 4, area: 'interno', canCombine: false },
  { number: 2, capacity: 4, area: 'interno', canCombine: false },
  { number: 3, capacity: 4, area: 'interno', canCombine: false },
  { number: 4, capacity: 4, area: 'interno', canCombine: false },
  { number: 5, capacity: 4, area: 'interno', canCombine: false },
  { number: 6, capacity: 4, area: 'interno', canCombine: false },
  { number: 7, capacity: 4, area: 'interno', canCombine: false },
  { number: 8, capacity: 4, area: 'interno', canCombine: false },
  // Mesa 9 não existe
  { number: 10, capacity: 2, area: 'interno', canCombine: false },
  { number: 11, capacity: 2, area: 'interno', canCombine: false },
  { number: 12, capacity: 2, area: 'interno', canCombine: false },
  // Mesa 13 não existe
  { number: 14, capacity: 4, area: 'interno', linkedTable: 16 },
  // Mesa 15 não existe
  { number: 16, capacity: 8, area: 'interno', linkedTable: 14 },
  { number: 17, capacity: 4, area: 'interno' },
  { number: 18, capacity: 4, area: 'interno' },
  { number: 19, capacity: 4, area: 'interno' },
  { number: 20, capacity: 4, area: 'interno' },
  { number: 21, capacity: 4, area: 'interno' },
  { number: 22, capacity: 4, area: 'interno' },
  { number: 23, capacity: 4, area: 'interno' },
  { number: 24, capacity: 4, area: 'interno' },
  { number: 25, capacity: 4, area: 'interno' },
];

// Área Semi Externa (26-37)
const areaSemiExterna: TableConfig[] = Array.from({ length: 12 }, (_, i) => ({
  number: 26 + i,
  capacity: 4,
  area: 'semi-externo' as TableArea,
}));

// Área Externa (38-51)
const areaExterna: TableConfig[] = Array.from({ length: 14 }, (_, i) => ({
  number: 38 + i,
  capacity: 4,
  area: 'externo' as TableArea,
}));

// Todas as mesas
export const ALL_TABLES: TableConfig[] = [
  ...areaInterna,
  ...areaSemiExterna,
  ...areaExterna,
];

// Constantes
export const TOTAL_TABLES = ALL_TABLES.length; // 48 mesas
export const TOTAL_CAPACITY = ALL_TABLES.reduce((sum, table) => sum + table.capacity, 0);

// Helper functions
export function getTablesByArea(area: TableArea): TableConfig[] {
  return ALL_TABLES.filter(table => table.area === area);
}

export function getTableByNumber(number: number): TableConfig | undefined {
  return ALL_TABLES.find(table => table.number === number);
}

export function getTableCapacity(number: number): number {
  const table = getTableByNumber(number);
  return table?.capacity || 4;
}

export function isValidTable(number: number): boolean {
  return !MESAS_INEXISTENTES.includes(number) && ALL_TABLES.some(t => t.number === number);
}

export function calculateTablesNeeded(people: number): number {
  return Math.ceil(people / 4);
}

// Função para validar se uma mesa pode ser combinada com outras
export function canTableBeCombined(tableNumber: number): boolean {
  const table = getTableByNumber(tableNumber);
  if (!table) return false;
  // Se canCombine é explicitamente false, não pode combinar
  if (table.canCombine === false) return false;
  return true;
}

// Função para validar se duas mesas podem ser combinadas juntas
export function canTablesBeJoined(table1: number, table2: number): boolean {
  const t1 = getTableByNumber(table1);
  const t2 = getTableByNumber(table2);

  if (!t1 || !t2) return false;

  // Verificar se ambas podem ser combinadas
  if (!canTableBeCombined(table1) || !canTableBeCombined(table2)) {
    return false;
  }

  // Verificar se são mesas vinculadas (como 14 e 16)
  if ((t1.linkedTable && t1.linkedTable === table2) ||
      (t2.linkedTable && t2.linkedTable === table1)) {
    return true;
  }

  // Se nenhuma tem linkedTable, podem ser combinadas normalmente
  if (!t1.linkedTable && !t2.linkedTable) {
    return true;
  }

  // Se apenas uma tem linkedTable, não podem ser combinadas com outras
  return false;
}

// Nomes das áreas para exibição
export const AREA_NAMES: Record<TableArea, string> = {
  'interno': 'Interno',
  'semi-externo': 'Semi Externo',
  'externo': 'Externo',
};

// Descrições das áreas
export const AREA_DESCRIPTIONS: Record<TableArea, string> = {
  'interno': 'Mesas 01-25',
  'semi-externo': 'Mesas 26-37',
  'externo': 'Mesas 38-51',
};
