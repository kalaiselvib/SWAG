import { logger } from "../logger/logger";

const mongoose = require("mongoose");

// export const createDBConnection = (): void => {
// 	mongoose
// 		.connect(process.env.MONGODB_URL, {
// 			useNewUrlParser: true,
// 			useUnifiedTopology: true,
// 		})
// 		.then(() => {
// 			logger.info("Connected to MongoDB");
// 		})
// 		// eslint-disable-next-line @typescript-eslint/no-explicit-any
// 		.catch((err: any) => {
// 			logger.error(err);
// 		});
// };
export const createDBConnection = async (): Promise<void> => {
	try {
		await mongoose.connect(process.env.MONGODB_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		logger.info("Connected to MongoDB");
	} catch (err: any) {
		logger.error("Error while connecting to db:" + JSON.stringify(err?.message));
	}
};
