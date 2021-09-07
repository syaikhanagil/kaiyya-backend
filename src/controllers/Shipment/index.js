const { default: axios } = require('axios');
const qs = require('qs');

// Define base header for fetching data
const headers = {
    key: process.env.RAJA_ONGKIR_API_KEY,
    'content-type': 'application/x-www-form-urlencoded'
};

const getCost = async (request, response) => {
    const { destination, weight, courier } = request.body;
    const payload = {
        origin: '1581',
        originType: 'subdistrict',
        destination,
        destinationType: 'subdistrict',
        weight,
        courier
    };
    await axios({
        method: 'POST',
        url: 'https://pro.rajaongkir.com/api/cost',
        headers,
        data: qs.stringify(payload)
    }).then((res) => {
        return response.status(200).json({
            status: true,
            message: 'successfully get cost data',
            data: res.data.rajaongkir.results
        });
    }).catch(() => {
        return response.status(400).json({
            status: false,
            message: 'get cost data failure'
        });
    });
};

const getService = (request, response) => {
    const data = [
        { name: 'JNE', code: 'jne' },
        { name: 'J&T', code: 'jnt' },
        { name: 'Lion Parcel', code: 'lion' }
    ];
    return response.status(200).json({
        status: true,
        message: 'successfully get province data',
        data
    });
};

const ShipmentController = {
    getCost,
    getService
};

module.exports = ShipmentController;
