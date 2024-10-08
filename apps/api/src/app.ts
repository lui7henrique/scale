import fastify from "fastify";
import { ordersRoutes } from "./http/controllers/orders/routes";
import { ZodError } from "zod";

export const app = fastify({});

app.register(ordersRoutes);

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

	// if (process. !== "production") {
	// 	console.error(error);
	// } else {
	// 	// TODO: Here we should log to a external tool like DataDog/NewRelic/Sentry
	// }

	return reply.status(500).send({ message: "Internal server error." });
});
