const { default: axios } = require('axios');

const Notify = (url, payload) => {
    return new Promise((resolve, reject) => {
        axios({
            method: 'POST',
            url: `https://notify.kaiyya.com${url}`,
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
