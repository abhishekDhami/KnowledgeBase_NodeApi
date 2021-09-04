const crypto = require('crypto');
const jsonwebtoken = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const SEC_KEY = fs.readFileSync(path.join(__dirname, '..', 'key.txt'));


//Compare user provided password with encryped password in database
function validPassword(password, hash, salt) {
    let hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash === hashVerify;
}

//Creating hash and salt from password, which will be stored in database insted of plain password
function generatePassword(password) {
    let salt = crypto.randomBytes(32).toString('hex');
    let genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    
    return {
      salt: salt,
      hash: genHash
    };
}


//Generating JWT token, User-id and Username are included in payload 
function issueJWT(user) {
  let expiresIn = '12d';

  const payload = {
    uid: user._id,
    uname: user.username
  };

  //creating token with Sec_Key
  const signedToken = jsonwebtoken.sign(payload, SEC_KEY, { expiresIn: expiresIn});

  return {
    token: "Bearer " + signedToken,
  }
}



module.exports={
    validPassword,
    generatePassword,
    issueJWT
}
