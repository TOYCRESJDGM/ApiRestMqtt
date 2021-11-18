const router = require('express').Router();
const alertController = require('../../controllers/alertController');

router.get('/public', alertController.public);
router.get('/node', alertController.info);

/* router.get('/co/:nodeId', dataController.getAlertCo);
router.get('/pm/:nodeId', dataController.getAlertPm);
router.get('/no/:nodeId', dataController.getAlertNo); */

module.exports = router;