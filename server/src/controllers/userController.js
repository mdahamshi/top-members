import db from '../db/db.js';
import { generatePasswordHash } from '../utils/passport.js';
import { sanitizeUser } from '../utils/sanitize.js';
export const getAllUsers = async (req, res, next) => {
  try {
    const items = await db.user.getAll();
    res.json(items);
  } catch (error) {
    next(error);
  }
};
export const searchUName = async (req, res, next) => {
  try {
    const search = req.query.search?.trim();
    let items;
    items = await db.user.searchByUName([`${search}`]);
    if(! items || ! items.length) {
      return res.json({available: true, message: `'${search}' is available.`});
    }
    else {
      return res.status(409).json({available: false, error: `'${search}' is already taken.` });

    }
  } catch (error) {
    next(error);
  }
};
export const getUserById = async (req, res, next) => {
  const id = parseInt(req.params.id);
  try {
    const item = await db.user.getById([id]);
    if (!item) return res.status(404).json({error: 'User not found' });
    res.json(item);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  const { username, password, fname, lname, role } = req.body;

  try {

    const existing = await db.user.getByUsername([username]);
    if (existing) {
      return res.status(409).json({ error: "Username already taken" });
    }

    const password_hash = await generatePasswordHash(password);
    const newUser = await db.user.create([username, fname, lname, password_hash, role || "user"]);

    return req.login(newUser, (err) => {
      if (err) return next(err);
      res.status(201).json({ message: "Registration successful", user: sanitizeUser(newUser) });
    });

  } catch (err) {
    next(err);
  }
};
export const updateUser = async (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  const { username } = req.body;
  try {
    const currentUser = await db.user.getByUsername([username]);
    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    if ('username' in req.body) delete req.body.username;

    const newUser = { ...currentUser, ...req.body };

    if (req.body.password) {
      newUser.password_hash = await generatePasswordHash(req.body.password);
    } else {
      newUser.password_hash = currentUser.password_hash;
    }

    const updated = await db.user.update([
      newUser.password_hash,
      newUser.fname,
      newUser.lname,
      newUser.role,
      newUser.membership_status,
      id,
    ]);

    res.json(sanitizeUser(updated));
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  const id = parseInt(req.params.id);
  try {
    await db.user.delete([id]);
    res.json({ message: 'User deleted' });
  } catch (error) {
    next(error);
  }
};
