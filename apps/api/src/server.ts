import { fastify } from "fastify";
import mongo from "@fastify/mongodb";

const app = fastify({
	logger: true,
});

app.register(mongo, {
	forceClose: true,
	url: "mongodb://root:example@localhost:27017",
	database: "library",
});

app.get("/", async (req, reply) => {
	reply.send({ hello: "world" });
});

app.listen({ port: 3000 }, (err) => {
	if (err) {
		app.log.error(err);
		process.exit(1);
	}
});
