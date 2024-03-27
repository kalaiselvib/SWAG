import express, { type Request, type Response } from "express";
import { routesConstants } from "../constants";
const { getEmployees } = require("../controllers/employees.controller");
const router = express.Router();
const { authenticateToken } = require("../middlewares/auth.middleware");

/**
 * @swagger
 * components:
 *   schemas:
 *     EmployeeObject:
 *       type: object
 *       properties:
 *         employeeId:
 *           type: number
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         location:
 *           type: string
 *         business_unit:
 *           type: string
 *         gender:
 *           type: string
 *       example: {
 *                  "employeeId": "2078",
 *                  "name": "John Doe",
 *                  "email": "john.doe@cdw.com",
 *                  "location": "Bengaluru",
 *                  "business_unit": "Pro Svc-IN Glob Del SWENG_DEV",
 *                  "gender": "Male"
 *               }
 */

/**
 *  This end point is defined to get all employees from wallet.
 * @param {Request} req
 * @param {Response} res
 * @openapi
 * /employees:
 *   get:
 *     tags:
 *        - Common
 *     summary: Fetches All the User Data from Wallet DB
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
 *                     $ref: '#/components/schemas/EmployeeObject'
 */
router.get(
	routesConstants.ROOT,
	authenticateToken,
	(req: Request, res: Response) => {
		getEmployees(req, res);
	},
);
module.exports = router;
