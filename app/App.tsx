import React from "react";
import { SafeAreaView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "./src/auth/AuthContext";
import { Rotas } from "./src/navigation/Rotas";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

export default function App() {
  return (
    <AuthProvider baseUrl={API_URL}>
      <SafeAreaView style={{ flex: 1 }}>
        <Rotas />
      </SafeAreaView>
      <StatusBar style="auto" />
    </AuthProvider>
  );
}
