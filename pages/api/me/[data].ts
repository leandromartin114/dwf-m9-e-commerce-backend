import method from "micro-method-router";
import type { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "lib/middlewares";
import { updateUser } from "controllers/user";
import * as yup from "yup";
import { queryAndBodyMid } from "lib/middlewares";

let querySchema = yup
	.string()
	.matches(/(email|fullName|address)/, "It's not a valid parameter");
let bodySchema = yup
	.object()
	.shape({
		content: yup.string().required(),
	})
	.noUnknown(true)
	.strict();

async function patchOneDataHandler(
	req: NextApiRequest,
	res: NextApiResponse,
	token
) {
	try {
		const infoForUpdate = {};
		const data = req.query.data as string;
		const content = req.body.content;
		infoForUpdate[data] = content;
		const userUpdated = await updateUser(token.userId, infoForUpdate);
		res.status(200).send(userUpdated);
	} catch (error) {
		res.status(400).send({ error: error });
	}
}

const patchHandlerWithValidation = queryAndBodyMid(
	querySchema,
	bodySchema,
	patchOneDataHandler
);

const handler = method({
	patch: patchHandlerWithValidation,
});

export default authMiddleware(handler);
