import { IsNotEmpty, IsString, IsNumber, IsNegative, IsBoolean, IsOptional, IsInt, IsNotEmptyObject, IsObject, ValidateNested, IsUrl, IsPositive } from "class-validator";
import { UpdateProductDetails } from "../types/product.type";
import "reflect-metadata";
import { Type } from "class-transformer";

export class ProductDTO {

    @IsInt({ message: "productId should be a number" })
	@IsNotEmpty({ message: "productId should not be empty" })
	productId: number;
    
    @IsString()
    @IsOptional()
    title?: string;

    @IsInt({ message: "reward points should be an Int" })
    @IsPositive()
    @IsOptional()
    rewardPoints?: number;

    @IsBoolean()
    @IsOptional()
    isCustomisable?: boolean;

    @IsString()
    @IsOptional()
    @IsUrl()
    productImgURL?: string;

	constructor(productId: number, title: string, rewardPoints: number, isCustomisable: boolean, productImgURL: string) {
		this.productId = productId;
        this.title = title;
        this.rewardPoints = rewardPoints;
        this.isCustomisable = isCustomisable;
        this.productImgURL = productImgURL;
	}
};

export class DeleteProductDTO {
    @IsInt({ message: "productId should be a number" })
	@IsNotEmpty({ message: "productId should not be empty" })
	productId: number;

    constructor(productId: number) {
		this.productId = productId;
	}
};