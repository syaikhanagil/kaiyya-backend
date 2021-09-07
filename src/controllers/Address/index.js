require('dotenv').config();
const { default: axios } = require('axios');
const mongoose = require('mongoose');

const Address = mongoose.model('Address');

const createAddress = (request, response) => {
    const { uid } = request.session;
    const { name, phone, province, provinceId, city, cityId, subdistrict, subdistrictId, detail } = request.body;
    const newAddress = new Address({
        account: uid,
        name,
        phone,
        province,
        province_id: provinceId,
        city,
        city_id: cityId,
        subdistrict,
        subdistrict_id: subdistrictId,
        detail
    });
    newAddress.save((err, address) => {
        if (err) {
            return response.status(400).json({
                status: false,
                message: 'save new address failed'
            });
        }
        return response.status(200).json({
            status: true,
            message: 'address successfully created',
            data: address
        });
    });
};

// get Address Collection
const getAddress = (request, response) => {
    const { uid } = request.session;
    Address.find({
        account: uid
    }).then((address) => {
        const data = [];
        for (let i = 0; i < address.length; i++) {
            const obj = {
                id: address[i].id,
                name: address[i].name,
                phone: address[i].phone,
                province: address[i].province,
                provinceId: address[i].province_id,
                city: address[i].city,
                cityId: address[i].city_id,
                subdistrict: address[i].subdistrict,
                subdistrictId: address[i].subdistrict_id,
                detail: address[i].detail
            };
            data.push(obj);
        }

        return response.status(200).json({
            status: true,
            message: 'successfully get address data',
            data
        });
    }).catch(() => {
        return response.status(400).json({
            status: false,
            message: 'get address data failed'
        });
    });
};

// get Address Collection
const getAddressById = (request, response) => {
    const { addressId } = request.query;
    Address.find({
        _id: addressId
    }).then((address) => {
        return response.status(200).json({
            status: true,
            message: 'successfully get address data',
            data: address
        });
    }).catch(() => {
        return response.status(400).json({
            status: false,
            message: 'get address data failed'
        });
    });
};

// Define base header for fetching data
const headers = {
    key: process.env.RAJA_ONGKIR_API_KEY
};

const getProvince = async (request, response) => {
    await axios.get('https://pro.rajaongkir.com/api/province', {
        headers
    }).then((res) => {
        return response.status(200).json({
            status: true,
            message: 'successfully get province data',
            data: res.data.rajaongkir.results
        });
    }).catch(() => {
        return response.status(200).json({
            status: true,
            message: 'get province data failure'
        });
    });
};

const getCity = async (request, response) => {
    const { provinceId } = request.params;
    await axios.get(`https://pro.rajaongkir.com/api/city?province=${provinceId}`, {
        headers
    }).then((res) => {
        return response.status(200).json({
            status: true,
            message: 'successfully get city data',
            data: res.data.rajaongkir.results
        });
    }).catch(() => {
        return response.status(200).json({
            status: true,
            message: 'get province data failure'
        });
    });
};

const getSubdistrict = async (request, response) => {
    const { cityId } = request.params;
    await axios.get(`https://pro.rajaongkir.com/api/subdistrict?city=${cityId}`, {
        headers
    }).then((res) => {
        return response.status(200).json({
            status: true,
            message: 'successfully get subdistrict data',
            data: res.data.rajaongkir.results
        });
    }).catch(() => {
        return response.status(200).json({
            status: true,
            message: 'get province data failure'
        });
    });
};

const AddressController = {
    createAddress,
    getAddress,
    getAddressById,
    getProvince,
    getCity,
    getSubdistrict
};

module.exports = AddressController;
