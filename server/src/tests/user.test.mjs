import { jest } from "@jest/globals";

jest.unstable_mockModule("../db/db.js", () => ({
  default: {
    user: {
      getByUsername: jest.fn(),
      create: jest.fn(),
      getAll: jest.fn(),
      getById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    message: {},
  },
}));

jest.unstable_mockModule("../utils/passport.js", () => ({
  generatePasswordHash: jest.fn(() => Promise.resolve("hashedPassword")),
}));

const { default: db } = await import("../db/db.js");
const { default: request } = await import("supertest");
const { app } = await import("../index.js");

const api = "/api/v1/users";

describe("User API", () => {
  const testUser = {
    id: 1,
    username: "testuser",
    fname: "Test",
    lname: "User",
    password_hash: "hashedPassword",
    role: "user",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /users", () => {
    it("should create a new user and login", async () => {
      db.user.getByUsername.mockResolvedValue(null);
      db.user.create.mockResolvedValue(testUser);

      app.use((req, res, next) => {
        req.login = (user, done) => done();
        next();
      });

      const res = await request(app).post(`${api}`).send({
        username: "testuser",
        password: "password123",
        fname: "Test",
        lname: "User",
        role: "user",
      });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("message", "Registration successful");
      expect(res.body.user).toMatchObject({
        username: "testuser",
        fname: "Test",
        lname: "User",
        role: "user",
      });

      expect(db.user.getByUsername).toHaveBeenCalledWith(["testuser"]);
      expect(db.user.create).toHaveBeenCalledWith(["testuser", "Test", "User", "hashedPassword", "user"]);
    });

    it("should reject duplicate username", async () => {
      db.user.getByUsername.mockResolvedValue(testUser);

      const res = await request(app).post(`${api}`).send({
        username: "testuser",
        password: "anyPassword",
      });

      expect(res.statusCode).toBe(409);
      expect(res.body).toHaveProperty("error", "Username already taken");
    });
  });

  describe("GET /users", () => {
    it("should return all users sanitized", async () => {
      const users = [
        { id: 1, username: "user1", password_hash: "hash", fname: "F", lname: "L", role: "user" },
        { id: 2, username: "user2", password_hash: "hash", fname: "F2", lname: "L2", role: "admin" },
      ];
      db.user.getAll.mockResolvedValue(users);

      const res = await request(app).get(`${api}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(2);
      res.body.forEach((user) => {
        expect(user).not.toHaveProperty("password_hash");
      });
    });
  });

  describe("GET /users/:id", () => {
    it("should return user by id sanitized", async () => {
      db.user.getById.mockResolvedValue(testUser);

      const res = await request(app).get(`${api}/1`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject({
        id: 1, username: "testuser", fname: "Test", lname: "User", role: "user",
      });
      expect(res.body).not.toHaveProperty("password_hash");
    });

    it("should return 404 if user not found", async () => {
      db.user.getById.mockResolvedValue(null);

      const res = await request(app).get(`${api}/9999`);

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("error", "User not found");
    });
  });

  describe("PUT /users/:id", () => {
    it("should update user fields except username", async () => {
      db.user.getById.mockResolvedValue(testUser);
      const updatedUser = { ...testUser, fname: "Updated", lname: "Name", role: "admin" };
      db.user.update.mockResolvedValue(updatedUser);

      const res = await request(app).put(`${api}/1`).send({
        fname: "Updated", lname: "Name", role: "admin", username: "newusername",
      });

      expect(res.statusCode).toBe(200);
      expect(db.user.getById).toHaveBeenCalledWith([1]);
      expect(res.body).toMatchObject({ fname: "Updated", lname: "Name", role: "admin" });
      expect(res.body).not.toHaveProperty("password_hash");
    });

    it("should hash password if password provided", async () => {
      db.user.getById.mockResolvedValue(testUser);
      db.user.update.mockResolvedValue(testUser);

      const res = await request(app).put(`${api}/1`).send({ password: "newpass123" });

      expect(res.statusCode).toBe(200);
    });

    it("should return 404 if user not found", async () => {
      db.user.getById.mockResolvedValue(null);

      const res = await request(app).put(`${api}/9999`).send({ fname: "Noone" });

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("error", "User not found");
    });
  });

  describe("DELETE /users/:id", () => {
    it("should delete user and return success message", async () => {
      db.user.delete.mockResolvedValue();

      const res = await request(app).delete(`${api}/1`);

      expect(db.user.delete).toHaveBeenCalledWith([1]);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("message", "User deleted");
    });

    it("should handle errors gracefully", async () => {
      db.user.delete.mockRejectedValue(new Error("Delete failed"));

      const res = await request(app).delete(`${api}/1`);

      expect(res.statusCode).toBe(500);
    });
  });
});
