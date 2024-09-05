import { database, type Order } from "@scale/database";
import { consumeQueue, publishToQueue } from "@scale/messaging";

export async function startPaymentService() {
	await consumeQueue("payment_queue", async (msg) => {
		if (msg) {
			const order: Order = JSON.parse(msg.content.toString());

			try {
				await new Promise((resolve) => setTimeout((resolve) => {}, 1000));

				if (order.payment_method === "PAYPAL") {
					await database.order.update({
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

					return;
				}

				const confirmedOrder = await database.order.update({
					where: {
						id: order.id,
					},
					data: {
						status: "CONFIRMED",
					},
				});

				await publishToQueue("payment_queue", order);
			} catch (error) {
				console.error("Error processing order:", error);
			}
		}
	});
}
