import path from "path";
import winston from "winston";
import fs from "fs";
const DailyRotateFile = require("winston-daily-rotate-file");

const logFormat = winston.format.combine(
	winston.format.colorize(),
	winston.format.timestamp(),
	winston.format.printf(
		(info) => `${info.timestamp} ${info.level}: ${info.message}`,
	),
);

// create the output path
const outputDir = "../../logs/";
const outputPath = path.join(__dirname, outputDir);
if (!fs.existsSync(outputPath)) {
	fs.mkdirSync(outputPath, { recursive: true });
}

const logger = winston.createLogger({
	format: logFormat,
	transports: [
		// New log files will be written everyday as we leave datePattern empty.
		new DailyRotateFile({
			filename: "SWAG-%DATE%.log",
			dirname: "logs",
			zippedArchive: true,
			maxSize: "10m",
			maxFiles: "7d",
			level: process.env.LOG_LEVEL,
		}),
	],
});

if (process.env.NODE_ENV !== "production") {
	logger.add(
		new winston.transports.Console({
			level: process.env.LOG_LEVEL || "info",
			format: winston.format.combine(
				winston.format.colorize(),
				winston.format.timestamp(),
				logFormat,
			),
		}),
	);
}

export { logger };
