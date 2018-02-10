'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var statusCtrlStub = {
  index: 'statusCtrl.index',
  show: 'statusCtrl.show',
  create: 'statusCtrl.create',
  upsert: 'statusCtrl.upsert',
  patch: 'statusCtrl.patch',
  destroy: 'statusCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var statusIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './status.controller': statusCtrlStub
});

describe('Status API Router:', function() {
  it('should return an express router instance', function() {
    expect(statusIndex).to.equal(routerStub);
  });

  describe('GET /api/status', function() {
    it('should route to status.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'statusCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/status/:id', function() {
    it('should route to status.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'statusCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/status', function() {
    it('should route to status.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'statusCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/status/:id', function() {
    it('should route to status.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'statusCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/status/:id', function() {
    it('should route to status.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'statusCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/status/:id', function() {
    it('should route to status.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'statusCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
