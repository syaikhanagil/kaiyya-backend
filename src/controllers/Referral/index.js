// const packageName = require('packageName');
const mongoose = require('mongoose');

const Account = mongoose.model('Account');
const Referral = mongoose.model('Referral');

const checkReferralCode = (request, response) => {
    const { referralCode } = request.body;
    Referral.findOne({
        code: referralCode
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
    checkReferralCode,
    getReferralDownline
};

module.exports = ReferralController;
