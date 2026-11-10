import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { ApiClient, createApiClient } from "../api/client";

export const TOKEN_KEY = "elohabits_token";

export interface AuthValue {
  token: string | null;
  carregando: boolean;
  api: ApiClient;
  entrar(email: string, senha: string): Promise<void>;
  cadastrar(email: string, senha: string): Promise<void>;
  sair(): Promise<void>;
}

export const AuthContext = createContext<AuthValue | null>(null);

export function useAuth(): AuthValue {
  const valor = useContext(AuthContext);
  if (!valor) throw new Error("useAuth fora do AuthProvider");
  return valor;
}

export function AuthProvider({ baseUrl, children }: { baseUrl: string; children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const tokenRef = useRef<string | null>(null);

  const api = useMemo(() => createApiClient(baseUrl, async () => tokenRef.current), [baseUrl]);

  useEffect(() => {
    SecureStore.getItemAsync(TOKEN_KEY).then((guardado) => {
      tokenRef.current = guardado;
      setToken(guardado);
      setCarregando(false);
    });
  }, []);

  const entrar = useCallback(
    async (email: string, senha: string) => {
      const { token: novo } = await api.login(email, senha);
      await SecureStore.setItemAsync(TOKEN_KEY, novo);
      tokenRef.current = novo;
      setToken(novo);
    },
    [api],
  );

  const cadastrar = useCallback(
    async (email: string, senha: string) => {
      await api.cadastro(email, senha);
      await entrar(email, senha);
    },
    [api, entrar],
  );

  const sair = useCallback(async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    tokenRef.current = null;
    setToken(null);
  }, []);

  const valor = useMemo(
    () => ({ token, carregando, api, entrar, cadastrar, sair }),
    [token, carregando, api, entrar, cadastrar, sair],
  );
  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}
