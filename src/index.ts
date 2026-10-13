import { buildApp } from "./api/server";
import { loadConfig } from "./infra/config";

const config = loadConfig();
const app = buildApp({ jwtSecret: config.jwtSecret });

app.listen({ port: config.port, host: "0.0.0.0" }).catch((err) => {
  app.log.error(err);
  process.exit(1);
});
