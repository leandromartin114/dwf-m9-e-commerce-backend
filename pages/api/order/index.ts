import type { NextApiRequest, NextApiResponse } from "next";
import method from "micro-method-router";
import { authMiddleware } from "lib/middlewares";
import { generateOrderAndPreference } from "controllers/order";
import { getOrder } from "controllers/order";
import { bodySchemaMiddleware } from "lib/middlewares";
import { orderQuerySchema, orderBodySchema } from "lib/schemas";
import { CORSMiddleware } from "lib/middlewares";

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
				req.body
				// req.query.productId,
			);
			res.status(200).send({ url: response.body.init_point });
		}
	} catch (error) {
		res.status(400).send({ error: error.message });
	}
}

const postHandlerWithValidation = bodySchemaMiddleware(
	orderBodySchema,
	postHandler
	// orderQuerySchema,
);

const getHandlerWithAuth = authMiddleware(getHandler);
const postHandlerWithAuth = authMiddleware(postHandlerWithValidation);

const handler = method({
	post: postHandlerWithAuth,
	get: getHandlerWithAuth,
});

export default CORSMiddleware(handler);
