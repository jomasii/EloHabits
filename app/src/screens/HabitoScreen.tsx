import React, { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { useAuth } from "../auth/AuthContext";
import { ApiError } from "../api/client";
import { StatusDupla } from "../api/types";

const MAX = 50;

export function HabitoScreen({ onAtualizar }: { status: StatusDupla; onAtualizar: () => void | Promise<void> }) {
  const { api } = useAuth();
  const [texto, setTexto] = useState("");
  const [erro, setErro] = useState<string | null>(null);

  async function salvar() {
    const descricao = texto.trim();
    if (descricao === "" || descricao.length > MAX) return setErro(`Descreva o hábito (até ${MAX} caracteres)`);
    setErro(null);
    try {
      await api.criarHabito(descricao);
      await onAtualizar();
    } catch (e) {
      setErro(e instanceof ApiError ? e.mensagem : "Erro inesperado");
    }
  }

  return (
    <View style={estilos.tela} testID="tela-habito">
      <Text style={estilos.titulo}>Seu hábito diário</Text>
      <TextInput style={estilos.campo} placeholder="Ex.: Ler 20 minutos" value={texto} onChangeText={setTexto} />
      {erro && <Text style={estilos.erro}>{erro}</Text>}
      <Button testID="salvar-habito" title="Salvar" onPress={salvar} />
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, justifyContent: "center", padding: 24, gap: 12 },
  titulo: { fontSize: 22, fontWeight: "bold" },
  campo: { borderWidth: 1, borderColor: "#999", borderRadius: 6, padding: 10 },
  erro: { color: "#b00020" },
});
