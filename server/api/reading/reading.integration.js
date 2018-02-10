'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../../../server');
import request from 'supertest';

var newReading;

describe('Reading API:', function() {
  describe('GET /api/readings', function() {
    var readings;

    beforeEach(function(done) {
      request(app)
        .get('/api/readings')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          readings = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(readings).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/readings', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/readings')
        .send({
          name: 'New Reading',
          info: 'This is the brand new reading!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newReading = res.body;
          done();
        });
    });

    it('should respond with the newly created reading', function() {
      expect(newReading.name).to.equal('New Reading');
      expect(newReading.info).to.equal('This is the brand new reading!!!');
    });
  });

  describe('GET /api/readings/:id', function() {
    var reading;

    beforeEach(function(done) {
      request(app)
        .get(`/api/readings/${newReading._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          reading = res.body;
          done();
        });
    });

    afterEach(function() {
      reading = {};
    });

    it('should respond with the requested reading', function() {
      expect(reading.name).to.equal('New Reading');
      expect(reading.info).to.equal('This is the brand new reading!!!');
    });
  });

  describe('PUT /api/readings/:id', function() {
    var updatedReading;

    beforeEach(function(done) {
      request(app)
        .put(`/api/readings/${newReading._id}`)
        .send({
          name: 'Updated Reading',
          info: 'This is the updated reading!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedReading = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedReading = {};
    });

    it('should respond with the updated reading', function() {
      expect(updatedReading.name).to.equal('Updated Reading');
      expect(updatedReading.info).to.equal('This is the updated reading!!!');
    });

    it('should respond with the updated reading on a subsequent GET', function(done) {
      request(app)
        .get(`/api/readings/${newReading._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let reading = res.body;

          expect(reading.name).to.equal('Updated Reading');
          expect(reading.info).to.equal('This is the updated reading!!!');

          done();
        });
    });
  });

  describe('PATCH /api/readings/:id', function() {
    var patchedReading;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/readings/${newReading._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Reading' },
          { op: 'replace', path: '/info', value: 'This is the patched reading!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedReading = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedReading = {};
    });

    it('should respond with the patched reading', function() {
      expect(patchedReading.name).to.equal('Patched Reading');
      expect(patchedReading.info).to.equal('This is the patched reading!!!');
    });
  });

  describe('DELETE /api/readings/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/readings/${newReading._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when reading does not exist', function(done) {
      request(app)
        .delete(`/api/readings/${newReading._id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});
