import mercadopago from "mercadopago";

mercadopago.configure({
	access_token: process.env.MP_TOKEN,
});

export async function getMerchantOrder(id) {
	const res = await mercadopago.merchant_orders.get(id);
	return res.body;
}

export async function createPreference(ref, data) {
	const preference = {
		items: data,
		external_reference: ref,
		notification_url: "https://myfreemarket.vercel.app/api/ipn/mercadopago",
		back_urls: {
			success: process.env.SUCCESS_URL,
			failure: process.env.FAILURE_URL,
			pending: process.env.PENDING_URL,
		},
	};
	const newPreference = await mercadopago.preferences.create(preference);
	return newPreference;
}
