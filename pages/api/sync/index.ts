import methods from "micro-method-router";
import type { NextApiRequest, NextApiResponse } from "next";
import { dataBaseSynchronizer } from "controllers/product";

//Synchro the databases
module.exports = methods({
	async get(req: NextApiRequest, res: NextApiResponse) {
		try {
			await dataBaseSynchronizer(res);
		} catch (error) {
			res.status(400).send({ error: error });
		}
	},
});
