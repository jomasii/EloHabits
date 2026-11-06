import React from "react";
import { Text } from "react-native";
import { render, waitFor, act } from "@testing-library/react-native";
import * as SecureStore from "expo-secure-store";
import { AuthProvider, useAuth, TOKEN_KEY } from "./AuthContext";

jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

const fetchMock = jest.fn();
let auth: ReturnType<typeof useAuth>;
function Espiao() {
  auth = useAuth();
  return <Text>{auth.carregando ? "carregando" : auth.token ?? "sem-token"}</Text>;
}

beforeEach(() => {
  jest.clearAllMocks();
  global.fetch = fetchMock as unknown as typeof fetch;
});

test("restaura o token guardado no SecureStore ao abrir", async () => {
  (SecureStore.getItemAsync as jest.Mock).mockResolvedValue("guardado");
  const { findByText } = render(<AuthProvider baseUrl="http://api"><Espiao /></AuthProvider>);
  expect(await findByText("guardado")).toBeTruthy();
});

test("login bem-sucedido guarda o token no SecureStore", async () => {
  (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);
  fetchMock.mockResolvedValue({ ok: true, status: 200, json: async () => ({ token: "t123" }) });
  const { findByText } = render(<AuthProvider baseUrl="http://api"><Espiao /></AuthProvider>);
  await findByText("sem-token");
  await act(async () => { await auth.entrar("a@x.com", "123456"); });
  expect(SecureStore.setItemAsync).toHaveBeenCalledWith(TOKEN_KEY, "t123");
  await waitFor(() => expect(auth.token).toBe("t123"));
});

test("sair apaga o token", async () => {
  (SecureStore.getItemAsync as jest.Mock).mockResolvedValue("t");
  const { findByText } = render(<AuthProvider baseUrl="http://api"><Espiao /></AuthProvider>);
  await findByText("t");
  await act(async () => { await auth.sair(); });
  expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(TOKEN_KEY);
  await waitFor(() => expect(auth.token).toBeNull());
});
