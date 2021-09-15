const { loginWithEmail, loginAdmin } = require('./login.controller');
const { register } = require('./register.controller');
const { getProfile, updateProfile } = require('./profile.controller');
const { requestVerificationCode, verifyEmail } = require('./verification.controller');

const AccountController = {
    loginWithEmail,
    loginAdmin,
    register,
    getProfile,
    updateProfile,
    requestVerificationCode,
    verifyEmail
};

module.exports = AccountController;
