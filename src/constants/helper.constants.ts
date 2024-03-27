import crypto from "crypto";
// helpers/pdf.helper.ts
export const COUPON_INPUT_DIR = "../../public/templates/";
export const COUPON_INPUT_FILE = "PDFTemplate.ejs";
export const USER_COUPON_TEMPLATE = "userCouponTemplate.ejs";
export const ORDER_STATUS_TEMPLATE = "orderStatusTemplate.ejs";
export const STATUS_CHANGE_TEMPLATE = "statusChangeTemplate.ejs";
export const COUPON_OUTPUT_DIR = "../../uploads/";
export const COUPON_PDF = (): string =>
	`coupon${crypto.randomBytes(4).toString("hex")}.pdf`;
export const COUPON_MERGED_PDF = (): string =>
	`coupons${crypto.randomBytes(4).toString("hex")}.pdf`;
export const SWAG_CONSTANT = "SWAG";
export const FILE_PROTOCOL = "file:///";
export const RIBBON_IMAGE_PATH = "../images/coupon-ribbon.png";
export const COUPONS_FILE_NAME = "successfulCouponsFile";
export const REWARDS_FILE_NAME = "successfulRewardsFile";
