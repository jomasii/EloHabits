import { ontem } from "./tempo";

/**
 * `diasCompletos`: datas em que os DOIS membros concluíram.
 * Conta dias consecutivos terminando em `hoje` (se completo) ou em ontem (dia aberto não quebra).
 */
export function calcularStreak(diasCompletos: string[], hoje: string): number {
  const completos = new Set(diasCompletos);
  let dia = completos.has(hoje) ? hoje : ontem(hoje);
  let streak = 0;
  while (completos.has(dia)) {
    streak++;
    dia = ontem(dia);
  }
  return streak;
}
