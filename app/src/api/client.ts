import { StatusDupla } from "./types";

export class ApiError extends Error {
  constructor(
    public status: number,
    public mensagem: string,
  ) {
    super(mensagem);
    this.name = "ApiError";
  }
}

export type ApiClient = ReturnType<typeof createApiClient>;

export function createApiClient(baseUrl: string, getToken: () => Promise<string | null>) {
  async function chamar<T>(metodo: "GET" | "POST", caminho: string, corpo?: unknown): Promise<T> {
    const token = await getToken();
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;
    let res: Response;
    try {
      res = await fetch(`${baseUrl}${caminho}`, {
        method: metodo,
        headers,
        body: corpo === undefined ? undefined : JSON.stringify(corpo),
      });
    } catch {
      throw new ApiError(0, "Sem conexão com o servidor");
    }
    const dados = await res.json().catch(() => ({}));
    if (!res.ok) throw new ApiError(res.status, (dados as { erro?: string }).erro ?? "Erro inesperado");
    return dados as T;
  }

  return {
    cadastro: (email: string, senha: string) => chamar<{ id: string }>("POST", "/auth/cadastro", { email, senha }),
    login: (email: string, senha: string) => chamar<{ token: string }>("POST", "/auth/login", { email, senha }),
    criarDupla: () => chamar<{ id: string; codigo: string }>("POST", "/duplas"),
    aceitarConvite: (codigo: string) => chamar<{ ok: true }>("POST", "/duplas/aceitar", { codigo }),
    criarHabito: (descricao: string) => chamar<{ id: string }>("POST", "/habitos", { descricao }),
    fazerCheckin: () => chamar<{ ok: true }>("POST", "/checkins"),
    status: () => chamar<StatusDupla>("GET", "/duplas/status"),
  };
}
