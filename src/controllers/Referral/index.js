// const packageName = require('packageName');
const mongoose = require('mongoose');

const Account = mongoose.model('Account');
const Referral = mongoose.model('Referral');

const compareReferralCode = (request, response) => {
    const { code } = request.query;
    Referral.findOne({
        code
    }).populate('account')
        .then((referral) => {
            response.status(200).json({
                status: true,
                message: 'referral code valid',
                data: {
                    username: referral.account.username,
                    fullname: referral.account.fullname,
                    role: referral.account.role,
                    referral: referral.code
                }
            });
        })
        .catch(() => {
            response.status(400).json({
                status: false,
                message: 'invalid referral code'
            });
        });
};

const getReferralDownline = (request, response) => {
    const { referral } = request.params;
    Account.find({
        referral
    }, (err, account) => {
        if (err) {
            return response.status(400).json({
                status: false
            });
        }
        const downline = [];
        for (let i = 0; i < account.length; i++) {
            const obj = {
                username: account[i].username,
                fullname: account[i].fullname,
                email: account[i].email,
                role: account[i].role
            };
            downline.push(obj);
        }
        return response.status(200).json({
            status: true,
            message: 'successful get downline',
            data: downline
        });
    });
};

const ReferralController = {
    compareReferralCode,
    getReferralDownline
};

module.exports = ReferralController;
