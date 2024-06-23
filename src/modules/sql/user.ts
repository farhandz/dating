import { Pool } from 'pg';
import { pgConnection } from '../../database';
import { BasicAuthRes, UserRes } from '../../types';
import { escapeIdentifier } from 'pg';
import { tableName } from '../../helpers/constant';

const db = new Pool(pgConnection);
const table = escapeIdentifier(tableName.USERS);

export const showBuilder = async (id: string): Promise<UserRes> => {
  const queryShow = {
    text: `
          SELECT id, username, email , premium  from ${table}
          WHERE id = $1 LIMIT 1
        `,
    values: [id],
  };

  const rows = (await db.query(queryShow)).rows;
  return rows[0] ?? null;
};

export const basicAuthBUilder = async (
  email: string,
): Promise<BasicAuthRes> => {
  const queryShow = {
    text: `
      SELECT id, email, password from ${table}
      WHERE email = $1 LIMIT 1
    `,
    values: [email],
  };

  const rows = (await db.query(queryShow)).rows;
  return rows[0] ?? null;
};
