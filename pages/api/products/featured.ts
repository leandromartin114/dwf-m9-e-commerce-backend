import method from "micro-method-router";
import type { NextApiRequest, NextApiResponse } from "next";
import { getFeaturedProducts } from "controllers/product";
import { CORSMiddleware } from "lib/middlewares";

//Get featured products
async function getHandler(req: NextApiRequest, res: NextApiResponse) {
	try {
		const products = await getFeaturedProducts(req);
		res.status(200).send(products);
	} catch (error) {
		res.status(400).send({ error: error });
	}
}

const handler = method({
	get: getHandler,
});

export default CORSMiddleware(handler);
