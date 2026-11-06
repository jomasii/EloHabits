import { createApiClient, ApiError } from "./client";

const fetchMock = jest.fn();
beforeEach(() => {
  fetchMock.mockReset();
  global.fetch = fetchMock as unknown as typeof fetch;
});

const ok = (status: number, body: unknown) => ({ ok: status < 400, status, json: async () => body });

test("injeta Authorization: Bearer <token> quando há token", async () => {
  fetchMock.mockResolvedValue(ok(200, { dupla: null }));
  await createApiClient("http://api", async () => "abc").status();
  expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe("Bearer abc");
});

test("não envia Authorization sem token", async () => {
  fetchMock.mockResolvedValue(ok(200, { token: "t" }));
  await createApiClient("http://api", async () => null).login("a@x.com", "123456");
  expect(fetchMock.mock.calls[0][1].headers.Authorization).toBeUndefined();
});

test("status 409 vira ApiError com a mensagem do campo erro", async () => {
  fetchMock.mockResolvedValue(ok(409, { erro: "você já está em uma dupla" }));
  const promessa = createApiClient("http://api", async () => "t").criarDupla();
  await expect(promessa).rejects.toMatchObject({ status: 409, mensagem: "você já está em uma dupla" });
  await expect(promessa).rejects.toBeInstanceOf(ApiError);
});

test("falha de rede vira ApiError status 0", async () => {
  fetchMock.mockRejectedValue(new TypeError("Network request failed"));
  await expect(createApiClient("http://api", async () => null).status()).rejects.toMatchObject({
    status: 0,
    mensagem: "Sem conexão com o servidor",
  });
});

test("login envia e-mail e senha em JSON para /auth/login", async () => {
  fetchMock.mockResolvedValue(ok(200, { token: "t" }));
  const r = await createApiClient("http://api", async () => null).login("a@x.com", "123456");
  expect(r).toEqual({ token: "t" });
  expect(fetchMock.mock.calls[0][0]).toBe("http://api/auth/login");
  expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ email: "a@x.com", senha: "123456" });
});
