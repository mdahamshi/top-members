import usersRoutes from './users.js';
import messagesRoutes from './messages.js';
import authRoutes from './auth.js';

function registerRoutes(app, apiV) {
  app.use(`/api/${apiV}/users`, usersRoutes);
  app.use(`/api/${apiV}/messages`, messagesRoutes);
  app.use(`/api/${apiV}/auth`, authRoutes);

}

export default registerRoutes;
