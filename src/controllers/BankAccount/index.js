const mongoose = require('mongoose');
const Xendit = require('../../configs/Xendit');

const BankAccount = mongoose.model('BankAccount');

const api = {
    disbursement_bank: 'https://api.xendit.co/available_disbursements_banks'
};

const createBankAccount = (request, response) => {
    const { uid } = request.session;
    const { bankNameHolder, bankCode, bankNumber } = request.body;
    const newBankAccount = new BankAccount({
        account: uid,
        bank_name_holder: bankNameHolder,
        bank_code: bankCode,
        bank_number: bankNumber
    });
    newBankAccount.save((err, bank) => {
        if (err) {
            return response.status(400).json({
                status: false,
                message: 'failed to create bank account'
            });
        }
        return response.status(200).json({
            status: true,
            message: 'New bank account created',
            data: bank
        });
    });
};

const getBankAccount = (request, response) => {
    const { uid } = request.session;
    BankAccount.find({
        account: uid
    }).then((bank) => {
        const data = [];
        for (let i = 0; i < bank.length; i++) {
            const obj = {
                id: bank[i].id,
                bank_name_holder: bank[i].bank_name_holder,
                bank_code: bank[i].bank_code,
                bank_number: bank[i].bank_number
            };
            data.push(obj);
        }
        return response.status(200).json({
            status: true,
            message: 'successfully get bank data',
            data
        });
    }).catch(() => {
        return response.status(400).json({
            status: false,
            message: 'successfully get bank data'
        });
    });
};

/**
 * GET DISBURSEMENT BANK
 */
const getAvailableDisbursementBank = (request, response) => {
    Xendit('GET', api.disbursement_bank).then((res) => {
        return response.status(200).json({
            status: true,
            message: 'successfully get disbursement account bank',
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

const BankAccountController = {
    getAvailableDisbursementBank,
    createBankAccount,
    getBankAccount
};

module.exports = BankAccountController;
