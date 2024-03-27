import { Date } from "mongoose";
import { Product } from "./product.type";

export interface OrdersType {
	_id?: object;
	orderId: number,
    employeeId: object,
    productId: number,
    quantity: number,
    statusId: object,
	createdAt?: Date,
    productDetails?: object,
    userDetails?: object,
    status?: object
}[];

export interface OrdersResponseObject {
	_id?: object;
	orderId: number,
    customisation?: object,
    employeeId?: object,
    productId?: number,
    quantity: number,
    statusId?: object,
	createdAt?: Date,
    productDetails?: object,
    userDetails?: object,
    status?: string,
    orderHistory?: object
};

export interface TransactionObject {
    orderId: number;
    employeeId: number;
    description: string;
    isCredited: boolean;
    amount: number;
    balance: number;
    transactionId: number;
    orderDetails: {
        orderId: number;
        statusId: string;
        quantity: number;
        customisation?: {
            size: string;
        };
       productDetails: {
        productId: number;
        title: string;
        rewardPoints: number;
        isCustomisable: boolean;
        productImgURL: string;
       };
    };
    orderHistory: OrderHistory;
};

export interface UserOrders {
    orderId: number,
    productDetails: {
        productId: number,
        title: string,
        rewardPoints: number,
        productUrl? : string
        isCustomisable? : boolean,
        productImgURL? : string,
    },
    quantity: number,
    status: string,
    customisation : Object,
    orderHistory?: [],
    userDetails?: {
        employeeId: number,
        name: string,
        location: string,
    };
};

export interface UserOrderResponse {
    employeeId: number,
    employeeName: string,
    location: string,
    orders : Array<UserOrders>,
    redeemedPoints?: number,
    balance?: number,
    totalCost? : number
};

export interface OrderHistoryArray  {
    userName: string,
    userId: number,
    status: string,
    time: string,
};

export interface UpdateOrderObject {
    orderId: number,
    changeTo: string,
    updateUserId: number,
    updateUserName: string,
    rejectReason?: string,
}

export interface ErrorOrderObject {
    productId: number,
    productName: string,
    message:string,
    errors : any
}

export interface ErrorOrderResponse {
    errors : Array<ErrorOrderObject>
}

export interface CartItems {
    productId: number,
    name: string,
    productImage: string,
    rewardPoints: number,
    quantity: number,
    isActive?: boolean,
    customisation?: Object,
    rewardPointsWhenAddedtoCart?: number,
    isError?: boolean,
};

export interface CartItemsResponse {
    cartItems : Array<CartItems>,
};

export interface OrderType {
	_id?: object;
	orderId: number,
    employeeId: number,
    productId: number,
    quantity: number,
    statusId: object,
};

export interface Customisation {
    size?: string;
    // color?: string;
};

export interface OrderHistory {
    _id?: object;
    status: object;
    history: {
        userName: string;
        userId: number;
        status: string;
        time: string;
        reason?: string;
    }[];
};

export interface UserOrderDetails {
    _id?: object;
    orderId: number;
    employeeId: number;
    transactionId: object;
    productId: number;
    statusId: object;
    quantity: number;
    customisation?: Customisation;
    createdAt?: Date;
    productDetails?: Product;
    orderHistory: OrderHistory;
};