import methods from "micro-method-router";
import type { NextApiRequest, NextApiResponse } from "next";
import { sendToken } from "controllers/auth";
import { emailCleaner } from "lib/email-cleaner";

module.exports = methods({
	async post(req: NextApiRequest, res: NextApiResponse) {
		const email = emailCleaner(req.body.email);
		const token = await sendToken(email, req.body.code);
		if (!token) {
			res.status(401).send({ message: "Wrong email or code" });
		}
		if (token === true) {
			res.status(401).send({ message: "Expired code" });
		}
		res.status(200).send({ token });
	},
});
