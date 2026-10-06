import jwt from "jsonwebtoken";

export interface TokenPayload {
  sub: string; // id do usuário
}

export interface JwtOptions {
  secret: string;
  expiresIn: string;
}

export function signToken(userId: string, { secret, expiresIn }: JwtOptions): string {
  return jwt.sign({}, secret, { subject: userId, expiresIn: expiresIn as jwt.SignOptions["expiresIn"] });
}

/** Lança se o token for inválido ou expirado. */
export function verifyToken(token: string, secret: string): TokenPayload {
  const decoded = jwt.verify(token, secret);
  if (typeof decoded === "string" || typeof decoded.sub !== "string") {
    throw new Error("token sem subject");
  }
  return { sub: decoded.sub };
}
