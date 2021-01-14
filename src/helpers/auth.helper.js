const jwt = require('jsonwebtoken');
const config = require('../../config/config')

const getUserInfo = async (params) => {
    return new Promise(resolve => {
        let token = params.access_token;
        jwt.verify(token,config.secret, { algorithm: "HS256" }, (err, user) => {
            return resolve(user)
        });
    });
}

module.exports = {
  getUserInfo
};
