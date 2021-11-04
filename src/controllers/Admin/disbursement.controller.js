const mongoose = require('mongoose');
// const moment = require('moment');
// require('moment/locale/id');
const Xendit = require('../../configs/Xendit');

const Disbursement = mongoose.model('Disbursement');
// const Notification = mongoose.model('Notification');

const api = {
    disbursement: 'https://api.xendit.co/disbursements'
};

exports.approveDisbursement = (request, response) => {
    const { disbursementId } = request.params;
    Disbursement.findOne({
        _id: disbursementId,
        status: 'pending'
    }).then((disbursement) => {
        const payload = {
            external_id: disbursement.external_id,
            account_holder_name: disbursement.bank_name_holder,
            account_number: disbursement.bank_number,
            bank_code: disbursement.bank_code,
            description: 'Penarikan Fee Edukasi',
            amount: disbursement.amount - 6500
        };
        Xendit('POST', api.disbursement, payload).then((res) => {
            disbursement.status = 'approved';
            disbursement.save();
            return response.status(200).json({
                status: true,
                message: 'successfully request disbursement',
                data: res
            });
        }).catch((err) => {
            return response.status(400).json({
                status: true,
                message: 'can\'t create disbursement request',
                data: err
            });
        });
    });
};

exports.getDisbursement = (request, response) => {
    Disbursement.find().then((disbursement) => {
        const data = [];
        for (let i = 0; i < disbursement.length; i++) {
            const obj = {
                id: disbursement[i].id,
                account: disbursement[i].account,
                bank_name_holder: disbursement[i].bank_name_holder,
                bank_code: disbursement[i].bank_code,
                bank_number: disbursement[i].bank_number,
                amount: disbursement[i].amount,
                status: disbursement[i].status
            };
            data.push(obj);
        }
        return response.status(200).json({
            status: true,
            message: 'successfully get disbursement data',
            data
        });
    }).catch(() => {
        return response.status(400).json({
            status: true,
            message: 'failed to get disbursement data'
        });
    });
};

exports.getDisbursementDetail = (request, response) => {
    const { disbursementId } = request.params;
    Disbursement.find({
        disbursementId
    }).then((disbursement) => {
        return response.status(200).json({
            status: true,
            message: 'successfully get disbursement data',
            data: {
                id: disbursement.id,
                bank_name_holder: disbursement.bank_name_holder,
                bank_code: disbursement.bank_code,
                bank_number: disbursement.bank_number
            }
        });
    }).catch(() => {
        return response.status(400).json({
            status: true,
            message: 'failed to get disbursement data'
        });
    });
};
