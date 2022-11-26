import type { NextApiRequest, NextApiResponse } from "next";
import type { NextRequest } from "next/server";
import parseBearerToken from "parse-bearer-token";
import { decodeToken } from "./jwt";
import * as yup from "yup";

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

export function bodySchemaMiddleware(schema: yup.AnyObjectSchema, callback) {
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

export function middleware(req: NextRequest) {
	if (req.method == "OPTIONS") {
		return new Response(null, {
			status: 204,
			headers: {
				"Access-Control-Allow-Credentials": "true",
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,DELETE,POST,PUT",
				"Access-Control-Allow-Headers":
					req.headers.get("Access-Control-Request-Headers") || "",
				Vary: "Access-Control-Request-Headers",
				"Content-Length": "0",
			},
		});
	}
}

export const config = {
	matcher: ["/api/:path*"],
};
