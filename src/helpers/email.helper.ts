import nodemailer, { type Transporter } from "nodemailer";
import ejs from "ejs";
import { logger } from "../logger/logger";
import { type Attachment } from "nodemailer/lib/mailer";
import { renderFileAsync } from "../helpers/pdf.helper";
// import { logger } from "../logger";

let transporter: Transporter | null = null;

const getTransporter = (): Transporter | null => {
	if (transporter) {
		return transporter;
	} else {
		if (!process.env.EMAIL_ADDRESS || !process.env.PASSWORD) {
			return null;
		}
		transporter = nodemailer.createTransport({
			host: 'smtp-mail.outlook.com',
			service: 'Outlook365',
			auth: {
				user: "swag.cdw@outlook.com",
				pass: "Swag@123",
			},
			tls: {
				ciphers: "SSLv3",
				rejectUnauthorized: false,
			},
		});
		
		return transporter;
	}
	
};

export const sendEmail = async (
	mailObj: Record<string, string | undefined>,
	attachments: Attachment[] = [],
): Promise<void> => {
	const { toAddress, subject, text, html } = mailObj;
	if (toAddress && subject && (text || html)) {
		const transporter = getTransporter();
		// send mail with defined transport object
		if (transporter) {
			const info = await transporter.sendMail({
				from: process.env.EMAIL_ADDRESS,
				to: toAddress,
				subject,
				text,
				html,
				attachments,
			});
			if (!info.messageId) {
				logger.error(`Email to ${toAddress} about ${subject} not sent`);
			}
		} else {
			logger.error(
				`Email to ${toAddress} about ${subject} not sent due to transporter issue`,
			);
		}
	}
};
