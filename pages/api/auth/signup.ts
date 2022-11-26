import method from "micro-method-router";
import type { NextApiRequest, NextApiResponse } from "next";
import { createAuth, sendCode } from "controllers/auth";
import { bodySchemaMiddleware } from "lib/middlewares";
import { newUserBodySchema } from "lib/schemas";
import { CORSMiddleware } from "lib/middlewares";

//Searches user and if it does not exist, creates a new one
async function postHandler(req: NextApiRequest, res: NextApiResponse) {
	try {
		const auth = await createAuth(req.body);
		if (!auth) {
			return res.status(400).send({ message: "The user already exists" });
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

const handlerWithCors = CORSMiddleware(postHandler);

const handler = method({
	post: handlerWithCors,
});

export default bodySchemaMiddleware(newUserBodySchema, handler);
