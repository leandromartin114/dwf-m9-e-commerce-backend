import type { NextApiRequest, NextApiResponse } from "next";
import method from "micro-method-router";
import { authMiddleware } from "lib/middlewares";
import { generateOrderAndPreference } from "controllers/order";
import { getOrder } from "controllers/order";
import * as yup from "yup";
import { queryAndBodyMid } from "lib/middlewares";

let querySchema = yup.mixed();

let bodySchema = yup
	.array()
	.of(
		yup
			.object()
			.shape({
				title: yup.string().required(),
				quantity: yup.string().required(),
				currency_id: yup.string().required(),
				unit_price: yup.number().required(),
				color: yup.string().optional(),
				materials: yup.string().optional(),
			})
			.noUnknown(true)
			.strict()
	)
	.strict();

async function getHandler(req: NextApiRequest, res: NextApiResponse, token) {
	try {
		if (!token.userId) {
			res.status(401).send({ message: "Unauthorized" });
		}
		const order = await getOrder(req.query.orderId as string);
		res.status(200).send(order);
	} catch (error) {
		res.status(400).send({ error: error });
	}
}

async function postHandler(req: NextApiRequest, res: NextApiResponse, token) {
	try {
		if (!token.userId) {
			res.status(401).send({ message: "Unauthorized" });
		}
		const response = await generateOrderAndPreference(
			token.userId,
			req.query.productId,
			req.body
		);
		res.status(200).send(response.body.init_point);
	} catch (error) {
		res.status(400).send({ error: error });
	}
}

const postHandlerWithValidation = queryAndBodyMid(
	querySchema,
	bodySchema,
	postHandler
);

const handler = method({
	post: postHandlerWithValidation,
	get: getHandler,
});

export default authMiddleware(handler);
