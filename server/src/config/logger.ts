import winston from "winston";

const winstonFormat = {
  logFormat: winston.format.combine(winston.format.timestamp(), winston.format.json()),
};

const logger = winston.createLogger({
  level: "info",
  transports: [
    new winston.transports.File({
      level: "info",
      dirname: "logs",
      filename: "info.log",
      format: winstonFormat.logFormat,
    }),
    new winston.transports.File({
      level: "error",
      dirname: "logs",
      filename: "error.log",
      format: winstonFormat.logFormat,
    }),
    new winston.transports.Console({
      level: "info",
      format: winstonFormat.logFormat,
    }),
  ],
});

export default logger;
