const { v4: uuidv4 } = require('uuid');
const HttpError = require('../models/http-error');

let DUMMY_PLACES = [
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

const getPlaceById = (req, res) => {
  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find((p) => {
    return p.id === placeId;
  });

  if (!place) {
    throw new HttpError('Could not find a place with related place id', 404);
  }

  res.json({ place });
};

const getPlacesByUserId = (req, res) => {
  const userId = req.params.uid;
  const places = DUMMY_PLACES.filter((p) => {
    return p.creator === userId;
  });

  if (!places || places.length === 0) {
    throw new HttpError('Could not find places with related user id', 404);
  }

  res.json({ places });
};

const createPlace = (req, res) => {
  const { title, description, coordinates, address, creator } = req.body;

  const createdPlace = {
    id: uuidv4(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  };
  DUMMY_PLACES.push(createdPlace);

  res.status(201).json({ place: createdPlace });
};

const updatePlace = (req, res) => {
  const { title, description } = req.body;
  const placeId = req.params.pid;

  const updatedPlace = { ...DUMMY_PLACES.find((p) => p.id === placeId) }; // create a copy of the array to save possible data failure
  const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);
  updatedPlace.title = title;
  updatedPlace.description = description;

  DUMMY_PLACES[placeIndex] = updatedPlace;

  res.status(200).json({ place: updatedPlace });
};

const deletePlace = (req, res) => {
  const placeId = req.params.pid;
  DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);

  res.status(200).json({ message: 'The place has been deleted.' });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
