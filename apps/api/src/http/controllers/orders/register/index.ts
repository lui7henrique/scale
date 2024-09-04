import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { database } from "@scale/database";
import { getChannel } from "src/lib/rabbit-mq";

const schema = z.object({
	product: z.string().min(1),
	quantity: z.number().min(1),
	address: z.string().min(1),
	payment_method: z.enum(["CREDIT_CARD"]),
});

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

		const channel = getChannel();
		const queue = "orders_queue";
		const message = JSON.stringify({
			orderId: order.id,
			product: order.product,
			quantity: order.quantity,
			status: order.status,
		});

		await channel.assertQueue(queue, { durable: true });
		channel.sendToQueue(queue, Buffer.from(message), { persistent: true });

		// Responde com o pedido criado
		reply.code(201).send(order);
	} catch (error) {
		throw error;
	}

	return reply.status(201).send();
}
