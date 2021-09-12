const router = require('express').Router();
const ReferralController = require('../../controllers/Referral');

router.post('/check-code', ReferralController.checkReferralCode);
// router.get('/:referral', ReferralController.getReferralDownline);
router.get('/test/:userCode?/:subtotal?', ReferralController.testAutomateUpdateReferralPoint);

const referralRoutes = router;

module.exports = referralRoutes;
