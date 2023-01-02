import type { NextApiRequest, NextApiResponse } from "next";
import parseBearerToken from "parse-bearer-token";
import { decodeToken } from "./jwt";
import * as yup from "yup";
import NextCors from "nextjs-cors";
import Cors from "cors";

export function authMiddleware(callback) {
	return function (req: NextApiRequest, res: NextApiResponse) {
		const token = parseBearerToken(req);
		if (!token) {
			res.status(401).send({ message: "No token" });
		}
		const decodedToken = decodeToken(token);
		if (decodedToken) {
			callback(req, res, decodedToken);
		} else {
			res.status(401).send({ message: "Wrong token" });
		}
	};
}

export function bodySchemaMiddleware(schema: yup.AnySchema, callback) {
	return async function (req: NextApiRequest, res: NextApiResponse) {
		try {
			const validateOK = await schema.validate(req.body);
			if (validateOK) {
				callback(req, res);
			}
		} catch (error) {
			res.status(422).send({ field: "body", message: error });
		}
	};
}

export function queryAndBodyMid(
	querySch: any,
	bodySch: yup.AnySchema,
	callback
) {
	return async function (req: NextApiRequest, res: NextApiResponse, token) {
		try {
			let query;
			if (req.query.data) {
				query = req.query.data;
			}
			if (req.query.productId) {
				query = req.query.productId;
			}
			const validateQueryOK = await querySch.validate(query);
			const validateBodyOK = await bodySch.validate(req.body);
			if (validateQueryOK && validateBodyOK) {
				callback(req, res, token);
			}
		} catch (error) {
			res.status(422).send({ field: "query or body", message: error });
		}
	};
}

//CORS mid 1
export function CORSMiddleware(callback) {
	return async function (req: NextApiRequest, res: NextApiResponse) {
		// Run the cors middleware
		// nextjs-cors uses the cors package, so we invite you to check the documentation https://github.com/expressjs/cors
		await NextCors(req, res, {
			// Options
			methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
			origin: "*",
			optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
		});

		// Rest of the API logic
		callback(req, res);
		//res.json({ message: "Hello NextJs Cors!" });
	};
}

//CORS mid 2
const cors = Cors({
	methods: ["GET", "POST", "PATCH", "OPTIONS"],
});

// export function CORS2Middleware(req, res, cb) {
// 	return new Promise((resolve, reject) => {
// 		cors(req, res, (result) => {
// 			if (result instanceof Error) return reject(result);
// 			cb(req, res);
// 			return resolve(result);
// 		});
// 	});
// }
export function CORS2Middleware(cb) {
	return async function (req: NextApiRequest, res: NextApiResponse) {
		await cors(req, res);
		cb(req, res);
	};
}
