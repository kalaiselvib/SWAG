import "dotenv/config";
import "reflect-metadata";
import express, { type Application } from "express";
import { createDBConnection } from "./db";
import bodyParser from "body-parser";
import { logger } from "./logger/logger";
import { startCronJob, checkForJobsPastDueDates } from "./helpers/cron.helpers";
import swaggerDocs from "./docs/swagger";
const path = require("path");
import helmet from "helmet";
import { corsConstants } from "./constants";
const { GET, POST, PATCH, DELETE, ORIGIN_DOMAINS } = corsConstants

const cors = require("cors");
const PORT = process.env.PORT;
const routes = require("./routes/index");
process.env.TZ = "Asia/Kolkata";

const corsOptions = {
	origin: ORIGIN_DOMAINS,
	optionsSuccessStatus: 200,
	methods: [GET, POST, PATCH, DELETE],
};

// Create a new express application instance
const app: Application = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet({ strictTransportSecurity: false}));
app.use(cors(corsOptions));
swaggerDocs(app, Number(PORT));

app.use("/api", routes);

app.use(express.static(path.join(__dirname, "../frontend")));

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "../frontend", "index.html"));
});

const startServer = async (): Promise<void> => {
	logger.info(`CDW Swag server running on port ${PORT}`);
	await checkForJobsPastDueDates();
	startCronJob();
};

// Create a database connection
createDBConnection()
	.then(async (): Promise<void> => {
		app.listen(PORT, () => {
			logger.info("Server started successfully");
			startServer()
				.then(() => {
					logger.info("Successfully called the cron jobs.");
				})
				.catch((e: any) => {
					logger.error("Error while starting the cron jobs");
				});
		});
	})
	.catch((e) => {
		logger.error("Error while connecting to mongoDB:");
	});

module.exports = app;
