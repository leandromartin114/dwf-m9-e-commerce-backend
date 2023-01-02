import { User } from "models/user";
import { Order } from "models/order";
import { createPreference, getMerchantOrder } from "lib/mercadopago";
import { sgMail } from "lib/sendgrid";
import * as _ from "lodash";

export async function generateOrderAndPreference(
	userId: string,
	// ids: any,
	data: any
) {
	const user = new User(userId);
	await user.pull();
	// let items;
	// if (data.length == 1) {
	// 	items = [
	// 		{
	// 			productId: ids,
	// 			...data[0],
	// 		},
	// 	];
	// } else {
	// 	items = _.zipWith(data, ids, (d, i) => {
	// 		return {
	// 			productId: i,
	// 			...d,
	// 		};
	// 	});
	// }
	const orderData = {
		userId: userId,
		email: user.data.email,
		items: data,
		status: "pending",
		merchant_order: "",
	};
	const newOrder = await Order.createNewOrder(orderData);
	const newPreference = await createPreference(newOrder.id, data);
	return newPreference;
}

export async function getAndUpdateOrder(data) {
	const { id, topic } = data;
	if (topic == "merchant_order") {
		const merchantOrder = await getMerchantOrder(id);
		const order = new Order(merchantOrder.external_reference);
		await order.pull();
		order.data.status = "closed";
		order.data.merchant_order = merchantOrder.id;
		await order.push();
		const msg = {
			to: order.data.email,
			from: "leandrom.roldan@gmail.com",
			subject: "Confirmación de pago",
			html: `<h1>Tu pago fue exitoso</h1>
			<p>En los próximos días recibirás tu producto</p>
			`,
		};
		await sgMail.send(msg);
		return order;
	}
}

export async function getOrdersByUserId(userId: string) {
	const result = await Order.findUserOrders(userId);
	return result.map((o) => {
		return o.data();
	});
}

export async function getOrder(orderId: string) {
	const order = await Order.findOrderById(orderId);
	return order;
}
