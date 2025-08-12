// utils/sanitize.js

export function sanitizeUser(user) {

  if (!user) return null;
  return {
    id: user.id,
    username: user.username,
    fname: user.fname,
    lname: user.lname,
    role: user.role,
    created_at: user.created_at,
    membership_status: user.membership_status,
  };
}

export function sanitizeMessage(message) {
  if (!message) return null;

  return {
    id: message.id,
    content: message.content,
    title: message.title,
    pinned: message.pinned,
  };
}
