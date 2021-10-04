const { createTransport } = require('nodemailer');
const mustache = require('mustache');
const fs = require('fs');
const path = require('path');

// const host = 'https://test.kaiyya.com'; // Development host
const host = 'kaiyya.com'; // Production host

const config = {
    service: 'gmail',
    auth: {
        user: 'noreply@kaiyya.id',
        pass: 'kaiyya.id1!'
    }
};

/**
 * Payload will found email address and name
 */
const sendRegisterMail = async (payload = {}) => {
    const transporter = await createTransport(config);
    const template = fs.readFileSync(
        path.resolve(__dirname, 'template/register.html'),
        { encoding: 'utf-8' }
    );
    payload.host = host;
    const mail = {
        from: 'Kaiyya <noreply@kaiyya.id>',
        to: payload.email,
        subject: 'Selamat datang di Kaiyya ✔',
        html: mustache.render(template, { ...payload })
    };
    transporter.sendMail(mail, (error, info) => {
        if (error) {
            console.log('registration email failure:', error);
        } else {
            console.log('registration email sent:', info.response);
        }
    });
};

const sendVerificationCodeMail = async (payload = {}) => {
    const transporter = await createTransport(config);
    const template = fs.readFileSync(
        path.resolve(__dirname, 'template/verification.html'),
        { encoding: 'utf-8' }
    );
    payload.host = host;
    const mail = {
        from: 'Kaiyya <noreply@kaiyya.id>',
        to: payload.email,
        subject: 'Kode Verifikasi akun Kaiyya',
        html: mustache.render(template, { ...payload })
    };
    transporter.sendMail(mail, (error, info) => {
        if (error) {
            console.log('verification code email failure:', error);
        } else {
            console.log('verification code email sent:', info.response);
        }
    });
};

const sendResetPasswordMail = async (payload = {}) => {
    const transporter = await createTransport(config);
    const template = fs.readFileSync(
        path.resolve(__dirname, 'template/reset_password.html'),
        { encoding: 'utf-8' }
    );
    payload.host = host;
    const mail = {
        from: 'Kaiyya <noreply@kaiyya.id>',
        to: payload.email,
        subject: 'Reset Password',
        html: mustache.render(template, { ...payload })
    };
    transporter.sendMail(mail, (error, info) => {
        if (error) {
            console.log('reset passwrod email failure:', error);
        } else {
            console.log('reset passwrod email sent:', info.response);
        }
    });
};

const Mailer = {
    sendRegisterMail,
    sendResetPasswordMail,
    sendVerificationCodeMail
};

module.exports = Mailer;
