/**
 * Login Controller
 */
const mongoose = require('mongoose');
const jsonwebtoken = require('jsonwebtoken');

const Account = mongoose.model('Account');

exports.loginWithEmail = (request, response) => {
    const { email, password } = request.body;
    Account.findOne({
        email
    }).then((account) => {
        if (!account.comparePassword(password)) {
            return response.status(400).json({
                status: false,
                message: 'invalid email or password combination'
            });
        }
        if (account.addons.suspend === true) {
            return response.status(400).json({
                status: false,
                message: 'account suspended'
            });
        }
        const token = jsonwebtoken.sign({
            uid: account.id,
            username: account.username,
            email: account.email
        }, 'KIS-APIs', { expiresIn: 120 * 60 });
        return response.status(200).json({
            status: true,
            message: 'login success',
            data: {
                uid: account.uid,
                email: account.email,
                role: account.role,
                token
            }
        });
    }).catch(() => {
        response.status(400).json({
            status: false,
            message: 'email not registered'
        });
    });
};
