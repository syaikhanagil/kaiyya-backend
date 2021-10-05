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

const getReferralProfit = (request, response) => {
    const { uid } = request.session;
    Referral.find({
        account: uid
    }).populate('referral_account').then((referral) => {
        return response.status(200).json({
            status: true,
            message: 'successful get downline',
            data: referral
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
            discount: 30,
            role: 'distributor',
            ref: 'none'
        },
        {
            code: 'userB',
            ref_point: 0,
            shop_point: 0,
            ref_profit: 8.5,
            discount: 20,
            role: 'reseller',
            ref: 'none'
        },
        {
            code: 'userC',
            ref_point: 0,
            shop_point: 0,
            ref_profit: 13,
            discount: 10,
            role: 'subreseller',
            ref: 'userB'
        },
        {
            code: 'userD',
            ref_point: 0,
            shop_point: 0,
            ref_profit: 0,
            discount: 0,
            role: 'retail',
            ref: 'userC'
        },
        {
            code: 'userE',
            ref_point: 0,
            shop_point: 0,
            ref_profit: 0,
            discount: 0,
            role: 'retail',
            ref: 'userA'
        }
    ];

    // const getProfit = (amount, profit) => {
    //     // const contoh = 1000000 * ((1-0) * 13%);
    //     // const s = 1000000 * ((1 - 0) * 10%);
    //     const het = 1000000;
    //     const discountRetail = 0;
    //     const hargaJual = het * ((100 - discountRetail) / 100);

    //     const discountSubreseller = 13;
    //     // const total = harga * discount;
    //     // const dpd = harga - total;
    //     const fee = hargaJual * (discountSubreseller / 100);
    //     console.log('fee', fee);
    //     // console.log('dpd', dpd);

    //     const result = parseInt(amount, 10) * ((100 - percentage) / 100);
    //     return Math.round(result);
    // };

    const getProfit = (amount, downlineDiscount, discount) => {
        const hargaJual = amount * ((100 - downlineDiscount) / 100);
        const fee = hargaJual * (discount / 100);
        const result = parseInt(fee, 10);
        return Math.round(result);
    };

    // User yang melakukan pembelian
    const userShopping = users.filter((user) => user.code === userCode);

    if (userShopping.length > 0) {
        userShopping[0].shop_point = 1;

        // Cari Kepala Pertama
        // Upline dari user yang melakukan pembelian
        const firstUpline = users.filter((user) => userShopping[0].ref === user.code);
        if (firstUpline.length > 0) {
            firstUpline[0].ref_point = getProfit(subtotal, userShopping[0].discount, firstUpline[0].ref_profit);

            // Cari Kepala Kedua
            // Upline dari upline user yang melakukan pembelian
            const secondUpline = users.filter((user) => firstUpline[0].ref === user.code);
            if (secondUpline.length > 0) {
                secondUpline[0].ref_point = getProfit(subtotal, firstUpline[0].discount, secondUpline[0].ref_profit);

                // Cari kepala Ketiga
                // Upline dari upline dan upline user yang melakukan pembelian
                const thirdUpline = users.filter((user) => secondUpline[0].ref === user.code);
                if (thirdUpline.length > 0) {
                    thirdUpline[0].ref_point = getProfit(subtotal, secondUpline[0].discount, thirdUpline[0].ref_profit);
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
    getReferralProfit,
    testAutomateUpdateReferralPoint
};

module.exports = ReferralController;
