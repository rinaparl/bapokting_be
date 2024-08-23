const jwt = require('jsonwebtoken');
const response = require('../helpers/standardResponse');
//const {APP_SECRET} = process.env;

const auth = (req, res, next) => {
  if (req.headers.authorization) {
    const auth = req.headers.authorization;
    const prefix = 'Bearer';
    if (auth.startsWith(prefix)) {
      const token = auth.slice(prefix.length + 1, auth.length);
      if (!token || token === '{{token}}') {
        console.error('Token is missing or still a placeholder');
        return response(res, 'Invalid Token', null, null, 401);
      }
      // console.log('Extracted token:', token); // Log token yang diterima
      try {
        const results = jwt.verify(token, process.env.APP_SECRET || 'D3f4uLt');
        req.authUser = results;
        next();
      } catch (e) {
        console.error('Token verification failed:', e.message);
        return response(res, 'Token Expired or Invalid', null, null, 401);
      }
    } else {
      return response(res, 'Invalid authorization format', null, null, 401);
    }
  } else {
    return response(res, 'Authorization header missing', null, null, 401);
  }
};


module.exports = auth;