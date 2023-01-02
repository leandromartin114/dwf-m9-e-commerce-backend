import method from "micro-method-router";
import type { NextApiRequest, NextApiResponse } from "next";
import { getProductData } from "controllers/product";
import { CORSMiddleware } from "lib/middlewares";

//Gets the product data searching by id

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
	try {
		const productData = await getProductData(req.query.productId);
		res.status(200).send(productData);
	} catch (error) {
		res.status(400).send({ error: error });
	}
}

const handler = method({
	get: getHandler,
});

// export default async (req: NextApiRequest, res: NextApiResponse) => {
// 	await CORS2Middleware(req, res, handler);
// };

export default CORSMiddleware(handler);

// export default handler;
