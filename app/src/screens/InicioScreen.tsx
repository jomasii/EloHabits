import React, { useState } from "react";
import { Button, RefreshControl, ScrollView, StyleSheet, Text } from "react-native";
import { useAuth } from "../auth/AuthContext";
import { ApiError } from "../api/client";
import { Mascote, StatusDupla } from "../api/types";

const MASCOTE: Record<Mascote, { emoji: string; texto: string }> = {
  feliz: { emoji: "😄", texto: "Feliz! Os dois cumpriram hoje." },
  faminto: { emoji: "😋", texto: "Faminto: falta check-in hoje." },
  desmaiado: { emoji: "😵", texto: "Desmaiado! O streak foi quebrado." },
};

const rotulo = (concluido: boolean) => (concluido ? "Concluído" : "Pendente");

export function InicioScreen({ status, onAtualizar }: { status: StatusDupla; onAtualizar: () => void | Promise<void> }) {
  const { api, sair } = useAuth();
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function atualizar() {
    setAtualizando(true);
    try {
      await onAtualizar();
    } finally {
      setAtualizando(false);
    }
  }

  async function fazerHoje() {
    setErro(null);
    try {
      await api.fazerCheckin();
      await onAtualizar();
    } catch (e) {
      setErro(e instanceof ApiError ? e.mensagem : "Erro inesperado");
    }
  }

  const m = MASCOTE[status.mascote];
  return (
    <ScrollView
      testID="scroll"
      contentContainerStyle={estilos.tela}
      refreshControl={<RefreshControl refreshing={atualizando} onRefresh={atualizar} />}
    >
      <Text testID={`mascote-${status.mascote}`} style={estilos.mascote}>{m.emoji}</Text>
      <Text>{m.texto}</Text>
      <Text testID="streak" style={estilos.streak}>{`${status.streak} dias seguidos`}</Text>
      <Text testID="status-eu">{`Você: ${rotulo(status.eu.concluidoHoje)}`}</Text>
      <Text testID="status-parceiro">{`Parceiro: ${rotulo(status.parceiro?.concluidoHoje ?? false)}`}</Text>
      {erro && <Text style={estilos.erro}>{erro}</Text>}
      <Button testID="fiz-hoje" title="Fiz hoje" onPress={fazerHoje} disabled={status.eu.concluidoHoje} />
      <Button title="Sair" onPress={sair} />
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  tela: { flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 24, gap: 12 },
  mascote: { fontSize: 96 },
  streak: { fontSize: 28, fontWeight: "bold" },
  erro: { color: "#b00020" },
});
