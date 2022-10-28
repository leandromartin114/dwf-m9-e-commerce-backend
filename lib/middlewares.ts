import type { NextApiRequest, NextApiResponse } from "next";
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

export function queryAndBodyMiddleware(
	querySch: yup.StringSchema,
	bodySch: yup.AnyObjectSchema,
	callback
) {
	return async function (req: NextApiRequest, res: NextApiResponse, token) {
		try {
			const validateQueryOK = await querySch.validate(req.query.data);
			const validateBodyOK = await bodySch.validate(req.body);
			if (validateQueryOK && validateBodyOK) {
				callback(req, res, token);
			}
		} catch (error) {
			res.status(422).send({ field: "query", message: error });
		}
	};
}
