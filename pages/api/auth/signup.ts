import method from "micro-method-router";
import type { NextApiRequest, NextApiResponse } from "next";
import { createAuth, sendCode } from "controllers/auth";
import * as yup from "yup";
import { schemaMiddleware } from "lib/middlewares";

let userSchema = yup
	.object()
	.shape({
		fullName: yup.string().required(),
		email: yup.string().email(),
		address: yup.string().required(),
	})
	.noUnknown(true)
	.strict();

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
	try {
		const auth = await createAuth(req.body);
		if (!auth) {
			return res.status(400).send({ message: "Auth failed" });
		} else {
			await sendCode(auth.data.email);
			return res
				.status(200)
				.send({ message: "the code was sent to " + auth.data.email });
		}
	} catch (error) {
		return res.status(400).send({ message: "error: " + error });
	}
}

const handler = method({
	post: postHandler,
});

export default schemaMiddleware(userSchema, handler);
