import express, { type Request, type Response } from "express";
const userRouter = express.Router();
const { authenticateToken } = require("../middlewares/auth.middleware");
const { routesConstants } = require("../constants");
const {
	getProductsList,
	getUserPoints,
	placeOrder,
	productSizes,
	getUserRewards,
	getUserTransactions,
	cancelOrder,
	updateCart,
	getCart,
	deleteCart,
	getOrdersByEmployeeId,
	getCOItems,
	claimReward
} = require("../user/user.controller");

/**
 * @swagger
 * components:
 *   schemas:
 *     CheckoutObject:
 *       type: object
 *       properties:
 *         quantity:
 *           type: number
 *         customisation:
 *           type: object
 *         isError:
 *           type: boolean
 *           description: Flag to determine if the Cart Item is outdated
 *         errorMessage:
 *           type: string
 *           description: Optional attribute that gets added if isError is 'false'
 *         productDetails:
 *           type: object
 *           properties:
 *             productId:
 *               type: number
 *             title:
 *               type: string
 *             rewardPoints:
 *               type: number
 *             isCustomisable:
 *               type: boolean
 *             productImgURL:
 *               type: string
 *       example: {
 *                "quantity": 4,
 *                "customisation": {},
 *                "isError": true,
 *                "errorMessage": "The product has been removed, Please remove this item to place order.",
 *                "productDetails": {
 *                  "productId": 218,
 *                  "title": "Coffee Mug",
 *                  "rewardPoints": 240,
 *                  "isCustomisable": false,
 *                  "productImgURL": "https://i.ibb.co/8K8g164/mug.png"
 *                }
 *               }
 * 
 *     UserGetAllRewards:
 *       type: object
 *       properties:
 *         date:
 *           type: string
 *         description:
 *           type: string
 *         rewardPoints:
 *           type: number
 *       example: {
 *                 "date": "28 Feb 2024",
 *                 "description": "GNG Winner",
 *                 "rewardPoints": 7500,
 *               }
 * 
 *     TransactionObject:
 *       type: object
 *       properties:
 *         date:
 *           type: string
 *         description:
 *           type: string
 *         transactionId:
 *           type: string
 *         amount:
 *           type: string
 *         balance:
 *           type: number
 *       example: {
 *                 "date": "28 Feb 2024",
 *                 "description": "Purchase Order No 113 - T-Shirt",
 *                 "transactionId": "T0000269",
 *                 "amount": "-230",
 *                 "balance": 680
 *               }
 * 
 *     ProductsObject:
 *       type: object
 *       properties:
 *         productId:
 *           type: number
 *         title:
 *           type: string
 *         rewardPoints:
 *           type: number
 *         isCustomisable:
 *           type: boolean
 *         isActive:
 *           type: boolean
 *         productImgURL:
 *           type: string
 *       example: {
 *                 "productId": 100,
 *                 "title": "Mouse Pad",
 *                 "rewardPoints": 250,
 *                 "isCustomisable": false,
 *                 "isActive": true,
 *                 "productImgURL": "http://image.com/mousepad.jepg"
 *               }
 * 
 *     UserGetAllProducts:
 *       allOf:
 *         - $ref: '#/components/schemas/ProductsObject'
 *         - type: object
 *           properties:
 *             isAlreadyPurchased:
 *               type: boolean
 *       example: {
 *                 "productId": 100,
 *                 "title": "Mouse Pad",
 *                 "rewardPoints": 250,
 *                 "isCustomisable": false,
 *                 "isActive": true,
 *                 "productImgURL": "http://image.com/mousepad.jepg",
 *                 "isAlreadyPurchased": false
 *               }
 * 
 *     UserPlaceOrders:
 *       type: object
 *       properties:
 *         orderId:
 *           type: number
 *         quantity:
 *           type: number
 *         customisation:
 *           type: object
 *           properties:
 *             size: 
 *               type: string
 *         productDetails:
 *            type: object
 *            $ref: '#/components/schemas/ProductsObject'
 *         status: 
 *            type: string
 *         userDetails:
 *            type: object
 *            properties:
 *              employeeId:
 *                type: number
 *              name:
 *                type: string
 *              location:
 *                type: string
 *       example: {
 *                 "orderId": 28,
 *                 "quantity": 2,
 *                 "customisation": { "size": "M" },
 *                 "productDetails": {
 *                      "productId": 265,
 *                      "title": "Hoodie",
 *                      "productUrl": "http:image.com/hoodie.jepg",
 *                      "isCustommisable": true,
 *                  },
 *                  "status": "SUBMITTED",
 *                  "userDetails": {
 *                       "employeeId": 2062,
 *                       "name": "John Doe",
 *                       "location": "CHENNAI"
 *                  }
 *               }
 * 
 *     UserGetAllOrders:
 *       allOf:
 *         - $ref: '#/components/schemas/UserPlaceOrders'
 *         - type: object
 *           properties:
 *             orderHistory:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: string
 *                   userId:
 *                     type: number
 *                   userName:
 *                     type: string
 *                   time:
 *                     type: string
 *       example: {
 *                 "orderId": 28,
 *                 "quantity": 2,
 *                 "customisation": { "size": "M" },
 *                 "productDetails": {
 *                      "productId": 265,
 *                      "title": "Hoodie",
 *                      "productUrl": "http:image.com/hoodie.jepg",
 *                      "isCustommisable": true,
 *                  },
 *                  "status": "SUBMITTED",
 *                  "userDetails": {
 *                       "employeeId": 2062,
 *                       "name": "John Doe",
 *                       "location": "CHENNAI"
 *                  },
 *                  "orderHistory": [{
 *                        "status": "SUBMITTED",
 *                        "userId": 2062,
 *                        "userName": "John Doe",
 *                        "time": "15 Mar 2024"
 *                   }]
 *               }
 */

/**
 *  This endpoint is for getting product list details from the inventory
 * @openapi
 * /user/orders:
 *   get:
 *     tags:
 *        - User
 *     summary: Fetches all Orders of the Employee
 *     parameters:
 *         - in: query
 *           name: offset
 *           schema:
 *             type: integer
 *           description: The number of items to skip before starting to collect the result set
 *         - in: query
 *           name: limit
 *           schema:
 *             type: integer
 *           description: The numbers of items to return
 *         - in: query
 *           name: transactionId
 *           schema:
 *             type: integer
 *           description: Fetches the Order that has the Given Transaction ID
 *     responses:
 *       200:
 *         description: 200 SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties: 
 *                     result:
 *                       type: array
 *                       items:
 *                         type: object
 *                         $ref: '#/components/schemas/UserGetAllOrders'
 *                 count:
 *                   type: object
 *                   example: 1
 */
userRouter.get(
	routesConstants.ORDERS,
	authenticateToken,
	(req: Request, res: Response) => {
		getOrdersByEmployeeId(req, res);
	},
);

/**
 *  This endpoint is for getting product list details from the inventory
 * @openapi
 * /user/products:
 *   get:
 *     tags:
 *        - User
 *     summary: Get All Active Products in the Catalogue
 *     responses:
 *       200:
 *         description: 200 SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     $ref: '#/components/schemas/UserGetAllProducts'
 */
userRouter.get(
	routesConstants.USER_PRODUCTS,
	authenticateToken,
	(req: Request, res: Response) => {
		getProductsList(req, res);
	},
);

/**
 *  This route retrieves user points by employee id
 * @openapi
 * /user/points:
 *   get:
 *     tags:
 *        - User
 *     summary: Fetches Points Details of the User
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                example: "john.doe@cdw.com"
 *     responses:
 *       200:
 *         description: 200 SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                       example: 2300
 *                     redeemed:
 *                       type: number
 *                       example: 800
 *                     available:
 *                       type: number
 *                       example: 1500
 */
userRouter.get(
	routesConstants.USER_POINTS,
	authenticateToken,
	(req: Request, res: Response) => {
		getUserPoints(req, res);
	},
);

/**
 *  This route is for placing orders
 * @openapi
 * /user/orders:
 *   post:
 *     tags:
 *        - User
 *     summary: Place Orders for Users
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *            type: array
 *            items:
 *              type: object
 *              properties:
 *                productId:
 *                  type: number
 *                quantity:
 *                  type: number
 *                customisation:
 *                  type: object
 *                  properties:
 *                    size:
 *                      type: string
 *           example: [
 *                      {
 *                       "productId": 265,
 *                       "quantity": 2,
 *                       "customisation": {
 *                           "size": M
 *                        }
 *                       }
 *                    ]
 *     responses:
 *       200:
 *         description: 200 SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     $ref: '#/components/schemas/UserPlaceOrders'
 */
userRouter.post(
	routesConstants.ORDERS,
	authenticateToken,
	(req: Request, res: Response) => {
		placeOrder(req, res);
	},
);
/**
 *  This end point is defined for getting all the rewards of the user
 * @openapi
 * /user/rewards:
 *   get:
 *     tags:
 *        - User
 *     summary: Get Users Rewards
 *     parameters:
 *         - in: query
 *           name: offset
 *           schema:
 *             type: integer
 *           description: The number of items to skip before starting to collect the result set
 *         - in: query
 *           name: limit
 *           schema:
 *             type: integer
 *           description: The numbers of items to return
 *         - in: query
 *           name: sort_amount
 *           schema:
 *             type: string
 *             enum: [ 'desc', 'asc' ]
 *           description: Sorts the results in Acending or Decending Order
 *     responses:
 *       200:
 *         description: 200 SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     result:
 *                      type: array
 *                      items:
 *                        type: object
 *                        $ref: '#/components/schemas/UserGetAllRewards'
 *                 count:
 *                   type: number
 *                   example: 1
 */
userRouter.get(
	routesConstants.USER_REWARDS,
	authenticateToken,
	(req: Request, res: Response) => {
		getUserRewards(req, res);
	},
);

/**
 *  This end point is defined for getting all the transactions of the user
 * @openapi
 * /user/transactions:
 *   get:
 *     tags:
 *        - User
 *     summary: Get Users Transactions
 *     parameters:
 *         - in: query
 *           name: offset
 *           schema:
 *             type: integer
 *           description: The number of items to skip before starting to collect the result set
 *         - in: query
 *           name: limit
 *           schema:
 *             type: integer
 *           description: The numbers of items to return
 *         - in: query
 *           name: sort_amount
 *           schema:
 *             type: string
 *             enum: [ 'desc', 'asc' ]
 *           description: Sorts the results in Acending or Decending Order
 *     responses:
 *       200:
 *         description: 200 SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: array
 *                   items:
 *                     type: object
 *                     $ref: '#/components/schemas/TransactionObject'     
 */
userRouter.get(
	routesConstants.USER_TRANSACTIONS,
	authenticateToken,
	// eslint-disable-next-line @typescript-eslint/no-misused-promises
	(req: Request, res: Response) => {
		getUserTransactions(req, res);
	},
);

/**
 *  This route retrieves user product size
 * @openapi
 * /user/products/size:
 *   get:
 *     tags:
 *        - User
 *     summary: Get Customisable Options for Size
 *     responses:
 *       200:
 *         description: 200 SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: [ "S" , "M", "L", "XL"]
 */
userRouter.get(
	routesConstants.PRODUCT_SIZE,
	authenticateToken,
	(req: Request, res: Response) => {
		productSizes(req, res);
	},
);

/**
 *  This route cancels user order
 * @openapi
 * /user/cancelOrder:
 *   patch:
 *     tags:
 *        - User
 *     summary: Cancels User Orders
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *            type: object
 *            properties:
 *              orderId:
 *               type: number
 *               example: 2
 *              changeTo:
 *               type: string
 *               example: "cancelled"
 *     responses:
 *       200:
 *         description: 200 SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   example: {
 *                              "isSuccess": true
 *                            }
 *       400:
 *         description: 400 ERROR
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   example: {
 *                              "isSuccess": false,
 *                              "errorMessage": "Cannot Cancel Order"
 *                            }
 */
userRouter.patch(
	routesConstants.USER_CANCEL_ORDER,
	authenticateToken,
	(req: Request, res: Response) => {
		cancelOrder(req, res);
	},
);
/**
 *  This route puts items in cart
 * @openapi
 * /user/updateCart:
 *   post:
 *     tags:
 *        - User
 *     summary: Puts products in the cart
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *            type: array
 *            example: [{
 *                        "productId": 231,
 *                        "quantity": 3
 *                      }]
 *     responses:
 *       200:
 *         description: 200 SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   example: {
 *                              "isSuccess": true,
 *                            }
 */
userRouter.post(routesConstants.USER_UPDATE_CART, authenticateToken, updateCart);

/**
 *  This end point is gets the user's cart details
 * @openapi
 * /user/cart:
 *   get:
 *     tags:
 *        - User
 *     summary: Get User's Cart
 *     responses:
 *       200:
 *         description: 200 SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       productId:
 *                         type: number
 *                       name:
 *                         type: number
 *                       rewardPoints:
 *                         type: number
 *                       productImgURL:
 *                         type: string
 *                       quantity:
 *                         type: number
 *                       isError:
 *                         type: boolean
 *                         description: "Flag to check if the product in the cart is 'Active' or  if cost changed"
 *               example: [{
 *                              productId: 251,
 *                              name: "Coffee Mug",
 *                              rewardPoints: 245,
 *                              productImgURL: "http://image.com/coffeemug.jpeg",
 *                              quantity: 4,
 *                              isError: false
 * 								},
 *                              {
 *                               productId: 258,
 *                               name: "Coffee Mug Set",
 *                               rewardPoints: 250,
 *                               productImgURL: "http://image.com/coffeemugset.jepg",
 *                               quantity: 1,
 *                               isError: true
 *                              }]
 */
userRouter.get(routesConstants.USER_GET_CART, authenticateToken, getCart);

/**
 *  This route cancels user order
 * @openapi
 * /user/removeCartItem:
 *   delete:
 *     tags:
 *        - User
 *     summary: Removes the Item from the Cart
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *            type: object
 *            properties:
 *              productId:
 *               type: number
 *               example: 2
 *     responses:
 *       200:
 *         description: 200 SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   example: {
 *                              "isSuccess": true,
 *                              "message": "Successfully removed product from cart"
 *                            }
 *       400:
 *         description: 400 ERROR
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   example: {
 *                              "isSuccess": false,
 *                              "errorMessage": "Cart Item not found"
 *                            }
 */
userRouter.delete(
	routesConstants.USER_REMOVE_CART_ITEM,
	authenticateToken,
	(req: Request, res: Response) => {
		deleteCart(req, res);
	},
);


/**
 *  This route cancels user order
 * @openapi
 * /user/claimReward:
 *   post:
 *     tags:
 *        - User
 *     summary: Claims the Reward by Using Coupon Code and Secret Code
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *            type: object
 *            properties:
 *              couponCode:
 *                type: string
 *              secretCode:
 *                type: string
 *            example: {
 *                       "couponCode": "cng-0bd508c11c4b",
 *                       "secretCode": "fd7b798498eaf6d4"
 *                     }
 *     responses:
 *       200:
 *         description: 200 SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   example: {
 *                              "isSuccess": true,
 *                            }
 */
 userRouter.post(
	routesConstants.CLAIM_REWARD,
	authenticateToken,
	(req: Request, res: Response) => {
		claimReward(req, res);
	},
);

/**
 *  This route gets items that is being checkout for rendering
 * @openapi
 * /user/checkout:
 *   get:
 *     tags:
 *        - User
 *     summary: For Checkout Page - Pulls the data from Cart
 *     responses:
 *       200:
 *         description: 200 SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     $ref: '#/components/schemas/CheckoutObject'
 */
userRouter.get(routesConstants.CHECKOUT, authenticateToken, getCOItems);

module.exports = userRouter;
