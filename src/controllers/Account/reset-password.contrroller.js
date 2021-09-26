const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const Notify = require('../../configs/Notify');
const CONSTANT = require('../../constant');

const Account = mongoose.model('Account');

const resetPasswordRequest = (request, response) => {
    const { email } = request.body;
    Account.findOne({
        email
    }).then(async (account) => {
        const token = jsonwebtoken.sign({
            uid: account.id
        }, 'KIS-SECRET-RESET', { expiresIn: 60 * 60 });

        const payload = {
            email: account.email,
            name: account.fullname,
            token
        };
        await Notify(CONSTANT.MAIL_RESET_PASSWORD, payload);
        return response.status(200).json({
            status: true,
            message: 'reset link sent successful, check email'
        });
    }).catch(() => {
        return response.status(400).json({
            status: false,
            message: 'email not found'
        });
    });
};

const resetPasswordTokenVerify = (request, response) => {
    const { token } = request.body;
    jsonwebtoken.verify(token, 'KIS-SECRET-RESET', (err, decode) => {
        if (err) {
            return response.status(400).json({
                status: false,
                message: 'invalid reset token'
            });
        }
        return response.status(200).json({
            status: true,
            message: 'token valid',
            data: decode
        });
    });
};

const resetPasswordConfirm = (request, response) => {
    const { uid, password } = request.body;
    Account.findOne({
        _id: uid
    }).then((account) => {
        account.password = bcrypt.hashSync(password, 10);
        account.save();
        response.status(200).json({
            status: true,
            message: 'reset password request successful'
        });
    });
};

module.exports = {
    resetPasswordRequest,
    resetPasswordTokenVerify,
    resetPasswordConfirm
};
