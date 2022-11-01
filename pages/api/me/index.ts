import type { NextApiRequest, NextApiResponse } from "next";
import method from "micro-method-router";
import { authMiddleware } from "lib/middlewares";
import { getUserData, updateUser } from "controllers/user";

//Gets user info
async function getHandler(req: NextApiRequest, res: NextApiResponse, token) {
	try {
		const userData = await getUserData(token.userId);
		if (userData) {
			res.status(200).send(userData);
		} else {
			res.status(400).send({ message: "There isn't user data" });
		}
	} catch (error) {
		res.status(400).send({ error: error });
	}
}
//Updates user info
async function patchHandler(req: NextApiRequest, res: NextApiResponse, token) {
	try {
		const userUpdated = await updateUser(token.userId, req.body);
		res.status(200).send(userUpdated);
	} catch (error) {
		res.status(400).send({ error: error });
	}
}

const handler = method({
	get: getHandler,
	patch: patchHandler,
});

export default authMiddleware(handler);
