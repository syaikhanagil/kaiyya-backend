/**
 * Admin Controller
 */
const mongoose = require('mongoose');
const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const moment = require('moment');
// const Mailer = require('../../mail');

const Account = mongoose.model('Account');

exports.login = (request, response) => {
    const { username, password } = request.body;
    Account.findOne({
        username,
        role: 'admin'
    })
        .then((account) => {
            if (!account.comparePassword(password)) {
                return response.status(401).json({
                    status: false,
                    message: 'invalid email or password combination'
                });
            }
            const token = jsonwebtoken.sign(
                {
                    uid: account.id,
                    username: account.username,
                    email: account.email,
                    keys: 'admin'
                },
                'KIS-APIs'
            );
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
        })
        .catch(() => {
            response.status(200).json({
                status: false,
                message: 'email not registered'
            });
        });
};

exports.getAccounts = (request, response) => {
    Account.find()
        .sort('fullname')
        .then((account) => {
            const filterAccount = account.filter(
                (item) => item.role !== 'admin'
            );
            const data = [];
            for (let i = 0; i < filterAccount.length; i++) {
                const obj = {
                    id: filterAccount[i].id,
                    username: filterAccount[i].username,
                    fullname: filterAccount[i].fullname,
                    email: filterAccount[i].email,
                    phone: filterAccount[i].phone,
                    role: filterAccount[i].role,
                    referral_code: filterAccount[i].referral_code,
                    created: moment(filterAccount[i].createdAt).format('LL'),
                    verified: filterAccount[i].verified,
                    addons: filterAccount[i].addons
                };
                data.push(obj);
            }
            return response.status(200).json({
                status: true,
                message: 'successfully get account data',
                data
            });
        });
};

exports.getAccountByRole = (request, response) => {
    const { userRole } = request.params;
    Account.find({
        role: userRole
    }).then((account) => {
        const data = [];
        for (let i = 0; i < account.length; i++) {
            const obj = {
                id: account[i].id,
                username: account[i].username,
                fullname: account[i].fullname,
                email: account[i].email,
                role: account[i].role
            };
            data.push(obj);
        }
        return response.status(200).json({
            status: true,
            message: 'successfully get account data',
            data
        });
    });
};

exports.getAccountDownline = (request, response) => {
    const { username } = request.params;
    Account.find({
        referral_code: username
    }).then((account) => {
        return response.status(200).json({
            status: true,
            data: account
        });
    });
};

exports.editAddons = (request, response) => {
    const { accountId } = request.params;
    const { discount, suspend, verified, withdraw } = request.body;
    Account.findOne({
        _id: accountId
    }).then((account) => {
        account.verified.admin = verified;
        account.addons.discount = discount;
        account.addons.suspend = suspend;
        account.addons.allow_withdraw_balance = withdraw;
        account.save();
        return response.status(200).json({
            status: true,
            data: account
        });
    });
};

exports.createNewAccount = (request, response) => {
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
    let defaultRef = '';
    let defaultDisc = 0;
    if (!referralCode) {
        if (role === 'distributor') {
            defaultRef = 'none';
            defaultDisc = 30;
        }
        if (role === 'reseller') {
            defaultRef = 'kaiyya_distributor';
            defaultDisc = 20;
        }
        if (role === 'subreseller') {
            defaultRef = 'kaiyya_reseller';
            defaultDisc = 10;
        }
        if (role === 'retail') {
            defaultRef = 'kaiyya_subreseller';
            defaultDisc = 0;
        }
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
        referral_code: referralCode || defaultRef,
        addons: {
            discount: defaultDisc
        }
    });

    newAccount.save(async (err, account) => {
        if (err) {
            console.log(err);
            const usedField = Object.keys(err.keyPattern);
            return response.status(200).json({
                status: false,
                message: `${usedField} already registered, please use other ${usedField}`,
                error: usedField[0]
            });
        }

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
