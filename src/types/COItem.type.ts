export interface COItem {
	quantity: number;
	rewardPointsWhenAddedtoCart?: number;
	customisation: object;
	isError: boolean;
	errorMessage?: string;
	productDetails: {
		productId: number;
		title: string;
		rewardPoints: number;
		isCustomisable?: boolean;
		productImgURL?: string;
	};
}

export interface userDetails {
	employeeId: number;
	name: string;
	location: string;
}
