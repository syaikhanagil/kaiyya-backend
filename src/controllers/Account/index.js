const { loginWithEmail } = require('./login.controller');
const { register } = require('./register.controller');
const { getProfile, updateProfile } = require('./profile.controller');
const { checkReferralCode, getReferralDownline } = require('./referral.controller');
const { requestVerificationCode, verifyEmail } = require('./verification.controller');

const AccountController = {
    loginWithEmail,
    register,
    getProfile,
    updateProfile,
    requestVerificationCode,
    verifyEmail,

    checkReferralCode,
    getReferralDownline
};

module.exports = AccountController;
