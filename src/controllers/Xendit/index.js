const mongoose = require('mongoose');
const moment = require('moment');
const Xendit = require('../../configs/Xendit');

const Account = mongoose.model('Account');
const Payment = mongoose.model('Payment');
const Order = mongoose.model('Order');
const Referral = mongoose.model('Referral');

const api = {
    virtual_account_bank: 'https://api.xendit.co/available_virtual_account_banks',
    virtual_account: 'https://api.xendit.co/callback_virtual_accounts/',
    virtual_account_pay: 'https://api.xendit.co/callback_virtual_accounts',
    qris: 'https://api.xendit.co/qr_codes/',
    disbursement_bank: 'https://api.xendit.co/available_disbursements_banks'
};

const checkAvailableVirtualAccount = (request, response) => {
    Xendit('GET', api.virtual_account_bank).then((res) => {
        return response.status(200).json({
            status: true,
            message: 'successfully get virtual account bank',
            data: res
        });
    }).catch((err) => {
        return response.status(400).json({
            status: true,
            message: 'can\'t create virtual account',
            data: err
        });
    });
};

/**
 * CREATE VIRTUAL ACCOUNT
 */
const createVirtualAccount = (request, response) => {
    const { uid } = request.session;
    const { externalId, name, amount, bankCode } = request.body;
    const date = moment();
    const payload = {
        external_id: externalId,
        name,
        amount,
        bank_code: bankCode,
        expected_amount: amount,
        is_single_use: true,
        expiration_date: date.utc().add(1, 'days').toISOString()
    };
    Xendit('POST', api.virtual_account, payload).then((res) => {
        Order.findOne({
            external_id: externalId
        }).then((order) => {
            const newPayment = new Payment({
                account: uid,
                order: order.id,
                external_id: externalId,
                detail: {
                    method: 'virtual-account',
                    name,
                    amount,
                    bank_code: bankCode,
                    virtual_account_number: res.account_number
                }
            });
            newPayment.save((err, payment) => {
                order.payment = payment.id;
                order.save();
                return response.status(200).json({
                    status: true,
                    message: 'virtual account successfully created',
                    data: {
                        id: payment.id,
                        detail: payment.detail
                    }
                });
            });
        });
    }).catch((err) => {
        return response.status(400).json({
            status: true,
            message: 'can\'t create virtual account',
            data: err
        });
    });
};

/**
 * CREATE QRIS
 */
const createQris = (request, response) => {
    const { uid } = request.session;
    const { externalId, amount } = request.body;
    const payload = {
        external_id: externalId,
        type: 'DYNAMIC',
        callback_url: 'https://kaiyya.com/payment/callback/xendit/qris/paid',
        amount
    };
    Xendit('POST', api.qris, payload).then((res) => {
        Order.findOne({
            external_id: externalId
        }).then((order) => {
            const newPayment = new Payment({
                account: uid,
                order: order.id,
                external_id: externalId,
                detail: {
                    method: 'qris',
                    amount,
                    qris_src: res.qr_string
                }
            });
            newPayment.save((err, payment) => {
                order.payment = payment.id;
                order.save();
                return response.status(200).json({
                    status: true,
                    message: 'qr code successfully created',
                    data: {
                        id: payment.id,
                        detail: payment.detail
                    }
                });
            });
        });
    }).catch((err) => {
        return response.status(err).json({
            status: true,
            message: 'can\'t create qr code payment',
            data: err
        });
    });
};

/**
 * VIRTUAL ACCOUNT PAID CALLBACK
 */
const callbackVirtualAccountPaid = (request, response) => {
    const externalId = request.body.external_id;

    const getProfit = (amount, downlineDiscount, discount) => {
        const hargaJual = amount * ((100 - downlineDiscount) / 100);
        const fee = hargaJual * (discount / 100);
        const result = parseInt(fee, 10);
        return Math.round(result);
    };

    if (!externalId) {
        return response.status(400).json({
            status: false,
            message: 'couldn\'t find external_id'
        });
    }
    Payment.findOne({
        external_id: externalId
    }).then((payment) => {
        payment.status = 'paid';
        payment.save();
        Order.findOne({
            external_id: externalId
        }).then((order) => {
            order.status = 'onprocess';
            order.save();

            // Add referral profit
            Account.findOne({
                _id: order.account
            }).then((account) => {
                /**
                 * cari upline pertama
                 */
                if (account.referral_code !== 'none') {
                    Account.findOne({
                        username: account.referral_code
                    }).then((firstUpline) => {
                        firstUpline.addons.referral_point += getProfit(order.subtotal, account.addons.discount, firstUpline.addons.referral_profit);
                        firstUpline.save();

                        const firstReferral = new Referral({
                            account: firstUpline.id,
                            referral_account: account.id,
                            amount: getProfit(order.subtotal, account.addons.discount, firstUpline.addons.referral_profit)
                        });
                        firstReferral.save();
                        console.log('1');

                        /**
                         * cari upline kedua
                         */
                        if (firstUpline.referral_code !== 'none') {
                            Account.findOne({
                                username: firstUpline.referral_code
                            }).then((secondUpline) => {
                                secondUpline.addons.referral_point += getProfit(order.subtotal, firstUpline.addons.discount, secondUpline.addons.referral_profit);
                                secondUpline.save();
                                const secondReferral = new Referral({
                                    account: secondUpline.id,
                                    referral_account: firstUpline.id,
                                    amount: getProfit(order.subtotal, firstUpline.addons.discount, secondUpline.addons.referral_profit)
                                });
                                secondReferral.save();
                                console.log('2');

                                /**
                                 * cari upline ketiga
                                 */
                                if (secondUpline.referral_code !== 'none') {
                                    Account.findOne({
                                        username: secondUpline.referral_code
                                    }).then((thirdUpline) => {
                                        thirdUpline.addons.referral_point += getProfit(order.subtotal, secondUpline.addons.discount, thirdUpline.addons.referral_profit);
                                        thirdUpline.save();
                                        const thirdReferral = new Referral({
                                            account: thirdUpline.id,
                                            referral_account: secondUpline.id,
                                            amount: getProfit(order.subtotal, secondUpline.addons.discount, thirdUpline.addons.referral_profit)
                                        });
                                        thirdReferral.save();
                                        console.log('3');

                                        return response.status(200).json({
                                            status: true,
                                            message: 'payment succesfully paid, not have upline',
                                            data: payment
                                        });
                                    });
                                } else {
                                    return response.status(200).json({
                                        status: true,
                                        message: 'payment succesfully paid, not have upline',
                                        data: payment
                                    });
                                }
                            });
                        } else {
                            return response.status(200).json({
                                status: true,
                                message: 'payment succesfully paid, not have upline',
                                data: payment
                            });
                        }
                    });
                } else {
                    return response.status(200).json({
                        status: true,
                        message: 'payment succesfully paid, not have upline',
                        data: payment
                    });
                }
            });
        });
    }).catch(() => {
        return response.status(400).json({
            status: false,
            message: `can't find external_id with value ${externalId}`
        });
    });
};

/**
 * VIRTUAL ACCOUNT UPDATE CALLBACK
 */
const callbackVirtualAccountUpdate = (request, response) => {
    const externalId = request.body.external_id;
    const { status } = request.body;
    if (!externalId) {
        return response.status(400).json({
            status: false,
            message: 'couldn\'t find external_id'
        });
    }
    Payment.findOne({
        external_id: externalId
    }).then((payment) => {
        if (status === 'INACTIVE') {
            payment.status = 'inactive';
            payment.save();
        }
        return response.status(200).json({
            status: true,
            message: 'status updated',
            data: payment
        });
    }).catch(() => {
        return response.status(400).json({
            status: false,
            message: `can't find external_id with value ${externalId}`
        });
    });
};

/**
 * QRIS PAID CALLBACK
 */
const callbackQrisPaid = (request, response) => {
    const externalId = request.body.external_id;
    const { status } = request.body;

    const getProfit = (amount, downlineDiscount, discount) => {
        const hargaJual = amount * ((100 - downlineDiscount) / 100);
        const fee = hargaJual * (discount / 100);
        const result = parseInt(fee, 10);
        return Math.round(result);
    };

    if (!externalId) {
        return response.status(400).json({
            status: false,
            message: 'couldn\'t find external_id'
        });
    }
    Payment.findOne({
        external_id: externalId
    }).then((payment) => {
        if (status === 'COMPLETED') {
            payment.status = 'paid';
            payment.save();
            Order.findOne({
                external_id: externalId
            }).then((order) => {
                order.status = 'onprocess';
                order.save();

                // Add referral profit
                Account.findOne({
                    _id: order.account
                }).then((account) => {
                    /**
                     * cari upline pertama
                     */
                    if (account.referral_code !== 'none') {
                        Account.findOne({
                            username: account.referral_code
                        }).then((firstUpline) => {
                            firstUpline.addons.referral_point += getProfit(order.subtotal, account.addons.discount, firstUpline.addons.referral_profit);
                            firstUpline.save();

                            const firstReferral = new Referral({
                                account: firstUpline.id,
                                referral_account: account.id,
                                amount: getProfit(order.subtotal, account.addons.discount, firstUpline.addons.referral_profit)
                            });
                            firstReferral.save();
                            console.log('1');

                            /**
                             * cari upline kedua
                             */
                            if (firstUpline.referral_code !== 'none') {
                                Account.findOne({
                                    username: firstUpline.referral_code
                                }).then((secondUpline) => {
                                    secondUpline.addons.referral_point += getProfit(order.subtotal, firstUpline.addons.discount, secondUpline.addons.referral_profit);
                                    secondUpline.save();
                                    const secondReferral = new Referral({
                                        account: secondUpline.id,
                                        referral_account: firstUpline.id,
                                        amount: getProfit(order.subtotal, firstUpline.addons.discount, secondUpline.addons.referral_profit)
                                    });
                                    secondReferral.save();
                                    console.log('2');

                                    /**
                                     * cari upline ketiga
                                     */
                                    if (secondUpline.referral_code !== 'none') {
                                        Account.findOne({
                                            username: secondUpline.referral_code
                                        }).then((thirdUpline) => {
                                            thirdUpline.addons.referral_point += getProfit(order.subtotal, secondUpline.addons.discount, thirdUpline.addons.referral_profit);
                                            thirdUpline.save();
                                            const thirdReferral = new Referral({
                                                account: thirdUpline.id,
                                                referral_account: secondUpline.id,
                                                amount: getProfit(order.subtotal, secondUpline.addons.discount, thirdUpline.addons.referral_profit)
                                            });
                                            thirdReferral.save();
                                            console.log('3');

                                            return response.status(200).json({
                                                status: true,
                                                message: 'payment succesfully paid, not have upline',
                                                data: payment
                                            });
                                        });
                                    } else {
                                        return response.status(200).json({
                                            status: true,
                                            message: 'payment succesfully paid, not have upline',
                                            data: payment
                                        });
                                    }
                                });
                            } else {
                                return response.status(200).json({
                                    status: true,
                                    message: 'payment succesfully paid, not have upline',
                                    data: payment
                                });
                            }
                        });
                    } else {
                        return response.status(200).json({
                            status: true,
                            message: 'payment succesfully paid, not have upline',
                            data: payment
                        });
                    }
                });
            });
        }
        return response.status(400).json({
            status: false,
            message: 'undefined status'
        });
    }).catch(() => {
        return response.status(400).json({
            status: false,
            message: `can't find external_id with value ${externalId}`
        });
    });
};

/**
 * TESTING VIRTUAL ACCOUNT PAY
 */
const testVirtualAccountPay = (request, response) => {
    const { externalId } = request.params;
    const payload = {
        amount: 255000
    };
    Xendit('POST', `${api.virtual_account_pay}/external_id=${externalId}/simulate_payment`, payload).then((res) => {
        return response.status(200).json({
            status: true,
            message: 'successfully get virtual account bank',
            data: res
        });
    }).catch((err) => {
        return response.status(400).json({
            status: true,
            message: 'can\'t create virtual account',
            data: err
        });
    });
};

const getPayment = (request, response) => {
    const { paymentId } = request.params;
    Payment.findOne({
        _id: paymentId
    }).then((payment) => {
        return response.status(200).json({
            status: true,
            message: 'successfully get payment data',
            data: payment
        });
    }).catch(() => {
        return response.status(400).json({
            status: false,
            message: 'failed to get payment data'
        });
    });
};

const XenditController = {
    checkAvailableVirtualAccount,
    createVirtualAccount,
    testVirtualAccountPay,
    callbackVirtualAccountPaid,
    callbackVirtualAccountUpdate,
    createQris,
    callbackQrisPaid,
    getPayment
};

module.exports = XenditController;
