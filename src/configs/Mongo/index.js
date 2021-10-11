/* eslint-disable no-console */
const mongoose = require('mongoose');
require('../../models/Account');
require('../../models/Address');
require('../../models/BankAccount');
require('../../models/Banner');
require('../../models/Category');
require('../../models/Catalog');
require('../../models/Faq');
require('../../models/Order');
require('../../models/OrderDetail');
require('../../models/Payment');
require('../../models/Post');
require('../../models/Product');
require('../../models/Size');
require('../../models/Image');
require('../../models/Referral');
require('../../models/Rules');

const Mongo = (uri = String, user = String, pass = String) => mongoose.connect(uri, {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    user,
    pass
}).then(() => {
    console.log('mongodb connected');
}).catch((err) => {
    console.log('Error to connect with mongodb server \n', err);
});

module.exports = Mongo;
