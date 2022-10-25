import methods from "micro-method-router";
import type { NextApiRequest, NextApiResponse } from "next";
import { sendCode } from "controllers/auth";
import { emailCleaner } from "lib/email-cleaner";

module.exports = methods({
	async post(req: NextApiRequest, res: NextApiResponse) {
		try {
			const email = emailCleaner(req.body.email);
			await sendCode(email);
			return res.status(200).send({ message: "the code was sent to " + email });
		} catch (error) {
			return res.status(400).send({ message: "error: " + error });
		}
	},
});
