/* eslint-disable no-console */
const mongoose = require('mongoose');
require('../../models/Account');
require('../../models/Address');
require('../../models/Banner');
require('../../models/Category');
require('../../models/Catalog');
require('../../models/Order');
require('../../models/OrderDetail');
require('../../models/Product');
require('../../models/Payment');
require('../../models/Size');
require('../../models/Image');
require('../../models/Referral');

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
