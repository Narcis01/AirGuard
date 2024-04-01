const chai = require('chai');
const sinon = require('sinon');
const catchAsyncErrors = require('./catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');

chai.use(require('sinon-chai'));
const expect = chai.expect;
const sandbox = sinon.createSandbox();


describe('catchAsyncErrors middleware', () => {
    it('should call the next function if the wrapped function resolves without errors', async () =>{
        const AsyncErrorsStub = sandbox.stub().resolves('success');
        const middleware = catchAsyncErrors(AsyncErrorsStub);
        const req = {};
        const res = {};
        const next = sinon.spy();

        await middleware(req, res, next);

        expect(AsyncErrorsStub.calledOnceWith(req, res, next)).to.be.true;
        expect(next).to.not.have.been.calledOnce;
        
    });

    it('should call the next function with the error if the weapped function rejects', async () => {
        const error = new ErrorHandler('fake error', 400);
        const AsyncErrorsStub = sandbox.stub().rejects(error);
        const middleware = catchAsyncErrors(AsyncErrorsStub);
        const req = {};
        const res = {};
        const next = sinon.spy();

        await middleware(req, res, next);

        expect(AsyncErrorsStub.calledOnceWith(req, res, next)).to.be.true;
        expect(next).to.have.been.calledOnce;
    })
})