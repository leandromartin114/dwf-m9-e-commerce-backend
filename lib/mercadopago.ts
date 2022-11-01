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
	};
	const newPreference = await mercadopago.preferences.create(preference);
	return newPreference;
}
