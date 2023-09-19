const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { isEmail, isStrongPassword } = require('validator');

// Define the User schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: [3, 'Your name cannot be less than 3 characters'],
    maxlength: [20,'Your name cannot exceed 20 characters']
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: [isEmail,'Entered email address not valid!']
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'Password must be at least 8 characters'],
    validate: [isStrongPassword, 'Password not strong enough']
  },
  verified: {
    type: Boolean,
    required: true,
    default: false
}
},{
  timestamps: true
});

//Using pre middleware function to utilise the data validation used in the schema https://mongoosejs.com/docs/validation.html
userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) { 
    //salt with 10 rounds will be generated and then the password will be hashed
      user.password=await bcrypt.hash(user.password, 10)
}
  next()
}
)

userSchema.methods.createToken = function () {
  return jwt.sign({ id: this.id }, process.env.JWT_KEY, { expiresIn: "2d" });    
};

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;