const mongoose = require('mongoose');
const moment = require('moment');
require('moment/locale/id');
const Xendit = require('../../configs/Xendit');

const Payment = mongoose.model('Payment');
const Order = mongoose.model('Order');
const Size = mongoose.model('Size');

const api = {
    disbursement_bank: 'https://api.xendit.co/available_disbursements_banks',
    available_virtual_account_bank: 'https://api.xendit.co/available_available_virtual_account_banks',
    virtual_account: 'https://api.xendit.co/callback_virtual_accounts/',
    qris: 'https://api.xendit.co/qr_codes/'
};

const checkAvailableVirtualAccount = (request, response) => {
    Xendit('GET', api.available_virtual_account_bank).then((res) => {
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

const createVirtualAccount = (request, response) => {
    const { uid } = request.session;
    const { externalId, name, amount, bankCode } = request.body;
    const date = moment();
    const expired = date.utc().add(1, 'days').toISOString();

    const payload = {
        external_id: externalId,
        name,
        amount,
        bank_code: bankCode,
        expected_amount: amount,
        is_single_use: true,
        is_closed: true,
        expiration_date: expired
    };
    Xendit('POST', api.virtual_account, payload).then((res) => {
        // return response.status(200).json({
        //     status: 200,
        //     data: res
        // });
        Order.findOne({
            external_id: externalId
        }).then((order) => {
            const newPayment = new Payment({
                account: uid,
                order: order.id,
                external_id: externalId,
                expired,
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

const createQris = (request, response) => {
    const { uid } = request.session;
    const { externalId, amount } = request.body;
    const payload = {
        external_id: externalId,
        type: 'DYNAMIC',
        callback_url: 'https://api.kaiyya.com/payment/callback/xendit/qris/paid',
        amount
    };
    const date = moment();
    const expired = date.utc().add(1, 'days').toISOString();
    Xendit('POST', api.qris, payload).then((res) => {
        Order.findOne({
            external_id: externalId
        }).then((order) => {
            const newPayment = new Payment({
                account: uid,
                order: order.id,
                external_id: externalId,
                expired,
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

const callbackVirtualAccountPaid = (request, response) => {
    const externalId = request.body.external_id;

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
            return response.status(200).json({
                status: true,
                message: 'payment succesfully paid',
                data: payment
            });
        });
    }).catch(() => {
        return response.status(400).json({
            status: false,
            message: `can't find external_id with value ${externalId}`
        });
    });
};

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
            Order.findOne({
                _id: payment.order
            }).populate('order_detail').then((order) => {
                const detail = order.order_detail;
                for (let i = 0; i < detail.length; i++) {
                    // return the reduced stock
                    Size.findOne({
                        _id: detail[i].size
                    }).then((size) => {
                        const currentStock = size.stock;
                        const newStock = currentStock + detail[i].qty;
                        size.stock = newStock;
                        size.save();
                    });
                }
                order.status = 'cancel';
                order.save();

                return response.status(200).json({
                    status: true,
                    message: 'successfully cancel order'
                });
            }).catch(() => {
                return response.status(400).json({
                    status: false,
                    message: 'failed to cancel order'
                });
            });
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

const callbackQrisPaid = (request, response) => {
    const externalId = request.body.qr_code.external_id;
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
        if (status === 'COMPLETED') {
            payment.status = 'paid';
            payment.save();
            return response.status(200).json({
                status: true,
                message: 'payment succesfully paid',
                data: payment
            });
        }
        return response.status(200).json({
            status: true,
            message: 'payment succesfully paid, not have upline',
            data: payment
        });
    }).catch(() => {
        return response.status(400).json({
            status: false,
            message: `can't find external_id with value ${externalId}`
        });
    });
};

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

const checkPaymentStatus = (request, response) => {
    const { paymentId } = request.params;
    Payment.findOne({
        _id: paymentId
    }).then((payment) => {
        return response.status(200).json({
            status: true,
            payment_status: payment.status
        });
    });
};

const getQris = (request, response) => {
    const { externalId } = request.params;
    Xendit('GET', `${api.qris}/${externalId}`).then((res) => {
        return response.status(200).json({
            status: true,
            message: 'qr code successfully created',
            data: res
        });
    }).catch((err) => {
        return response.status(err).json({
            status: true,
            message: 'can\'t create qr code payment',
            data: err
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
    getQris,
    getPayment,
    checkPaymentStatus
};

module.exports = XenditController;
