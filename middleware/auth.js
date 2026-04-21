const adminAuth = (req, res, next) => {
  const role = req.headers["role"];

  if (role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin can only login" });
  }
  next();
};

const clientAuth = (req, res, next) => {
  const clientId = req.headers["client-id"];

  if (!clientId) {
    return res.status(401).json({ message: "client-id header is required" });
  }

  req.clientId = clientId;
  next();
};

module.exports = { adminAuth, clientAuth };