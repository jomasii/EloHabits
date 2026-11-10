import React, { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { useAuth } from "../auth/AuthContext";
import { ApiError } from "../api/client";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function EntrarScreen() {
  const { entrar, cadastrar } = useAuth();
  const [criando, setCriando] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function enviar() {
    const emailNorm = email.trim().toLowerCase();
    if (!EMAIL_RE.test(emailNorm)) return setErro("E-mail inválido");
    if (senha.length < 6) return setErro("A senha deve ter ao menos 6 caracteres");
    setErro(null);
    setEnviando(true);
    try {
      await (criando ? cadastrar : entrar)(emailNorm, senha);
    } catch (e) {
      setErro(e instanceof ApiError ? e.mensagem : "Erro inesperado");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <View style={estilos.tela} testID="tela-entrar">
      <Text style={estilos.titulo}>EloHabits</Text>
      <TextInput style={estilos.campo} placeholder="E-mail" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <TextInput style={estilos.campo} placeholder="Senha" secureTextEntry value={senha} onChangeText={setSenha} />
      {erro && <Text style={estilos.erro}>{erro}</Text>}
      <Button testID="enviar" title={criando ? "Criar conta" : "Entrar"} onPress={enviar} disabled={enviando} />
      <Button testID="alternar-modo" title={criando ? "Já tenho conta" : "Criar conta"} onPress={() => setCriando(!criando)} />
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: { flex: 1, justifyContent: "center", padding: 24, gap: 12 },
  titulo: { fontSize: 28, fontWeight: "bold", textAlign: "center" },
  campo: { borderWidth: 1, borderColor: "#999", borderRadius: 6, padding: 10 },
  erro: { color: "#b00020" },
});
