import { ontem } from "./tempo";

export type Mascote = "feliz" | "faminto" | "desmaiado";

export interface EntradaMascote {
  /** Datas em que os DOIS membros concluíram. */
  diasCompletos: string[];
  hoje: string;
  /** Data (Fortaleza) em que a dupla foi criada. */
  inicioDupla: string;
}

export function estadoMascote({ diasCompletos, hoje, inicioDupla }: EntradaMascote): Mascote {
  const completos = new Set(diasCompletos);
  if (completos.has(hoje)) return "feliz";
  const ultimoFechado = ontem(hoje);
  if (ultimoFechado >= inicioDupla && !completos.has(ultimoFechado)) return "desmaiado";
  return "faminto";
}
