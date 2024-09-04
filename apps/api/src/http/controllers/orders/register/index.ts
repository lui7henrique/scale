import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { database, type Order } from "@scale/database";
import { getChannel } from "src/lib/rabbit-mq";

const schema = z.object({
	product: z.string().min(1),
	quantity: z.number().min(1),
	address: z.string().min(1),
	payment_method: z.enum(["CREDIT_CARD"]),
});

export async function publishToQueue(
	queue: string,
	order: Order,
): Promise<void> {
	const message = {
		orderId: order.id,
		product: order.product,
		quantity: order.quantity,
		status: order.status,
	};

	try {
		const channel = getChannel();
		const messageBuffer = Buffer.from(JSON.stringify(message));

		await channel.assertQueue(queue, { durable: true });
		channel.sendToQueue(queue, messageBuffer, { persistent: true });
	} catch (error) {
		console.error("Failed to publish message to queue", error);
		throw error;
	}
}

export async function register(request: FastifyRequest, reply: FastifyReply) {
	try {
		const fields = schema.parse(request.body);

		const order = await database.order.create({
			data: {
				...fields,
				status: "PENDING",
				payment_method: "CREDIT_CARD",
			},
		});

		await publishToQueue("orders_queue", order);

		reply.code(201).send(order);
	} catch (error) {
		throw error;
	}

	return reply.status(201).send();
}
