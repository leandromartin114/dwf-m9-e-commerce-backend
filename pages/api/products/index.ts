import method from "micro-method-router";
import type { NextApiRequest, NextApiResponse } from "next";
import { getAllProducts } from "controllers/product";
import { CORSMiddleware } from "lib/middlewares";

//Gets all the products
async function getHandler(req: NextApiRequest, res: NextApiResponse) {
	try {
		const products = await getAllProducts(req);
		res.status(200).send(products);
	} catch (error) {
		res.status(400).send({ error: error });
	}
}

const getHandlerWithCors = CORSMiddleware(getHandler);

const handler = method({
	get: getHandlerWithCors,
});

export default handler;
