import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { HabitoScreen } from "./HabitoScreen";
import { comAuth, statusBase } from "../testUtils";

const status = statusBase({ eu: { temHabito: false, concluidoHoje: false } });

test("bloqueia texto vazio sem chamar a API", () => {
  const api = { criarHabito: jest.fn() };
  const t = render(comAuth(api, <HabitoScreen status={status} onAtualizar={jest.fn()} />));
  fireEvent.press(t.getByTestId("salvar-habito"));
  expect(t.getByText("Descreva o hábito (até 50 caracteres)")).toBeTruthy();
  expect(api.criarHabito).not.toHaveBeenCalled();
});

test("bloqueia texto com mais de 50 caracteres", () => {
  const api = { criarHabito: jest.fn() };
  const t = render(comAuth(api, <HabitoScreen status={status} onAtualizar={jest.fn()} />));
  fireEvent.changeText(t.getByPlaceholderText("Ex.: Ler 20 minutos"), "x".repeat(51));
  fireEvent.press(t.getByTestId("salvar-habito"));
  expect(api.criarHabito).not.toHaveBeenCalled();
});

test("salvar chama a API e atualiza o status", async () => {
  const api = { criarHabito: jest.fn().mockResolvedValue({ id: "1" }) };
  const onAtualizar = jest.fn();
  const t = render(comAuth(api, <HabitoScreen status={status} onAtualizar={onAtualizar} />));
  fireEvent.changeText(t.getByPlaceholderText("Ex.: Ler 20 minutos"), "Ler 20 minutos");
  fireEvent.press(t.getByTestId("salvar-habito"));
  await waitFor(() => expect(onAtualizar).toHaveBeenCalled());
  expect(api.criarHabito).toHaveBeenCalledWith("Ler 20 minutos");
});
