import method from "micro-method-router";
import type { NextApiRequest, NextApiResponse } from "next";
import { getProductData } from "controllers/product";
import { CORSMiddleware } from "lib/middlewares";
import NextCors from "nextjs-cors";

//Gets the product data searching by id

async function getHandler(req, res) {
	// Run the cors middleware
	// nextjs-cors uses the cors package, so we invite you to check the documentation https://github.com/expressjs/cors
	await NextCors(req, res, {
		// Options
		methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
		origin: "*",
		optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
	});

	// Rest of the API logic
	try {
		const productData = await getProductData(req.query.productId);
		res.status(200).send(productData);
	} catch (error) {
		res.status(400).send({ error: error });
	}
	res.json({ message: "Hello NextJs Cors!" });
}

// async function getHandler(req: NextApiRequest, res: NextApiResponse) {
// 	try {
// 		const productData = await getProductData(req.query.productId);
// 		res.status(200).send(productData);
// 	} catch (error) {
// 		res.status(400).send({ error: error });
// 	}
// }

const handler = method({
	get: getHandler,
});

export default CORSMiddleware(handler);
