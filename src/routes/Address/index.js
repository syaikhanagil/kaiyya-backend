const router = require('express').Router();
const AddressController = require('../../controllers/Address');

router.get('/province', AddressController.getProvince);
router.get('/city/:provinceId', AddressController.getCity);
router.get('/subdistrict/:cityId', AddressController.getSubdistrict);

router.post('/', AddressController.createAddress);
router.get('/', AddressController.getAddress);

router.get('/detail/:addressId', AddressController.getAddressDetail);
router.patch('/edit/:addressId', AddressController.editAddress);

const addressRoutes = router;
module.exports = addressRoutes;
