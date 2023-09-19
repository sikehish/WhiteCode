const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User= require('../models/userModel');
const validator=require('validator');
const asyncWrapper=require('express-async-handler')

const  path = require('path');
const { sendMail } = require('../utils/mailFunc');
const { requestReset, passwordReset } = require('../services/passwords');



// Set up routes
exports.userSignup=asyncWrapper(async (req, res) => {
  // try {
    let { name, email, password, confirmPassword } = req.body;

    name=name.trim()
    email=email.trim()
    password=password.trim()
    confirmPassword=confirmPassword.trim()


    if (!email || !password || !confirmPassword || !name) {
      res.status(400)
      throw Error("All fields must be filled");
    }
    else if (password !== confirmPassword){
      res.status(400)
      throw Error("Passwords not matching")
    }

    // Check if the user already exists
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      res.status(400)
      throw new Error('User already exists');
    }

    if(!validator.isStrongPassword(password)) {
      res.status(400)
      throw new Error('Password not strong enough!')
    }
    
    if(!validator.isEmail(email)) {
      res.status(400)
      throw new Error("Entered email address not valid!")
    }
    
    //Sending an email to the user
    
    const user = await User.create({ email, password, name });
    
    const token = user.createToken();
    
    const url = `http://localhost:3000/api/users/verify/${token}`
    

      subject = 'Account Verification'
      html=`
        <h1>Account Verification</h1>
        <p>Thank you for signing up. Please click the following link to verify your account:</p>
        <a href=${url}>Verify Email</a>`

    sendMail(email,subject, html)

    
    res.status(201).json({ status: 'success', data: { name, email} });


  // } catch (error) {
  //   console.error('Error in signup', error);
  //   res.status(400).json({status:"fail", message: error.message });
  // }
})

exports.userLogin =asyncWrapper( async (req, res) => {
  // try {
    let { email, password } = req.body;
    email=email.trim()
    password=password.trim()
    if (!email || !password) {
      res.status(400)
      throw Error("Email and password must be filled");
    }
        else if (!validator.isEmail(email)) {
          res.status(400)
          throw Error("Email format invalid");
        }
        
        
        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
          res.status(404)
          throw new Error("User doesn't exist")
        }
        
        // Compare passwords
        const exists = await bcrypt.compare(password, user.password);
        if (!exists) {
          res.status(401)
          throw new Error("Incorrect password")
        }

        if(!user.verified) {
          res.status(401)
          throw new Error("User is not verified")
        }

    // Create a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, { expiresIn: '5d'});

    res.status(200).json({status:"success", data:{ email , name:user.name, token }});
  // } catch (error) {
  //   console.error('Error in login', error);
  //   res.status(400).json({status:"fail", message: error.message });
  // }
})


exports.userVerify=asyncWrapper(async (req,res)=>{
  const {token} = req.params;
  // try{
    const { id }= jwt.verify(token,process.env.JWT_KEY)
  console.log(token, id)
  const newDoc = await User.findByIdAndUpdate(id,{ verified: true},{
    new: true
  } )
  if (!newDoc) {
    res.status(404)
    throw new Error("User doesn't exist")
  }
  console.log(newDoc)
  // res.status(200).json({status:"success", message:"Verified successfully!"})
  res.sendFile(path.join(__dirname,'..','static','html','verified.html'));
// }catch(err){
//   console.log(err)
//   res.sendFile(path.join(__dirname,'..','static','html','verifiederr.html'));
//   }
  
})


exports.deleteAccount = asyncWrapper(async (req, res) => {
  // try {
    const id = req.user;

    // Find the user by email
    const user = await User.findByIdAndDelete(id);

    if (!user) {
       res.status(404)
       throw new Error("User doesn't exist")
    }

    const url = `${process.env.CLIENT_URL}/signup`

    subject = 'Account Deleted'
      html=`
        <h1>Account Deleted</h1>
        <p>Your account was succesfully deleted</p>
        <a href=${url}>Sign up to create an account!</a>`

    sendMail(user.email,subject, html)

    res.status(204).json({ status:"success",message: 'User account deleted successfully.' });
  // } catch (error) {
  //   console.error(error);
  //   res.status(500).json({ status:"fail",message: 'An error occurred while deleting the user account.' });
  // }
})

exports.updateUser= asyncWrapper(async (req,res)=>{
  // try{

  const id = req.user;
  let { name,password,confirmPassword } = req.body;
  console.log(name,password,confirmPassword)
  //Changing passwords
  if( password!==undefined && confirmPassword!==undefined){
    password=password.trim()
    confirmPassword=confirmPassword.trim()
    if(!password || !confirmPassword) {
      res.status(400)
      throw new Error("Passwords cannot be empty");
    }
    if (password !== confirmPassword) {
      res.status(400)
      throw Error("Passwords not matching")
    }
    if(!validator.isStrongPassword(password)){
      res.status(400)
      throw new Error("Password not strong enough!")
    }
    
    const newDoc = await User.findByIdAndUpdate(id,{ password },{
      new: true,
      runValidators: true
    } )
  }  

  //Updating name
  if(name==undefined){
    res.status(404)  
    throw new Error("No name to update")
  }
  
  name=name.trim()

  if(!name) {
    res.status(404)  
    throw new Error("Please enter a valid name!")
  }


  const newDoc = await User.findByIdAndUpdate(id,{ name },{
    new: true,
    runValidators: true
  } )
  if (!newDoc) {
    res.status(404)
    throw new Error("User doesn't exist")
  }
  console.log(newDoc)
  res.status(200).json({status:"success", data: newDoc})
// }catch(err){
//   console.log(err)
//   res.status(400).json({status:"fail", message: err.message });
//   }
})


exports.resetRequestController=asyncWrapper(async (req,res)=>{
  // try{
    let { email } = req.body

    email=email.trim()

    if(!email || !validator.isEmail(email)) {
      res.status(400)
      throw new Error("Please enter a valid email")
    }
    
    const data = await requestReset(email)

    res.status(200).json({status:"success", data})

  // }catch(err){
  //   console.log(err)
  //   res.status(400).json({status:"fail", message: err.message});
  // }

})

exports.resetPasswordController=asyncWrapper(async (req,res)=>{

  // try{

    let { password, confirmPassword, uid, token } = req.body
    
    const newDoc=await passwordReset(uid, token, password, confirmPassword)

    res.status(200).json({status:"success", data: newDoc})

  // }catch(err){
  //   console.log(err)
  //   res.status(400).json({status:"fail", message: err.message});
  // }

})
