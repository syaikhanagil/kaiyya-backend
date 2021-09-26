const { default: axios } = require('axios');

// const baseUrl = 'http://localhost:1202';
const baseUrl = 'https://notify.kaiyya.com';

const Notify = (url, payload) => {
    return new Promise((resolve, reject) => {
        axios({
            method: 'POST',
            url: `${baseUrl}${url}`,
            headers: {
                Authorization: 'Bearer KIS'
            },
            data: payload
        }).then((res) => {
            const response = res.data;
            resolve(response);
        }).catch((err) => {
            reject(err);
        });
    });
};

module.exports = Notify;
