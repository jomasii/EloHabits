import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import * as Clipboard from "expo-clipboard";
import { DuplaScreen } from "./DuplaScreen";
import { comAuth, statusBase } from "../testUtils";
import { ApiError } from "../api/client";

jest.mock("expo-clipboard", () => ({ setStringAsync: jest.fn().mockResolvedValue(true) }));

test("criar dupla chama a API e atualiza o status", async () => {
  const api = { criarDupla: jest.fn().mockResolvedValue({ id: "1", codigo: "ABC123" }) };
  const onAtualizar = jest.fn();
  const t = render(comAuth(api, <DuplaScreen status={statusBase({ dupla: null, parceiro: null })} onAtualizar={onAtualizar} />));
  fireEvent.press(t.getByTestId("criar-dupla"));
  await waitFor(() => expect(onAtualizar).toHaveBeenCalled());
  expect(api.criarDupla).toHaveBeenCalled();
});

test("dupla aguardando parceiro mostra o código de 6 caracteres e o botão Copiar", async () => {
  const t = render(comAuth({}, <DuplaScreen status={statusBase({ dupla: { codigo: "ABC123", completa: false }, parceiro: null })} onAtualizar={jest.fn()} />));
  expect(t.getByTestId("codigo-convite").props.children).toBe("ABC123");
  fireEvent.press(t.getByTestId("copiar"));
  await waitFor(() => expect(Clipboard.setStringAsync).toHaveBeenCalledWith("ABC123"));
});

test("aceitar com código inexistente mostra o erro em texto", async () => {
  const api = { aceitarConvite: jest.fn().mockRejectedValue(new ApiError(404, "código inexistente")) };
  const t = render(comAuth(api, <DuplaScreen status={statusBase({ dupla: null, parceiro: null })} onAtualizar={jest.fn()} />));
  fireEvent.changeText(t.getByPlaceholderText("Código do convite"), "zzzzzz");
  fireEvent.press(t.getByTestId("aceitar"));
  expect(await t.findByText("código inexistente")).toBeTruthy();
});
