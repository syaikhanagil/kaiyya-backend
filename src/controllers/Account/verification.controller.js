const mongoose = require('mongoose');
const jsonwebtoken = require('jsonwebtoken');
const Notify = require('../../configs/Notify');
const CONSTANT = require('../../constant');
// const Mailer = require('../../mail');

const Account = mongoose.model('Account');

const requestVerificationCode = (request, response) => {
    const { email } = request.body;
    Account.findOne({
        email
    }).then(async (account) => {
        const verificationCode = Math.floor(100000 + Math.random() * 900000);
        account.verified.verification_code = verificationCode;
        account.save();
        const payload = {
            email: account.email,
            fullname: account.fullname,
            code: account.verified.verification_code
        };
        // await Notify.MAIL_VERIFICATION_CODE(payload);
        await Notify(CONSTANT.MAIL_VERIFICATION_CODE, payload);
        return response.status(200).json({
            status: true,
            message: 'email verification sent'
        });
    }).catch(() => {
        return response.status(400).json({
            status: true,
            message: 'email verification failed to sent'
        });
    });
};

const verifyAccount = (request, response) => {
    const { token } = request.body;
    jsonwebtoken.verify(token, 'KIS-SECRET-VERIFY', (err, decode) => {
        if (err) {
            return response.status(400).json({
                status: false,
                message: 'invalid verify token'
            });
        }
        Account.findOne({
            _id: decode.uid
        }).then((account) => {
            if (account.verified.code === decode.code) {
                account.verified.status = true;
                account.save();
                return response.status(200).json({
                    status: true,
                    message: 'token valid',
                    data: decode
                });
            }
            return response.status(400).json({
                status: false,
                message: 'invalid verify token'
            });
        });
    });
};

module.exports = {
    requestVerificationCode,
    verifyAccount
};
