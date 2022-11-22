import methods from "micro-method-router";
import type { NextApiRequest, NextApiResponse } from "next";
import { getAllProducts } from "controllers/product";

//Gets all the products
module.exports = methods({
	async get(req: NextApiRequest, res: NextApiResponse) {
		try {
			const products = await getAllProducts(req);
			res.status(200).send(products);
		} catch (error) {
			res.status(400).send({ error: error });
		}
	},
});
