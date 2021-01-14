const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const db = require("../models");
const users = db.users;
const Op = db.Sequelize.Op;
const users_verification = db.user_verification;
const helper = require('../helpers/auth.helper');
const md5 = require('md5');
var dateFormat = require('dateformat');
const nodemailer = require("nodemailer");
const uploadImageService = require('../services/fileupload');


let transporter = nodemailer.createTransport({
    host: config.smtp_host,
    port: config.smtp_port,
    secure: config.smtp_secure,
    auth: {
        user: config.smtp_user,
        pass: config.smtp_pass,
    }
});





const login = async (params) => {
  return new Promise(resolve => {
      users.findOne({
          where: {
             email: params.email
          }
      })
          .then(user => {
              if (user) {
                  let data = user.dataValues;
                  if (data.status) {
                      if (data.is_verified) {
                          users.findOne({
                              where: {
                                  email: params.email,   
                                  password: md5(params.password),
                                  is_verified: true,
                                  status: true,
                                  roles: 'user'
                              }
                          }).then(result => {
                              delete result.dataValues.password;
                              let token = jwt.sign(user.dataValues, config.secret, {algorithm: 'HS256'});
                              return resolve({
                                  status: true,
                                  msg: "Login successfully",
                                  data: result.dataValues,
                                  access_token: token
                              });
                          }).catch(err => {
                              return resolve({status: false, msg: "Invalid email and/or password", data: {}});
                          });
                      } else {
                          return resolve({status: false, msg: "Please verify your account!", data: {}});
                      }
                  } else {
                      return resolve({
                          status: false,
                          msg: "Your account has been blocked by admin, please contact to support team!",
                          data: {}
                      });
                  }
              } else {
                  return resolve({status: false, msg: "Invalid email and/or password", data: {} });
              }
          });
  });
}


const googleLogin = async (params) => {
    return new Promise(resolve => {
        users.findOne({
            where: {email: params.email, google_id: params.google_id,roles:'user'}
        })
            .then(user => {
                if (user) {
                    if(user.dataValues.status){
                        user.update(params).then(usr  => {
                            delete usr.dataValues.password;
                            let token = jwt.sign(user.dataValues, config.secret, {algorithm: 'HS256'});
                            return resolve({
                                status: true,
                                msg: "Login successfully",
                                data: usr.dataValues,
                                access_token: token
                            });
                        });

                    } else {
                        return resolve({
                            status: false,
                            msg: "Your account has been blocked by admin, please contact to support team!",
                            data: {}
                        });
                    }
                } else {
                    params.created_at = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
                    params.updated_at = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
                    params.login_type = "google";
                    params.roles = "user";
                    params.is_verified = 1;
                    users.create(params).then(user => {
                        delete user.dataValues.password;
                        let token = jwt.sign(user.dataValues, config.secret, {algorithm: 'HS256'});
                        return resolve({
                            status: true,
                            msg: "Login successfully",
                            data: user.dataValues,
                            access_token: token
                        });
                    });
                }
            });
    });
}

const facebookLogin = async (params) => {
    return new Promise(resolve => {
        users.findOne({
            where: {email: params.email, facebook_id: params.facebook_id,roles:'user'}
        })
            .then(user => {
                if (user) {
                    if(user.dataValues.status){

                        user.update(params).then(usr => {
                            delete usr.dataValues.password;
                            let token = jwt.sign(user.dataValues, config.secret, {algorithm: 'HS256'});
                            return resolve({
                                status: true,
                                msg: "Login successfully",
                                data: usr.dataValues,
                                access_token: token
                            });
                        });

                    } else {
                        return resolve({
                            status: false,
                            msg: "Your account has been blocked by admin, please contact to support team!",
                            data: {}
                        });
                    }
                } else {
                    params.created_at = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
                    params.updated_at = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
                    params.login_type = "facebook";
                    params.roles = "user";
                    params.is_verified = 1;
                    users.create(params).then(user => {
                        delete user.dataValues.password;
                        let token = jwt.sign(user.dataValues, config.secret, {algorithm: 'HS256'});
                        return resolve({
                            status: true,
                            msg: "Login successfully",
                            data: user.dataValues,
                            access_token: token
                        });
                    });
                }
            });
    });
};

const sendVerificationCode = async (params) => {
  return new Promise(async resolve => {
       var code = Math.floor(1000 + Math.random() * 9000);
           params.code = code;
           await sendEmailVerfication(params).then(res => {
              if(res){
                  users_verification.findOne({
                      where: {email: params.email}
                  }).then(user_verfied => {
                      if(user_verfied){
                          user_verfied.update(params).then(user => {
                              return resolve({
                                  status: true,
                                  msg: "Verification code sent successfully",
                                  data: {}
                              });
                          }).catch(err => {
                              return resolve({
                                  status: false,
                                  msg: err.message,
                                  data: {}
                              });
                          });
                      } else {
                          users_verification.create(params).then(user => {
                              return resolve({
                                  status: true,
                                  msg: "Verification code sent successfully",
                                  data: {}
                              });
                          }).catch(err => {
                              return resolve({
                                  status: false,
                                  msg: err.message,
                                  data: {}
                              });
                          });
                      }
                  });
              } else {
                  return resolve({status: false, msg: "something went wrong, please try again!", data: {} });
              }
          }).catch(err => {
               return resolve({status: false, msg: err.message, data: {} });
          });
  });
}



const register = async (params) => {
  return new Promise(async resolve => {
                let { email } = params;
                 users.findOne({where:{email ,roles:'user'}}).then(user => {
                    if(!user){
                        let token = jwt.sign({
                              email: email
                            }, config.secret, {algorithm: 'HS256'});
    
                        params.created_at = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
                        params.updated_at = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
                        params.roles = "user";
                        login_type = 'email';
                        params.is_verified = 1;
                        params.password = md5(params.password);
                        users.create(params).then(user => {
                            transporter.sendMail({
                                from: '"" <noreply@ebizzdevelopment.com>',
                                to: params.email, // list of receivers
                                subject: "your account one time verification link", // Subject line
                                text: "", // plain text body
                                html: `<p>Click <a href="http://localhost:3000/auth/register">here</a> to reset your password</p> And  your token is ${token}`
                            })
                            delete user.dataValues.password;
                            return resolve({
                                status: true,
                                msg: "send successfully",
                            });
                        });
                    } else {
                        return resolve({status: false, msg: "user is already register", data: {} });
                    }
                 });
            
          });       

}




async function sendEmailVerfication(params) {
    let info = await transporter.sendMail({
        from: '"DB_ezllo" <noreply@ebizzdevelopment.com>', 
        to: params.email, // list of receivers
        subject: "demo account one time verification link", // Subject line
        text: "", // plain text body
        html: "<p>Hello Dear,</p>" +
            "<p>Thanks for Regsi!</p>" +
            "<p>Your one time verification link is : "+params.code+"</p>" +
            "<br/>" +
            "<b>Thank You!</b>"
    });
    return  info.messageId
}
  

const forgotPassword = async (params) => {
    return new Promise(async resolve => {
        var code = Math.floor(1000 + Math.random() * 9000);
            params.code = code;
            users.findOne({where:{email:params.email} }).then(async rescheck => {
                if(rescheck){
                    await transporter.sendMail({
                        from: '"demo-app" <noreply@ebizzdevelopment.com>', 
                        to: params.email, // list of receivers
                        subject: "your account one time verification link", // Subject line
                          html: `<p>Click <a href="http://localhost:3000/auth/reset-password/${rescheck.id}">here</a> to reset your password</p> And  your code is ${params.code}`
                    }).then(res => {
                        if(res){
                            users_verification.findOne({
                                where: {email: params.email}
                            }).then(user_verfied => {
                                if(user_verfied){
                                    user_verfied.update(params).then(user => {
                                        return resolve({
                                            status: true,
                                            msg: "Verification code sent successfully",
                                            data: {}
                                        });
                                    }).catch(err => {
                                        return resolve({
                                            status: false,
                                            msg: err.message,
                                            data: {}
                                        });
                                    });
                                } else {
                                    users_verification.create(params).then(user => {
                                        return resolve({
                                            status: true,
                                            msg: "Verification code sent successfully",
                                            data: {}
                                        });
                                    }).catch(err => {
                                        return resolve({
                                            status: false,
                                            msg: err.message,
                                            data: {}
                                        });
                                    });
                                }
                            });
                        } else {
                            return resolve({status: false, msg: "something went wrong, please try again!", data: {} });
                        }    
                        }).catch(err => {
                            return resolve({status: false, msg: err.message, data: {} });
                        });

                } else {
                    return resolve({
                        status: false,
                        msg: "Invalid email address, please try later with valid email address!",
                        data: {}
                    });
                }
            });
    });
}


const resetPassword = async (params) => {
    return new Promise(async resolve => {
            users_verification.findOne({where:{email:params.email,code:params.otp}}).then(response =>{
                if(response) {
                    users.update({password:md5(params.new_password)},{where:{email:params.email}}).then(update => {
                        if(update){
                            response.destroy();
                            return resolve({status: true, msg: "New password updated successfully", data: {},status_code:0 });
                        } else {
                            return resolve({status: false, msg: "Something went wrong, please try latter!", data: {}, status_code:1});
                        }
                    });
                } else {
                    return resolve({status: false, msg: "may be invalid email or otp Please check", data: {},status_code:2});
                }
            });
    });
}



const updateProfile = async (params) => {
    let user = await helper.getUserInfo(params);
    return new Promise(async resolve => {
        try {
            let data = {};
            if(params.profile_pic){           
                const  ImageUploadStatus = await uploadImageService.uploadImage({
                    uploadPath: 'public/profile_image/',
                    image: params.profile_pic,
                    userId: user.id
                  });
                  console.log("ImageUploadStatus",ImageUploadStatus);
                
                params.profile_pic = config.imageBaseUrl + ImageUploadStatus;
               
            }
                    users.findOne({where:{email:params.email} ,id:{ [Op.not]: user.id}}).then(checkemail => {
                                if(checkemail){
                                    return resolve({
                                        status: false,
                                        msg: "Email address is already registered in our data",
                                        data: {}
                                    });
                                } else {
                                    data['email'] = params.email;
                                }
                    })

                if(params.profile_pic){
                    data['profile_pic'] = params.profile_pic;
                }
         
            if(data){
                users.update(data, {where:{id:user.id}}).then(res => {
                   if(res){
                       users.findOne({where:{id:user.id}}).then(userobj => {
                           delete userobj.dataValues.password;
                           return resolve({
                               status: true,
                               msg: "Profile updated successfully",
                             data: userobj.dataValues        
                           });
                       })
                   } else {
                       return resolve({
                           status: false,
                           msg: "Something went wrong, please try latter!",
                           data: {}
                       });
                   }
                });
            } else {
                delete user.password;
                return resolve({
                    status: true,
                    msg: "Profile updated successfully",
                    data: user
                });
            }

        } catch (error) {
            console.log(error.message)
        }
    });
}




module.exports = {
  sendVerificationCode,
  register,
  login,
  googleLogin,
  facebookLogin,
  forgotPassword,
  resetPassword,
  updateProfile,
  updateProfile,
}

