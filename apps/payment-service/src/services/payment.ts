import { database, type Order } from "@scale/database";
import { consumeQueue, publishToQueue } from "@scale/messaging";

export async function startPaymentService() {
	await consumeQueue("payment_queue", async (msg) => {
		if (msg) {
			const order: Order = JSON.parse(msg.content.toString());
			console.log("💬 Processing order:", order);

			try {
				if (order.payment_method === "PAYPAL") {
					const failedOrder = await database.order.update({
						where: {
							id: order.id,
						},
						data: {
							status: "PAYMENT_FAILED",
						},
					});

					await database.product.update({
						where: {
							id: order.productId,
						},
						data: {
							quantity: {
								increment: order.quantity,
							},
						},
					});

					return console.log("Processed order:", failedOrder);
				}

				const confirmedOrder = await database.order.update({
					where: {
						id: order.id,
					},
					data: {
						status: "CONFIRMED",
					},
				});

				console.log("Processed order:", confirmedOrder);

				await publishToQueue("order_fulfillment_queue", confirmedOrder);
			} catch (error) {
				console.error("Error processing order:", error);
			}
		}
	});
}
