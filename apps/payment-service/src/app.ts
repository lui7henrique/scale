import fastify from "fastify";
import { ZodError } from "zod";

export const app = fastify({});

app.setErrorHandler((error, _, reply) => {
	if (error instanceof ZodError) {
		return reply
			.status(400)
			.send({ message: "Validation error.", issues: error.format() });
	}

	if (error instanceof SyntaxError) {
		return reply.status(400).send({
			message: "Invalid JSON payload.",
			details: error.message,
		});
	}

	return reply.status(500).send({ message: "Internal server error." });
});
