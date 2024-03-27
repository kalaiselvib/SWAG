import express, { type Request, type Response } from "express";
import multer from "multer";
import { roleConstants, routesConstants } from "../constants";
import {
	bulkCreateRewards,
	bulkUploadRewards,
	getAllRewards,
	getAllRewardCategories,
	getAllFilteredRewards,
	scheduleExpiration,
	cancelExpiration,
	bulkGenerateCoupons,
} from "../hr/hr.controller";

const upload = multer({ dest: "./uploads/" });
const { authenticateToken, authorize } = require("../middlewares/auth.middleware");
const rewardsRouter = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     RewardsObject:
 *       type: object
 *       properties:
 *         date:
 *           type: string
 *         rewardee:
 *           type: string
 *         rewardCategory:
 *           type: string
 *         description:
 *           type: string
 *         rewardPoints:
 *           type: number
 *         addedBy:
 *           type: string
 *       example: {
 *                  "date": "22 Feb 2024",
 *                  "rewardee": "1882 - Jospeh",
 *                  "rewardCategory": "SSL",
 *                  "description": "1st Prize",
 *                  "rewardPoints": 7500,
 *                  "addedBy": "1882 - John Doe"
 *               }
 * 
 *     GetRewardsObject:
 *       type: object
 *       properties:
 *         data:
 *           type: object
 *           $ref: '#/components/schemas/RewardsObject'
 *         count:
 *           type: number
 *       example: {
 *                  "date": "22 Feb 2024",
 *                  "rewardee": "1882 - Jospeh",
 *                  "rewardCategory": "SSL",
 *                  "description": "1st Prize",
 *                  "rewardPoints": 7500,
 *                  "addedBy": "1882 - John Doe"
 *               }
 * 
 *     AddRewardsObject:
 *       allOf:
 *         - $ref: '#/components/schemas/RewardsObject'
 *         - type: object
 *           properties:
 *             isErroneous:
 *               type: boolean
 *       example: {
 *                  "date": "22 Feb 2024",
 *                  "rewardee": "1882 - Jospeh",
 *                  "rewardCategory": "SSL",
 *                  "description": "1st Prize",
 *                  "rewardPoints": 7500,
 *                  "addedBy": "1882 - John Doe",
 *                  "isErroneous": false
 *               }
 * 
 *     FilterRewardsObject:
 *       allOf:
 *         - $ref: '#/components/schemas/RewardsObject'
 *         - type: object
 *           properties:
 *             rewardType:
 *               type: string
 *       example: {
 *                  "date": "22 Feb 2024",
 *                  "rewardee": "1882 - Jospeh",
 *                  "rewardCategory": "SSL",
 *                  "description": "1st Prize",
 *                  "rewardPoints": 7500,
 *                  "addedBy": "1882 - John Doe",
 *                  "rewardType": "ADDED"
 *               }
 */

/**
 *  This end point is defined for validating the uploaded xlsx - HR
 * @openapi
 * /hr/rewards/upload:
 *   post:
 *     tags:
 *        - Organizer
 *     summary: Add Multilpe Rewards through Excel Upload
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *            type: object
 *            properties:
 *              rewardsFile: 
 *               type: rewards_excelsheet.xlsx
 *     responses:
 *       200:
 *         description: 200 SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rewards:
 *                   type: array
 *                   items:
 *                     type: object
 *                     $ref: '#/components/schemas/AddRewardsObject'
 */
rewardsRouter.post(
	routesConstants.UPLOAD,
	authenticateToken,
	authorize(roleConstants.HR),
	upload.single("rewardsFile"),
	// eslint-disable-next-line @typescript-eslint/no-misused-promises
	async (req: Request, res: Response) => {
		await bulkUploadRewards(req, res);
	},
);

/**
 *  This end point is defined for generating coupons - HR
 * @openapi
 * /hr/coupons:
 *   post:
 *     tags:
 *        - Organizer
 *     summary: Generates Gift Cards for Organizer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *            type: array
 *            items:
 *              type: object
 *              properties:
 *                rewardCategory:
 *                  type: string
 *                rewardPoints:
 *                  type: number
 *                quantity:
 *                  type: number
 *            example: [{
 *                       "rewardCategory": "CNG",
 *                       "rewardPoints": 1000,
 *                       "quantity": 10
 *                     }]
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
rewardsRouter.post(
	routesConstants.COUPONS,
	authenticateToken,
	authorize(roleConstants.HR),
	// eslint-disable-next-line @typescript-eslint/no-misused-promises
	async (req: Request, res: Response) => {
		await bulkGenerateCoupons(req, res);
	},
);
/**
 *  This end point is defined for saving the rewards - HR
 * @openapi
 * /hr/rewards:
 *   post:
 *     tags:
 *        - Organizer
 *     summary: Adds Rewards into the DB
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *            type: array
 *            items:
 *              type: object
 *              $ref: '#/components/schemas/AddRewardsObject'
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
 *                     isSuccess:
 *                       type: boolean
 *                       example: true
 */
rewardsRouter.post(
	routesConstants.USER_REWARDS,
	authenticateToken,
	authorize(roleConstants.HR),
	// eslint-disable-next-line @typescript-eslint/no-misused-promises
	async (req: Request, res: Response) => {
		await bulkCreateRewards(req, res);
	},
);
/**
 *  This end point is defined for getting all the rewards - HR
 * @openapi
 * /hr/rewards:
 *   get:
 *     tags:
 *        - Organizer
 *     summary: Fetches all user rewards data in the DB
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
 *                       type: array
 *                       items:
 *                         type: object
 *                         $ref: '#/components/schemas/RewardsObject'
 */
rewardsRouter.get(
	routesConstants.USER_REWARDS,
	authenticateToken,
	authorize(roleConstants.HR),
	// eslint-disable-next-line @typescript-eslint/no-misused-promises
	async (req: Request, res: Response) => {
		await getAllRewards(req, res);
	},
);

/**
 *  This end point is defined for getting the filtered rewards - HR
 * @openapi
 * /hr/rewards/filter:
 *   post:
 *     tags:
 *        - Organizer
 *     summary: Filter Rewards
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
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rewardee:
 *                 type: number
 *                 description: Optional Attribute
 *               rewardCategory:
 *                 type: string
 *                 description: Optional Attribute
 *               addedBy:
 *                 type: number
 *                 description: Optional Attribute
 *               startDate:
 *                 type: string
 *                 description: Optional Attribute
 *               endDate:
 *                 type: string
 *                 description: Optional Attribute
 *             example: {
 *                         "rewardee": 2062,
 *                         "addedBy": 1653
 *                      }
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
 *                         $ref: '#/components/schemas/FilterRewardsObject'
 *                     count:
 *                       type: number
 *                       example: 1
 */
rewardsRouter.post(
	routesConstants.REWARD_FILTER,
	authenticateToken,
	authorize(roleConstants.HR),
	// eslint-disable-next-line @typescript-eslint/no-misused-promises
	async (req: Request, res: Response) => {
		await getAllFilteredRewards(req, res);
	},
);

/**
 *  This end point is defined for getting all the reward categories - HR
 * @openapi
 * /hr/rewards/categories:
 *   get:
 *     tags:
 *        - Organizer
 *     summary: Fetches all reward categories from the DB
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
 *                   example: [ "SSL", "CCL", "Event'O", "Diwali Event" ]
 */
// eslint-disable-next-line @typescript-eslint/no-misused-promises
rewardsRouter.get(
	routesConstants.REWARD_CATEGORIES,
	authenticateToken,
	authorize(roleConstants.HR),
	// eslint-disable-next-line @typescript-eslint/no-misused-promises
	async (req: Request, res: Response) => {
		await getAllRewardCategories(req, res);
	},
);

/**
 *  This end point is for scheduling Expiration Job
 * @openapi
 * /hr/schedule/expiration:
 *   post:
 *     tags:
 *        - Organizer
 *     summary: Schedules Coupon and Points Expiration Job
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 description: Format YYYY-MM-DD 
 *             example: {
 *                         date: "2024-03-16"
 *                      }
 *     responses:
 *       200:
 *         description: 200 SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: string
 *               example: "CRON Job Created Successfully"
 */
rewardsRouter.post(
	routesConstants.SCHEDULE_EXPIRATION,
	authenticateToken,
	authorize(roleConstants.HR),
	// eslint-disable-next-line @typescript-eslint/no-misused-promises
	async (req: Request, res: Response) => {
		await scheduleExpiration(req, res);
	},
);

/**
 *  This end point is for cancelling Expiration Job
 * @openapi
 * /hr/schedule/expiration:
 *   delete:
 *     tags:
 *        - Organizer
 *     summary: Deletes the existing Schedules Coupon and Points Expiration Job
 *     responses:
 *       200:
 *         description: 200 SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: string
 *               example: "Existing Job has been Cancelled"
 */
rewardsRouter.delete(
	routesConstants.SCHEDULE_EXPIRATION,
	authenticateToken,
	authorize(roleConstants.HR),
	// eslint-disable-next-line @typescript-eslint/no-misused-promises
	async (req: Request, res: Response) => {
		await cancelExpiration(req, res);
	},
);

module.exports = rewardsRouter;
