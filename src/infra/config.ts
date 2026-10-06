const MIN_SECRET_LENGTH = 32;
const PLACEHOLDER_PREFIX = "troque-por";

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
  if (env.NODE_ENV === "production") {
    if (jwtSecret.length < MIN_SECRET_LENGTH) {
      throw new Error(`JWT_SECRET deve ter ao menos ${MIN_SECRET_LENGTH} caracteres em produção`);
    }
    if (jwtSecret.startsWith(PLACEHOLDER_PREFIX)) {
      throw new Error("JWT_SECRET ainda é o placeholder do .env.example");
    }
  }
  return {
    port: Number(env.PORT ?? 3000),
    databaseUrl,
    jwtSecret,
    jwtExpiresIn: env.JWT_EXPIRES_IN ?? "7d",
  };
}
