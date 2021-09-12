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

const testAutomateUpdateReferralPoint = (request, response) => {
    const { subtotal, userCode } = request.query;
    const users = [
        {
            code: 'userA',
            ref_point: 0,
            shop_point: 0,
            ref_profit: 5,
            role: 'distributor',
            ref: 'none'
        },
        {
            code: 'userB',
            ref_point: 0,
            shop_point: 0,
            ref_profit: 8.5,
            role: 'reseller',
            ref: 'none'
        },
        {
            code: 'userC',
            ref_point: 0,
            shop_point: 0,
            ref_profit: 12,
            role: 'subreseller',
            ref: 'userB'
        },
        {
            code: 'userD',
            ref_point: 0,
            shop_point: 0,
            ref_profit: 0,
            role: 'retail',
            ref: 'userC'
        },
        {
            code: 'userE',
            ref_point: 0,
            shop_point: 0,
            ref_profit: 0,
            role: 'retail',
            ref: 'userA'
        }
    ];

    const getProfit = (amount, profit) => {
        const percentage = 100 - profit;
        return parseInt(amount, 10) * ((100 - percentage) / 100);
    };

    // User yang melakukan pembelian
    const userShopping = users.filter((user) => user.code === userCode);
    // Upline dari user yang melakukan pembelian
    const firstUpline = users.filter((user) => userShopping[0].ref === user.code);

    if (userShopping.length > 0) {
        userShopping[0].shop_point = 1;

        // Cari Kepala Pertama
        if (firstUpline.length > 0) {
            firstUpline[0].ref_point = getProfit(subtotal, firstUpline[0].ref_profit);

            // Upline dari upload user yang melakukan pembelian
            // Cari Kepala Kedua
            const secondUpline = users.filter((user) => firstUpline[0].ref === user.code);
            if (secondUpline.length > 0) {
                secondUpline[0].ref_point = getProfit(subtotal, secondUpline[0].ref_profit);

                // Upline dari upline dan upline user yang melakukan pembelian
                // Cari kepala Ketiga
                const thirdUpline = users.filter((user) => secondUpline[0].ref === user.code);
                if (thirdUpline.length > 0) {
                    thirdUpline[0].ref_point = getProfit(subtotal, thirdUpline[0].ref_profit);
                    return response.status(200).json({
                        data: users
                    });
                }
                return response.status(200).json({
                    data: users
                });
            }
            return response.status(200).json({
                data: users
            });
        }
        return response.status(200).json({
            data: users
        });
    }
    response.status(200).json({
        data: users
    });
};

const ReferralController = {
    checkReferralCode,
    getReferralDownline,
    testAutomateUpdateReferralPoint
};

module.exports = ReferralController;
