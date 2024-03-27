export type Product = {
	_id?: object;
	productId: number;
	title: string;
	rewardPoints: number;
	isCustomisable: boolean;
	productImgURL?: string;
	isActive?: boolean;
	createdAt?: Date;
};

export interface ProductResponseObject {
	_id?: string;
	productId: number;
	title: string;
	rewardPoints: number;
	isCustomisable: boolean;
	isActive?: boolean;
	productImgURL?: string;
	createdAt?: Date;
	isErroneous?: boolean;
	isAlreadyPurchased?: boolean;
}

export interface UpdateProductDetails {
	title?: string;
	rewardPoints?: number;
	isCustomisable?: boolean;
	productImgURL?: string;
};