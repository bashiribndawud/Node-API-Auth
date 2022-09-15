const jwt = require("jsonwebtoken");

// check if user has token
function auth(req, res, next) {
  const token = req.header("auth-token");
  if (!token) return res.status(401).send("Access Denied");
  
//   if the request has a token then verify it
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).send("Invalid token");
  }
}

module.exports =  auth ;
