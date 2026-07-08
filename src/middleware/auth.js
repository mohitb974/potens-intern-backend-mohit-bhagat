function auth(req, res, next) {
  const apiKey = req.headers["x-api-key"];

  if (apiKey !== "potens-secret-key") {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  next();
}

module.exports = auth;