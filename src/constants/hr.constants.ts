import { type User } from "../schemas/user.schema";

// email constants
export const rewardCategories = {
	award: "award",
	evento: "evento",
};

export const COUPON_DESCRIPTION = "coupon";

export const logMessages = {
	invalidEmployeeId: "Rewarder or rewardee invalid",
	catDescInvalid: "Reward category or description invalid",
	pointsInvalid: "Reward points invalid",
	invalidReward: "Invalid Reward due to",
	walletCommFailure: "Wallet api communication failure",
};

// export const rewardCategory = "rewardCategory";

export const errorMessages = {
	WRONG_XL_SKELETON: "The given XL file does not have the expected columns.",
	INVALID_REQUESTOR: "Invalid login. Kindly try re-logging in.",
};

export const expectedRewardKeys = [
	"Rewardee",
	"Reward Category",
	"Description",
	"Reward Points",
];

export const rewardInputKeysMap: Record<string, string> = {
	Rewardee: "rewardee",
	"Reward Category": "rewardCategory",
	Description: "description",
	"Reward Points": "rewardPoints",
};

export const couponOutputKeysMap: Record<string, string> = {
	"rewardCategory": "Reward Category",
	"rewardPoints": "Reward Points",
	"addedBy": "Added By",
	"couponCode": "Coupon Code"
};

export const rewardOutputKeysMap: Record<string, string> = {
	"rewardee": "Rewardee",
	"rewardCategory": "Reward Category",
	"description": "Description",
	"rewardPoints": "Reward Points",
	"addedBy": "Added By",
};

export const filterErrorMessages = {
	INVALID_REWARDEE: "Invalid coworker",
	INVALID_REWARDER: "Invalid addedBy",
	INVALID_REWARD_CATEGORY: "Invalid Reward Category",
	INVALID_DATE_RANGE: "Invalid Date Range",
};

export const COUPONS_EMAIL_CONTENT = (
	hr: User,
	totalCouponsCreated: number,
): Record<string, string> => {
	return {
		toAddress: hr?.email,
		subject: "Coupons creation successful!",
		html: `
<pre>Hi ${hr?.name},
<pre>
    PFA The coupons that have been successfully created!
    Total coupons created: ${totalCouponsCreated}</pre>
<pre>Thanks,
CDW SWAG.</pre></pre>`,
	};
};

export const REWARDS_EMAIL_CONTENT = (
	hr: User,
	totalRewardsCreated: number,
): Record<string, string> => {
	return {
		toAddress: hr?.email,
		subject: "Rewards creation successful!",
		html: `
<pre>Hi ${hr?.name},
<pre>
    PFA The rewards that have been successfully created!
    Total rewards created: ${totalRewardsCreated}</pre>
<pre>Thanks,
CDW SWAG.</pre></pre>`,
	};
};

export const REWARD_TYPES = {
	REDEEMED: "REDEEMED",
	ADDED: "ADDED",
	COUPON: "COUPON",
};

export const PROMO_TYPES = {
	COUPON: "COUPON",
	REWARD: "REWARD",
};
