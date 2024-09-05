import { connectRabbitMQ } from "@scale/messaging";
import { app } from "./app";
import { startPaymentService } from "./services/payment";

app
	.listen({
		host: "0.0.0.0",
		port: 3334,
	})
	.then(async () => {
		try {
			await connectRabbitMQ();
			console.log("🚀 Running at port 3333 and connected to RabbitMQ.");

			await startPaymentService();
			console.log("🚀 Start order processing.");
		} catch (error) {
			console.error("Failed to start the server: ", error);
			process.exit(1);
		}
	});
