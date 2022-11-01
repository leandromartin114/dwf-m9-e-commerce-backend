import methods from "micro-method-router";
import type { NextApiRequest, NextApiResponse } from "next";
import { sendCode } from "controllers/auth";
import { emailCleaner } from "lib/email-cleaner";

//Searches user by email and if it does exist generates a number code and sends it by email
module.exports = methods({
	async post(req: NextApiRequest, res: NextApiResponse) {
		try {
			const email = emailCleaner(req.body.email);
			const code = await sendCode(email);
			if (code) {
				return res
					.status(200)
					.send({ message: "the code was sent to " + email });
			} else {
				return res.status(400).send({ message: "the user doesn't exist" });
			}
		} catch (error) {
			return res.status(400).send({ message: "error: " + error });
		}
	},
});
