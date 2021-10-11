const router = require('express').Router();
const BankAccountController = require('../../controllers/BankAccount');

router.post('/', BankAccountController.createBankAccount);
router.get('/', BankAccountController.getBankAccount);
router.get('/available-bank', BankAccountController.getAvailableDisbursementBank);
router.post('/validate-bank', BankAccountController.bankAccountValidation);

const bankAccountRoutes = router;
module.exports = bankAccountRoutes;
