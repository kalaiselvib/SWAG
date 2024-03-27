/* eslint-disable @typescript-eslint/no-explicit-any */
import { IsDateString, IsInt, IsOptional, IsString } from "class-validator";
import { filterErrorMessages } from "../constants/hr.constants";
import { type Transaction } from "../schemas/transaction.schema";

export interface Reward {
	rewardee?: any;
	rewardCategory: any;
	rewardCat?: any;
	description: string;
	rewardPoints: number;
	couponDetails?: {
		couponId: string;
		secretCode: string;
	};
	addedBy: any;
	_id?: object;
	transactionId?: object;
	employeeId?: number;
	createdAtVal?: string;
	encryptedCouponCode?: string | null;
	couponCode?: string;
	secretCode?: string;
	isCouponExpired?: boolean;
	isHRContext?: boolean;
	transaction?: Transaction;
	rewardType?: string;
}

export interface userRewardsDTO {
	date: string;
	description: string;
	rewardPoints: number;
}

export interface RewardDTO {
	date: string | undefined;
	rewardee: string;
	rewardCategory: string;
	description: string;
	rewardPoints: number;
	addedBy: string | number;
	rewardType?: string;
}

export class RewardFiltersDTO {
	@IsInt()
	@IsOptional()
	rewardee?: number;

	@IsInt()
	@IsOptional()
	addedBy?: number;

	@IsString({ message: filterErrorMessages.INVALID_REWARD_CATEGORY })
	@IsOptional()
	rewardCategory?: string;

	@IsDateString()
	@IsOptional()
	startDate?: string;

	@IsDateString()
	@IsOptional()
	endDate?: string;

	constructor(
		rewardee?: number,
		rewardCategory?: string,
		addedBy?: number,
		startDate?: string,
		endDate?: string,
	) {
		this.rewardee = rewardee;
		this.rewardCategory = rewardCategory;
		this.addedBy = addedBy;
		this.startDate = startDate;
		this.endDate = endDate;
	}
}