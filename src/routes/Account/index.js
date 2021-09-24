const router = require('express').Router();
const AccountController = require('../../controllers/Account');

router.post('/login', AccountController.loginWithEmail);

router.post('/register', AccountController.register);
router.get('/profile', AccountController.getProfile);
router.patch('/profile', AccountController.updateProfile);

router.post('/ref/check', AccountController.checkReferralCode);
router.get('/ref/downline', AccountController.getReferralDownline);

router.post('/verify', AccountController.verifyEmail);
router.get('/verify/request-code', AccountController.requestVerificationCode);

const accountRoutes = router;

module.exports = accountRoutes;
