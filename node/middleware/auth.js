const jwt = require('jsonwebtoken');
const { config } = require("../config/Config");


const verifyUserToken = async (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: 'Unauthorized request' })
  try {
    token = token.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized request' });
    }
    let verifiedUser = await jwt.verify(token, config.TOKEN_SECRET);
    if (!verifiedUser) return res.status(401).json({ message: 'Unauthorized request' });
    req.user = verifiedUser;
    next();
  } catch (e) {
    return res.status(400).json({ message: 'Unauthorized request' });
  }
}

module.exports = {
  verifyUserToken
}