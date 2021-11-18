const router = require('express').Router();
const UserController = require('../../controllers/UserController');
const auth = require('../../middleware/auth');

router.post('/register', UserController.register);
router.post('/login', UserController.login);

/*delete this after create user "admin"*/

router.post('/create', auth.verifyAdmin, UserController.create);


router.put('/update', UserController.update);

router.get('/list', auth.verifyGovernmentEntity, UserController.list);
router.get('/detail', UserController.detail);


module.exports = router;