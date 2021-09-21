const mongoose = require('mongoose');
const Xendit = require('../../configs/Xendit');

// const Order = mongoose.model('Order');
const Payment = mongoose.model('Payment');
const Order = mongoose.model('Order');

const api = {
    virtual_account: 'https://api.xendit.co/callback_virtual_accounts/',
    qris: 'https://api.xendit.co/qr_codes/'
};

/**
 * Disbursement API
 */

const getAvailableBank = (request, response) => {
    
};

const XenditController = {
    getAvailableBank
};
