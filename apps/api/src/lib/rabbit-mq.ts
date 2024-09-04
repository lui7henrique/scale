import amqp from "amqplib";

let channel: amqp.Channel;

export async function connectRabbitMQ() {
	try {
		const connection = await amqp.connect(
			process.env.RABBITMQ_URL || "amqp://localhost:5672",
		);

		channel = await connection.createChannel();
		console.log("Connected to RabbitMQ");
	} catch (error) {
		console.error("Failed to connect to RabbitMQ", error);
		throw error;
	}
}

export function getChannel() {
	if (!channel) {
		throw new Error(
			"RabbitMQ channel is not initialized. Please connect to RabbitMQ first.",
		);
	}

	return channel;
}
