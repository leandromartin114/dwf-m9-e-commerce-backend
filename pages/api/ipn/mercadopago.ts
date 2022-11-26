import method from "micro-method-router";
import type { NextApiRequest, NextApiResponse } from "next";
import { getAndUpdateOrder } from "controllers/order";
import { CORSMiddleware } from "lib/middlewares";

//Endpoint for the notification about the merchant order/payment from MP

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
	try {
		const order = await getAndUpdateOrder(req.query);
		res.status(200).send(order);
	} catch (error) {
		res.status(400).send({ error: error });
	}
}

const handler = method({
	post: postHandler,
});

export default CORSMiddleware(handler);
