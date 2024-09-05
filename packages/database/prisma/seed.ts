import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
	const products = Array.from({ length: 100 }).map(() => ({
		name: faker.commerce.productName(),
		price: Number(faker.commerce.price()),
		quantity: faker.number.int({ min: 1, max: 10 }),
	}));

	await prisma.product.createMany({
		data: products,
	});

	console.log("Seed completed: 100 products created");
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
	});
