const mongoose = require('mongoose');

const Disbursement = mongoose.model('Disbursement');
const Notification = mongoose.model('Notification');

const createDisbursement = (request, response) => {
    const { uid } = request.session;
    const { amount, bankNameHolder, bankCode, bankNumber } = request.body;
    const uniqcode = Math.floor(10000000 + Math.random() * 90000000);
    const newDisbursement = new Disbursement({
        external_id: `KFE-10${uniqcode}`,
        account: uid,
        amount,
        bank_name_holder: bankNameHolder,
        bank_code: bankCode,
        bank_number: bankNumber
    });
    newDisbursement.save((err, disbursement) => {
        if (err) {
            return response.status(400).json({
                status: false
            });
        }
        const newNotification = new Notification({
            account: uid,
            title: 'Penarikan Imbalan',
            message: `Penarikan imbalan dengan nominal Rp ${new Intl.NumberFormat().format(amount)} berhasil diajukan, tunggu konfirmasi dari Admin Kaiyya. Konfirmasi ini membutuhkan waktu 1x24 Jam.`
        });
        newNotification.save();
        return response.status(200).json({
            message: 'disbursement successfully requested',
            data: disbursement
        });
    });
};

const getDisbursement = (request, response) => {
    const { uid } = request.session;
    Disbursement.find({
        account: uid
    }).then((disbursement) => {
        const data = [];
        for (let i = 0; i < disbursement.length; i++) {
            const obj = {
                id: disbursement.id,
                bank_name_holder: disbursement.bank_name_holder,
                bank_code: disbursement.bank_code,
                bank_number: disbursement.bank_number
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

const getDisbursementDetail = (request, response) => {
    const { disbirsementId } = request.patams;
    Disbursement.findOne({
        _id: disbirsementId
    }).then((disbursement) => {
        const data = [];
        for (let i = 0; i < disbursement.length; i++) {
            const obj = {
                id: disbursement.id,
                bank_name_holder: disbursement.bank_name_holder,
                bank_code: disbursement.bank_code,
                bank_number: disbursement.bank_number
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

const DisbursementController = {
    createDisbursement,
    getDisbursement,
    getDisbursementDetail
};

module.exports = DisbursementController;
