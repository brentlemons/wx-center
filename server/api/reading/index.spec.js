'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var readingCtrlStub = {
  index: 'readingCtrl.index',
  show: 'readingCtrl.show',
  create: 'readingCtrl.create',
  upsert: 'readingCtrl.upsert',
  patch: 'readingCtrl.patch',
  destroy: 'readingCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var readingIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './reading.controller': readingCtrlStub
});

describe('Reading API Router:', function() {
  it('should return an express router instance', function() {
    expect(readingIndex).to.equal(routerStub);
  });

  describe('GET /api/readings', function() {
    it('should route to reading.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'readingCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/readings/:id', function() {
    it('should route to reading.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'readingCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/readings', function() {
    it('should route to reading.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'readingCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/readings/:id', function() {
    it('should route to reading.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'readingCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/readings/:id', function() {
    it('should route to reading.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'readingCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/readings/:id', function() {
    it('should route to reading.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'readingCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
