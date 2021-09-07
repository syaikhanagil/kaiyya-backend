const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Notify = require('../../configs/Notify');
const CONSTANT = require('../../constant');

const Account = mongoose.model('Account');

const resetPasswordRequest = (request, response) => {
    const { email } = request.body;
    Account.findOne({
        email
    }).then(async (account) => {
        const payload = {
            email: account.email,
            name: account.fullname
        };
        await Notify(CONSTANT.MAIL_RESET_PASSWORD, payload);
        response.status(200).json({
            status: true,
            message: 'reset link sent successful, check email'
        });
    });
};

const resetPasswordConfirm = (request, response) => {
    const { email, password } = request.body;
    Account.findOne({
        email
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
    resetPasswordConfirm
};
