import method from "micro-method-router";
import type { NextApiRequest, NextApiResponse } from "next";
import { searchProducts } from "controllers/product";
import { CORSMiddleware } from "lib/middlewares";

//Gets the products searching by query

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
	try {
		const result = await searchProducts(req);
		if (result.results.length !== 0) {
			res.status(200).send(result);
		} else {
			res.status(400).send({ message: "Product not found" });
		}
	} catch (error) {
		res.status(400).send({ error: error });
	}
}

const handler = method({
	post: getHandler,
});

export default CORSMiddleware(handler);
