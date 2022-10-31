import methods from "micro-method-router";
import type { NextApiRequest, NextApiResponse } from "next";
import { searchProducts } from "controllers/products";

module.exports = methods({
	async get(req: NextApiRequest, res: NextApiResponse) {
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
	},
});
