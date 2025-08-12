

export const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Authentication required' });
}
export const ensureMember = (req, res, next) => {
  if (req.user && req.user.membership_status) {
    return next();
  }
  res.status(401).json({ error: 'Membership required' });
}

export const ensureAdmin = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated() && req.user.role === 'admin') {
    return next();
  }
  res.status(403).json({ error: 'Admin access required' });
}

export const ensureSelfOrAdmin = (req, res, next) => {
  if (
    req.isAuthenticated &&
    req.isAuthenticated() &&
    (req.user.role === 'admin' || req.user.id === Number(req.params.id))
  ) {
    return next();
  }
  res.status(403).json({ error: 'Access denied' });
}