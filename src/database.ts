import pg from 'pg';
const { Client } = pg;
export const pgConnection = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
} as const;

// Connect with a client.

const checkconnection = async () => {
  try {
    const client = new Client(pgConnection);
    await client.connect();
    console.log('Connected to PostgreSQL database!');
    await client.end();
  } catch (error) {
    console.log('Error connecting to the database:', error);
  }
};

export default {
  checkconnection,
};
