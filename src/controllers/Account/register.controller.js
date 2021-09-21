/**
 * User Registration Controller
 */
const mongoose = require('mongoose');
const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Notify = require('../../configs/Notify');
const CONSTANT = require('../../constant');

const Account = mongoose.model('Account');

exports.register = (request, response) => {
    const { fullname, email, phone, password, referralCode, role } = request.body;
    if (!fullname) {
        return response.status(400).json({
            status: false,
            message: 'fullname is required'
        });
    }
    if (!email) {
        return response.status(400).json({
            status: false,
            message: 'email is required'
        });
    }
    if (!phone) {
        return response.status(400).json({
            status: false,
            message: 'phone is required'
        });
    }
    if (!password) {
        return response.status(400).json({
            status: false,
            message: 'password is required'
        });
    }
    if (!role) {
        return response.status(400).json({
            status: false,
            message: 'role is required'
        });
    }
    const username = email.split('@')[0].split('.').join('_');
    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    // Define default referral by role
    let defaultReferral = '';
    if (!referralCode) {
        if (role === 'distributor') defaultReferral = 'none';
        if (role === 'reseller') defaultReferral = 'kaiyya_distributor';
        if (role === 'subreseller') defaultReferral = 'kaiyya_reseller';
        if (role === 'retail') defaultReferral = 'kaiyya_subreseller';
    }
    const newAccount = new Account({
        username,
        fullname,
        email,
        phone,
        password: bcrypt.hashSync(password, 10),
        verified: {
            verification_code: verificationCode
        },
        role,
        referral_code: referralCode || defaultReferral
    });

    newAccount.save(async (err, account) => {
        if (err) {
            const usedField = Object.keys(err.keyPattern);
            return response.status(400).json({
                status: false,
                message: `${usedField} already registered, please use other ${usedField}`
            });
        }
        // eslint-disable-next-line new-cap
        const hashId = new Buffer.from(account.id).toString('base64');

        const payload = {
            id: hashId,
            email: account.email,
            fullname: account.fullname,
            code: account.verified.verification_code
        };

        // send email verification to user
        await Notify(CONSTANT.MAIL_REGISTRATION, payload);
        // console.log(payload);

        const token = jsonwebtoken.sign({
            uid: account.id,
            username: account.username,
            email: account.email
        }, 'KIS-APIs', { expiresIn: 120 * 60 });

        return response.status(200).json({
            status: true,
            message: 'new account created',
            data: {
                username: account.username,
                fullname: account.fullname,
                email: account.email,
                verified: account.verified.status,
                token
            }
        });
    });
};
