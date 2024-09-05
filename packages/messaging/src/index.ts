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

export async function consumeQueue(
	queue: string,
	onMessage: (msg: amqp.ConsumeMessage | null) => void,
) {
	try {
		const channel = getChannel();
		await channel.assertQueue(queue, { durable: true });
		channel.consume(queue, onMessage, { noAck: true });
	} catch (error) {
		console.error("Failed to consume queue", error);
		throw error;
	}
}

export async function publishToQueue(
	queue: string,
	message: unknown,
): Promise<void> {
	try {
		const channel = getChannel();
		const messageBuffer = Buffer.from(JSON.stringify(message));

		await channel.assertQueue(queue, { durable: true });
		channel.sendToQueue(queue, messageBuffer, { persistent: true });
	} catch (error) {
		console.error("Failed to publish message to queue", error);
		throw error;
	}
}
