import algoliasearch from "algoliasearch";

const client = algoliasearch("SU2ZMU59NH", "30fa615c46c5ca84ac83a84bf19ee9a5");
export const productsIndex = client.initIndex("products");

// import algoliasearch from "algoliasearch";
// import "dotenv/config";

// const client = algoliasearch(
// 	process.env.ALGOLIA_APPID,
// 	process.env.ALGOLIA_APIKEY
// );
// export const productsIndex = client.initIndex("products");
