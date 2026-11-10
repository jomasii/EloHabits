import React from "react";
import { render } from "@testing-library/react-native";
import { AuthContext, AuthValue } from "../auth/AuthContext";
import { Rotas, escolherTela } from "./Rotas";
import { StatusDupla } from "../api/types";

const base: StatusDupla = {
  dupla: { codigo: "ABC123", completa: true }, streak: 0, mascote: "faminto",
  eu: { temHabito: true, concluidoHoje: false }, parceiro: { temHabito: true, concluidoHoje: false },
};

test("escolherTela: sem token → Entrar", () => expect(escolherTela(null, null)).toBe("Entrar"));
test("escolherTela: sem dupla → Dupla", () => expect(escolherTela("t", { ...base, dupla: null })).toBe("Dupla"));
test("escolherTela: dupla incompleta → Dupla", () => {
  expect(escolherTela("t", { ...base, dupla: { codigo: "A", completa: false } })).toBe("Dupla");
});
test("escolherTela: sem hábito → Habito", () => {
  expect(escolherTela("t", { ...base, eu: { temHabito: false, concluidoHoje: false } })).toBe("Habito");
});
test("escolherTela: completo → Inicio", () => expect(escolherTela("t", base)).toBe("Inicio"));

test("Rotas renderiza a tela correspondente ao status carregado", async () => {
  const valor = {
    token: "t", carregando: false, sair: jest.fn(),
    api: { status: jest.fn().mockResolvedValue({ ...base, dupla: null }) },
  } as unknown as AuthValue;
  const { findByTestId } = render(<AuthContext.Provider value={valor}><Rotas /></AuthContext.Provider>);
  expect(await findByTestId("tela-dupla")).toBeTruthy();
});
