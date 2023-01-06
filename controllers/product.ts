import { productsIndex } from "lib/algolia";
import { airtableBase } from "lib/airtable";
import { getOffsetAndLimitFromReq } from "lib/requests";

export async function searchProducts(req) {
	const { limit, offset } = getOffsetAndLimitFromReq(req, 20, 10);
	const query: any = req.query.q;
	const result = await productsIndex.search(query, {
		offset: offset,
		length: limit,
	});
	const response = {
		results: result.hits,
		pagination: {
			offset: offset,
			limit: limit,
			total: result.nbHits,
		},
	};
	return response;
}

export async function getAllProducts(req) {
	const { limit, offset } = getOffsetAndLimitFromReq(req, 20, 10);
	const result = await productsIndex.search("", {
		offset: offset,
		length: limit,
	});
	const response = {
		results: result.hits,
		pagination: {
			offset: offset,
			limit: limit,
			total: result.nbHits,
		},
	};
	return response;
}

export async function getFeaturedProducts(req) {
	const { limit, offset } = getOffsetAndLimitFromReq(req, 20, 20);
	const result = await productsIndex.search("true", {
		offset: offset,
		length: limit,
	});
	const response = {
		results: result.hits,
		pagination: {
			offset: offset,
			limit: limit,
			total: result.nbHits,
		},
	};
	return response;
}

export async function getProductData(id) {
	const result = await productsIndex.getObject(id);
	if (result) {
		return result;
	} else {
		return null;
	}
}

export async function dataBaseSynchronizer(response) {
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
				response.status(200).json({ done: "ok" });
			}
		);
}
