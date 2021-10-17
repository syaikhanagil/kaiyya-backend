const mongoose = require('mongoose');

const Disbursement = mongoose.model('Disbursement');

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
        return response.status(200).json({
            data: disbursement
        });
    });
};

const DisbursementController = {
    createDisbursement
};

module.exports = DisbursementController;
