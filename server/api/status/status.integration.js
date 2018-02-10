'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../../../server');
import request from 'supertest';

var newStatus;

describe('Status API:', function() {
  describe('GET /api/status', function() {
    var status;

    beforeEach(function(done) {
      request(app)
        .get('/api/status')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          status = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(status).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/status', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/status')
        .send({
          name: 'New Status',
          info: 'This is the brand new status!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newStatus = res.body;
          done();
        });
    });

    it('should respond with the newly created status', function() {
      expect(newStatus.name).to.equal('New Status');
      expect(newStatus.info).to.equal('This is the brand new status!!!');
    });
  });

  describe('GET /api/status/:id', function() {
    var status;

    beforeEach(function(done) {
      request(app)
        .get(`/api/status/${newStatus._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          status = res.body;
          done();
        });
    });

    afterEach(function() {
      status = {};
    });

    it('should respond with the requested status', function() {
      expect(status.name).to.equal('New Status');
      expect(status.info).to.equal('This is the brand new status!!!');
    });
  });

  describe('PUT /api/status/:id', function() {
    var updatedStatus;

    beforeEach(function(done) {
      request(app)
        .put(`/api/status/${newStatus._id}`)
        .send({
          name: 'Updated Status',
          info: 'This is the updated status!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedStatus = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedStatus = {};
    });

    it('should respond with the updated status', function() {
      expect(updatedStatus.name).to.equal('Updated Status');
      expect(updatedStatus.info).to.equal('This is the updated status!!!');
    });

    it('should respond with the updated status on a subsequent GET', function(done) {
      request(app)
        .get(`/api/status/${newStatus._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let status = res.body;

          expect(status.name).to.equal('Updated Status');
          expect(status.info).to.equal('This is the updated status!!!');

          done();
        });
    });
  });

  describe('PATCH /api/status/:id', function() {
    var patchedStatus;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/status/${newStatus._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Status' },
          { op: 'replace', path: '/info', value: 'This is the patched status!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedStatus = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedStatus = {};
    });

    it('should respond with the patched status', function() {
      expect(patchedStatus.name).to.equal('Patched Status');
      expect(patchedStatus.info).to.equal('This is the patched status!!!');
    });
  });

  describe('DELETE /api/status/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/status/${newStatus._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when status does not exist', function(done) {
      request(app)
        .delete(`/api/status/${newStatus._id}`)
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
