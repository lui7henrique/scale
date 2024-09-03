import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

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

		console.log({ fields });
		reply.send({ fields });
	} catch (error) {
		throw error;
	}

	return reply.status(201).send();
}
