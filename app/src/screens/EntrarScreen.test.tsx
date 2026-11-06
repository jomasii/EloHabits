import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { AuthContext, AuthValue } from "../auth/AuthContext";
import { EntrarScreen } from "./EntrarScreen";
import { ApiError } from "../api/client";

function renderizar(parcial: Partial<AuthValue> = {}) {
  const valor = {
    token: null, carregando: false, api: {},
    entrar: jest.fn().mockResolvedValue(undefined),
    cadastrar: jest.fn().mockResolvedValue(undefined),
    sair: jest.fn(),
    ...parcial,
  } as unknown as AuthValue;
  const tela = render(<AuthContext.Provider value={valor}><EntrarScreen /></AuthContext.Provider>);
  return { ...tela, valor };
}

function preencher(t: ReturnType<typeof renderizar>, email: string, senha: string) {
  fireEvent.changeText(t.getByPlaceholderText("E-mail"), email);
  fireEvent.changeText(t.getByPlaceholderText("Senha"), senha);
  fireEvent.press(t.getByTestId("enviar"));
}

test("e-mail inválido mostra erro sem chamar a API", () => {
  const t = renderizar();
  preencher(t, "nao-e-email", "123456");
  expect(t.getByText("E-mail inválido")).toBeTruthy();
  expect(t.valor.entrar).not.toHaveBeenCalled();
});

test("senha com menos de 6 caracteres mostra erro sem chamar a API", () => {
  const t = renderizar();
  preencher(t, "a@x.com", "12345");
  expect(t.getByText("A senha deve ter ao menos 6 caracteres")).toBeTruthy();
  expect(t.valor.entrar).not.toHaveBeenCalled();
});

test("dados válidos chamam entrar", async () => {
  const t = renderizar();
  preencher(t, "a@x.com", "123456");
  await waitFor(() => expect(t.valor.entrar).toHaveBeenCalledWith("a@x.com", "123456"));
});

test("erro da API é mostrado em texto", async () => {
  const t = renderizar({ entrar: jest.fn().mockRejectedValue(new ApiError(401, "credenciais inválidas")) });
  preencher(t, "a@x.com", "123456");
  expect(await t.findByText("credenciais inválidas")).toBeTruthy();
});

test("alternar para Criar conta usa cadastrar", async () => {
  const t = renderizar();
  fireEvent.press(t.getByTestId("alternar-modo"));
  preencher(t, "a@x.com", "123456");
  await waitFor(() => expect(t.valor.cadastrar).toHaveBeenCalledWith("a@x.com", "123456"));
});
