const mongoose = require('mongoose');

const Account = mongoose.model('Account');

const getProfile = (request, response) => {
    const { username } = request.session;
    Account.findOne({
        username
    }).then((account) => {
        // sent response to client
        return response.status(200).json({
            status: true,
            data: {
                uid: account.id,
                username: account.username,
                email: account.email,
                fullname: account.fullname,
                phone: account.phone,
                role: account.role,
                addons: account.addons
            }
        });
    }).catch(() => {
        // response error
        return response.status(400).json({
            status: false,
            message: 'account not found'
        });
    });
};

const editProfile = async (request, response) => {
    const { uid } = request.session;
    const { fullname, email, phone } = request.body;
    await Account.findOne({
        _id: uid
    }).then((account) => {
        // define new profile data
        account.fullname = fullname;
        account.email = email;
        account.phone = phone;
        account.save((err, saved) => {
            if (err) {
                const usedField = Object.keys(err.keyPattern);
                return response.status(200).json({
                    status: false,
                    error: usedField[0],
                    message: `${usedField} already registered, please use other ${usedField}`
                });
            }
            // sent response to client
            return response.status(200).json({
                status: true,
                data: {
                    userId: saved.id,
                    username: saved.username,
                    email: saved.email,
                    phone: saved.phone,
                    fullname: saved.fullname,
                    addons: saved.addons
                }
            });
        });
    });
};

module.exports = {
    getProfile,
    editProfile
};
