const mongoose = require('mongoose');
const moment = require('moment');
const Xendit = require('../../configs/Xendit');

// const Order = mongoose.model('Order');
const Payment = mongoose.model('Payment');
const Order = mongoose.model('Order');

const api = {
    disbursement_bank: 'https://api.xendit.co/available_disbursements_banks',
    virtual_account_bank: 'https://api.xendit.co/available_virtual_account_banks',
    virtual_account: 'https://api.xendit.co/callback_virtual_accounts/',
    qris: 'https://api.xendit.co/qr_codes/'
};

const checkAvailableBank = (request, response) => {
    Xendit('GET', api.virtual_account_bank).then((res) => {
        return response.status(200).json({
            status: true,
            message: 'virtual account successfully created',
            data: res.data
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
        if (status === 'COMPLETED') {
            payment.status = 'paid';
            payment.save();
            return response.status(200).json({
                status: true,
                message: 'payment succesfully paid',
                data: payment
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

const PaymentController = {
    checkAvailableBank,
    createVirtualAccount,
    createQris,
    callbackVirtualAccountPaid,
    callbackVirtualAccountUpdate,
    callbackQrisPaid,
    getPayment
};

module.exports = PaymentController;
