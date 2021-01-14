const authComponent = require('../components/auth.component');
const _= require('lodash');


const login = async (req, res) => {
    let params = req.fields;
    let data = await authComponent.login(params);
    return res.status(200).json(data);
};

const googleLogin = async (req, res) => {
    let params = req.fields;
    let data = await authComponent.googleLogin(params);
    return res.status(200).json(data);
};

const facebookLogin = async (req, res) => {
    let params = req.fields;
    let data = await authComponent.facebookLogin(params);
    return res.status(200).json(data);
};

const sendVerificationCode = async (req, res) => {
    let params = req.fields;
    let data = await authComponent.sendVerificationCode(params);
    return res.status(200).json(data);
};


const register = async (req, res) => {
    let params = req.fields;
    let data = await authComponent.register(params);
    return res.status(200).json(data);
};

const forgotPassword = async (req, res) => {
    let params = req.fields;
    let data = await authComponent.forgotPassword(params);
    return res.status(200).json(data);
};

const resetPassword = async (req, res) => {
    let params = req.fields;
    let data = await authComponent.resetPassword(params);
    return res.status(200).json(data);
};


const updateProfile = async (req, res) => {
    console.log(req.params);
    let params = req.fields;
    params['access_token'] = req.headers.authorization;
    let data = await authComponent.updateProfile(params);
    return res.status(200).json(data); 
}








module.exports = {
    login,
    sendVerificationCode,
    register,
    googleLogin,
    facebookLogin,
    forgotPassword,
    resetPassword,
    updateProfile,
};
