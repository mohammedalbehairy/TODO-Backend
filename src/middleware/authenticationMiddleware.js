const jwt = require('jsonwebtoken');
const {
  UserModel
} = require('../user/users_model')

module.exports = async function (req, res, next) {
  let token = req.header('Authorization');
 
  if (!token || !token.startsWith('bearer ')) {
    return res.status(401).send({
      message: 'Access denied. No token provided.'
    });
  }
  // Remove Bearer from string
  token = token.slice(7, token.length);
  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    const user = await UserModel.findById(decoded._id)
    if (!user) return res.status(401).send({
      message: 'Invalid token.'
    });
    
    
    req.user = user;
    next();
  } catch (ex) {
    res.status(401).send({
      message: 'Invalid token.'
    });
  }
}