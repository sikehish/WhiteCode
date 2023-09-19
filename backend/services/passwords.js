const User = require("../models/userModel");
const Token = require("../models/tokenModel");
const { sendMail } = require("../utils/mailFunc");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const validator=require("validator");

exports.requestReset = async (email) => {

  const user = await User.findOne({ email });

  if (!user) throw new Error("User does not exist");

  const token = await Token.findOneAndDelete({ uid: user.id });
  
  // let token = await Token.findOne({ uid: user.id });
  // if (token) await token.deleteOne();

  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = await bcrypt.hash(resetToken, 10);

  const newToken = await Token.create({
    uid: user.id,
    token: hashedToken
  })

  const url = `${process.env.CLIENT_URL}/passwordReset?uid=${user.id}&token=${resetToken}`

  subject="Password Reset Request"

  html=`
        <h1>Password Reset</h1>
        <p>Hello ${user.email}</p>
        <p>Click on the link below to reset your password</p>
        <a href=${url}>Password Reset</a>`

  sendMail(user.email,subject,html)

  return {
    uid: user.id, token: resetToken
  }
};

exports.passwordReset = async (uid, token, password, confirmPassword) => {

  //Double security implemented; employing both uid and reset token
  const hashedTokenDoc = await Token.findOne({ uid });

  if (!hashedTokenDoc) {
    throw new Error("The user doesn't exist!");
  }

  const exists = await bcrypt.compare(token, hashedTokenDoc.token);

  if (!exists) {
    throw new Error('The reset password token is invalid')
  }

  password=password.trim()
  confirmPassword=confirmPassword.trim()
  if(!password || !confirmPassword) throw new Error("Passwords cannot be empty");
  if (password !== confirmPassword) throw Error("Passwords not matching")
  if(!validator.isStrongPassword(password)) throw new Error('Password not strong enough!')

  const hashedPassword = await bcrypt.hash(password, 10);

  const newDoc = await User.findByIdAndUpdate(uid ,{ password:hashedPassword },{
    new: true,
    runValidators: true
  } )

  const user = await User.findById(uid);

  const url = `${process.env.CLIENT_URL}/login`

  subject="Password Reset Successful"

  html=`
        <h1>Your password was reset successfully!</h1>
        <p>Hello ${user.email}</p>
        <p>Your password reset was succesful</p>
        <p>Click on the link below to login</p>
        <a href=${url}>Login</a>`

  sendMail(user.email,subject,html)

  await hashedTokenDoc.deleteOne();

  return newDoc
};