import { query } from '../pool.js';
import { sanitizeUser } from '../../utils/sanitize.js';
const queries = {
  getAll: 'SELECT * FROM users ORDER BY id ASC',
  getById: 'SELECT * FROM users WHERE id = $1',
  getByUsername: 'SELECT * FROM users WHERE username = $1',
  create: 'INSERT INTO users (username,fname, lname, password_hash, role) VALUES ($1, INITCAP($2), INITCAP($3), $4, $5) RETURNING *',
  update: 'UPDATE users SET password_hash = $1, fname = INITCAP($2), lname = INITCAP($3), role = $4, membership_status = $5 WHERE id = $6 RETURNING *',
  delete: 'DELETE FROM users WHERE id = $1',
  searchByUName:
    'SELECT * FROM users WHERE username = $1 LIMIT 1',
  updateMembership: 'UPDATE users SET membership_status = $2 WHERE id = $1 RETURNING *',
};

const user = {
  getAll: async () => (await query(queries.getAll)).rows.map(u => sanitizeUser(u)),
  getById: async (params) => sanitizeUser((await query(queries.getById, params)).rows[0]),
  getByUsername: async (params) => (await query(queries.getByUsername, params)).rows[0],
  searchByUName: async (params = []) => (await query(queries.searchByUName, params)).rows,
  create: async (params) => ((await query(queries.create, params)).rows[0]),
  update: async (params) => sanitizeUser((await query(queries.update, params)).rows[0]),
  updateMembership: async (params) => sanitizeUser((await query(queries.updateMembership, params)).rows[0]),
  delete: async (params) => {
    await query(queries.delete, params);
    return { deleted: params[0] };
  }
};
export default user;
