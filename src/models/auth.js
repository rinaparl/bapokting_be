const db = require('../helpers/db.js');

exports.register = (data, cb)=>{
  const quer = 'INSERT INTO users(username, email, password) VALUES ($1, $2, $3) RETURNING *';
  const value = [data.username, data.email, data.password];
  db.query(quer, value, (err, res)=>{
    if (res) {
      cb(err, res.rows);
    }else{
      cb(err);
    }
  });
};

exports.getUserByEmail = (email, cb) => {
  const quer = 'SELECT * FROM users WHERE email=$1';
  const value = [email];
  db.query(quer, value, (err, res)=>{
    cb(err, res);
  });
};

