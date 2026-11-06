import { buildApp } from "./api/server";
import { loadConfig } from "./infra/config";
import { createDb } from "./infra/db";

const config = loadConfig();
const db = createDb(config.databaseUrl);
const app = buildApp({ jwtSecret: config.jwtSecret, jwtExpiresIn: config.jwtExpiresIn, db });

app.listen({ port: config.port, host: "0.0.0.0" }).catch((err) => {
  app.log.error(err);
  process.exit(1);
});
