import type { FastifyInstance } from "fastify";
import { register } from "./register";

export async function ordersRoutes(app: FastifyInstance) {
	app.post("/orders", register);
}
