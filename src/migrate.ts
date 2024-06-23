import { pgConnection } from './database';
import { Pool } from 'pg';
import { sqlQueries } from './migrations/migrate';

const db = new Pool(pgConnection);
async function runMigration() {
  try {
    await db.query(sqlQueries);
    console.log('Migration executed successfully');
  } catch (error: any) {
    console.error('Error executing migration:', error.message);
  }
}

runMigration();
