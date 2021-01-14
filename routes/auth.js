const  express = require('express');
const  router = express.Router();
const  authController = require('../src/controllers/auth.controller')
const  authValidate = require('./validation/index')
const rateLimit = require("express-rate-limit");
const  authMiddleware  = require('./../src/middleware/authenticate.middleware')

const createAccountLimiter = rateLimit({
    windowMs: 2 * 60 * 1000, // 1 hour window
    max: 1, // start blocking after 5 requests
    msg:{status:false,msg:"Too many requests from this IP, please try again after an 1 minute"}
});


//auth routes
router.post('/auth/login',authValidate.validation, authController.login);
router.post('/auth/google-login',authValidate.validation, authController.googleLogin);
router.post('/auth/facebook-login',authValidate.validation, authController.facebookLogin);
router.post('/auth/register',authValidate.validation, authController.register);
router.post('/auth/send_verification_code',createAccountLimiter,authValidate.validation,   authController.sendVerificationCode);




router.post('/auth/forgot-password',authValidate.validation, authController.forgotPassword);
router.post('/auth/reset-password',authValidate.validation, authController.resetPassword);


router.post('/update-profile',authValidate.validation, authMiddleware.isAuthenticate, authController.updateProfile);




module.exports = router;

