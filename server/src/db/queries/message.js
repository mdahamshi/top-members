import { query } from "../pool.js";

const queries = {
  create:
    "INSERT INTO messages (content, title, user_id) VALUES ($1, $2, $3) RETURNING *",
  update:
    "UPDATE messages SET content = $1, title = $2, user_id = $3 WHERE id = $4 RETURNING *",
  delete: "DELETE FROM messages WHERE id = $1",
  getAllPublic:
    "SELECT id, title,pinned, content FROM messages ORDER BY pinned DESC, created_at DESC;",
  getAllAuth: `
  SELECT 
      m.id,
      m.title,
      m.content,
      m.pinned,
      m.created_at,
      jsonb_build_object(
        'id', u.id,
        'username', u.username,
        'fname', u.fname,
        'lname', u.lname
      ) AS user
    FROM messages AS m
    LEFT JOIN users AS u
      ON m.user_id = u.id
    ORDER BY pinned DESC, created_at DESC;`,
  getByIdPublic: "SELECT id, title, content FROM messages WHERE id = $1",
  getByIdAuth:
    "SELECT id, title, content, user_id, created_at FROM messages WHERE id = $1",
  getMessagesByUser: `
    SELECT 
      m.id,
      m.content,
      m.pinned,
      m.created_at,
      json_build_object(
        'id', u.id,
        'username', u.username,
        'fname', u.fname,
        'lname', u.lname
      ) AS user
    FROM messages m
    JOIN users u ON m.user_id = u.id
    WHERE m.user_id = $1
    ORDER BY pinned DESC, created_at DESC;
  `,
};

const message = {
  getAll: async (isAuth) => {
    const res = await query(isAuth ? queries.getAllAuth : queries.getAllPublic);
    return res.rows;
  },
  getById: async (params = [], isAuth) => {
    const res = await query(
      isAuth ? queries.getByIdAuth : queries.getByIdPublic,
      params,
    );
    return res.rows[0];
  },
  create: async (params = []) => {
    const res = await query(queries.create, params);
    return res.rows[0];
  },
  update: async (params = []) => {
    const res = await query(queries.update, params);
    return res.rows[0];
  },
  delete: async (params = []) => {
    await query(queries.delete, params);
    return { deleted: params[0] };
  },
  getMessagesByUser: async (params = []) => {
    const res = await query(queries.getMessagesByUser, params);
    return res.rows;
  },
};

export default message;
