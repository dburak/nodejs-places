const router = require('express').Router();
const { check } = require('express-validator');
const placesControllers = require('../controllers/places-controllers');
const fileUpload = require('../middleware/image-upload');
const checkAuth = require('../middleware/check-auth');

router.get('/:pid', placesControllers.getPlaceById);

router.get('/user/:uid', placesControllers.getPlacesByUserId);

// First two requests are open to everyone !

router.use(checkAuth);

// Below routes are protected with jwt token

router.post(
  '/',
  fileUpload.single('image'),
  [check('title').not().isEmpty()],
  placesControllers.createPlace
);

router.patch('/:pid', placesControllers.updatePlace);

router.delete('/:pid', placesControllers.deletePlace);

module.exports = router;
