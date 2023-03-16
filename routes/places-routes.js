const router = require('express').Router();

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
    const error = new Error('Could not find a place with related place id');
    error.code = 404;
    return next(error);
  }

  res.json({ place });
});

router.get('/user/:uid', (req, res) => {
  const userId = req.params.uid;
  const user = DUMMY_PLACES.find((p) => {
    return p.creator === userId;
  });

  if (!user) {
    const error = new Error('Could not find a place with related user id');
    error.code = 404;
    return next(error);
  }

  res.json({ user });
});

module.exports = router;
