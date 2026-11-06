import { StatusDupla } from "./api/types";
import { AuthValue } from "./auth/AuthContext";

export interface TelaProps {
  status: StatusDupla;
  onAtualizar: () => void | Promise<void>;
}

export function statusBase(parcial: Partial<StatusDupla> = {}): StatusDupla {
  return {
    dupla: { codigo: "ABC123", completa: true }, streak: 0, mascote: "faminto",
    eu: { temHabito: true, concluidoHoje: false },
    parceiro: { temHabito: true, concluidoHoje: false },
    ...parcial,
  };
}

export type FakeApi = Partial<Record<keyof AuthValue["api"], jest.Mock>>;

import React from "react";
import { AuthContext } from "./auth/AuthContext";

export function comAuth(api: FakeApi, filho: React.ReactElement) {
  const valor = { token: "t", carregando: false, api, sair: jest.fn() } as unknown as AuthValue;
  return <AuthContext.Provider value={valor}>{filho}</AuthContext.Provider>;
}
