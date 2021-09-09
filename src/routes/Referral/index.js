const router = require('express').Router();
const ReferralController = require('../../controllers/Referral');

router.post('/check-code', ReferralController.checkReferralCode);
router.get('/:referral', ReferralController.getReferralDownline);

const referralRoutes = router;

module.exports = referralRoutes;
