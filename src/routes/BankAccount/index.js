const router = require('express').Router();
const BankAccountController = require('../../controllers/BankAccount');

router.get('/available-bank', BankAccountController.getAvailableDisbursementBank);

const bankAccountRoutes = router;
module.exports = bankAccountRoutes;
