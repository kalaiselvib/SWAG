import mongoose, { Schema, Document, model, Types } from "mongoose";

interface Order extends Document {
	orderId: number;
	employeeId: string;
	transactionId: string;
	managedBy: string;
	productId: string;
	createdAt: Date;
}

const OrderSchema = new Schema<Order>({
	orderId: {
		type: Number,
		required: true,
	},
	employeeId: {
		type: String,
		required: true,
		ref: "User",
	},
	transactionId: {
		type: String,
		required: true,
		ref: "Transaction",
	},
	managedBy: {
		type: String,
		required: true,
	},
	productId: {
		type: String,
		required: true,
		ref: "Product",
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = model<Order>("Order", OrderSchema);
