import { FastifyInstance } from "fastify";
import { Knex } from "knex";
import { authenticate } from "../auth-middleware";
import { buscarDuplaDoUsuario } from "../../infra/repos/pairs";
import { buscarHabito } from "../../infra/repos/habits";
import { checkinsDeHoje, diasCompletosDaDupla } from "../../infra/repos/checkins";
import { hojeFortaleza } from "../../domain/tempo";
import { calcularStreak } from "../../domain/streak";
import { estadoMascote, Mascote } from "../../domain/mascote";

export interface StatusDupla {
  dupla: { codigo: string; completa: boolean } | null;
  streak: number;
  mascote: Mascote;
  eu: { temHabito: boolean; concluidoHoje: boolean };
  parceiro: { temHabito: boolean; concluidoHoje: boolean } | null;
}

export function registrarStatus(app: FastifyInstance, opts: { db: Knex; jwtSecret: string; agora: () => Date }): void {
  const { db, jwtSecret, agora } = opts;

  app.get("/duplas/status", { preHandler: authenticate(jwtSecret) }, async (request): Promise<StatusDupla> => {
    const usuarioId = request.userId!;
    const dupla = await buscarDuplaDoUsuario(db, usuarioId);
    const euTemHabito = !!(await buscarHabito(db, usuarioId));
    if (!dupla) {
      return {
        dupla: null, streak: 0, mascote: "faminto",
        eu: { temHabito: euTemHabito, concluidoHoje: false }, parceiro: null,
      };
    }
    const hoje = hojeFortaleza(agora());
    const parceiroId = dupla.usuarioAId === usuarioId ? dupla.usuarioBId : dupla.usuarioAId;
    const [diasCompletos, fizeramHoje, parceiroHabito] = await Promise.all([
      diasCompletosDaDupla(db, dupla.id),
      checkinsDeHoje(db, dupla.id, hoje),
      parceiroId ? buscarHabito(db, parceiroId) : Promise.resolve(undefined),
    ]);
    return {
      dupla: { codigo: dupla.codigo, completa: parceiroId !== null },
      streak: calcularStreak(diasCompletos, hoje),
      mascote: estadoMascote({ diasCompletos, hoje, inicioDupla: hojeFortaleza(dupla.criadoEm) }),
      eu: { temHabito: euTemHabito, concluidoHoje: fizeramHoje.has(usuarioId) },
      parceiro: parceiroId
        ? { temHabito: !!parceiroHabito, concluidoHoje: fizeramHoje.has(parceiroId) }
        : null,
    };
  });
}
