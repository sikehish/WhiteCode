const express=require('express')
const userRouter= express.Router()
const { userLogin,userVerify, userSignup, deleteAccount, updateUser, resetRequestController, resetPasswordController, getPeerId}= require('../controllers/userController')
const { checkAuth } = require('../middleware/checkAuth')

userRouter.route('/login').post(userLogin)
userRouter.route('/signup').post(userSignup)
userRouter.route('/verify/:token').get(userVerify)
userRouter.route('/delete').delete(checkAuth,deleteAccount)
userRouter.route('/update').patch(checkAuth,updateUser)
userRouter.route('/request-reset').post(resetRequestController)
userRouter.route('/reset-password').patch(resetPasswordController)
// Fetch the PeerJS ID of a user by username
userRouter.route('/peerid/:email').get(checkAuth,getPeerId)

  

module.exports=userRouter