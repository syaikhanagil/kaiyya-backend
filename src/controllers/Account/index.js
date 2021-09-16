const { loginWithEmail } = require('./login.controller');
const { register } = require('./register.controller');
const { getProfile, updateProfile } = require('./profile.controller');
const { requestVerificationCode, verifyEmail } = require('./verification.controller');
const { loginAdmin, getAccounts, getAccountByRole } = require('./admin.controller');

const AccountController = {
    loginWithEmail,
    loginAdmin,
    register,
    getProfile,
    updateProfile,
    requestVerificationCode,
    verifyEmail,
    getAccounts,
    getAccountByRole
};

module.exports = AccountController;
