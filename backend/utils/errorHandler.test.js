const chai = require('chai');
const expect = chai.expect;
const ErrorHandler = require('./errorHandler');

describe('ErrorHandler', () => {
    
    const message = 'Fake error';
    const statusCode = 400;
    
    it('should send an error message and status code', () => {
        const errorHandler = new ErrorHandler(message, statusCode);
        expect(errorHandler.message).to.equal(message);
        expect(errorHandler.statusCode).to.equal(statusCode);

    })
})
