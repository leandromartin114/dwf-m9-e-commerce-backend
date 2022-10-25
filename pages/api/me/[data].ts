import methods from "micro-method-router";
import type { NextApiRequest, NextApiResponse } from "next";

module.exports = methods({
	async patch(req: NextApiRequest, res: NextApiResponse) {
		res.status(200).json({
			message: "soy patch one data",
			data: req.query.data,
			content: req.body.content,
		});
	},
});
