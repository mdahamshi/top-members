import db from "../db/db.js";
import { sanitizeMessage } from "../utils/sanitize.js";
export const getAllMessages = async (req, res, next) => {
  try {
    const fullMessage =
      req.user?.role === "admin" ||
      (req.user?.membership_status && req.isAuthenticated());
    const items = await db.message.getAll(fullMessage);
    res.json(items.map((msg) => sanitizeMessage(msg, req.user)));
  } catch (error) {
    next(error);
  }
};

export const getMessageById = async (req, res, next) => {
  const id = parseInt(req.params.id);
  try {
    const fullMessage =
      req.user?.role === "admin" ||
      (req.user?.membership_status && req.isAuthenticated());
    const item = await db.message.getById([id], fullMessage);
    if (!item) return res.status(404).json({ error: "Message not found" });
    res.json(sanitizeMessage(item, req.user));
  } catch (error) {
    next(error);
  }
};
export const createMessage = async (req, res, next) => {
  try {
    const { content, title, pinned } = req.body;
    if (req.user?.role !== "admin") pinned = false;
    const user_id = req.user.id;
    const newItem = await db.message.create([
      title,
      content,
      user_id,
      pinned || false,
    ]);
    res.status(201).json(sanitizeMessage(newItem, req.user));
  } catch (error) {
    next(error);
  }
};

export const updateMessage = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { content, title, pinned: pinnedClient } = req.body;
    let pinned = pinnedClient;
    if (req.user?.role !== "admin") pinned = false;
    const user_id = req.body.user.id;
    const updatedItem = await db.message.update([
      content,
      title,
      user_id,
      pinned,
      id,
    ]);
    res.json({ ...req.body, ...updatedItem });
  } catch (error) {
    next(error);
  }
};

export const deleteMessage = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const message = await db.message.delete([id]);
    res.json({ message: message });
  } catch (error) {
    next(error);
  }
};

export const getMessagesByUser = async (req, res, next) => {
  try {
    const fullMessage =
      req.user?.role === "admin" ||
      (req.user?.membership_status && req.isAuthenticated());

    const id = parseInt(req.params.id);
    const items = await db.message.getMessagesByUser([id]);

    res.json(items.map((msg) => sanitizeMessage(msg, req.user)));
  } catch (error) {
    next(error);
  }
};
