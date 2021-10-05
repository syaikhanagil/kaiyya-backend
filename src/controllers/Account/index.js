const { loginWithEmail } = require('./login.controller');
const { register } = require('./register.controller');
const { getProfile, editProfile } = require('./profile.controller');
const { checkReferralCode, getReferralDownline, getReferralDownlineByCode, getReferralProfit } = require('./referral.controller');
const { resetPasswordRequest, resetPasswordTokenVerify, resetPasswordConfirm } = require('./reset-password.contrroller');
const { requestVerificationCode, verifyAccount } = require('./verification.controller');

const AccountController = {
    loginWithEmail,
    register,
    getProfile,
    editProfile,
    requestVerificationCode,
    verifyAccount,

    resetPasswordRequest,
    resetPasswordTokenVerify,
    resetPasswordConfirm,

    checkReferralCode,
    getReferralDownline,
    getReferralDownlineByCode,
    getReferralProfit
};

module.exports = AccountController;
