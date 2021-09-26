const mongoose = require('mongoose');

const Account = mongoose.model('Account');
const Referral = mongoose.model('Referral');

exports.checkReferralCode = (request, response) => {
    const { code } = request.body;
    Account.findOne({
        username: code
    }).then((account) => {
        response.status(200).json({
            status: true,
            message: 'referral code valid',
            data: {
                username: account.username,
                fullname: account.fullname,
                role: account.role
            }
        });
    }).catch(() => {
        return response.status(400).json({
            status: false,
            message: 'referral code invalid'
        });
    });
};

exports.getReferralDownline = (request, response) => {
    const { username } = request.session;
    Account.find({
        referral_code: username
    }).sort('fullname').then((account) => {
        const data = [];
        for (let i = 0; i < account.length; i++) {
            const obj = {
                username: account[i].username,
                fullname: account[i].fullname,
                email: account[i].email
            };
            data.push(obj);
        }
        return response.status(200).json({
            status: true,
            message: 'successfully get downline data',
            data
        });
    }).catch(() => {
        return response.status(200).json({
            status: false,
            message: 'failed to get downline data',
            data: []
        });
    });
};

exports.getSingleDownlineReport = (request, response) => {
    const { username } = request.session;
    const { refUsername } = request.params;
    Account.findOne({
        username: refUsername, // username downline
        referral_code: username // kode referral upline
    }).then((account) => {
        Referral.find({
            account: account.id
        }).then((referral) => {
            return response.status(200).json({
                status: true,
                message: 'successfully get downline data',
                data: {
                    username: account.username,
                    fullname: account.fullname,
                    email: account.email,
                    referral_report: referral
                }
            });
        });
    }).catch(() => {
        return response.status(200).json({
            status: false,
            message: 'failed to get downline data',
            data: []
        });
    });
};

exports.getMultipleDownlineReport = (request, response) => {
    const { username } = request.session;
    Account.find({
        referral: username // kode referral upline
    }).then((account) => {
        const data = [];
        for (let i = 0; i < account.length; i++) {
            const obj = {
                username: account[i].username,
                fullname: account[i].fullname,
                email: account[i].email
            };
            Referral.find({
                account: account[i].id
            }).then((referral) => {
                obj.referral_report = referral;
                data.push(obj);
            });
        }
        return response.status(200).json({
            status: true,
            message: 'successfully get downline data',
            data
        });
    }).catch(() => {
        return response.status(200).json({
            status: false,
            message: 'failed to get downline data',
            data: []
        });
    });
};

// exports.addIncome = (request, response) => {
//     const { username } = request;
// };
