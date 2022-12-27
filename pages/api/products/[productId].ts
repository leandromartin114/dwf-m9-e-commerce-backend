import method from "micro-method-router";
import type { NextApiRequest, NextApiResponse } from "next";
import { getProductData } from "controllers/product";
import { CORSMiddleware } from "lib/middlewares";
import Cors from "cors";

//Gets the product data searching by id

// async function getHandler(req: NextApiRequest, res: NextApiResponse) {
// 	try {
// 		const productData = await getProductData(req.query.productId);
// 		res.status(200).send(productData);
// 	} catch (error) {
// 		res.status(400).send({ error: error });
// 	}
// }

// const handler = method({
// 	get: getHandler,
// });

// export default CORSMiddleware(handler);

const cors = Cors({
	methods: ["GET", "HEAD"],
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req, res, fn) {
	return new Promise((resolve, reject) => {
		fn(req, res, (result) => {
			if (result instanceof Error) {
				return reject(result);
			}

			return resolve(result);
		});
	});
}
async function handler(req, res) {
	// Run the middleware
	await runMiddleware(req, res, cors);

	// Rest of the API logic
	try {
		const productData = await getProductData(req.query.productId);
		res.status(200).send(productData);
	} catch (error) {
		res.status(400).send({ error: error });
	}
}

export default handler;
