import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Button, Text, View } from "react-native";
import { useAuth } from "../auth/AuthContext";
import { ApiError } from "../api/client";
import { StatusDupla } from "../api/types";
import { EntrarScreen } from "../screens/EntrarScreen";
import { DuplaScreen } from "../screens/DuplaScreen";
import { HabitoScreen } from "../screens/HabitoScreen";
import { InicioScreen } from "../screens/InicioScreen";

export type Tela = "Entrar" | "Dupla" | "Habito" | "Inicio";

export function escolherTela(token: string | null, status: StatusDupla | null): Tela {
  if (!token || !status) return "Entrar";
  if (!status.dupla || !status.dupla.completa) return "Dupla";
  if (!status.eu.temHabito) return "Habito";
  return "Inicio";
}

export function Rotas() {
  const { token, carregando, api, sair } = useAuth();
  const [status, setStatus] = useState<StatusDupla | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const atualizar = useCallback(async () => {
    try {
      setStatus(await api.status());
      setErro(null);
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) return sair();
      setErro(e instanceof ApiError ? e.mensagem : "Erro inesperado");
    }
  }, [api, sair]);

  useEffect(() => {
    if (token) atualizar();
    else setStatus(null);
  }, [token, atualizar]);

  if (carregando) return <ActivityIndicator />;
  if (!token) return <EntrarScreen />;
  if (erro) {
    return (
      <View testID="erro-rede" style={{ flex: 1, justifyContent: "center", padding: 24 }}>
        <Text>{erro}</Text>
        <Button title="Tentar de novo" onPress={atualizar} />
      </View>
    );
  }
  if (!status) return <ActivityIndicator />;

  switch (escolherTela(token, status)) {
    case "Dupla":
      return <DuplaScreen status={status} onAtualizar={atualizar} />;
    case "Habito":
      return <HabitoScreen status={status} onAtualizar={atualizar} />;
    default:
      return <InicioScreen status={status} onAtualizar={atualizar} />;
  }
}
