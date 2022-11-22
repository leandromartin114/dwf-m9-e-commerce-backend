import methods from "micro-method-router";
import type { NextApiRequest, NextApiResponse } from "next";
import { getAndUpdateOrder } from "controllers/order";

//Endpoint for the notification about the merchant order/payment from MP
module.exports = methods({
	async post(req: NextApiRequest, res: NextApiResponse) {
		try {
			const order = await getAndUpdateOrder(req.query);
			res.status(200).send(order);
		} catch (error) {
			res.status(400).send({ error: error });
		}
	},
});
