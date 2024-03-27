import express, { type Request, type Response } from "express";
const { loginUser, resetPassword } = require("../controllers/auth.controller");
const router = express.Router();
const { routesConstants } = require("../constants");

/**
 *  This end point is defined for user login
 * @param {Request} req
 * @param {Response} res
 * @openapi
 * /auth/login:
 *   post:
 *     tags:
 *        - Auth
 *     description: Use Wallet Credentials
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *            type: object
 *            properties:
 *              email: 
 *               type: string
 *               description: The user's wallet Email ID.
 *               example: john.doe@cdw.com
 *              password:
 *               type: string
 *               description: The user's wallet password.
 *               example: 2840b3
 *     responses:
 *       200:
 *         description: 200 SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuccess:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 */
router.post(routesConstants.LOGIN, (req: Request, res: Response) => {
	loginUser(req, res);
});

/**
 *  This end point is defined for user reset password
 * @param {Request} req
 * @param {Response} res
 * @openapi
 * /auth/reset-password:
 *   post:
 *     tags:
 *        - Auth
 *     description: Resets the User's Password
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *            type: object
 *            properties:
 *              email: 
 *               type: string
 *               description: The user's wallet Email ID.
 *               example: john.doe@cdw.com
 *     responses:
 *       200:
 *         description: 200 SUCCESS
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuccess:
 *                   type: boolean
 *                   example: true
 */
router.post(routesConstants.RESET_PASSWORD, (req: Request, res: Response) => {
	resetPassword(req, res);
});

module.exports = router;
