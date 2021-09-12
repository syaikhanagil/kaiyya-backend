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

const updateProfile = async (request, response) => {
    const { username } = request.session;
    const { fullname, email, phone } = request.body;

    await Account.findOne({
        username
    }).then((account) => {
        // define new profile data
        account.fullname = fullname;
        account.email = email;
        account.phone = phone;
        account.save();
        // sent response to client
        response.status(200).json({
            status: true,
            data: {
                userId: account.id,
                username: account.username,
                email: account.email,
                fullname: account.fullname,
                addons: account.addons
            }
        });
    });
};

module.exports = {
    getProfile,
    updateProfile
};
