const router = require('express').Router();
const AccountController = require('../../controllers/Account');

router.post('/login', AccountController.loginWithEmail);

router.post('/register', AccountController.register);

router.post('/password/reset-request', AccountController.resetPasswordRequest);
router.post('/password/reset-verify', AccountController.resetPasswordTokenVerify);
router.post('/password/reset-confirm', AccountController.resetPasswordConfirm);

router.get('/profile', AccountController.getProfile);
router.patch('/profile/edit', AccountController.editProfile);

router.post('/ref/check', AccountController.checkReferralCode);
router.get('/ref/downline', AccountController.getReferralDownline);
router.get('/ref/downline/:code', AccountController.getReferralDownlineByCode);

router.post('/verify', AccountController.verifyAccount);

const accountRoutes = router;

module.exports = accountRoutes;
