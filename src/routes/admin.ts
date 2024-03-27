import express, { type Request, type Response } from "express";
import multer from "multer";
import { roleConstants, routesConstants } from "../constants";
import { APP_CONSTANTS } from "../constants/constants";
import { logger } from "../logger/logger";
const upload = multer({ dest: "./public/uploads/" });
const {
	getProductsList,
	bulkCreateProducts,
	getOrderStatusCount,
	changeOrderStatus,
	getFilteredOrders,
	getOrdersList,
	createProduct,
	updateProductDetails,
	deleteProduct,
	activateProduct
} = require("../admin/admin.controller");
const adminRouter = express.Router();
const { authenticateToken, authorize } = require("../middlewares/auth.middleware");

/**
 *  This endpoint is for getting product list details from the inventory
 * @openapi
 * /admin/inventory:
 *   get:
 *     tags:
 *        - Admin
 *     summary: Get All Products in the Catalogue
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
 *                         $ref: '#/components/schemas/ProductsObject'
 *                 count:
 *                   type: object
 *                   example: 1
 */
adminRouter.get(
	routesConstants.INVENTORY,
	authenticateToken,
	authorize(roleConstants.ADMIN),
	(req: Request, res: Response) => {
		try {
			getProductsList(req, res);
		} catch (error: any) {
			logger.error("Server Error - " + JSON.stringify(error?.message));
			// serverErrorResponse()
		}
	},
);

/**
 *  This endpoint is for uploading product inventory through a excel file
 * @openapi
 * /admin/inventory/upload:
 *   post:
 *     tags:
 *        - Admin
 *     summary: Products Excel Upload
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *            type: object
 *            properties:
 *              fileName: 
 *               type: product_excelsheet.xlsx
 *     responses:
 *       201:
 *         description: 201 SUCCESS
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
 *                       title:
 *                         type: string
 *                       rewardPoints:
 *                         type: number
 *                       isCustomisable:
 *                         type: boolean
 *                       productImgURL:
 *                         type: string
 *                       isErroneous:
 *                         type: boolean
 *                   example: [{
 * 								title: Mouse Pad,
 * 								rewardPoints: 230,
 * 								isCustomisable: false,
 * 								productImgURL: "http://imageurl.com/mousepad.jpeg",
 *                              isErroneous: false
 * 								},
 *                             {
 * 								title: Steel Water Bottle,
 * 								rewardPoints: 230,
 * 								isCustomisable: false,
 * 								productImgURL: "http://imageurl.com/waterbottle.jpeg",
 *                              isErroneous: false
 * 								}]
 *       207:
 *         description: 207 Partial success
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
 *                       title:
 *                         type: string
 *                       rewardPoints:
 *                         type: number
 *                       isCustomisable:
 *                         type: boolean
 *                       productImgURL:
 *                         type: string
 *                       isErroneous:
 *                         type: boolean
 *                   example: [{
 * 								title: Mouse Pad,
 * 								rewardPoints: 230,
 * 								isCustomisable: false,
 * 								productImgURL: "http://imageurl.com/mousepad.jpeg",
 *                              isErroneous: false
 * 								},
 *                             {
 * 								title: Steel Water Bottle,
 * 								rewardPoints: 230,
 * 								isCustomisable: false,
 * 								productImgURL: "http://imageurl.com/waterbottle.jpeg",
 *                              isErroneous: true
 * 								}]
 */
adminRouter
	.route(routesConstants.INVENTORY_UPLOAD)
	.post(
		upload.single(APP_CONSTANTS.FILE_NAME),
		authenticateToken,
		authorize(roleConstants.ADMIN),
		(req: Request, res: Response) => {
			try {
				bulkCreateProducts(req, res);
			} catch (error: any) {
				logger.error("Server Error-" + JSON.stringify(error?.message));
				// serverErrorResponse()
			}
		},
	);

/**
 *  This endpoint is for changing the order status
 * @openapi
 * /admin/updateOrderStatus:
 *   patch:
 *     tags:
 *        - Admin
 *     summary: Changes the Order Status
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *            type: object
 *            properties:
 *              orderId: 
 *               type: number
 *               description: OrderId Number
 *               example: 3
 *              changeTo:
 *               type: string
 *               description: changeTo value = ["Submitted", "Accepted", "Cancelled", "Ready for Pickup", "Delivered"]
 *               example: Rejected
 *              rejectReason:
 *               type: string
 *               description: Reject Reason is only mandatory when 'changeTo' is 'Rejected'
 *               example: Not Available
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
 *                   example: {isSuccess: true}
 */
adminRouter.patch(
	routesConstants.UPDATE_ORDER_STATUS,
	authenticateToken,
	authorize(roleConstants.ADMIN),
	(req: Request, res: Response) => {
		changeOrderStatus(req, res);
	},
);

/**
 *  This endpoint is for getting the all order status
 * @openapi
 * /admin/dashboard:
 *   get:
 *     tags:
 *        - Admin
 *     summary: Fetches the Orders overview counts
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
 *                             "submitted": 6,
 *                             "accepted": 0,
 *                             "pickup": 0,
 *                             "delivered": 3
 *                            }
 */
adminRouter.get(
	routesConstants.ADMIN_DASHBOARD,
	authenticateToken,
	authorize(roleConstants.ADMIN),
	(req: Request, res: Response) => {
		getOrderStatusCount(req, res);
	},
);

/**
 *  This endpoint is for filtering orders
 * @openapi
 * /admin/orders:
 *   post:
 *     tags:
 *        - Admin
 *     summary: Get Orders With Filters
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *            type: object
 *            properties:
 *              status: 
 *               type: array
 *               example: ["SUBMITTED", "ACCEPTED"]
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
adminRouter.post(
	routesConstants.ORDERS,
	authenticateToken,
	authorize(roleConstants.ADMIN),
	(req: Request, res: Response) => {
		getFilteredOrders(req, res);
	},
);

/**
 *  This endpoint is for getting all orders
 * @openapi
 * /admin/orders:
 *   get:
 *     tags:
 *        - Admin
 *     summary: Fetches all Orders for the Admin
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
adminRouter.get(
	routesConstants.ORDERS,
	authenticateToken,
	authorize(roleConstants.ADMIN),
	(req: Request, res: Response) => {
		getOrdersList(req, res);
	},
);

/**
 *  This endpoint is for adding a single product
 * @openapi
 * /admin/inventory:
 *   post:
 *     tags:
 *        - Admin
 *     summary: Add Individual Products
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *            type: object
 *            properties:
 *              title: 
 *               type: string
 *               example: Mouse Pad
 *              rewardPoints:
 *               type: number
 *               example: 460
 *     responses:
 *       201:
 *         description: 201 SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   example: [{
 *                              productId: 111,
 *                              title: Mouse Pad,
 *                              rewardPoints: 230,
 *                              isCustomisable: false,
 *                              productImgURL: "http://imageurl.com/mousepad.jpeg",
 *                              isErroneous: false
 *                              },
 *                             {
 *                              productId: 222,
 *                              title: Steel Water Bottle,
 *                              rewardPoints: 230,
 *                              isCustomisable: false,
 *                              productImgURL: "http://imageurl.com/waterbottle.jpeg",
 *                              isErroneous: false
 *                             }]
 *       207:
 *         description: 207 Partial success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   example: [{
 *                              productId: 111,
 *                              title: ,
 *                              rewardPoints: 230,
 *                              isCustomisable: false,
 *                              productImgURL: "http://imageurl.com/mousepad.jpeg",
 *                              isErroneous: true
 *                              },
 *                             {
 *                              productId: 222,
 *                              title: Steel Water Bottle,
 *                              rewardPoints: 230,
 *                              isCustomisable: false,
 *                              productImgURL: "http://imageurl.com/waterbottle.jpeg",
 *                              isErroneous: true
 *                             }]
 */
adminRouter.post(
	routesConstants.INVENTORY,
	authenticateToken,
	authorize(roleConstants.ADMIN),
	(req: Request, res: Response) => {
		createProduct(req, res);
	},
);

/**
 *  This endpoint is for editing product details
 * @openapi
 * /admin/editProduct:
 *   patch:
 *     tags:
 *        - Admin
 *     summary: Edits the Product Details
 *     description: ProductId must be provided, rest is optional based on what needs to be changed
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *            type: object
 *            properties:
 *              productId: 
 *               type: number
 *               description: ProductId Number
 *               example: 3
 *              title:
 *               type: string
 *               example: Mouse Pad
 *              rewardPoints:
 *               type: number
 *               example: 240
 *              isCustomisable:
 *               type: boolean
 *               example: false
 *              productImgURL:
 *               type: string
 *               example: "http://image.com/mousepad.jpeg"
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
 *                             "isSuccess": true
 *                            }
 */
adminRouter.patch(
	routesConstants.EDIT_PRODUCT,
	authenticateToken,
	authorize(roleConstants.ADMIN),
	(req: Request, res: Response) => {
		updateProductDetails(req, res);
	},
);

/**
 *  This endpoint is for soft deleting products
 * @openapi
 * /admin/product:
 *   delete:
 *     tags:
 *        - Admin
 *     summary: Deactivates a product
 *     description: Deactivates or Soft Deletes a Product
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *            type: object
 *            properties:
 *              productId: 
 *               type: number
 *               example: 3
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
 *                   example: {isSuccess: true}
 */
adminRouter.delete(
	routesConstants.PRODUCT,
	authenticateToken,
	authorize(roleConstants.ADMIN),
	(req: Request, res: Response) => {
		deleteProduct(req, res);
	},
);

/**
 *  This endpoint is for activating products
 * @openapi
 * /admin/product/activate:
 *   delete:
 *     tags:
 *        - Admin
 *     summary: Activates a product
 *     description: Activates Product
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *            type: object
 *            properties:
 *              productId: 
 *               type: number
 *               example: 3
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
 *                   example: {isSuccess: true}
 */
adminRouter.delete(
	routesConstants.PRODUCT_ACTIVATE,
	authenticateToken,
	authorize(roleConstants.ADMIN),
	(req: Request, res: Response) => {
		activateProduct(req, res);
	},
);


module.exports = adminRouter;
