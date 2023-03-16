const router = require('express').Router();
const HttpError = require('../models/http-error');

const DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Aspava',
    description: 'One of the most famous restaurant in Ankara',
    location: {
      lat: 39.916526,
      lng: 32.8170519,
    },
    address: 'Emek mah.',
    creator: 'u1',
  },
];

router.get('/:pid', (req, res, next) => {
  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find((p) => {
    return p.id === placeId;
  });

  if (!place) {
    throw new HttpError('Could not find a place with related place id', 404);
  }

  res.json({ place });
});

router.get('/user/:uid', (req, res, next) => {
  const userId = req.params.uid;
  const user = DUMMY_PLACES.find((p) => {
    return p.creator === userId;
  });

  if (!user) {
    throw new HttpError('Could not find a place with related user id', 404);
  }

  res.json({ user });
});

module.exports = router;
