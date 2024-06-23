import { pgConnection } from '../../database';
import { Pool } from 'pg';
import { escapeIdentifier } from 'pg';
import { tableName } from '../../helpers/constant';
import * as bcrypt from 'bcryptjs';
import { AuthRegister } from '../../types/auth';

const table = escapeIdentifier(tableName.USERS);
const db = new Pool(pgConnection);

export const RegisterBuilder = async (body: AuthRegister): Promise<void> => {
  const saltOrRounds = 10;
  const password = bcrypt.hashSync(body.password, saltOrRounds);

  const queryRegister = {
    text: `INSERT INTO ${table} (username, email, password) VALUES ($1, $2, $3)`,
    values: [body.username, body.email, password],
  };

  await db.query(queryRegister);
};

export const ShowBuilder = async (email: string): Promise<any> => {
  const queryShow = {
    text: `SELECT * FROM ${table} WHERE email = $1`,
    values: [email],
  };

  return (await db.query(queryShow)).rows[0];
};
