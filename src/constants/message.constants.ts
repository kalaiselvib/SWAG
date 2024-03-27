import { type StatusMailObject } from "../types/status.type";
import { dbOrderStatus } from "./db.constants";
import { type Transaction } from "../schemas/transaction.schema";
import { type Reward } from "../types/rewards.type";
import { type User } from "../types/user.type";
import { COUPON_INPUT_DIR, ORDER_STATUS_TEMPLATE, STATUS_CHANGE_TEMPLATE, USER_COUPON_TEMPLATE } from "./helper.constants";
import path from "path";
import { renderFileAsync } from "../helpers/pdf.helper";
export const RESPONSE_CONSTANTS = {
	INVENTORY: {
		NO_FILE: {
			STATUS: 400,
			MESSAGE: "No File Found in the Server",
		},
		EMPTY: {
			STATUS: 400,
			MESSAGE: "No Data Found in the File",
		},
		NOT_FOUND: {
			STATUS: 204,
			MESSAGE: "No Data Found in the Server",
		},
		BAD_DATA: {
			STATUS: 400,
			MESSAGE: "Data Validation Failed",
		},
		CREATE: {
			STATUS: 200,
			MESSAGE: "All Products Created Successfully",
		},
		PARTIAL_CREATE: {
			STATUS: 201,
			MESSAGE: "Created Some Products Successfully",
		},
	},
	ORDER: {
		PLACED: {
			STATUS: 200,
			MESSAGE: "Order Placed Successfully",
		},
		BAD_DATA: {
			INVALID_PRODUCTS: {
				STATUS: 400,
				MESSAGE: "Products are invalid",
			},
			INSUFFICIENT_POINTS: {
				STATUS: 400,
				MESSAGE: "Points are not sufficient to place an order",
			},
		},
		OUT_OF_STOCK: {
			STATUS: 400,
			MESSAGE: "Products are out of stock",
		},
        NOT_PLACED : {
            STATUS : 400,
            MESSAGE : "Order could not be placed"
        },
	},
	CART: {
		BAD_DATA: {
			NO_CUSTOMISATION: {
				STATUS: 400,
				MESSAGE: "Customisation is not allowed",
			},
			INVALID_CUSTOMISATION: {
				STATUS: 400,
				MESSAGE: `Invalid $text is chosen for this product`,
			},
		},
		PLACED: {
			STATUS: 200,
			MESSAGE: "Item placed successfully in cart",
		},
        NOT_PLACED : {
            STATUS : 400,
            MESSAGE : "Items could not be added to cart"
        }
	},
};

export const statusUpdateMail = async (
	statusMailObj: StatusMailObject,
) => {
	const {
		userName,
		userBalance,
		orderNo,
		orderUpdatedStatus,
		productTitle,
		quantity,
		rewardPoints,
		totalPoints,
		productImgURL,
		rejectionReason,
	} = statusMailObj;
	// return {
	// 	subject: `CDW SWAG - Order ${orderNo} Status`,
	// 	html: `
	// 	<pre>Hi ${userName},
        
    //     <pre>Your SWAG Order No: ${orderNo} is ${orderUpdatedStatus.toLowerCase()}.
        
    //     ORDER DETAILS:
		
    //     Product              : ${productTitle}
    //     <img src=${productImgURL} width='50' height='50'/>
    //     Quantity             : ${quantity}
    //     Product Points       : ${rewardPoints}
    //     ${
	// 		orderUpdatedStatus.toUpperCase() === dbOrderStatus.REJECTED ||
	// 		orderUpdatedStatus.toUpperCase() === dbOrderStatus.CANCELLED
	// 			? "Refunded Points      : " + totalPoints
	// 			: "Total Points         : " + totalPoints
	// 	}
	// 	<pre>${
	// 		orderUpdatedStatus.toUpperCase() === dbOrderStatus.REJECTED
	// 			? "Reason for Rejection : " + rejectionReason
	// 			: ""
	// 	}</pre>
	// 	</pre>

    //     <pre>Your current balance after this transaction is ${userBalance}.</pre>
        
	// 	<pre>Thanks,
	// 	CDW SWAG.</pre></pre>`,
	// };
	const inputPath = path.join(__dirname, COUPON_INPUT_DIR, STATUS_CHANGE_TEMPLATE);
	const html = await renderFileAsync(inputPath, {
		statusMailObj
	});
	let emailText;

	switch (statusMailObj.orderUpdatedStatus) {
		case "REJECTED":
			emailText = `SWAG Order ${statusMailObj.orderNo} Rejected`
			break;
		case "ACCEPTED":
			emailText = `SWAG Order ${statusMailObj.orderNo} Accepted`
			break;

		case "CANCELLED":
			emailText = `SWAG Order ${statusMailObj.orderNo} Cancelled`
			break;
		
		case "DELIVERED":
			emailText = `SWAG Order ${statusMailObj.orderNo} Delivered`
			break;
		default:
			break;
	}
	return {
		subject: emailText,
		html:html
	}
};

export const rewardMail = (
	reward: Reward,
	rewardee: User,
	transaction: Transaction,
): Record<string, string> => {
	return {
		subject: "Reward from CDW!",
		html: `
<pre>Hi ${rewardee.name},
        
        <pre>Congrats! You've got a reward amount of <b>${
			reward.rewardPoints
		}</b> for ${reward.description} on ${reward.rewardCategory?.name}!</pre>

		<pre>${
			transaction.balance
				? "Your current balance after this reward is <b>" +
				  transaction.balance +
				  "</b>."
				: ""
		}</pre>
        
<pre>Thanks, 
CDW SWAG.</pre></pre>`,
	};
};

export const couponEmail = async (
	reward: Reward,
	rewardee: User,
): Promise<Record<string, string>> => {
	const inputPath = path.join(__dirname, COUPON_INPUT_DIR, USER_COUPON_TEMPLATE);
	const html = await renderFileAsync(inputPath, {
		reward,
		rewardeeName: rewardee?.name,
	});
	return {
		subject: "Coupon from CDW!",
		html,
	};
};

export const orderMail = (emailContent: any) => {
	return {
		subject: "Ordered in SWAG!",
		html: `
<pre>Hi ${emailContent.employeeName},
${emailContent.orders.map((order: any) => {
	return `<pre>
        Your SWAG Order No: ${order.orderId} is submitted.
        
        ORDER DETAILS:
		
        Product          : ${order.productDetails.title}
        <img src=${order.productDetails.productUrl} width='50' height='50'/>
        Quantity         : ${order.quantity}
        Reward Points    : ${order.productDetails.rewardPoints}
        Total Points     : ${order.productDetails.rewardPoints * order.quantity}
		</pre>`;
})}
        <pre>Your current balance after this order is ${emailContent.balance}.</pre>
        
<pre>Thanks,
CDW SWAG.</pre></pre>`,
	};
};

export const orderStatusUpdateEmail = async (emailContent: any) => {
	const inputPath = path.join(__dirname, COUPON_INPUT_DIR, ORDER_STATUS_TEMPLATE);
	const html = await renderFileAsync(inputPath, {
		emailContent
	});
	return {
		subject: `SWAG Order Update`,
		html:html
	}
}
