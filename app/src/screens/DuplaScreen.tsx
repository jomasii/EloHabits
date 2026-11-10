import React, { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import * as Clipboard from "expo-clipboard";
import { useAuth } from "../auth/AuthContext";
import { ApiError } from "../api/client";
import { StatusDupla } from "../api/types";

interface Props {
  status: StatusDupla;
  onAtualizar: () => void | Promise<void>;
}

export function DuplaScreen({ status, onAtualizar }: Props) {
  const { api } = useAuth();
  const [codigo, setCodigo] = useState("");
  const [erro, setErro] = useState<string | null>(null);

  async function executar(acao: () => Promise<unknown>) {
    setErro(null);
    try {
      await acao();
      await onAtualizar();
    } catch (e) {
      setErro(e instanceof ApiError ? e.mensagem : "Erro inesperado");
    }
  }

  if (status.dupla && !status.dupla.completa) {
    return (
      <View style={estilos.tela} testID="tela-dupla">
        <Text>Envie este código ao seu parceiro:</Text>
        <Text style={estilos.codigo} testID="codigo-convite">{status.dupla.codigo}</Text>
        <Button testID="copiar" title="Copiar" onPress={() => Clipboard.setStringAsync(status.dupla!.codigo)} />
        <Button testID="atualizar" title="Já aceitou? Atualizar" onPress={() => executar(async () => undefined)} />
        {erro && <Text style={estilos.erro}>{erro}</Text>}
      </View>
    );
  }

  return (
    <View style={estilos.tela} testID="tela-dupla">
      <Text style={estilos.titulo}>Forme sua dupla</Text>
      <Button testID="criar-dupla" title="Criar dupla" onPress={() => executar(() => api.criarDupla())} />
      <Text>ou entre com o código do parceiro:</Text>
      <TextInput style={estilos.campo} placeholder="Código do convite" autoCapitalize="characters" maxLength={6} value={codigo} onChangeText={setCodigo} />
      <Button testID="aceitar" title="Aceitar convite" onPress={() => executar(() => api.aceitarConvite(codigo))} />
      {erro && <Text style={estilos.erro}>{erro}</Text>}
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, justifyContent: "center", padding: 24, gap: 12 },
  titulo: { fontSize: 22, fontWeight: "bold" },
  codigo: { fontSize: 36, fontWeight: "bold", letterSpacing: 4, textAlign: "center" },
  campo: { borderWidth: 1, borderColor: "#999", borderRadius: 6, padding: 10 },
  erro: { color: "#b00020" },
});
