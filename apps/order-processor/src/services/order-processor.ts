import { consumeQueue } from "@scale/messaging";

export async function startOrderProcessing() {
	await consumeQueue("orders_queue", (msg) => {
		if (msg) {
			const order = JSON.parse(msg.content.toString());
			console.log("Processing order:", order);

			try {
				console.log(`Order ${order.orderId} is being processed`);
			} catch (error) {
				console.error("Error processing order:", error);
			}
		}
	});
}
