const Joi = require('joi');
const validation = (req,res,next) => {
    try{
        const data = req.fields;
        var schema = "";

        if(req.url === "/auth/login"){
            schema = Joi.object({
                email: Joi.string().required(),
                password: Joi.string().required(),
            });
        } else if(req.url === "/auth/google-login") {
            schema = Joi.object({
                firstname: Joi.string().required(),
                lastname: Joi.string().required(),
                email: Joi.string().email().required(),
                google_id: Joi.string().required()
            });
        } else if(req.url === "/auth/facebook-login") {
            schema = Joi.object({
                firstname: Joi.string().required(),
                lastname: Joi.string().required(),
                email: Joi.string().email().required(),
                facebook_id: Joi.string().required(),
            });
        } else if(req.url === "/auth/register") {
                    schema = Joi.object({
                        firstname: Joi.string().required(),
                        lastname: Joi.string().required(),
                        email: Joi.string().email().required(),
                        password: Joi.string().required(),
                        otp: Joi.string().required(),
                        profile_pic: Joi.string().required(),
                        login_type: Joi.string()
                    });

        } else if(req.url === "/auth/send_verification_code") {
                    schema = Joi.object({
                        email: Joi.string().email().required()
                    });
        }  else if(req.url === "/auth/forgot-password") {
                    schema = Joi.object({
                        email: Joi.string().email().required()
                    });
                
        } else if(req.url === "/auth/reset-password") {
                    schema = Joi.object({
                       email: Joi.string().email().required(),
                       otp: Joi.number().required(),
                       new_password: Joi.string().min(3).max(20).required(),
                      //  new_password_confirmation: Joi.string().valid(Joi.ref('new_password')).required().options({ language: { any: { allowOnly: 'Must match new password!' } } })
                        new_password_confirmation:Joi.string().required().valid(Joi.ref('new_password')),
                       new_password_confirmation: Joi.string().valid(Joi.ref('new_password')).required()
                    });
        }  else if(req.url === "/update-profile") {
            schema = Joi.object({
                profile_pic: Joi.string().required(),
                email: Joi.string().required()
            });
        }


        var result = schema.validate(data).error
        if(result){
            return res.status(400).json({
                flag: 0,
                msg: result.details[0].message,
                data: ""
            })
        } else {
            return next();
        }
    } catch (e) {
        return res.status(400).json({
            flag: 0,
            msg: e.message,
            data: ""
        })
    }
}
module.exports = {
    validation
};
