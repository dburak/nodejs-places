const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const getCordsForAddress = require('../util/location');
const Place = require('../models/place');

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;

  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, please try again later.',
      500
    );

    return next(error);
  }

  if (!place) {
    const error = new HttpError('Could not find a place for related id.', 404);

    return next(error);
  }
  res.json({ place });
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let places;

  try {
    places = await Place.find({
      creator: userId,
    });
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, please try again later.',
      500
    );

    return next(error);
  }

  if (!places || places.length === 0) {
    const err = new HttpError(
      'Could not find places with related user id',
      404
    );

    return next(err);
  }

  res.json({ places });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError('Invalid input. Please check your data.', 422));
  }

  const { title, description, address, creator } = req.body;

  let coordinates;

  try {
    coordinates = await getCordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    location: coordinates,
    image:
      'https://lh3.googleusercontent.com/p/AF1QipMrnDmt3S5rut1SmIsuoz_vHXzwVjiJIXjZlliI=s1360-w1360-h1020',
    creator,
  });

  try {
    await createdPlace.save();
  } catch (err) {
    const error = new HttpError(
      'While creating the place an error occured, please try again.',
      500
    );
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const { title, description } = req.body;
  const placeId = req.params.pid;

  let updatedPlace;

  try {
    updatedPlace = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      'An error occured while updating, please try again.',
      500
    );
    return next(error);
  }

  updatedPlace.title = title;
  updatedPlace.description = description;

  await updatedPlace.save();

  res.status(200).json({ place: updatedPlace });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  try {
    await Place.deleteOne({
      _id: placeId,
    });
  } catch (error) {
    return next(error);
  }

  res.status(200).json({ message: 'The place has been deleted.' });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
