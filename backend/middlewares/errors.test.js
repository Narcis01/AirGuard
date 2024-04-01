const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai')
const errorsMiddlerware = require('./errors');

chai.use(sinonChai);
const expect = chai.expect;

describe('errorHandler middleware', () => {
    it('should send the correct error response', () => {
        const err = new Error('Test error');
        err.message = 'Error';
        err.statusCode = 400;

        const req = {};
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };
        const next = sinon.spy();

        errorsMiddlerware(err, req, res, next);

        expect(res.status.calledWithExactly(400)).to.be.true;
        expect(next.notCalled).to.be.true;
    });

    it('should handle internal server errors with status 500', () => {
        const err = new Error('Internal server error');
        
        const req = {};
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };
        const next = sinon.spy();

        errorsMiddlerware(err, req, res, next);

        expect(res.status.calledWithExactly(500)).to.be.true;
        expect(next.notCalled).to.be.true;
    })
})