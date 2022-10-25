import Airtable from "airtable";

export const airtableBase = new Airtable({
	apiKey: "keysuA8j6pIhq4vV8",
}).base("appu8Rc6OY1K2nvbR");

// import Airtable from "airtable";
// import "dotenv/config";

// export const airtableBase = new Airtable({
// 	apiKey: process.env.AIRTABLE_APIKEY,
// }).base(process.env.AIRTABLE_BASEID);
