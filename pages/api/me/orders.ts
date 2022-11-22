import method from "micro-method-router";
import type { NextApiRequest, NextApiResponse } from "next";
import { getOrdersByUserId } from "controllers/order";
import { authMiddleware } from "lib/middlewares";

//Gets user's orders
async function getHandler(req: NextApiRequest, res: NextApiResponse, token) {
	try {
		const userOrders = await getOrdersByUserId(token.userId);
		if (userOrders.length !== 0) {
			res.status(200).send(userOrders);
		} else {
			res.status(400).send({ message: "There aren't orders with this userId" });
		}
	} catch (error) {
		res.status(400).send({ error: error });
	}
}

const handler = method({
	get: getHandler,
});

export default authMiddleware(handler);
