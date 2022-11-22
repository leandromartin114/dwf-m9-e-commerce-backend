import type { NextApiRequest, NextApiResponse } from "next";
import method from "micro-method-router";
import { authMiddleware } from "lib/middlewares";
import { generateOrderAndPreference } from "controllers/order";
import { getOrder } from "controllers/order";
import { queryAndBodyMid } from "lib/middlewares";
import { orderQuerySchema, orderBodySchema } from "lib/schemas";

//Gets order info by id
async function getHandler(req: NextApiRequest, res: NextApiResponse, token) {
	try {
		if (!token.userId) {
			res.status(401).send({ message: "Unauthorized" });
		} else {
			const order = await getOrder(req.query.orderId as string);
			res.status(200).send(order);
		}
	} catch (error) {
		res.status(400).send({ error: error });
	}
}

//Generates a new order and preference
async function postHandler(req: NextApiRequest, res: NextApiResponse, token) {
	try {
		if (!token.userId) {
			res.status(401).send({ message: "Unauthorized" });
		} else {
			const response = await generateOrderAndPreference(
				token.userId,
				req.query.productId,
				req.body
			);
			res.status(200).send(response.body.init_point);
		}
	} catch (error) {
		res.status(400).send({ error: error });
	}
}

const postHandlerWithValidation = queryAndBodyMid(
	orderQuerySchema,
	orderBodySchema,
	postHandler
);

const handler = method({
	post: postHandlerWithValidation,
	get: getHandler,
});

export default authMiddleware(handler);
