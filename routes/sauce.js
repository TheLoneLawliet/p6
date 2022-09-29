const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');

const multer = require('../middleware/multer-config');

const sauceCtrl = require('../controllers/sauce')


router.post('/', auth, multer, sauceCtrl.newSauce);

router.post('/:id/like', auth, multer, sauceCtrl.likes);

router.put('/:id', auth, multer, sauceCtrl.editOneSauce);

router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);

router.delete('/:id', auth, sauceCtrl.deleteOneSauce);

module.exports = router;