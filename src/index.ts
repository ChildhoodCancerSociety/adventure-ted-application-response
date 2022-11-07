import type { Server } from "http";

import app from "./app";
import { config, logger } from "./config";

let server: Server;
async function main() {
  server = app.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
  });
}

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const errorHandler = (error: Error) => {
  logger.error(error);
  exitHandler();
};

process.on("uncaughtException", errorHandler);
process.on("unhandledRejection", errorHandler);

process.on("SIGTERM", () => {
  logger.info("SIGTERM Received");
  if (server) {
    server.close();
  }
});

main();
