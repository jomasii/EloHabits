export type Mascote = "feliz" | "faminto" | "desmaiado";

export interface MembroStatus {
  temHabito: boolean;
  concluidoHoje: boolean;
}

/** Espelha GET /duplas/status da API. */
export interface StatusDupla {
  dupla: { codigo: string; completa: boolean } | null;
  streak: number;
  mascote: Mascote;
  eu: MembroStatus;
  parceiro: MembroStatus | null;
}
