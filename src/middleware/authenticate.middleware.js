const jwt = require('jsonwebtoken');
const config = require('../../config/config')
const isAuthenticate = (req,res,next) => {
  let token = req.headers.authorization;
  jwt.verify(token,config.secret, { algorithm: "HS256" }, (err, user) => {
    if (err) {
      return res.status(500).json({ status:0,msg:"Unauthorized",data: {} });
    }
    return next();
  });
}

module.exports = {
  isAuthenticate
};
