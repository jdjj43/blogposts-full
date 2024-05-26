const crypto = require('crypto');
const jwt = require('jsonwebtoken');


function genPassword(password) {
  var salt = crypto.randomBytes(32).toString('hex');
  var genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

  return {
    salt: salt,
    hash: genHash
  }
}
function validPassword(password, hash, salt) {
  var hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return hash === hashVerify;
}
function issueJWT(user) {
  const _id = user._id;

  const expiresIn = '1d';

  const payload = {
    sub: _id,
    iat: Date.now()
  }

  const accessToken = jwt.sign(payload, 'kuramanoestamuerto', { expiresIn: '1d' });

  return {
    accessToken,
    expires: expiresIn,
  }
}

module.exports.validPassword = validPassword;
module.exports.genPassword = genPassword;
module.exports.issueJWT = issueJWT;