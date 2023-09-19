const express=require('express')
const userRouter= express.Router()
const { userLogin,userVerify, userSignup, deleteAccount, updateUser, resetRequestController, resetPasswordController}= require('../controllers/userController')
const { checkAuth } = require('../middleware/checkAuth')

userRouter.route('/login').post(userLogin)
userRouter.route('/signup').post(userSignup)
userRouter.route('/verify/:token').get(userVerify)
userRouter.route('/delete').delete(checkAuth,deleteAccount)
userRouter.route('/update').patch(checkAuth,updateUser)
userRouter.route('/request-reset').post(resetRequestController)
userRouter.route('/reset-password').patch(resetPasswordController)

module.exports=userRouter