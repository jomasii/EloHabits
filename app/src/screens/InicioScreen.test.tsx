import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import { InicioScreen } from "./InicioScreen";
import { comAuth, statusBase } from "../testUtils";

test.each(["feliz", "faminto", "desmaiado"] as const)("renderiza o mascote no estado %s", (mascote) => {
  const t = render(comAuth({}, <InicioScreen status={statusBase({ mascote })} onAtualizar={jest.fn()} />));
  expect(t.getByTestId(`mascote-${mascote}`)).toBeTruthy();
});

test("mostra o streak em destaque e Pendente/Concluído dos dois membros", () => {
  const status = statusBase({
    streak: 4,
    eu: { temHabito: true, concluidoHoje: true },
    parceiro: { temHabito: true, concluidoHoje: false },
  });
  const t = render(comAuth({}, <InicioScreen status={status} onAtualizar={jest.fn()} />));
  expect(t.getByTestId("streak").props.children).toContain("4");
  expect(t.getByTestId("status-eu").props.children).toContain("Concluído");
  expect(t.getByTestId("status-parceiro").props.children).toContain("Pendente");
});

test('botão "Fiz hoje" chama fazerCheckin e recarrega o status', async () => {
  const api = { fazerCheckin: jest.fn().mockResolvedValue({ ok: true }) };
  const onAtualizar = jest.fn();
  const t = render(comAuth(api, <InicioScreen status={statusBase()} onAtualizar={onAtualizar} />));
  fireEvent.press(t.getByTestId("fiz-hoje"));
  await waitFor(() => expect(onAtualizar).toHaveBeenCalled());
  expect(api.fazerCheckin).toHaveBeenCalled();
});

test("pull-to-refresh recarrega o status", async () => {
  const onAtualizar = jest.fn().mockResolvedValue(undefined);
  const t = render(comAuth({}, <InicioScreen status={statusBase()} onAtualizar={onAtualizar} />));
  await act(async () => { await t.getByTestId("scroll").props.refreshControl.props.onRefresh(); });
  expect(onAtualizar).toHaveBeenCalled();
});
