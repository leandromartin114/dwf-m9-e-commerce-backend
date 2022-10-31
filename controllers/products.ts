import { productsIndex } from "lib/algolia";
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
