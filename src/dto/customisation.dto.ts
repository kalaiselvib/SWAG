import { IsNotEmpty, IsString, IsAlpha } from "class-validator";
import "reflect-metadata";
export class CustomisationDTO {

	@IsString({ message: "Expected value in string" })
	@IsAlpha()
	@IsNotEmpty({ message: "Size should not be empty" })
	size: string;

	constructor(size: string) {
		this.size = size;
	}
}
