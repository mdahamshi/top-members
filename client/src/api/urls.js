const base = '/api/v1';
const api = {
  users: `${base}/users`,
  auth: `${base}/auth`,
  messages: `${base}/messages`,
  usersMessages: (id) => `${base}/users/${id}/messages`,
};

export default api;
