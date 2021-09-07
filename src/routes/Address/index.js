const router = require('express').Router();
const AddressController = require('../../controllers/Address');

router.get('/province', AddressController.getProvince);
router.get('/city/:provinceId', AddressController.getCity);
router.get('/subdistrict/:cityId', AddressController.getSubdistrict);

router.post('/', AddressController.createAddress);
router.get('/', AddressController.getAddress);

router.get('/:addressId?', AddressController.getAddressById);
router.patch('/:addressId?', AddressController.getProvince);

const addressRoutes = router;
module.exports = addressRoutes;
