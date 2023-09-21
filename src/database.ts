import { Client } from 'pg';
import 'dotenv/config';

const client = new Client({
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT),
	database: process.env.DB,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
});

async function connectDatabase(): Promise<void> {
	await client.connect();
	console.log('Database connected.');
}

export { client, connectDatabase };
