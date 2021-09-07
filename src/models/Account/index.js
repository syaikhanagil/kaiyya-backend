/* eslint-disable func-names */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;

const AccountSchema = new Schema({
    username: {
        type: String,
        lowercase: true,
        required: true
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    fullname: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        default: ''
    },
    verified: {
        status: {
            type: Boolean,
            require: true,
            default: false
        },
        verification_code: {
            type: String,
            reqired: true,
            default: '040801'
        }
    },
    role: {
        type: String,
        lowecase: true,
        default: 'retail'
    },
    referral: {
        type: String,
        required: true,
        default: 'none'
    }
}, { timestamps: true });

AccountSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

AccountSchema.methods.compareVerificationCode = function (code) {
    const storedCode = parseInt(this.verified.verification_code, 10);
    const userCode = parseInt(code, 10);
    if (storedCode !== userCode) {
        return false;
    }
    return true;
};

module.exports = mongoose.model('Account', AccountSchema);
