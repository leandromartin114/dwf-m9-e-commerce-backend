import algoliasearch from "algoliasearch";

const client = algoliasearch(
	process.env.ALGOLIA_APPID,
	process.env.ALGOLIA_APIKEY
);
export const productsIndex = client.initIndex("products");
