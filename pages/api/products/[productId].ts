import methods from "micro-method-router";
import type { NextApiRequest, NextApiResponse } from "next";
import { getProductData } from "controllers/product";

//Gets the product data searching by id
module.exports = methods({
	async get(req: NextApiRequest, res: NextApiResponse) {
		try {
			const productData = await getProductData(req.query.productId);
			res.status(200).send(productData);
		} catch (error) {
			res.status(400).send({ error: error });
		}
	},
});
