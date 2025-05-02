/* eslint-disable @typescript-eslint/restrict-template-expressions */
import app from "./app";
import logger from "./config/logger";

const PORT = process.env.PORT || 3000;

const startServer = () => {
  try {
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error: unknown) {
    logger.error(`Error starting server: ${error}`);
    process.exit(1);
  }
};

startServer();
