/* eslint-disable no-console */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jsonwebtoken = require('jsonwebtoken');
const Mongo = require('./src/configs/Mongo');
const adminRoutes = require('./src/routes/Admin');
const accountRoutes = require('./src/routes/Account');
const imageRoutes = require('./src/routes/Image');
const bannerRoutes = require('./src/routes/Banner');
const addressRoutes = require('./src/routes/Address');
const paymentRoutes = require('./src/routes/Payment');
const productRoutes = require('./src/routes/Product');
const categoryRoutes = require('./src/routes/Category');
const catalogRoutes = require('./src/routes/Catalog');
const shipmentRoutes = require('./src/routes/Shipment');
const orderRoutes = require('./src/routes/Order');
const faqRoutes = require('./src/routes/Faq');
const bankAccountRoutes = require('./src/routes/BankAccount');
const postRoutes = require('./src/routes/Post');
const disbursementRoutes = require('./src/routes/Disbursement');

const app = express();
const { PORT, MONGO_URI, MONGO_USER, MONGO_PASSWORD } = process.env;

const corsConfig = cors({
    origin: '*',
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE']
});

app.use(corsConfig);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((request, response, next) => {
    if (request.headers && request.headers.authorization && request.headers.authorization.split(' ')[0] === 'Bearer') {
        const token = request.headers.authorization.split(' ')[1];
        jsonwebtoken.verify(token, 'KIS-APIs', (err, decode) => {
            if (err) {
                request.session = undefined;
            }
            request.session = decode;
            next();
        });
    } else {
        request.session = undefined;
        next();
    }
});

app.use('/admin', adminRoutes);
app.use('/account', accountRoutes);
app.use('/address', addressRoutes);
app.use('/category', categoryRoutes);
app.use('/catalog', catalogRoutes);
app.use('/images', imageRoutes);
app.use('/bank', bankAccountRoutes);
app.use('/banner', bannerRoutes);
app.use('/orders', orderRoutes);
app.use('/product', productRoutes);
app.use('/payment', paymentRoutes);
app.use('/shipment', shipmentRoutes);
app.use('/disbursement', disbursementRoutes);
app.use('/faq', faqRoutes);
app.use('/post', postRoutes);
app.all('/*', (request, response) => {
    response.status(404).json({
        status: false,
        message: 'what are you doing?'
    });
});

// const lifetimeToken = jsonwebtoken.sign({
//     username: 'test',
//     email: 'testing@kaiyya.id'
// }, 'KIS-API-KAIYYA');
// console.log(lifetimeToken);

app.listen(PORT, () => {
    console.clear();
    console.log(`app running on http://localhost:${PORT}`);
    console.log('connecting mongodb..');
    setTimeout(() => {
        Mongo(MONGO_URI, MONGO_USER, MONGO_PASSWORD);
    }, 1000);
});
