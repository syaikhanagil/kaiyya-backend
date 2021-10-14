require('dotenv').config();
const { default: axios } = require('axios');
const mongoose = require('mongoose');

const Address = mongoose.model('Address');

const createAddress = (request, response) => {
    const { uid } = request.session;
    const { name, phone, province, provinceId, city, cityId, subdistrict, subdistrictId, detail, isDefault } = request.body;
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
        detail,
        is_default: isDefault || false
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
                detail: address[i].detail,
                is_default: address[i].is_default
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

// get Address Detail
const getAddressDetail = (request, response) => {
    const { addressId } = request.params;
    Address.findOne({
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

const editAddress = (request, response) => {
    const { addressId } = request.params;
    const { name, phone, province, provinceId, city, cityId, subdistrict, subdistrictId, detail } = request.body;
    Address.findOne({
        _id: addressId
    }).then((address) => {
        address.name = name;
        address.phone = phone;
        address.province = province;
        address.province_id = provinceId;
        address.city = city;
        address.city_id = cityId;
        address.subdistrict = subdistrict;
        address.subdistrict_id = subdistrictId;
        address.detail = detail;
        address.save();
        return response.status(200).json({
            status: true,
            message: 'address successfully updated',
            data: address
        });
    }).catch(() => {
        return response.status(400).json({
            status: false,
            message: 'edit address failed'
        });
    });
};

const setDefaultAddress = (request, response) => {
    const { uid } = request.session;
    const { addressId } = request.params;
    // find the default address
    Address.findOne({
        account: uid,
        is_default: true
    }).then((address) => {
        // then set is_default to false
        address.is_default = false;
        address.save();
        // find the new address
        Address.findOne({
            _id: addressId
        }).then((address2) => {
            address2.is_default = true;
            address2.save();
            return response.status(200).json({
                status: false,
                message: 'set default address success'
            });
        });
    }).catch(() => {
        Address.findOne({
            _id: addressId
        }).then((address2) => {
            address2.is_default = true;
            address2.save();
            return response.status(200).json({
                status: false,
                message: 'set default address success'
            });
        }).catch(() => {
            return response.status(400).json({
                status: false,
                message: 'can\'t find the default address'
            });
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
    getAddressDetail,
    editAddress,
    setDefaultAddress,
    getProvince,
    getCity,
    getSubdistrict
};

module.exports = AddressController;
