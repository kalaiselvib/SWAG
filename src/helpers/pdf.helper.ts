import fs from "fs";
import path from "path";
import {
	COUPON_INPUT_DIR,
	COUPON_INPUT_FILE,
	COUPON_MERGED_PDF,
	COUPON_OUTPUT_DIR,
	COUPON_PDF,
	FILE_PROTOCOL,
	RIBBON_IMAGE_PATH,
	SWAG_CONSTANT,
} from "../constants/helper.constants";
import { logger } from "../logger/logger";
import { PDFMerger } from "./pdf-merger-js/index";
import ejs from "ejs";
import { type Reward } from "../types/rewards.type";
import { type User } from "../schemas/user.schema";
import { UNDERSCORE } from "../constants/common.constants";
import { randomUUID } from "crypto";
// const htmlPdfNode = require("html-pdf-node");
const puppeteer = require("puppeteer");
const Recipe = require("muhammara").Recipe;

export const renderFileAsync: (
	file: string,
	data: object,
) => Promise<string> = async (file, data) => {
	return await new Promise((resolve, reject) => {
		ejs.renderFile(file, data, (err, str) => {
			if (err) {
				reject(err);
			} else {
				resolve(str);
			}
		});
	});
};

export const passwordProtectPDF = (
	pdfPath: string | null,
	user: User,
	isHr: boolean,
): string | null => {
	const protectedPdfPath = path.join(
		__dirname,
		COUPON_OUTPUT_DIR,
		isHr ? COUPON_MERGED_PDF() : COUPON_PDF(),
	);
	let pdfDoc;
	if (pdfPath && user) {
		pdfDoc = new Recipe(pdfPath, protectedPdfPath);
		const password = user.employeeId + UNDERSCORE + SWAG_CONSTANT;
		pdfDoc
			.encrypt({
				userPassword: password,
				ownerPassword: null,
				userProtectionFlag: parseInt("111100111100", 2),
			})
			.endPDF();
	}
	return pdfDoc ? protectedPdfPath : pdfPath;
};

const checkPathOrCreate = (outpuDirPath: string): void => {
	if (!fs.existsSync(outpuDirPath)) {
		fs.mkdirSync(outpuDirPath, { recursive: true });
	}
};

/**
 * @description takes a JSON data and converts the data in it to a new worksheet
 * @param multerFile: Express.Multer.File
 * @returns outputPath — : string | null
 */
export const createPDFWithData = async (
	reward1: Reward,
	reward2: Reward | null = null,
): Promise<string | null> => {
	try {
		// pdf location
		const outpuDirPath = path.join(__dirname, COUPON_OUTPUT_DIR);
		checkPathOrCreate(outpuDirPath);
		const outputPath = path.join(outpuDirPath, COUPON_PDF());
		fs.writeFileSync(outputPath, "");

		// html path
		const htmlPath = path.join(
			__dirname,
			COUPON_OUTPUT_DIR,
			`index${randomUUID()}.html`,
		);

		// ribbon image path
		const ribbonImagePath =
			FILE_PROTOCOL + path.join(__dirname, RIBBON_IMAGE_PATH);

		// setting the viewdata
		const rewards: Reward[] =
			reward1 && reward2 ? [reward1, reward2] : reward1 ? [reward1] : [];

		// ejs input compilation
		const inputPath = path.join(__dirname, COUPON_INPUT_DIR, COUPON_INPUT_FILE);
		const html = await renderFileAsync(inputPath, { rewards, ribbonImagePath });
		fs.writeFileSync(htmlPath, html);
		let userAgent, viewportSize, browserVersion;
		// puppeteer pdf generation
		const ssPath = "./ss.png";
		await (async () => {
			const browser = await puppeteer.launch({
				args: ["--disable-web-security", "--no-sandbox"],
				headless: true,
			});
			const page = await browser.newPage();
			// await page.setUserAgent(
			// 	"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/93.0.4577.0 Safari/537.36",
			// );
			// await page.setViewport({ width: 800, height: 600 });
			// await page.emulateMediaType("screen"); //will help not to render print css
			await page.goto(FILE_PROTOCOL + htmlPath);
			await page.waitForTimeout(2000);
			userAgent = await page.evaluate(() => navigator.userAgent);
			viewportSize = page.viewport();
			browserVersion = await page.browser().version();
			await page.screenshot({
				path: ssPath,
				fullPage: true,
			});
			await page.pdf({
				path: outputPath,
				format: "A4",
				// printBackground: true,
			});
			await browser.close();
		})();
		logger.info(
			"Puppeteer settings info - browser version, user agent, viewport size: " +
				JSON.stringify(browserVersion) +
				JSON.stringify(userAgent) +
				JSON.stringify(viewportSize),
		);
		fs.unlink(htmlPath, (err: any) => {
			if (err) {
				logger.warn("Error deleting file:" + JSON.stringify(err?.message));
			}
		});
		logger.info("PDF created");
		return outputPath;
	} catch (e: any) {
		logger.error(
			"PDF could not be created due to the error: " +
				JSON.stringify(e?.message),
		);
		return null;
	}
};

export const createMultiPagePDFwithData = async (
	rewards: Reward[],
): Promise<string | null> => {
	try {
		const pdfPaths: string[] = [];
		for (let i = 0; i < rewards.length; i += 2) {
			let pdfPath;
			if (rewards?.[i + 1]) {
				pdfPath = await createPDFWithData(rewards[i], rewards[i + 1]);
			} else {
				pdfPath = await createPDFWithData(rewards[i]);
			}
			if (pdfPath) {
				pdfPaths.push(pdfPath);
			}
		}
		const merger = new PDFMerger();

		for (const pdf of pdfPaths) {
			await merger.add(pdf);
			fs.unlink(pdf, (err: any) => {
				if (err) {
					logger.warn(
						"Error deleting file:" + JSON.stringify(err?.message),
					);
				}
			});
		}

		await merger.setMetadata({
			producer: "HR CouponCodes PDF",
		});
		const outpuDirPath = path.join(__dirname, COUPON_OUTPUT_DIR);
		checkPathOrCreate(outpuDirPath);
		const outputPath = path.join(outpuDirPath, COUPON_MERGED_PDF());
		await merger.save(outputPath);
		// logger.info("after saving merged pdf function");
		return outputPath;
	} catch (e: any) {
		logger.error(
			"PDF could not be created due to the error: " +
				JSON.stringify(e?.message),
		);
		return null;
	}
};
