import { database, type Order } from "@scale/database";
import { consumeQueue } from "@scale/messaging";

export async function startOrderProcessing() {
	await consumeQueue("orders_queue", async (msg) => {
		if (msg) {
			const order: Order = JSON.parse(msg.content.toString());
			console.log("Processing order:", order);

			try {
				await database.order.update({
					where: {
						id: order.id,
					},
					data: {
						status: "PROCESSING",
					},
				});
				console.log(`Order ${order.id} is being processed`);
			} catch (error) {
				console.error("Error processing order:", error);
			}
		}
	});
}
