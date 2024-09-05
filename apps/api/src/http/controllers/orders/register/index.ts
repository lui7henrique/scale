import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { database, Prisma } from "@scale/database";
import { publishToQueue } from "@scale/messaging";

const schema = z.object({
	product_id: z.string().min(1),
	quantity: z.number().min(1),
	address: z.string().min(1),
	payment_method: z.enum(["CREDIT_CARD", "DEBIT_CARD", "PAYPAL"]),
});

export async function register(request: FastifyRequest, reply: FastifyReply) {
	try {
		const { product_id, ...data } = schema.parse(request.body);

		const product = await database.product.findFirst({
			where: {
				id: product_id,
			},
		});

		if (!product) {
			return reply.code(404).send({ message: "Product not found" });
		}

		if (product.quantity < data.quantity) {
			return reply
				.code(422)
				.send({ message: "Insufficient stock for the requested quantity" });
		}

		await database.product.update({
			where: {
				id: product_id,
			},
			data: {
				quantity: {
					decrement: data.quantity,
				},
			},
		});

		const order = await database.order.create({
			data: {
				...data,
				product: {
					connect: { id: product_id },
				},
			},
		});

		await publishToQueue("payment_queue", order);
		reply.code(201).send(order);
	} catch (error) {
		console.error(error);
	}

	return reply.status(201).send();
}
