/**
 * Admin Controller
 */
const mongoose = require('mongoose');
const jsonwebtoken = require('jsonwebtoken');

const Account = mongoose.model('Account');

exports.loginAdmin = (request, response) => {
    const { username, password } = request.body;
    Account.findOne({
        username,
        role: 'admin'
    }).then((account) => {
        if (!account.comparePassword(password)) {
            return response.status(401).json({
                status: false,
                message: 'invalid email or password combination'
            });
        }
        const token = jsonwebtoken.sign({
            uid: account.id,
            username: account.username,
            email: account.email,
            keys: 'admin'
        }, 'KIS-APIs');
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
        response.status(200).json({
            status: false,
            message: 'email not registered'
        });
    });
};

exports.getAccounts = (request, response) => {
    Account.find().then((account) => {
        const filterAccount = account.filter((item) => item.role !== 'admin');
        const data = [];
        for (let i = 0; i < filterAccount.length; i++) {
            const obj = {
                id: filterAccount[i].id,
                username: filterAccount[i].username,
                fullname: filterAccount[i].fullname,
                email: filterAccount[i].email,
                phone: filterAccount[i].phone,
                role: filterAccount[i].role
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
