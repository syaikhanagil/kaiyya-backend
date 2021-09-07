require('dotenv').config();
const { default: axios } = require('axios');

const generateToken = () => {
    const key = `${process.env.XENDIT_API_KEY}:`;
    // Convert xendit api key to base64 string
    // eslint-disable-next-line new-cap
    const base64 = new Buffer.from(key).toString('base64');
    return base64;
};

const Xendit = (method, url, payload) => {
    return new Promise((resolve, reject) => {
        axios({
            method,
            url,
            headers: {
                Authorization: `Basic ${generateToken()}`,
                'Content-Type': 'application/json'
            },
            data: payload ? JSON.stringify(payload) : {}
        })
            .then((res) => {
                resolve(res.data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

// class Xendit {
//     static CREATE_VIRTUAL_ACCOUNT() {
//         return (payload) => this.request('POST', api.virtual_account, payload);
//     }

//     static GET_VIRTUAL_ACCOUNT(externalId) {
//         return (payload) => this.request('GET', api.virtual_account + externalId, payload);
//     }

//     static CREATE_QRIS() {
//         return (payload) => this.request('POST', api.qris, payload);
//     }

//     static GET_QRIS(externalId) {
//         return (payload) => this.request('GET', api.qris + externalId, payload);
//     }

//     static request(method, url, payload = {}) {
//         return new Promise((resolve, reject) => {
//             axios({
//                 method,
//                 url,
//                 headers: {
//                     Authorization: `Basic ${generateToken()}`,
//                     'Content-Type': 'application/json'
//                 },
//                 data: payload ? JSON.stringify(payload) : {}
//             })
//                 .then((res) => {
//                     resolve(res.data);
//                 })
//                 .catch((err) => {
//                     reject(err);
//                 });
//         });
//     }
// }

module.exports = Xendit;
