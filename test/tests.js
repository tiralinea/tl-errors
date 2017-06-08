'use strict';

describe('FI-ERRORS', () => {
  describe('[GET /]', () => {
    it('should respond a 200 status code', (done) => {
      req('/', (err, res) => {
        expect(err).to.be.null;

        expect(res.statusCode).to.be.a('number');
        expect(res.statusCode).to.equal(200);

        done();
      });
    });
  });

  describe('[GET /bad-request]', () => {
    it('should respond a 400 status code', (done) => {
      req('/bad-request', (err, res) => {
        expect(err).to.be.null;

        expect(res.statusCode).to.be.a('number');
        expect(res.statusCode).to.equal(400);

        done();
      });
    });
  });

  describe('[GET /unauthorized-request]', () => {
    it('should respond a 401 status code', (done) => {
      req('/unauthorized-request', (err, res) => {
        expect(err).to.be.null;

        expect(res.statusCode).to.be.a('number');
        expect(res.statusCode).to.equal(401);

        done();
      });
    });
  });

  describe('[GET /forbidden-request]', () => {
    it('should respond a 403 status code', (done) => {
      req('/forbidden-request', (err, res) => {
        expect(err).to.be.null;

        expect(res.statusCode).to.be.a('number');
        expect(res.statusCode).to.equal(403);

        done();
      });
    });
  });

  describe('[GET /failed-precondition-request]', () => {
    it('should respond a 412 status code', (done) => {
      req('/failed-precondition-request', (err, res) => {
        expect(err).to.be.null;

        expect(res.statusCode).to.be.a('number');
        expect(res.statusCode).to.equal(412);

        done();
      });
    });
  });

  describe('[GET /not-found-request]', () => {
    it('should respond a 404 status code', (done) => {
      req('/not-found-request', (err, res) => {
        expect(err).to.be.null;

        expect(res.statusCode).to.be.a('number');
        expect(res.statusCode).to.equal(404);

        done();
      });
    });
  });

  describe('[GET /validation-failed-request]', () => {
    it('should respond a 400 status code', (done) => {
      req('/validation-failed-request', (err, res) => {
        expect(err).to.be.null;

        expect(res.statusCode).to.be.a('number');
        expect(res.statusCode).to.equal(400);

        done();
      });
    });
  });

  describe('[GET /duplicated-entity-request]', () => {
    it('should respond a 409 status code', (done) => {
      req('/duplicated-entity-request', (err, res) => {
        expect(err).to.be.null;

        expect(res.statusCode).to.be.a('number');
        expect(res.statusCode).to.equal(409);

        done();
      });
    });
  });

  describe('[GET /internal-error-request]', () => {
    it('should respond a 500 status code and throw and error', (done) => {
      req('/internal-error-request', (err, res) => {
        expect(err).to.be.null;

        expect(res.statusCode).to.be.a('number');
        expect(res.statusCode).to.equal(500);

        done();
      });
    });
  });
});