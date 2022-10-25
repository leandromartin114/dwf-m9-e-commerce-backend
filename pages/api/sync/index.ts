import methods from "micro-method-router";
import type { NextApiRequest, NextApiResponse } from "next";
import { airtableBase } from "lib/airtable";
import { productsIndex } from "lib/algolia";

module.exports = methods({
	async get(req: NextApiRequest, res: NextApiResponse) {
		airtableBase("Furniture")
			.select({
				pageSize: 5,
			})
			.eachPage(
				function page(records, fetchNextPage) {
					const objects = records.map((r) => {
						return {
							objectID: r.id,
							...r.fields,
						};
					});
					productsIndex.saveObjects(objects);
					fetchNextPage();
				},
				function done(err) {
					if (err) {
						console.error(err);
						return;
					}
					console.log("terminó");
					res.status(200).json({ done: "ok" });
				}
			);
	},
});
