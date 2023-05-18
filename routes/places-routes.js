const router = require('express').Router();
const { check } = require('express-validator');
const placesControllers = require('../controllers/places-controllers');
const fileUpload = require('../middleware/image-upload');

router.get('/:pid', placesControllers.getPlaceById);

router.get('/user/:uid', placesControllers.getPlacesByUserId);

router.post(
  '/',
  fileUpload.single('image'),
  [check('title').not().isEmpty()],
  placesControllers.createPlace
);

router.patch('/:pid', placesControllers.updatePlace);

router.delete('/:pid', placesControllers.deletePlace);

module.exports = router;
