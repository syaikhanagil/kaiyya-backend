const router = require('express').Router();
const ReferralController = require('../../controllers/Referral');

router.get('/:referral', ReferralController.getReferralDownline);
router.post('/', ReferralController.checkReferralCode);

const referralRoutes = router;

module.exports = referralRoutes;
