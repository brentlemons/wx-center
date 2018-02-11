/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/readings              ->  index
 * POST    /api/readings              ->  create
 * GET     /api/readings/:id          ->  show
 * PUT     /api/readings/:id          ->  upsert
 * PATCH   /api/readings/:id          ->  patch
 * DELETE  /api/readings/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Reading from './reading.model';

var defaultHours = 6;

var moment = require('moment');

var isEmpty = function(obj) {
  return !Object.keys(obj).length > 0;
};

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function(entity) {
    try {
      // eslint-disable-next-line prefer-reflect
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch(err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function(entity) {
    if(entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if(!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Readings
export function index(req, res) {
  var query = {};
  var endTime = moment();
  var startTime = moment(endTime).subtract(defaultHours, 'hours');
  if(!isEmpty(req.query)) {
    if(req.query.time) {
      if(req.query.time !== 'now') {
        if(moment(req.query.time).isValid()) {
          endTime = moment(req.query.time);
        }
      }
    }
    if(req.query.hours) {
      startTime = moment(endTime).subtract(req.query.hours, 'hours');
    } else {
      startTime = moment(endTime).subtract(defaultHours, 'hours');
    }
  }
  query.timestamp = {$gt: startTime.toISOString(), $lt: endTime.toISOString()};
  return Reading.find(query).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Reading from the DB
export function show(req, res) {
  return Reading.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Reading in the DB
export function create(req, res) {
  req.body.timestamp = moment();
  return Reading.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Reading in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Reading.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Reading in the DB
export function patch(req, res) {
  if(req.body._id) {
    Reflect.deleteProperty(req.body, '_id');
  }
  return Reading.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Reading from the DB
export function destroy(req, res) {
  return Reading.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
