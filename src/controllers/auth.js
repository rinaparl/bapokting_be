const response = require('../helpers/standardResponse');
const authModel = require('../models/auth');
const errResponse = require('../helpers/errResponse');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {APP_SECRET} = process.env;

exports.register = (req, res)=>{
  authModel.register(req.body, (err, result) => {
    if(err){
      return errResponse(err, res);
    }
    return response(res, 'Register succesfully', result);
  });
};

// aa
exports.login = (req, res)=>{
  console.log('Request Body:', req.body);
  const {email, password} = req.body;
  
  authModel.getUserByEmail(email, (err, results) => {
    if (err) {
      console.error('Database Error:', err);
      return response(res, 'Internal Server Error', null, null, 500);
    }
    
    if(results.rows.length < 1){
      console.log('User Not Found:', email);
      return response(res, 'User Not Found', null, null, 400);
    }
    const user = results.rows[0];
    const id = user.id;
    // const pin = user.pin;
    bcrypt.compare(password, user.password)
      .then((cpRes)=>{
        if(cpRes){
          console.log();
          const token = jwt.sign({id: user.id}, APP_SECRET || 'D3f4uLt');
          return response(res, 'Login Success', {id: user.id, token});
        }
        console.log('Invalid Password:', email);
        return response(res, 'Check your email and pasword', null, null, 400);

      })
      // eslint-disable-next-line no-unused-vars
      .catch(err => {
        return response(res, 'Check your email and pasword', null, null, 400);
      });
  });
};

