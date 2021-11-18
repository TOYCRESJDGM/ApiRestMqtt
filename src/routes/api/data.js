const router = require('express').Router();
const dataController = require('../../controllers/dataController');
const auth = require('../../middleware/auth');

/*router.post('/save', dataController.save);*/
router.get('/node', dataController.info);
router.get('/all',auth.verifyGovernmentEntity, dataController.data);

module.exports = router;