export interface Config {
  port: number;
  databaseUrl: string;
  jwtSecret: string;
  jwtExpiresIn: string;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const jwtSecret = env.JWT_SECRET;
  const databaseUrl = env.DATABASE_URL;
  if (!jwtSecret) throw new Error("JWT_SECRET é obrigatório");
  if (!databaseUrl) throw new Error("DATABASE_URL é obrigatório");
  return {
    port: Number(env.PORT ?? 3000),
    databaseUrl,
    jwtSecret,
    jwtExpiresIn: env.JWT_EXPIRES_IN ?? "7d",
  };
}
