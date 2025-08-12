import request from 'supertest';
import {app} from '../index.js';          // your Express app
import db from '../db/db.js';         // DB module to mock
import { generatePasswordHash } from '../utils/passport.js';

// Mock DB module functions used by controller
jest.mock('../db/db.js');

// Mock password hashing for speed
jest.mock('../utils/passport.js', () => ({
  generatePasswordHash: jest.fn(() => Promise.resolve('hashedPassword')),
}));

const api = '/api/v1/users'; 


describe('User API', () => {
  const testUser = {
    id: 1,
    username: 'testuser',
    fname: 'Test',
    lname: 'User',
    password_hash: 'hashedPassword',
    role: 'user',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Helper to mock req.login in POST /users
  function mockLoginMiddleware(req, res, next) {
    req.login = (user, cb) => cb(); // call cb with no error
    next();
  }

  // Wrap the /users POST route with login mock middleware for testing
  beforeAll(() => {
    // If you control route registration, insert mockLoginMiddleware before your user routes
    // Example:
    // app.use('/users', mockLoginMiddleware, userRoutes);

    // Or you can patch app.post('/users', ...) dynamically for tests if needed
  });

  describe('POST /users', () => {
    it('should create a new user and login', async () => {
      // DB: no existing user with username
      db.user.getByUsername.mockResolvedValue(null);

      // DB: create returns the new user object
      db.user.create.mockResolvedValue(testUser);

      // Insert mock login on request, patch app routes for test
      // Or patch request agent to add login

      const agent = request.agent(app);

      // Patch req.login to avoid error: done inside Express normally
      app.use((req, res, next) => {
        req.login = (user, done) => done();
        next();
      });

      const res = await request(app).post(`${api}`).send({
        username: 'testuser',
        password: 'password123',
        fname: 'Test',
        lname: 'User',
        role: 'user',
      });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('message', 'Registration successful');
      expect(res.body.user).toMatchObject({
        username: 'testuser',
        fname: 'Test',
        lname: 'User',
        role: 'user',
      });

      expect(db.user.getByUsername).toHaveBeenCalledWith(['testuser']);
      expect(generatePasswordHash).toHaveBeenCalledWith('password123');
      expect(db.user.create).toHaveBeenCalledWith([
        'testuser',
        'Test',
        'User',
        'hashedPassword',
        'user',
      ]);
    });

    it('should reject duplicate username', async () => {
      db.user.getByUsername.mockResolvedValue(testUser);

      const res = await request(app).post(`${api}`).send({
        username: 'testuser',
        password: 'anyPassword',
      });

      expect(res.statusCode).toBe(409);
      expect(res.body).toHaveProperty('error', 'Username already taken');
    });
  });

  describe('GET /users', () => {
    it('should return all users sanitized', async () => {
      const users = [
        {
          id: 1,
          username: 'user1',
          password_hash: 'hash',
          fname: 'F',
          lname: 'L',
          role: 'user',
        },
        {
          id: 2,
          username: 'user2',
          password_hash: 'hash',
          fname: 'F2',
          lname: 'L2',
          role: 'admin',
        },
      ];
      db.user.getAll.mockResolvedValue(users);

      const res = await request(app).get(`${api}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(2);
      // Make sure password_hash is removed by sanitizeUser (you can mock sanitizeUser or test shape)
      res.body.forEach((user) => {
        expect(user).not.toHaveProperty('password_hash');
      });
    });
  });

  describe('GET /users/:id', () => {
    it('should return user by id sanitized', async () => {
      db.user.getById.mockResolvedValue(testUser);

      const res = await request(app).get(`${api}/1`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject({
        id: 1,
        username: 'testuser',
        fname: 'Test',
        lname: 'User',
        role: 'user',
      });
      expect(res.body).not.toHaveProperty('password_hash');
    });

    it('should return 404 if user not found', async () => {
      db.user.getById.mockResolvedValue(null);

      const res = await request(app).get(`${api}/9999`);

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error', 'User not found');
    });
  });

  describe('PUT /users/:id', () => {
    it('should update user fields except username', async () => {
      db.user.getById.mockResolvedValue(testUser);

      const updatedUser = {
        ...testUser,
        fname: 'Updated',
        lname: 'Name',
        role: 'admin',
        password_hash: 'hashedPassword',
      };

      db.user.update.mockResolvedValue(updatedUser);

      const res = await request(app)
        .put(`${api}/1`)
        .send({ fname: 'Updated', lname: 'Name', role: 'admin', username: 'newusername' });

      expect(res.statusCode).toBe(200);
      expect(db.user.getById).toHaveBeenCalledWith([1]);
      expect(db.user.update).toHaveBeenCalledWith([
        'hashedPassword',
        'Updated',
        'Name',
        'admin',
        1,
      ]);
      expect(res.body).toMatchObject({
        fname: 'Updated',
        lname: 'Name',
        role: 'admin',
      });
      expect(res.body).not.toHaveProperty('password_hash');
    });

    it('should hash password if password provided', async () => {
      db.user.getById.mockResolvedValue(testUser);
      db.user.update.mockResolvedValue(testUser);

      const res = await request(app)
        .put(`${api}/1`)
        .send({ password: 'newpass123' });

      expect(generatePasswordHash).toHaveBeenCalledWith('newpass123');
      expect(db.user.update).toHaveBeenCalled();

      expect(res.statusCode).toBe(200);
    });

    it('should return 404 if user not found', async () => {
      db.user.getById.mockResolvedValue(null);

      const res = await request(app)
        .put(`${api}/9999`)
        .send({ fname: 'Noone' });

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error', 'User not found');
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete user and return success message', async () => {
      db.user.delete.mockResolvedValue();

      const res = await request(app).delete(`${api}/1`);

      expect(db.user.delete).toHaveBeenCalledWith([1]);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'User deleted');
    });

    it('should handle errors gracefully', async () => {
      db.user.delete.mockRejectedValue(new Error('Delete failed'));

      const res = await request(app).delete(`${api}/1`);

      expect(res.statusCode).toBe(500);
      // If your error handler returns json with error, adjust this test accordingly
    });
  });
});
