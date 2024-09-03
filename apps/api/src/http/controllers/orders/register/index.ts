import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { database } from "@scale/database";

const schema = z.object({
	product: z.string().min(1),
	quantity: z.number().min(1),
	address: z.string().min(1),
	payment_method: z.enum(["CREDIT_CARD"]),
	// status: z.enum(["pending"]),
	// created_at: z.string().min(1),
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

		reply.code(201).send(order);
	} catch (error) {
		throw error;
	}

	return reply.status(201).send();
}
