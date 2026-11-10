/** Único ponto de definição do fuso das datas de check-in (ADR-0004). */
const FUSO = "America/Fortaleza";

const formato = new Intl.DateTimeFormat("en-CA", { timeZone: FUSO, year: "numeric", month: "2-digit", day: "2-digit" });

/** Data `YYYY-MM-DD` de `agora` no fuso de Fortaleza. */
export function hojeFortaleza(agora: Date): string {
  return formato.format(agora);
}

/** Dia anterior a `dia` (`YYYY-MM-DD`). */
export function ontem(dia: string): string {
  const d = new Date(`${dia}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}
