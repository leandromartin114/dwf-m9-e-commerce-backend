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

export function schemaMiddleware(shema: yup.AnyObjectSchema, callback) {
	return async function (req: NextApiRequest, res: NextApiResponse) {
		try {
			const validateOK = await shema.validate(req.body);
			if (validateOK) {
				callback(req, res);
			}
		} catch (error) {
			res.status(422).send({ field: "body", message: error });
		}
	};
}
